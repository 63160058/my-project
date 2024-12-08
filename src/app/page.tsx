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


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [currentDateRange, setCurrentDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    fetch('/api/calendar/list')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  useEffect(() => {
    if (currentDateRange.start && currentDateRange.end) {
      const sortedEvents = events
        .filter((event) => {
          const eventStart = new Date(event.start_date);
          let eventEnd = new Date(event.end_date);
  
          if (event.all_day) {
            eventEnd = new Date(eventEnd);
            eventEnd.setDate(eventEnd.getDate() - 1);
            eventEnd.setHours(0, 0, 0, 0);
          }
  
          return (
            eventStart <= new Date(currentDateRange.end) &&
            eventEnd >= new Date(currentDateRange.start)
          );
        })
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // เรียงลำดับตามวันที่เริ่มต้นของกิจกรรม
  
      setVisibleEvents(sortedEvents);
    }
  }, [events, currentDateRange]);
  

  // เพิ่มฟังก์ชันเพื่อจัดการกับการลบและแก้ไข
  const handleEdit = (eventId) => {
    console.log('Editing event with ID:', eventId);
    // คุณสามารถนำฟังก์ชันนี้ไปใช้ในการแสดงหน้าจอแก้ไข
  };

  const handleDelete = (eventId) => {
    console.log('Deleting event with ID:', eventId);
    // คุณสามารถนำฟังก์ชันนี้ไปใช้ในการลบกิจกรรม
  };


  const [showDialog, setShowDialog] = useState(false);
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
    // ถ้ากิจกรรมเป็น 'ตลอดวัน' ให้กำหนดเวลาใน `end_date` เป็น 59:59.999Z
    let formattedEndDate = new Date(formData.end_date);
    if (formData.all_day) {
      // ตั้งเวลาเป็น 59:59.999Z ของวันสิ้นสุด
      formattedEndDate.setHours(23, 59, 59, 999);
    } else {
      // ถ้าไม่ใช่กิจกรรมตลอดวัน ให้ใช้เวลาเดิม
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
        body: JSON.stringify(formattedData),  // ส่งวันที่ที่แปลงแล้ว
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Event created:', result);
      setShowDialog(false); // ปิดหน้าต่างหลังจากบันทึกเสร็จสิ้น และเปลี่ยนค่า setShowDialog(false)
      window.location.reload();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };


  return (
    <div>
      <Navbar />

      <div className="flex w-full px-10 gap-8">
        <div className="w-3/12 bg-gray-100 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center flex justify-between items-center">
          รายการกิจกรรม
            <button onClick={() => setShowDialog(true)}>
              <FontAwesomeIcon icon={faCalendarPlus} className="text-[#7096D1] transition-colors duration-300 hover:text-[#1E90FF]"  />
            </button>

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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
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
                  <div className="absolute top-2 right-2 flex space-x-2">  
                    <button onClick={() => handleEdit(event.event_id)}>
                      <PencilIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => handleDelete(event.event_id)}>
                      <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
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