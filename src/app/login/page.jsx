"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
    const [User_email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // สำหรับเก็บข้อความข้อผิดพลาด
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // รีเซ็ตข้อความข้อผิดพลาดก่อน

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ User_email, password }),
            });

            // ตรวจสอบว่าสถานะของ response สำเร็จหรือไม่
            if (response.ok) {
                console.log("Login successful! Redirecting to home page...");
                router.push('/');
            } else {
                const data = await response.json();
                setError(data.message || "An error occurred during login");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://banpong.go.th/public/slideone_upload/backend/slideone_3_1.jpg')" }}
        >
            <div className="bg-white/80 p-8 rounded-md shadow-md w-96">
                <div className="mb-5 text-center">
                    <img src="https://banpong.go.th/public/configuration_upload/config/logoweb.png" alt="Banpong Municipality" style={{ width: '150px', height: '150px' }} className="mx-auto mb-5" />
                    <h2 className="text-center text-2xl font-bold text-blue-800">เข้าสู่ระบบ</h2>
                </div>

                {/* แสดงข้อความข้อผิดพลาดถ้ามี */}
                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-left mb-2 font-semibold text-blue-800">
                            E-mail :
                        </label>
                        <input
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-200 border border-gray-300"
                            type="email"
                            value={User_email}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-left mb-2 font-semibold text-blue-800">
                            รหัสผ่าน :
                        </label>
                        <input
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-200 border border-gray-300"
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
                    >
                        เข้าสู่ระบบ
                    </button>

                    <hr className="my-2" />
                    <button
                        onClick={() => router.back()}
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all"
                    >
                        ย้อนกลับ
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
