'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './componente/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // หรือใช้ไอคอนจากไลบรารีอื่นๆ เช่น FontAwesome
// import { PlusCircle } from 'lucide-react';// หรือใช้ไอคอนจากไลบรารีอื่นๆ เช่น FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";



export default function CalendarPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");


    setToken(storedToken);

  }, []);


  const [events, setEvents] = useState([]); // ใช้จัดเก็บกิจกรรม
  const [visibleEvents, setVisibleEvents] = useState([]); // ใช้จัดเก็บกิจกรรมที่จะแสดง
  const [currentDateRange, setCurrentDateRange] = useState({ start: null, end: null }); // ใช้จัดเก็บช่วงวันที่ที่เลือก

  useEffect(() => {
    fetch('/api/calendar/list') // ดึงข้อมูลกิจกรรมจาก API
      .then((response) => {
        if (!response.ok) {
          throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEvents(data)) // เก็บข้อมูลกิจกรรม
      .catch((error) => console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:', error));
  }, []);

  useEffect(() => {
    if (currentDateRange.start && currentDateRange.end) {
      const sortedEvents = events
        .filter((event) => {
          const eventStart = new Date(event.start_date);
          let eventEnd = new Date(event.end_date);

          if (event.all_day) {
            eventEnd = new Date(eventEnd);
            eventEnd.setDate(eventEnd.getDate() - 1); // ปรับเวลาสำหรับกิจกรรมที่เป็นตลอดวัน
            eventEnd.setHours(0, 0, 0, 0);
          }

          return (
            eventStart <= new Date(currentDateRange.end) &&
            eventEnd >= new Date(currentDateRange.start)
          );
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // เรียงลำดับกิจกรรมตามวันที่เริ่มต้น

      setVisibleEvents(sortedEvents); // อัปเดตกิจกรรมที่จะแสดง
    }
  }, [events, currentDateRange]);

  const handleDelete = (eventId) => {
    console.log('กำลังลบกิจกรรมที่มี ID:', eventId);
    setEventIdToDelete(eventId); // เก็บ ID ของกิจกรรมที่ต้องการลบ
    setShowDialog_delete(true); // เปิดหน้าต่างยืนยันการลบ
  };

  const [showDialog, setShowDialog] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [showDialog_delete, setShowDialog_delete] = useState(false);
  const [showDialog_edit, setShowDialog_edit] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    all_day: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formattedEndDate = new Date(formData.end_date);
    if (formData.all_day) {
      formattedEndDate.setHours(23, 59, 59, 999); // กำหนดเวลาสิ้นสุดสำหรับกิจกรรมที่เป็นตลอดวัน
    } else {
      formattedEndDate = new Date(formData.end_date);
    }
    const formattedStartDate = new Date(formData.start_date).toISOString();
    formattedEndDate = formattedEndDate.toISOString();
    const formattedData = {
      ...formData,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };
    try {
      const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),  // ส่งข้อมูลกิจกรรมที่มีการแปลงวันที่แล้ว
      });
      if (!response.ok) {
        throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}`);
      }
      const result = await response.json();
      console.log('สร้างกิจกรรมสำเร็จ:', result);
      setShowDialog(false); // ปิดหน้าต่างเมื่อบันทึกเสร็จ
      window.location.reload(); // รีเฟรชหน้าจอ
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกกิจกรรม:', error);
    }
  };

  const handleDelete2 = async (eventId) => {
    const E_ID = eventId;
    console.log('กำลังลบกิจกรรมที่มี ID:', E_ID);

    const formattedData1 = {
      event_id: eventId,
    };

    try {
      const response = await fetch(`/api/calendar/delete/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData1),
      });

      if (response.ok) {
        console.log('ลบกิจกรรมสำเร็จ');
        setShowDialog_delete(false);
        setEvents(prevEvents => prevEvents.filter(event => event.event_id !== E_ID)); // อัปเดตกิจกรรมที่เหลือ
      } else {
        console.error('ไม่สามารถลบกิจกรรมได้');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบกิจกรรม:', error);
    }
  };

  const handleUpdate = async (eventId) => {
    try {
      if (!eventData.title || !eventData.start_date || !eventData.end_date) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      const formattedStartDate = new Date(eventData.start_date).toISOString();
      let formattedEndDate = new Date(eventData.end_date);
      if (eventData.all_day) {
        formattedEndDate.setHours(23, 59, 59, 999);
      }
      formattedEndDate = formattedEndDate.toISOString();

      const updatedData = {
        title: eventData.title,
        description: eventData.description,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        all_day: eventData.all_day,
      };

      const response = await fetch(`/api/calendar/update/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
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

  const [eventData, setEventData] = useState({
    title: '',        
    description: '',  
    start_date: '',   
    end_date: '',     
    all_day: false,   
  });

  const handleInputChange1 = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setEventData((prevData) => ({
      ...prevData,
      [name]: inputValue, 
    }));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toISOString().slice(0, 16);
  };

  const handleEdit = async (eventId) => {
    try {
      const response = await fetch(`/api/calendar/list/${eventId}`);
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลกิจกรรม');
      }
      const data = await response.json();

      setEventData({
        event_id: data.event_id,
        title: data.title,
        description: data.description,
        start_date: formatDateTime(data.start_date),
        end_date: formatDateTime(data.end_date),
        all_day: data.all_day,
      });
      setShowDialog_edit(true); // เปิดหน้าต่างแก้ไข
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:', error);
    }
  };


  
  return (
    <div>
      <Navbar />

      <div className="flex w-full px-10 gap-8">
        <div className="w-3/12 bg-gray-100 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center flex justify-between items-center">
          รายการกิจกรรม
          {token && (
            <>
              <button onClick={() => setShowDialog(true)}>
                <FontAwesomeIcon icon={faCalendarPlus} className="text-[#7096D1] transition-colors duration-300 hover:text-[#1E90FF]"  />
              </button>
            </>
          )}
        </h2>
        {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">เพิ่มกิจกรรม</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">ชื่อกิจกรรม</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">รายละเอียด</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">วันเริ่มต้น</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">วันสิ้นสุด</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="all_day"
                  checked={formData.all_day}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">กิจกรรมตลอดวัน</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDialog_delete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบกิจกรรม</h2>
            <p>คุณต้องการลบกิจกรรมที่มี ID: {eventIdToDelete} หรือไม่?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDialog_delete(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
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
            <h3 className="text-2xl font-bold mb-4">แก้ไขกิจกรรม</h3>
            <form onSubmit={() => handleUpdate(eventData.event_id)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="title">ชื่อกิจกรรม</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={eventData.title}
                  onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="description">รายละเอียด</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={eventData.description}
                  onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="start_date">วันที่เริ่มต้น</label>
                <input
                  type="datetime-local"
                  id="start_date"
                  name="start_date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={eventData.start_date}
                  onChange={handleInputChange1}
                />
              </div>
              <div className="mb-4">
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
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDialog_edit(false)}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          <ul className="space-y-4">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <li
                  key={event.event_id}
                  className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-200 relative"
                >
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const startDate = new Date(event.start_date);
                      const endDate = new Date(event.end_date);

                      // ตรวจสอบว่ากิจกรรมเป็น all-day หรือไม่
                      if (event.all_day) {
                        // ถ้าเริ่มและสิ้นสุดในวันเดียวกัน แสดงวันที่เดียว
                        if (startDate.toLocaleDateString('th-TH') === endDate.toLocaleDateString('th-TH')) {
                          return startDate.toLocaleDateString('th-TH');
                        } else {
                          // ถ้าเริ่มและสิ้นสุดในหลายวัน แสดงช่วงวันที่
                          return `${startDate.toLocaleDateString('th-TH')} - ${endDate.toLocaleDateString('th-TH')}`;
                        }
                      }

                      // ตรวจสอบว่า event ข้ามวันหรือไม่
                      const startDateString = startDate.toLocaleDateString('th-TH');
                      const endDateString = endDate.toLocaleDateString('th-TH');

                      if (startDateString !== endDateString) {
                        // ถ้ากิจกรรมข้ามวัน
                        return `${startDateString} - ${endDateString}`;
                      } else {
                        // ถ้าอยู่ในวันเดียวกัน, แสดงวันที่และเวลา
                        const startTime = startDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                        const endTime = endDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                        return `${startDateString} ${startTime} - ${endTime}`;
                      }
                    })()}
                  </p>



                  {event.all_day && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      กิจกรรมตลอดวัน
                    </span>
                  )}

                  {/* ปุ่มไอคอนการแก้ไขและลบ */}
                  {token && (
                    <>
                      <div className="absolute top-2 right-2 flex space-x-2">  
                        <button onClick={() => handleEdit(event.event_id)}>
                          <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                        </button>
                        <button onClick={() => handleDelete(event.event_id)}>
                          <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">ไม่มีรายการกิจกรรมในเดือนนี้</p>
            )}
          </ul>
        </div>

        {/* FullCalendar */}
        <div className="w-9/12">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            showNonCurrentDates={false}
            events={events.map((event) => ({
              id: event.event_id,
              title: event.title,
              start: event.start_date,
              end: event.end_date,
              allDay: event.all_day,
            }))}
            locale="th"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            buttonText={{
              today: 'วันนี้',
              month: 'เดือน',
              week: 'สัปดาห์',
              day: 'วัน',
              list: 'รายการ',
            }}
            datesSet={(dateInfo) => {
              setCurrentDateRange({
                start: dateInfo.startStr,
                end: dateInfo.endStr,
              });
            }}
            dayHeaderDidMount={(info) => {
              // Target the specific weekday header labels
              const dayLabels = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

              if (dayLabels.includes(info.text)) {
                info.el.style.backgroundColor = '#7096D1'; // Change this color as needed
                info.el.style.color = 'white'; // Adjust text color as needed
              }
            }}
            dayCellDidMount={(info) => {
              const date = new Date(info.date);
              if (date.getDay() === 0 || date.getDay() === 6) {
                info.el.style.backgroundColor = '#FFEBEE';
              }
              
            }}
          />
        </div>
      </div>
    </div>
  );
}