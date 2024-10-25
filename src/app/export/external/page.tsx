"use client";

import Navbar from "../../componente/Navbar";
import SearchableTable from "../../componente/SearchableTableexternal";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
import React, { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter(); // ใช้ useRouter สำหรับการเปลี่ยนเส้นทาง
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ใช้ getSession() เพื่อดึงข้อมูลเซสชัน
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login'); // ถ้าไม่มี session จะถูกส่งไปที่หน้า login
      } else {
        setLoading(false); // เมื่อมี session จะหยุด loading
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // แสดงข้อความ Loading ระหว่างตรวจสอบเซสชัน
  }

  return (
    <main>
      <Navbar />
      <h1 style={{ padding: "20px" }}>หนังสือส่งราชกาล (ภายนอก)</h1>
      <SearchableTable />
    </main>
  );
}
