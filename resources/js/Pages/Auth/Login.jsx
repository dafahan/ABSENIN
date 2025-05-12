import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { FaRegCopyright } from "react-icons/fa";

export default function Login() {
    const { csrf_token } = usePage().props;
    const [remember, setRemember] = useState(false);

    const [form, setForm] = useState({
        username: 'superadmin',
        password: '123',
    });
    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: JSON.stringify({ ...form, remember }),

            });

            if (response.redirected) {
                router.visit(response.url, { method: 'get' });
            } else {
                const data = await response.json();
                if (response.status === 422) {
                    setErrors(data.errors);
                    setForm({
                        username: '',
                        password: '',
                    });
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white font-sans">
            {/* Header */}
            <header className="flex justify-center py-8 w-full border-b-2 border-gray-100">
                <img
                    src="/assets/images/logo.png"
                    alt="Logo"
                    className="h-12"
                />
            </header>

            {/* Login Box */}
            <main className="flex flex-col items-center justify-center flex-grow px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-full max-w-md space-y-6 p-8 border border-gray-200 shadow-xl rounded-2xl"
                >
                    <div>
                        <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                            NPM <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Masukkan npm anda.."
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-blue-50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Masukkan password anda.."
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-blue-50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-700">
                            Ingat saya
                        </label>

                    </div>

                    {errors && (
                        <div className="text-sm text-red-600 font-medium">
                            {errors.username || errors.password ||errors.ip}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition duration-200"
                    >
                        Masuk
                    </button>
                    <div className="text-right text-sm text-cyan-600 mt-2">
                            <a href="/forgot-password" className="hover:underline">
                                Lupa password?
                            </a>
                    </div>
                </form>
            </main>

            {/* Footer */}
            <footer className="bg-cyan-600 text-white px-6 py-4 flex items-center justify-between">
                <img
                    src="/assets/images/logo.png"
                    alt="MedS-PATH Footer Logo"
                    className="h-8"
                />
                <div className="flex gap-2  items-center justify-around">
                <FaRegCopyright color='white' size={18}/>
                <span className="text-sm italic ">Copyright 2025</span>
                </div>
            </footer>
        </div>
    );
}
