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

  // const thaiTimes = data.map((row) => {
  //   if (row.D_time) {
  //     return new Date(row.D_time).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  //   }
  //   return ""; // คืนค่าว่างถ้าไม่มีเวลา
  // });


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
  
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };


  const handleEdit = async (Id) => {
    try {
      const response = await fetch(`/api/export/internal/list/${Id}`);
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลหนังสือส่งออกราชการ (ภายใน)');
      }
      const data = await response.json();

      console.log(data);

      // setEventData({
      //   event_id: data.event_id,
      //   title: data.title,
      //   description: data.description,
      //   start_date: formatDateTime(data.start_date),
      //   end_date: formatDateTime(data.end_date),
      //   all_day: data.all_day,
      // });
      setShowDialog_edit(true); // เปิดหน้าต่างแก้ไข
    } catch (error) {
      // console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือส่งออกราชการ (ภายใน)', error);
    }
  };

  const handleUpdate = async (Id) => {
    try {
      // if (!eventData.title || !eventData.start_date || !eventData.end_date) {
      //   alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      //   return;
      // }

      const response = await fetch(`/api/export/internal/edit/${Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}`);
      }

      const result = await response.json();
      console.log('อัปเดตหนังสือส่งออกราชการ (ภายใน)สำเร็จ:', result);

      setShowDialog_edit(false);
      window.location.reload(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตหนังสือส่งออกราชการ (ภายใน)', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตหนังสือส่งออกราชการ (ภายใน)');
    }
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
                            .filter((row) => row.D_type === "internal") // กรองเฉพาะแถวที่เป็น external
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
                                        onClick={() => delete_row(row.D_id)}  // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
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
            <h3 className="text-2xl font-bold mb-4">แก้ไขกิจกรรม</h3>
            <form onSubmit={() => handleUpdate(edit_id)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="id">ที่:</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="date">ลงวันที่:</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.start_date}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="from">จาก:</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="to">ถึง:</label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="story">เรื่อง:</label>
                <input
                  type="text"
                  id="story"
                  name="story"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="comment">การปฏิบัติ:</label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="time">หมายเหตุ:</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="time">หมายเหตุ:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  // value={eventData.title}
                  // onChange={handleInputChange1}
                />
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="end_date">วันที่สิ้นสุด</label>
                <input
                  type="datetime-local"
                  id="end_date"
                  name="end_date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={eventData.end_date}
                  onChange={handleInputChange1}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="all_day"
                  name="all_day"
                  className="mr-2"
                  checked={eventData.all_day}
                  onChange={handleInputChange1}
                />
                <label htmlFor="all_day" className="text-sm">กิจกรรมตลอดวัน</label>
              </div> */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  // className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDialog_edit(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:text-gray-700"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  แก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
