"use client";

import { useState, useEffect } from "react";
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchableTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog_add, setshowDialog_add] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [showDialog_delete, setShowDialog_delete] = useState(false);
  const [showDialog_edit, setShowDialog_edit] = useState(false);


  const [formData, setFormData] = useState({
    id: '',
    A_date1: '',
    A_Agency: '',
    A_Book_number: '',
    A_date2: '',
    A_Subject: '',
    A_date3: '',
    A_endorser1: '',
    A_date4: '',
    A_date5: '',
    A_endorser2: ''
  });

  const [formData1, setFormData1] = useState({
    id: '',
    A_date1: '',
    A_Agency: '',
    A_Book_number: '',
    A_date2: '',
    A_Subject: '',
    A_date3: '',
    A_endorser1: '',
    A_date4: '',
    A_date5: '',
    A_endorser2: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // จำนวนข้อมูลต่อหน้า (เริ่มต้นเป็น 10)

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/announcements');
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setData(data);
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    // console.log(date);
    if (isNaN(date)) return ""; // ตรวจสอบว่าเป็นวันที่ที่ถูกต้อง
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedDate1 = formatDate(row.A_date1);


  return (
    row.id.toString().includes(searchTerm) || // Convert `id` to string
     // Convert date fields to strings if necessary
    row.A_Agency.includes(searchTerm) ||
    row.A_Book_number.includes(searchTerm) ||
    row.A_date2.toString().includes(searchTerm) ||
    row.A_Subject.includes(searchTerm) ||
    row.A_date3.toString().includes(searchTerm) ||
    row.A_endorser1.includes(searchTerm) ||
    row.A_date4.toString().includes(searchTerm) ||
    row.A_date5.toString().includes(searchTerm) ||
    row.A_endorser2.includes(searchTerm)
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    // console.log(date);
    if (isNaN(date)) return ""; // ตรวจสอบว่าเป็นวันที่ที่ถูกต้อง
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  


  const handleAddNewData = async (e) => {
    setFormData({
      A_date1: data.A_date1,
      A_Agency: data.A_Agency,
      A_Book_number: data.A_Book_number,
      A_date2: data.A_date2,
      A_Subject: data.A_Subject,
      A_date3: data.A_date3,
      A_endorser1: data.A_endorser1,
      A_date4: data.A_date4,
      A_date5: data.A_date5,
      A_endorser2: data.A_endorser2
    });
    console.log(formData);

    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  }


  const handleDelete2 = async (Id) => {
    const E_ID = Id;
    console.log('กำลังลบกิจกรรมที่มี ID:', E_ID);

    const formattedData1 = {
      Id: Id,
    };

    try {
      const response = await fetch(`/api/announcements/delete/${Id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData1),
      });

      if (response.ok) {
        console.log('ลบกิจข้อมูลติดประกาศ ');
        setShowDialog_delete(false);
        window.location.reload(); // รีเฟรชข้อมูล
      } else {
        console.error('ไม่สามารถลบข้อมูลติดประกาศ ');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูลติดประกาศ :', error);
    }
  };

  const handleDelete = (Id) => {
    console.log('กำลังลบข้อมูลติดประกาศ  ID:', Id);
    setEventIdToDelete(Id); // เก็บ ID ของกิจกรรมที่ต้องการลบ
    setShowDialog_delete(true); // เปิดหน้าต่างยืนยันการลบ
  };

  const handleInputChange1 = (e) => {
    setFormData1({
      ...formData1,
      [e.target.name]: e.target.value,
    });
  };

  const format_DateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // แปลงเป็น 'YYYY-MM-DD'
  };

  const handleEdit = async (Id) => {
    try {
      const response = await fetch(`/api/announcements/list/${Id}`);
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลติดประกาศ');
      }
      const data = await response.json();

      console.log(data);

      setFormData1({
        id: data.id,
        A_date1: format_DateTime(data.A_date1),
        A_Agency: data.A_Agency,
        A_Book_number: data.A_Book_number,
        A_date2: format_DateTime(data.A_date2),
        A_Subject: data.A_Subject,
        A_date3: format_DateTime(data.A_date3),
        A_endorser1: data.A_endorser1,
        A_date4: format_DateTime(data.A_date4),
        A_date5: format_DateTime(data.A_date5),
        A_endorser2: data.A_endorser2
      });



      setShowDialog_edit(true); // เปิดหน้าต่างแก้ไข
    } catch (error) {
      // console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือส่งออกราชการ (ภายใน)', error);
    }
  };

  
  const handleUpdate = async (Id) => {
    try {

      const data = {
        A_date1: formData1.A_date1,
        A_Book_number: formData1.A_Book_number,
        A_date2: formData1.A_date2,
        A_Subject: formData1.A_Subject,
        A_date3: formData1.A_date3,
        A_endorser1: formData1.A_endorser1,
        A_date4: formData1.A_date4,
        A_date5: formData1.A_date5,
        A_endorser2: formData1.A_endorser2,
        A_Agency: formData1.A_Agency,
      };

      console.log('กำลังอัปเดตข้อมูลติดประกาศ:', data);
    

      const response = await fetch(`/api/announcements/edit/${Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}`);
      }

      const result = await response.json();
      console.log('อัปเดตกิจกรรมสำเร็จ:', result);

      setShowDialog_edit(false);
      window.location.reload(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตกิจกรรม:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตกิจกรรม');
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
            // onClick={() => window.location.href="/export/external/add" } // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
            onClick={() => setshowDialog_add(true)} // ส่งค่า eventIdToDelete ไปยังฟังก์ชันลบ
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            เพิ่มข้อมูล
          </button>
        </div>

        {/* ตารางข้อมูล */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", textAlign: "center" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>เลขรับ</th>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ว/ด/ป รับ</th>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>หน่วยงาน</th>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>เลขที่หนังสือ</th>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ลงวันที่</th>
              <th rowSpan="2" style={{  width: "15%",border: "1px solid #ddd", padding: "8px" }}>เรื่อง/รายการ</th>
              <th colSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ป.ช.ส. ลงเว็บไซต์</th>
              <th colSpan="3" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>การติดประกาศบอร์ด</th>
              <th rowSpan="2" style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>Action</th>
            </tr>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ว/ด/ป ที่ลง</th>
              <th style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ผู้ลง</th>
              <th style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ว/ด/ป ปิด</th>
              <th style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ว/ด/ป ปลด</th>
              <th style={{  width: "5%",border: "1px solid #ddd", padding: "8px" }}>ผู้ลง</th>
            </tr>
          </thead>
          <tbody>
            {currentItems
            .filter((row) => row.A_date1.toString().includes(searchTerm) || row.A_Agency.includes(searchTerm) || row.A_Book_number.includes(searchTerm) || row.A_date2.includes(searchTerm) || row.A_Subject.includes(searchTerm) || row.A_date3.includes(searchTerm) || row.A_endorser1.includes(searchTerm) || row.A_date4.includes(searchTerm) || row.A_date5.includes(searchTerm) || row.A_endorser2.includes(searchTerm))
              .map((row, index) => (
            <tr key={row.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{indexOfFirstItem + index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(row.A_date1)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.A_Agency}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.A_Book_number}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(row.A_date2)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.A_Subject}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(row.A_date3)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.A_endorser1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(row.A_date4)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDate(row.A_date5)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.A_endorser2}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>

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

{showDialog_add && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md shadow-lg max-w-4xl w-full">
      <h3 className="text-2xl font-bold mb-6">เพิ่มข้อมูลติดประกาศ</h3>
      <form onSubmit={handleAddNewData}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_date1">
              ว/ด/ป รับ:
            </label>
            <input
              type="date"
              id="A_date1"
              name="A_date1"
              value={formData.A_date1}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_Agency">
              หน่วยงาน:
            </label>
            <input
              type="text"
              id="A_Agency"
              name="A_Agency"
              value={formData.A_Agency}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_Book_number">
              เลขที่หนังสือ:
            </label>
            <input
              type="text"
              id="A_Book_number"
              name="A_Book_number"
              value={formData.A_Book_number}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_date2">
              ลงวันที่:
            </label>
            <input
              type="date"
              id="A_date2"
              name="A_date2"
              value={formData.A_date2}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_Subject">
              เรื่อง/รายการ:
            </label>
            <input
              type="text"
              id="A_Subject"
              name="A_Subject"
              value={formData.A_Subject}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_date3">
              ว/ด/ป ที่ลง (ป.ช.ส. ลงเว็บไซต์):
            </label>
            <input
              type="date"
              id="A_date3"
              name="A_date3"
              value={formData.A_date3}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_endorser1">
              ผู้ลง (ป.ช.ส. ลงเว็บไซต์):
            </label>
            <select
              id="A_endorser1"
              name="A_endorser1"
              value={formData.A_endorser1}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">เลือกผู้ลง</option>
              <option value="ประพนธ์">ประพนธ์</option>
              <option value="กัญญรัตน์">กัญญรัตน์</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_date4">
              ว/ด/ป ปิด (การติดประกาศบอร์ด):
            </label>
            <input
              type="date"
              id="A_date4"
              name="A_date4"
              value={formData.A_date4}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_date4">
              ว/ด/ป ปลด (การติดประกาศบอร์ด):
            </label>
            <input
              type="date"
              id="A_date5"
              name="A_date5"
              value={formData.A_date5}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="A_endorser2">
              ผู้ลง (การติดประกาศบอร์ด):
            </label>
            <select
              id="A_endorser2"
              name="A_endorser2"
              value={formData.A_endorser2}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">เลือกผู้ลง</option>
              <option value="ณัฐธยาน์">ณัฐธยาน์</option>
              <option value="ภริดา">ภริดา</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setshowDialog_add(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:text-gray-700 hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            เพิ่มข้อมูล
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showDialog_delete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบข้อมูลติดประกาศ </h2>
            <p>คุณต้องการลบข้อมูลติดประกาศ หรือ ไม่?</p>
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

{showDialog_edit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">แก้ไขข้อมูลติดประกาศ</h3>
              <form onSubmit={() => handleUpdate(formData1.id)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_date1">
                      ว/ด/ป รับ:
                    </label>
                    <input
                      type="date"
                      id="A_date1"
                      name="A_date1"
                      value={formData1.A_date1}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_Agency">
                      หน่วยงาน:
                    </label>
                    <input
                      type="text"
                      id="A_Agency"
                      name="A_Agency"
                      value={formData1.A_Agency}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_Book_number">
                      เลขที่หนังสือ:
                    </label>
                    <input
                      type="text"
                      id="A_Book_number"
                      name="A_Book_number"
                      value={formData1.A_Book_number}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_date2">
                      ลงวันที่:
                    </label>
                    <input
                      type="date"
                      id="A_date2"
                      name="A_date2"
                      value={formData1.A_date2}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_Subject">
                      เรื่อง/รายการ:
                    </label>
                    <input
                      type="text"
                      id="A_Subject"
                      name="A_Subject"
                      value={formData1.A_Subject}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_date3">
                      ว/ด/ป ที่ลง (ป.ช.ส. ลงเว็บไซต์):
                    </label>
                    <input
                      type="date"
                      id="A_date3"
                      name="A_date3"
                      value={formData1.A_date3}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_endorser1">
                      ผู้ลง (ป.ช.ส. ลงเว็บไซต์):
                    </label>
                    <select
                      id="A_endorser1"
                      name="A_endorser1"
                      value={formData1.A_endorser1}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">เลือกผู้ลง</option>
                      <option value="ประพนธ์">ประพนธ์</option>
                      <option value="กัญญรัตน์">กัญญรัตน์</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_date4">
                      ว/ด/ป ปิด (การติดประกาศบอร์ด):
                    </label>
                    <input
                      type="date"
                      id="A_date4"
                      name="A_date4"
                      value={formData1.A_date4}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_date4">
                      ว/ด/ป ปลด (การติดประกาศบอร์ด):
                    </label>
                    <input
                      type="date"
                      id="A_date5"
                      name="A_date5"
                      value={formData1.A_date5}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="A_endorser2">
                      ผู้ลง (การติดประกาศบอร์ด):
                    </label>
                    <select
                      id="A_endorser2"
                      name="A_endorser2"
                      value={formData1.A_endorser2}
                      onChange={handleInputChange1}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">เลือกผู้ลง</option>
                      <option value="ณัฐธยาน์">ณัฐธยาน์</option>
                      <option value="ภริดา">ภริดา</option>
                    </select>
                  </div>
                </div>

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

    </div>
  );
}
