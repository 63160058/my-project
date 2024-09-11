"use client";

import { useState, useEffect } from "react";

export default function SearchableTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/export/external"); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // ฟังก์ชันสำหรับกรองข้อมูลตามคำค้นหา
  const filteredData = data.filter((row) => {
    return (
      row.doc_id.toString().includes(searchTerm) ||
      row.num_doc.toString().includes(searchTerm) ||
      row.doc_date_at.includes(searchTerm) ||
      row.doc_from.includes(searchTerm) ||
      row.doc_end.includes(searchTerm) ||
      row.doc_title.includes(searchTerm) ||
      row.doc_main.includes(searchTerm)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <div>
        {/* ช่องค้นหา */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", marginBottom: "10px", width: "40%", border: "1px solid #ddd", borderRadius: "4px" }}
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
              <tr key={row.doc_id}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.doc_id}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.num_doc}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{new Date(row.doc_date_at).toLocaleDateString()}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.doc_from}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.doc_end}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.doc_title}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.doc_main}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
