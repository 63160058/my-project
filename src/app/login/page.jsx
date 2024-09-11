"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await signIn('credentials', {
              redirect: false,
              email,
              password,
            })
      
            if (result.error) {
              console.error(result.error)
            } else {
              router.push('/')
            }
          } catch (error) {
            console.log('error', error)
          }
        }

    return (
        <div 
            className="min-h-screen flex justify-center items-center bg-cover bg-center" 
            style={{ backgroundImage: "url('https://banpong.go.th/public/slideone_upload/backend/slideone_3_1.jpg')" }} // ใส่ path ของรูปพื้นหลังที่ต้องการ
        >
            <div className="bg-white/80 p-8 rounded-md shadow-md w-96">
                {/* Header with image */}
                <div className="mb-5 text-center">
                    <img src="https://banpong.go.th/public/configuration_upload/config/logoweb.png" alt="Banpong Municipality" style={{ width: '150px', height: '150px' }}  className="mx-auto mb-5" />
                    <h2 className="text-center text-2xl font-bold text-blue-800">เข้าสู่ระบบ</h2>
                </div>

                {/* Form */}
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
                            value={email}
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
                        login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
