"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

        if (error) {
            console.error("Login error:", error);
            setError(error.message);
            setLoading(false);
            return;
        }

        console.log("Logged in user:", data.user);

        setLoading(false);

        router.push("/dashboard");
    }

    return (
        <main className="min-h-screen w-full bg-gray-100">

            <div className="flex min-h-screen w-full flex-col">

                {/* HEADER */}
                <header className="relative flex min-h-[90px] w-full items-center justify-center bg-white px-4 py-4 shadow-sm sm:min-h-[105px] sm:px-6 md:h-28 md:py-0">

                    {/* LOGO */}
                    <div className="absolute left-3 flex items-center sm:left-6">
                        <Image
                            src="/Lions.svg"
                            alt="Lions Clubs International"
                            width={100}
                            height={70}
                            className="h-12 w-auto object-contain sm:h-16"
                            priority
                        />
                    </div>

                    {/* TITLE */}
                    <h1 className="px-16 text-center text-lg font-bold leading-tight text-blue-900 sm:px-20 sm:text-xl md:px-0 md:text-2xl">
                        Diabetes Screening Camp
                    </h1>

                </header>

                {/* LOGIN AREA */}
                <div className="flex flex-1 items-center justify-center px-3 py-8 sm:px-5 sm:py-10">

                    {/* LOGIN CARD */}
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-7 md:p-8">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* LOGIN TITLE */}
                            <h2 className="text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
                                Login
                            </h2>

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-center text-sm font-bold text-gray-900">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter email"
                                    className="input w-full text-center font-semibold"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-center text-sm font-bold text-gray-900">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter password"
                                    className="input w-full text-center font-semibold"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* ERROR */}
                            {error && (
                                <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-bold leading-relaxed text-red-600">
                                    {error}
                                </p>
                            )}

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-blue-700 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </main>
    );
}