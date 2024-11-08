"use client";

import Navbar from "../../componente/Navbar";
import SearchableTable from "../../componente/SearchableTable_export_external";
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter(); // ใช้ useRouter สำหรับการเปลี่ยนเส้นทาง
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงค่า token จาก cookie
    const token = Cookies.get('token');
    
    if (token) {
      console.log('Token:', token);
      // เมื่อมี token ให้หยุดการแสดง Loading และแสดงเนื้อหา
      setLoading(false);
    } else {
      console.log('No token found');
      // หากไม่มี token ให้ redirect ไปยังหน้า login
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // แสดงข้อความ Loading ระหว่างตรวจสอบเซสชัน
  }

  return (
    <main>
      <Navbar />
      <h1 style={{ padding: "20px" }}>หนังสือส่งออกราชการ (ภายนอก)</h1>
      <SearchableTable />
    </main>
  );
}
