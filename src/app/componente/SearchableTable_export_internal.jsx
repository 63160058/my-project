"use client";

import { useState, useEffect } from "react";
import { faPencil, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchableTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog_edit, setShowDialog_edit] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [showDialog_delete, setShowDialog_delete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const [formData, setFormData] = useState({
    id: '',
    D_id: '',
    date: '',
    from: '',
    to: '',
    story: '',
    action: '',
    comment: '',
    time: ''
  });

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
      // row.num_doc.toString().includes(searchTerm) ||
      row.D_date.includes(searchTerm) ||
      row.D_from.includes(searchTerm) ||
      row.D_to.includes(searchTerm) ||
      row.D_story.includes(searchTerm) ||
      row.D_comment.includes(searchTerm)
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


  const Download_file = async (fileName) => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST', // ใช้ POST เพื่อส่งข้อมูล
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }), // ส่งข้อมูลเป็น JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
  
      // แปลง response เป็น Blob
      const blob = await response.blob();
  
      // สร้าง URL เพื่อดาวน์โหลดไฟล์
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
      a.click();
      window.URL.revokeObjectURL(url); // ลบ URL ออกจากหน่วยความจำ
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  

  async function handleFileUpload(e) {
    if (e.target.files) {
      const formData = new FormData();
  
      // ตรวจสอบและเพิ่มเฉพาะไฟล์ PDF
      Object.values(e.target.files).forEach((file) => {
        if (file.type === "application/pdf") {
          formData.append("file", file);
        } else {
          alert(`${file.name} ไม่ใช่ไฟล์ PDF`);
        }
      });
  
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const format_DateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // แปลงเป็น 'YYYY-MM-DD'
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  


  const handleEdit = async (Id) => {
    try {
      const response = await fetch(`/api/export/internal/list/${Id}`);
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลหนังสือส่งออกราชการ (ภายใน)');
      }
      const data = await response.json();

      console.log(data);

      setFormData({
        id: data.id,
        D_id: data.D_id,
        date: format_DateTime(data.D_date),
        from: data.D_from,
        to: data.D_to,
        story: data.D_story,
        action: data.D_action,
        comment: data.D_comment,
        time: formatTime(data.D_time)
      });



      setShowDialog_edit(true); // เปิดหน้าต่างแก้ไข
    } catch (error) {
      // console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือส่งออกราชการ (ภายใน)', error);
    }
  };

  const handleUpdate = async (Id) => {
    const data = new FormData();
  
    // เพิ่มข้อมูลฟอร์มเข้าไปใน FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value.toString());
      }
    });
  
    // เพิ่มไฟล์ PDF ที่อัปโหลด (ถ้ามี)
    const fileInput = document.querySelector('input[name="file"]');
    if (fileInput?.files?.[0]) {
      data.append('file', fileInput.files[0]);
    }
  
    try {
      const response = await fetch(`/api/export/internal/edit/${Id}`, {
        method: 'PUT',
        body: data, // ส่ง FormData แทน JSON
      });
  
      // ตรวจสอบสถานะการตอบกลับ
      if (!response.ok) {
        const errorDetails = await response.text(); // อ่านข้อความจาก response
        throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}, ข้อความ: ${errorDetails}`);
      }
  
      // ตรวจสอบว่าเนื้อหาของการตอบกลับเป็น JSON
      const result = await response.json();
      console.log('อัปเดตหนังสือส่งออกราชการ (ภายใน)สำเร็จ:', result);
  
      setShowDialog_edit(false);
      // window.location.reload(); // รีเฟรชข้อมูล
    } catch (error) {
      // console.error('เกิดข้อผิดพลาดในการอัปเดตหนังสือส่งออกราชการ (ภายใน)', error);
      // alert(`เกิดข้อผิดพลาดในการอัปเดตหนังสือส่งออกราชการ (ภายใน): ${error.message}`);
    }
  };
  
  const handleFileAndInputChange = (e) => {
    handleFileUpload(e);
    handleInputChange(e);
  };

  const handleDelete2 = async (Id) => {
    const E_ID = Id;
    console.log('กำลังลบกิจกรรมที่มี ID:', E_ID);

    const formattedData1 = {
      Id: Id,
    };

    try {
      const response = await fetch(`/api/export/internal/delete/${Id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData1),
      });

      if (response.ok) {
        console.log('ลบกิจกรรมสำเร็จ');
        setShowDialog_delete(false);
        window.location.reload(); // รีเฟรชข้อมูล
      } else {
        console.error('ไม่สามารถลบกิจกรรมได้');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบกิจกรรม:', error);
    }
  };

  const handleDelete = (Id) => {
    console.log('กำลังลบหนังสือส่งออกราชการ (ภายใน) ID:', Id);
    setEventIdToDelete(Id); // เก็บ ID ของกิจกรรมที่ต้องการลบ
    setShowDialog_delete(true); // เปิดหน้าต่างยืนยันการลบ
  };




  return (
    <div style={{ padding: "20px" }}>
      <div>
        {/* ช่องค้นหา */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "40%", border: "1px solid #ddd", borderRadius: "4px" }}
          />

          <button
            type="button"
            onClick={() => window.location.href="/export/internal/add" } // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            เพิ่มข้อมูล
          </button>
        </div>

        {/* ตารางข้อมูล */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ width: "5%", padding: "8px", border: "1px solid #ddd" }}>เลขที่ทะเบียนรับ</th>
              <th style={{ width: "10%", padding: "8px", border: "1px solid #ddd" }}>ที่</th>
              <th style={{ width: "5%", padding: "8px", border: "1px solid #ddd" }}>ลงวันที่</th>
              <th style={{ width: "8%", padding: "8px", border: "1px solid #ddd" }}>จาก</th>
              <th style={{ width: "8%", padding: "8px", border: "1px solid #ddd" }}>ถึง</th>
              <th style={{ width: "44%", padding: "8px", border: "1px solid #ddd" }}>เรื่อง</th>
              <th style={{ width: "10%", padding: "8px", border: "1px solid #ddd" }}>การปฏิบัติ</th>
              <th style={{ width: "5%", padding: "8px", border: "1px solid #ddd" }}>หมายเหตุ</th>
              <th style={{ width: "5%", padding: "8px", border: "1px solid #ddd" }}>Action</th>
            </tr>
          </thead>
          <tbody>
                        {currentItems
                            .filter((row) => row.D_type === "internal" && (row.D_id.includes(searchTerm) || row.D_date.includes(searchTerm) || row.D_from.includes(searchTerm) || row.D_story.includes(searchTerm) || row.D_time.includes(searchTerm)|| row.D_to.includes(searchTerm) || row.D_comment.includes(searchTerm))) // กรองเฉพาะแถวที่เป็น internal
                            .map((row, index) => (
                                <tr key={row.D_id}>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                        {indexOfFirstItem + index + 1} {/* ลำดับแถว */}
                                    </td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{row.D_id}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                        {new Date(row.D_date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{row.D_from}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{row.D_to}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.D_story}</td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{row.D_comment}</td>

                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                      {row.D_time ? new Date(row.D_time).toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' }) : ""}
                                    </td>

                                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                      <button
                                        type="button"
                                        onClick={() => Download_file(row.D_file)}  // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                      >
                                        <FontAwesomeIcon icon={faDownload} className="text-[#ffffff] transition-colors duration-300 hover:text-[#1E90FF]"  />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleEdit(row.id)}  // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                      >
                                        <FontAwesomeIcon icon={faPencil} className="text-[#ffffff] transition-colors duration-300 "  />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(row.id)}  // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                      >
                                        <FontAwesomeIcon icon={faTrash} className="text-[#ffffff] transition-colors duration-300 "  />
                                      </button>
                                    </td>

                                </tr>
                            ))}
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
      {showDialog_edit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">แก้ไขหนังสือส่งออกราชการ (ภายใน)</h3>
            <form onSubmit={() => handleUpdate(formData.id)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="id">ที่:</label>
                <input
                  type="text"
                  id="D_id"
                  name="D_id"
                  value={formData.D_id}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="date">ลงวันที่:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="from">จาก:</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="to">ถึง:</label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="story">เรื่อง:</label>
                <input
                  type="text"
                  id="story"
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="comment">การปฏิบัติ:</label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="time">หมายเหตุ:</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="upload-pdf"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="upload-pdf" className="text-sm font-medium cursor-pointer">
                  ต้องการอัพโหลด PDF ใหม่หรือไม่?
                </label>
              </div>
              {isChecked && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="time">หมายเหตุ:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileAndInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"

                />
              </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  // className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDialog_edit(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:text-gray-700"
                >
                  ยกเลิก
                </button>
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  แก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDialog_delete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบหนังสือส่งออกราชการ (ภายใน)</h2>
            <p>คุณต้องการลบหนังสือส่งออกราชการ (ภายใน) หรือ ไม่?</p>
            <div className="flex justify-end gap-2">
                <button
                type="button"
                onClick={() => setShowDialog_delete(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:text-gray-700"
                >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleDelete2(eventIdToDelete)}  // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
