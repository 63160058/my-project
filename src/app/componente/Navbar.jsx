"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const exportDropdownRef = useRef(null);
    const importDropdownRef = useRef(null);
    const router = useRouter();
    const { data: session, status } = useSession({
 
    });

    // Function to handle the dropdown toggle
    const handleDropdown = (menu) => {
        if (isDropdownOpen === menu) {
            setIsDropdownOpen(null); // ปิด dropdown ถ้ากดที่เดิม
        } else {
            setIsDropdownOpen(menu); // เปิด dropdown ที่เลือก
        }
    };

    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
        if (
            (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) &&
            (importDropdownRef.current && !importDropdownRef.current.contains(event.target))
        ) {
            setIsDropdownOpen(null); // ปิด dropdown เมื่อคลิกนอก dropdown
        }
    };

    // UseEffect to detect clicks outside the dropdown
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to handle navigation and close dropdown
    const handleNavigation = (event, path) => {
        event.preventDefault();
        router.push(path); // เปลี่ยนเส้นทางไปที่ path ที่ระบุ
        setIsDropdownOpen(null); // ปิด dropdown หลังจาก navigation
    };

    return (
        <nav className='bg-[#333] text-white py-5 shadow-lg'>
            <div className='container mx-auto'>
                <div className='flex justify-between items-center'>
                    {/* Main Links */}
                    <div className='flex space-x-8'>
                        <Link href="/" className='hover:text-[#FFD700] transition-colors duration-300'>หน้าหลัก</Link>

                        {/* Dropdown 1: หนังสือส่งออกราชการ */}
                        <div className='relative' ref={exportDropdownRef}>
                            <button
                                onClick={() => handleDropdown('export')}
                                className='hover:text-[#FFD700] transition-colors duration-300'
                            >
                                หนังสือส่งออกราชการ
                            </button>
                            {isDropdownOpen === 'export' && (
                                <div className='absolute top-full left-0 bg-[#555] text-white p-4 shadow-md rounded-md transition-all duration-300'>
                                    <button
                                        onClick={(e) => handleNavigation(e, '/export/internal')}
                                        type="button"
                                        className='block hover:text-[#FFD700] p-2 text-left'
                                    >
                                        ภายใน
                                    </button>
                                    <button
                                        onClick={(e) => handleNavigation(e, '/export/external')}
                                        type="button"
                                        className='block hover:text-[#FFD700] p-2 text-left'
                                    >
                                        ภายนอก
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Dropdown 2: หนังสือรับราชการ */}
                        <div className='relative' ref={importDropdownRef}>
                            <button
                                onClick={() => handleDropdown('import')}
                                className='hover:text-[#FFD700] transition-colors duration-300'
                            >
                                หนังสือนำเข้าราชการ
                            </button>
                            {isDropdownOpen === 'import' && (
                                <div className='absolute top-full left-0 bg-[#555] text-white p-4 shadow-md rounded-md transition-all duration-300'>
                                    <button
                                        onClick={(e) => handleNavigation(e, '/import/internal')}
                                        type="button"
                                        className='block hover:text-[#FFD700] p-2 text-left'
                                    >
                                        ภายใน
                                    </button>
                                    <button
                                        onClick={(e) => handleNavigation(e, '/import/external')}
                                        type="button"
                                        className='block hover:text-[#FFD700] p-2 text-left'
                                    >
                                        ภายนอก
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/announcements" className='hover:text-[#FFD700] transition-colors duration-300'>ติดประกาศ</Link>
                    </div>

                    {/* Info section */}
                    <div className='text-sm'>
                        {/* Add user info here if needed */}
                    </div>
                    
                    <ul className='flex'>
                        {status === 'loading' ? (
                            <li className='mx-3'>
                                <span className='bg-gray-500 text-white border py-2 px-3 rounded-md text-ls my-2'>
                                    กำลังโหลด...
                                </span>
                            </li>
                        ) : status === 'authenticated' ? (
                            <>
                                <li className='mx-3'>
                                    <span>สวัสดี, {session.user.name}</span>
                                </li>
                                
                                <li className='mx-3'>
                                <button>
                                    <a
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className='bg-red-500 text-white border py-2 px-3 rounded-md text-ls my-2 cursor-pointer hover:bg-red-700'
                                    >
                                        ออกจากระบบ
                                    </a>
                                    </button>
                                </li>
                                
                            </>
                        ) : (
                            <li className='mx-3'>
                                <button>
                                <a
                                    onClick={() => router.push('/login')}
                                    className='bg-green-500 text-white border py-2 px-3 rounded-md text-ls my-2 cursor-pointer hover:bg-green-700'
                                >
                                    เข้าสู่ระบบ
                                </a>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
