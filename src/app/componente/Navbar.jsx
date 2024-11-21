"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const exportDropdownRef = useRef(null);
    const importDropdownRef = useRef(null);
    const router = useRouter();

    // เก็บค่า token และ username จากคุกกี้
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // สถานะโหลด

    useEffect(() => {
        const storedToken = Cookies.get("token");
        const storedUsername = Cookies.get("userName");

        setToken(storedToken);
        setUsername(storedUsername);
        setIsLoading(false); // อัพเดตว่าโหลดเสร็จแล้ว
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("userName");
        Cookies.remove("role");
        router.push("/");
        window.location.reload();
    };

    const handleDropdown = (menu) => {
        setIsDropdownOpen(isDropdownOpen === menu ? null : menu);
    };

    const handleClickOutside = (event) => {
        if (
            (exportDropdownRef.current &&
                !exportDropdownRef.current.contains(event.target)) &&
            (importDropdownRef.current &&
                !importDropdownRef.current.contains(event.target))
        ) {
            setIsDropdownOpen(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNavigation = (event, path) => {
        event.preventDefault();
        router.push(path);
        setIsDropdownOpen(null);
    };

    // if (isLoading) {
    //     // แสดง loader หรือ div ว่างๆ ขณะรอโหลดสถานะ
    //     return ""
    // }

    return (
        <nav className="bg-[#333] text-white py-5 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    {/* Main Links */}
                    <div className="flex space-x-8">
                        <Link
                            href="/"
                            className="hover:text-[#FFD700] transition-colors duration-300"
                        >
                            หน้าหลัก
                        </Link>
                        <div className="relative" ref={exportDropdownRef}>
                            <button
                                onClick={() => handleDropdown("export")}
                                className="hover:text-[#FFD700] transition-colors duration-300"
                            >
                                หนังสือส่งออกราชการ
                            </button>
                            {isDropdownOpen === "export" && (
                                <div className="absolute top-full left-0 bg-[#555] text-white p-4 shadow-md rounded-md transition-all duration-300">
                                    <button
                                        onClick={(e) =>
                                            handleNavigation(e, "/export/internal")
                                        }
                                        type="button"
                                        className="block hover:text-[#FFD700] p-2 text-left"
                                    >
                                        ภายใน
                                    </button>
                                    <button
                                        onClick={(e) =>
                                            handleNavigation(e, "/export/external")
                                        }
                                        type="button"
                                        className="block hover:text-[#FFD700] p-2 text-left"
                                    >
                                        ภายนอก
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Dropdown 2: หนังสือรับราชการ */}
                        <div className="relative" ref={importDropdownRef}>
                            <button
                                onClick={() => handleDropdown("import")}
                                className="hover:text-[#FFD700] transition-colors duration-300"
                            >
                                หนังสือนำเข้าราชการ
                            </button>
                            {isDropdownOpen === "import" && (
                                <div className="absolute top-full left-0 bg-[#555] text-white p-4 shadow-md rounded-md transition-all duration-300">
                                    <button
                                        onClick={(e) =>
                                            handleNavigation(e, "/import/internal")
                                        }
                                        type="button"
                                        className="block hover:text-[#FFD700] p-2 text-left"
                                    >
                                        ภายใน
                                    </button>
                                    <button
                                        onClick={(e) =>
                                            handleNavigation(e, "/import/external")
                                        }
                                        type="button"
                                        className="block hover:text-[#FFD700] p-2 text-left"
                                    >
                                        ภายนอก
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/announcements"
                            className="hover:text-[#FFD700] transition-colors duration-300"
                        >
                            ติดประกาศ
                        </Link>
                    </div>

                    <ul className="flex">
                        {token ? (
                            <>
                                <li className="mx-3 flex items-center">
                                    <span>สวัสดี, {username}</span>
                                </li>
                                <li className="mx-3">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 text-white border py-2 px-3 rounded-md text-ls my-2 cursor-pointer hover:bg-red-700"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </li>
                            </>
                        ) : (
                            
                            <li className="mx-3 flex space-x-4">
                            <Link href="/register">
                                <button className="bg-green-500 text-white border py-2 px-4 rounded-md text-ls my-2 cursor-pointer hover:bg-green-600 transition-colors">
                                    สมัครสมาชิก
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="bg-blue-500 text-white border py-2 px-4 rounded-md text-ls my-2 cursor-pointer hover:bg-blue-600 transition-colors">
                                    เข้าสู่ระบบ
                                </button>
                            </Link>
                        </li>
                        
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
