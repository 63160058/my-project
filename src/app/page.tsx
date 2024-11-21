'use client';
import Navbar from "./componente/Navbar";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true); // สถานะโหลด

  useEffect(() => {

    setIsLoading(false); // อัพเดตว่าโหลดเสร็จแล้ว
}, []);

  if (isLoading) {
    // แสดง loader หรือ div ว่างๆ ขณะรอโหลดสถานะ
    return ""
}
  return (
    <main
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('/bg.jpg')", // ใส่ชื่อไฟล์รูปภาพพื้นหลัง
        backgroundSize: "cover", // ปรับให้รูปภาพขยายเต็มพื้นที่
        backgroundPosition: "50% -130%", // 50% แนวนอน, 20% แนวตั้ง
        backgroundRepeat: "no-repeat", // ไม่ให้ภาพพื้นหลังซ้ำ
      }}
    >
      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>
    </main>
  );
}
