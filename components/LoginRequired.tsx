import React from 'react'
import Link from 'next/link';
import { Lock } from "lucide-react";

function LoginRequired() {
    return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6">
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 max-w-md">
                <div className="flex justify-center mb-4">
                    <Lock size={48} className="text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Login Required
                </h2>

                <p className="text-gray-600 mb-6">
                    You must be logged in to access your dashboard. Please sign in to
                    continue.
                </p>

                <div className="flex-col items-center justify-center mt-2">
                    <Link
                        href="/signin"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign In
                    </Link>

                    <p className="text-base text-center text-gray-600 mt-6">
                        New User? Not a Member{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginRequired