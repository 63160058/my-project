"use client";

// components/SearchableTable.js
import { useState } from "react";


const data = [
  { id: 1, number: 42, date: "2 ก.ค. 67", from: "ปลัด", to: "ผอ.", subject: "ขอให้เปิดประกาศ", actionTime: "14:30" },
  { id: 2, number: 43, date: "5 ก.ค. 67", from: "หัวหน้า", to: "ผอ.", subject: "แจ้งการประชุม", actionTime: "10:00" },
  // เพิ่มข้อมูลอื่นๆ
];

export default function SearchableTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // ฟังก์ชันสำหรับกรองข้อมูลตามคำค้นหา
  const filteredData = data.filter((row) => {
    return (
      row.number.toString().includes(searchTerm) ||
      row.date.includes(searchTerm) ||
      row.from.includes(searchTerm) ||
      row.to.includes(searchTerm) ||
      row.subject.includes(searchTerm) ||
      row.actionTime.includes(searchTerm)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
        <div >
        {/* ช่องค้นหา */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <input
                type="text"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "8px", marginBottom: "10px", width: "40%" , border: "1px solid #ddd", orderRadius: "4px" }}
            />
        </div>

        {/* ตารางข้อมูล */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>เลขที่ทะเบียนรับ</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>ที่</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>ลงวันที่</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>จาก</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>ถึง</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>เรื่อง</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>การปฏิบัติ</th>
            </tr>
            </thead>
            <tbody>
            {filteredData.map((row) => (
                <tr key={row.id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.id}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.number}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.date}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.from}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.to}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.subject}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.actionTime}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
}
