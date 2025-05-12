import React, { useState } from 'react';
import { router ,usePage} from '@inertiajs/react';
import Swal from 'sweetalert2';


export default function ForgotPassword() {
    const { csrf_token } = usePage().props;
    const [csrf,setCsrf] = useState(csrf_token)

    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const fetchQuestion = async () => {
        try {
            const res = await fetch(`/api/security-question/${username}`);
            const data = await res.json();
            if (res.ok) {
                setQuestion(data.question);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Terjadi kesalahan.');
        }
    };

    const verifyAnswer = async () => {
        const res = await fetch(`/api/verify-security-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf, // include this
            },
            body: JSON.stringify({ username, answer }),
        });
        const data = await res.json();
        
        if (res.ok) {
            setStep(3);
            setCsrf(data.csrf);
        } else {
            setError(data.message);
        }
    };

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Password tidak sama.');
            return;
        }
    
        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf, // include this

                },
                body: JSON.stringify({
                    username,
                    password: newPassword,
                }),
            });
    
            const data = await res.json();
    
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: data.message,
                }).then(() => {
                    window.location.href = '/login'; // redirect after alert
                });
            } else {
                setError(data.message || 'Gagal mereset password.');
            }
        } catch (err) {
            setError('Terjadi kesalahan.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full space-y-6 bg-white p-6 border rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-center">Lupa Password</h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                {step === 1 && (
                    <>
                        <input
                            type="text"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                        <button onClick={fetchQuestion} className="w-full bg-cyan-600 text-white py-2 rounded">
                            Lanjut
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="text-sm text-gray-700">Pertanyaan: <b>{question}</b></p>
                        <input
                            type="text"
                            placeholder="Jawaban Anda"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                        <button onClick={verifyAnswer} className="w-full bg-cyan-600 text-white py-2 rounded">
                            Verifikasi Jawaban
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                        <input
                            type="password"
                            placeholder="Konfirmasi Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                        />
                        <button onClick={resetPassword} className="w-full bg-cyan-600 text-white py-2 rounded">
                            Simpan Password Baru
                        </button>
                    </>
                )}
                <div className="text-center pt-4">
                    <a href="/login" className="text-sm text-cyan-700 hover:underline">
                        Kembali ke halaman login
                    </a>
                </div>
            </div>
        </div>
    );
}
