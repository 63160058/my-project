"use client";

import { useState, useEffect } from "react";

export default function SearchableTable() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // จำนวนข้อมูลต่อหน้า (เริ่มต้นเป็น 10)

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch("/api/export/internal"); // Adjust the URL if needed
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
            row.D_id.toString().includes(searchTerm) ||
            row.D_date.toString().includes(searchTerm) ||
            row.D_from.includes(searchTerm) ||
            row.D_story.includes(searchTerm) ||
            row.D_time.includes(searchTerm) ||
            row.D_to.includes(searchTerm) ||
            row.D_num.includes(searchTerm)
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // ฟังก์ชันสำหรับเปลี่ยนจำนวนข้อมูลที่แสดงต่อหน้า
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // รีเซ็ตกลับไปที่หน้าที่ 1 เมื่อเปลี่ยนจำนวนข้อมูลต่อหน้า
    };

    return (
        <div style={{ padding: "20px" }}>
            <div>
                {/* ช่องค้นหา */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px" }}>
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "8px", marginBottom: "10px", width: "40%", border: "1px solid #ddd", borderRadius: "4px" }}
                    />

                    {/* Dropdown สำหรับเปลี่ยนจำนวนข้อมูลที่แสดงต่อหน้า */}

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
                        {currentItems.map((row) =>
                            row.D_type === "internal" ? (
                                <tr key={row.D_id}>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_id}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_num}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                        {new Date(row.D_date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_from}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_to}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_story}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_time}</td>
                                </tr>
                            ) : null
                        )}
                    </tbody>
                </table>

                {/* Pagination controls */}
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}> {/* flex-end เพื่อให้ปุ่มไปอยู่ด้านขวา */}
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ padding: "8px", margin: "0 5px", cursor: "pointer" }}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            style={{
                                padding: "8px",
                                margin: "0 5px",
                                cursor: "pointer",
                                backgroundColor: currentPage === i + 1 ? "#ddd" : "transparent",
                                border: "1px solid #ddd"
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ padding: "8px", margin: "0 5px", cursor: "pointer" }}
                    >
                        Next
                    </button>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
                        <option value={5}>5</option>
                        <option value={10}>10 </option>
                        <option value={50}>50 </option>
                        <option value={100}>100 </option>
                    </select>
                </div>
                {/* <p style={{ marginLeft: "10px" }}>Page {currentPage} of {totalPages}</p>
         */}
            </div>
        </div>
    );
}
