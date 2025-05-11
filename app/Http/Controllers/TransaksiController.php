<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transfer;
use App\Models\Transaction;
use App\Models\BankDetail;
use App\Models\Data;
use App\Models\Bonus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Bank;
use Carbon\Carbon;

class TransaksiController extends Controller
{

    public function index()
    {
        
        $bonusData = Data::where('key', 'bonus_category')->first();
        $bonusCategories = $bonusData ? json_decode($bonusData->value, true) : [];
        $authenticatedUser = auth()->user();
        $userRole = $authenticatedUser->role ?? null;
        
        $banks = BankDetail::select('id', 'code', 'category')
        ->with(['bank:id,balance']) 
        ->whereJsonContains('role_access', $userRole)
        ->get();


        return Inertia::render('Transaksi', ["banks"=>$banks,"bonusCategories"=>$bonusCategories,"authenticatedUser"=>$authenticatedUser]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'username' => 'required|string',
            'balance' => 'required|numeric',
            'other' => 'nullable|numeric',
            'category' => 'required|in:deposit,withdraw',
            'status' => 'required|string',
            'note' => 'nullable|string',
            'bonuses' => 'nullable|array',
            'bonuses.*.category' => 'required_with:bonuses|string',
            'bonuses.*.value' => 'required_with:bonuses|numeric',
            'bank' => 'required|exists:bank_detail,id',
        ]);
    
        DB::transaction(function () use ($validated) {
            // Lock the related bank row for update
            $bankDetail = BankDetail::where('id', $validated['bank'])->lockForUpdate()->firstOrFail();
            $bank = $bankDetail->bank;
    
            if (!$bank) {
                abort(404, 'Bank not found.');
            }
    
            // Lock the bank row for update
            $bank->lockForUpdate();
    
            // // Calculate total bonuses
            // $totalBonus = collect($validated['bonuses'] ?? [])->sum(function ($bonus) {
            //     return (float) $bonus['value'];
            // });
    
            $balance = (float) $validated['balance'];
            $other = (float) ($validated['other'] ?? 0);
            $adjustedAmount = 0;
    
            if ($validated['category'] === 'deposit') {
                $adjustedAmount = $balance  - $other;
            } else {
                $adjustedAmount = -($balance + $other);
            }
    
            // Update bank balance
            $bank->balance += $adjustedAmount;
            $bank->save();
    
            // Create transaction
            $transaction = Transaction::create([
                'date' => $validated['date'],
                'username' => $validated['username'],
                'balance' => $validated['balance'],
                'other' => $validated['other'],
                'category' => $validated['category'],
                'status' => $validated['status'],
                'note' => $validated['note'],
                'operator' => auth()->user()->name,
                'created_by' => auth()->id(),
                'bank_id' => $bankDetail->id,
                'bank_code' => $bankDetail->code,
            ]);
    
            // Create bonus records
            foreach ($validated['bonuses'] ?? [] as $bonus) {
                Bonus::create([
                    'date' => $validated['date'],
                    'username' => $validated['username'],
                    'balance' => $bonus['value'],
                    'note' => $bonus['category'],
                    'category' => $bonus['category'],
                    'operator' => auth()->user()->name,
                    'created_by' => auth()->id(),
                    'transaction_id' => $transaction->id,
                ]);
            }
        });
    
        return response()->json(['message' => 'Transaction successfully recorded.']);
    }
    
    

    public function apiTransaksi(Request $request)
    {
        $user = auth()->user();
        $query = Transaction::with('bonuses');
    
        if (!in_array($user->role, ['admin', 'superadmin'])) {
            $query->where('created_by', $user->id);
        }
    
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('date', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('operator', 'like', "%{$search}%")
                  ->orWhere('bank_code', 'like', "%{$search}%");
            });
        }
    
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }
    
        // Sorting
        $sortField = $request->get('sort_field', 'date');
        $sortDirection = $request->get('sort_direction', 'desc');
        $allowedSorts = ['date', 'username', 'balance', 'category','status'];
    
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('date', 'desc');
        }
    
        $perPage = $request->get('per_page', 10);
        return response()->json($query->paginate($perPage));
    }
    
    
    
    public function checkIsDailyBonus(Request $request,$username)
{
    $date = Carbon::today();
    if ($request->has('date') ) {
       $date = $request->date;
    }

    $hasBonus = Bonus::where('username', $username)
        ->whereDate('date', $date)
        ->where('category', 'Daily')
        ->exists();

    return response()->json([
        'has_bonus' => $hasBonus,
    ]);
}



    public function transfer()
    {
        $authenticatedUser = auth()->user();
        $userRole = $authenticatedUser->role ?? null;
        
        $accessibleBanks = BankDetail::whereJsonContains('role_access', $userRole)
            ->pluck('id'); 
    
        $transfer_log = Transfer::whereIn('source_id', $accessibleBanks)
            ->orWhereIn('recipient_id', $accessibleBanks)
            ->get();

        
    
        $banks = BankDetail::select('id', 'code', 'category')
            ->with(['bank:id,balance']) 
            ->whereJsonContains('role_access', $userRole)
            ->get();
            
        $bankData = Data::where('key', 'bank_category')->first();
        $categories = $bankData ? json_decode($bankData->value, true) : [];
    
        return Inertia::render('Transfer', [
            'transfer_log' => $transfer_log,
            'banks' => $banks,
            'categories' => $categories,
            'authenticatedUser' => $authenticatedUser
        ]);
    }
    
    
    public function transfer_process(Request $request)
    {
        $validated = $request->validate([
            'source_bank_id' => 'required|exists:bank,id',
            'destination_bank_id' => 'required|exists:bank,id',
            'amount' => 'required|numeric|min:1',
            'other_costs' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
        ]);
    
        try {
            DB::beginTransaction();
    
            $sourceBank = Bank::lockForUpdate()->findOrFail($validated['source_bank_id']);
            $destinationBank = Bank::lockForUpdate()->findOrFail($validated['destination_bank_id']);
    
            $totalDeduction = $validated['amount'] + ($validated['other_costs'] ?? 0);
    
            if ($sourceBank->balance < $totalDeduction) {
                return response()->json(['message' => 'Insufficient balance in source bank.'], 400);
            }
    
            // Update balances
            $sourceBank->balance -= $totalDeduction;
            $sourceBank->save();
    
            $destinationBank->balance += $validated['amount'];
            $destinationBank->save();
    
            // Get bank codes
            $sourceBankDetail = BankDetail::findOrFail($sourceBank->id);
            $destinationBankDetail = BankDetail::findOrFail($destinationBank->id);
    
            // Create transfer log
            $transfer = Transfer::create([
                'date' => now(),
                'source_id' => $sourceBank->id,
                'source_name' => $sourceBankDetail->code,
                'recipient_id' => $destinationBank->id,
                'recipient_name' => $destinationBankDetail->code,
                'balance' => $validated['amount'],
                'other' => $validated['other_costs'] ?? 0,
                'note' => $validated['note'],
                'creator_name' => auth()->user()->name,
                'created_by' => auth()->id(),
            ]);
    
            DB::commit();
    
            return response()->json([
                'message' => 'Transfer successful',
                'transfer' => $transfer,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Transfer failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
