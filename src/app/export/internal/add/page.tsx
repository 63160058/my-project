"use client";

import Navbar from "../../../componente/Navbar";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    date: '',
    from: '',
    to: '',
    story: '',
    action: '',
    comment: '',
    time: ''
  });

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
    return <p>Loading...</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/export/internal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create document: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Document created successfully:", result);
      alert("ส่งข้อมูลเรียบร้อยแล้ว");

      // กลับไปที่หน้า import/internal หลังจากส่งข้อมูลสำเร็จ
      router.push('/import/internal');
      
    } catch (error) {
      console.error("Error creating document:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <main>
      <Navbar />
      <h1 style={{ padding: "20px" }}>เพิ่มหนังสือนำเข้าราชการ (ภายใน)</h1>
      
      <form onSubmit={handleSubmit} style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>ที่:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <label>ลงวันที่:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>จาก:</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>ถึง:</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>เรื่อง:</label>
          <input
            type="text"
            name="story"
            value={formData.story}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>การปฏิบัติ:</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>หมายเหตุ:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          ส่งข้อมูล
        </button>
      </form>
    </main>
  );
}
