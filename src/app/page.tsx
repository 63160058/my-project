'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './componente/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // หรือใช้ไอคอนจากไลบรารีอื่นๆ เช่น FontAwesome
import { PlusCircle } from 'lucide-react';// หรือใช้ไอคอนจากไลบรารีอื่นๆ เช่น FontAwesome

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

  return (
    <div>
      <Navbar />

      <div className="flex w-full px-10 gap-8">
        <div className="w-3/12 bg-gray-100 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center flex justify-between items-center">
          รายการกิจกรรม
          <button>
            <PlusCircle className="w-5 h-5 text-green-600 hover:text-green-800" />
          </button>
        </h2>

          <ul className="space-y-4">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <li
                  key={event.event_id}
                  className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-200 relative"
                >
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.start_date).toLocaleDateString('th-TH')}
                    {(() => {
                      const startDate = new Date(event.start_date);
                      const endDate = new Date(event.end_date);
                      endDate.setDate(endDate.getDate() - 1);
                      
                      if (startDate.toLocaleDateString('th-TH') !== endDate.toLocaleDateString('th-TH')) {
                        return ' - ' + endDate.toLocaleDateString('th-TH');
                      } else {
                        return '';
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