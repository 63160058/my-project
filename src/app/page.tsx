'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './componente/Navbar';
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
  DatesSetArg,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventApi[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDescription, setNewEventDescription] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [calendarTitle, setCalendarTitle] = useState<string>('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<EventApi | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  useEffect(() => {
    if (dateRange) {
      const isMonthView = calendarTitle.includes('เดือน');
      const filtered = currentEvents.filter((event) => {
        const eventStart = new Date(event.start!);

        if (isMonthView) {
          const startOfMonth = new Date(
            dateRange.start.getFullYear(),
            dateRange.start.getMonth(),
            1
          );
          const endOfMonth = new Date(
            dateRange.start.getFullYear(),
            dateRange.start.getMonth() + 1,
            0
          );
          return eventStart >= startOfMonth && eventStart <= endOfMonth;
        } else {
          return eventStart >= dateRange.start && eventStart <= dateRange.end;
        }
      });

      filtered.sort((a, b) => {
        const dateA = new Date(a.start!).getTime();
        const dateB = new Date(b.start!).getTime();
        return dateA - dateB;
      });

      setFilteredEvents(filtered);
    }
  }, [currentEvents, dateRange, calendarTitle]);

  const handleDatesSet = (arg: DatesSetArg) => {
    setDateRange({ start: arg.start, end: arg.end });
    setCalendarTitle(arg.view.title);
  };

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        title: newEventTitle,
        description: newEventDescription,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      try {
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const data = await response.json();

        // If the event is successfully saved to the database, add it to the calendar
        const addedEvent = {
          ...newEvent,
          id: data.id, // Assuming the API returns the ID of the created event
        };

        calendarApi.addEvent(addedEvent);
        handleCloseDialog();
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        // Send a DELETE request to your API with the event id in the body
        const response = await fetch('/api/calendar/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: eventToDelete.id }), // Send the id in the body
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete event from database');
        }
  
        // If the event is successfully deleted from the database, remove it from the calendar
        eventToDelete.remove();
        setEventToDelete(null); // Reset the selected event
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
    setIsDeleteDialogOpen(false); // Close the dialog
  };
  

  const handleEventClick = (selected: EventClickArg) => {
    setEventToDelete(selected.event); // เก็บกิจกรรมที่เลือกไว้ในสถานะ
    setIsDeleteDialogOpen(true); // เปิด Dialog การลบ
  };
  

  
  const handleCancelDelete = () => {
    setEventToDelete(null); // รีเซ็ตกิจกรรม
    setIsDeleteDialogOpen(false); // ปิด Dialog
  };
  

  return (
    <div>
      <Navbar />

      {isDialogOpen && (
        <dialog open className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">เพิ่มกิจกรรม</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md"
                required
              />
              <textarea
                placeholder="Event Description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md"
                rows={3}
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  เพิ่ม
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {isDeleteDialogOpen && (
        <dialog open className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">ยืนยันการลบกิจกรรม</h2>
            <p className="text-center mb-4">คุณต้องการลบกิจกรรม {eventToDelete?.title} หรือไม่?</p>

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                onClick={handleConfirmDelete}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                ยืนยัน
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex w-full px-10 gap-8">
        <div className="w-3/12 bg-gray-100 p-5 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">รายการกิจกรรม</h2>
          <h2 className="text-2xl font-bold mb-4 text-center">{calendarTitle}</h2>
          <ul className="space-y-4">
            {filteredEvents.length <= 0 ? (
              <p className="italic text-center text-gray-400">ไม่มีกิจกรรม</p>
            ) : (
              filteredEvents.map((event: EventApi) => {
                const startDate = new Date(event.start!);
                const endDate = event.end ? new Date(event.end) : startDate;
                endDate.setDate(endDate.getDate() - 1);

                const formattedStartDate = formatDate(startDate, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  locale: 'th',
                });

                const formattedEndDate = formatDate(endDate, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  locale: 'th',
                });
                return (
                  <li
                    key={event.id}
                    className="border border-gray-300 p-3 rounded-md shadow-sm"
                  >
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {event.allDay ? (
                        startDate.getTime() === endDate.getTime() ? (
                          `ทั้งวัน (${formattedStartDate})`
                        ) : (
                          `ทั้งวัน (${formattedStartDate} - ${formattedEndDate})`
                        )
                      ) : (
                        `${formattedStartDate} ${formatDate(startDate, {
                          hour: '2-digit',
                          minute: '2-digit',
                          locale: 'th',
                        })} - ${formattedEndDate} ${formatDate(endDate, {
                          hour: '2-digit',
                          minute: '2-digit',
                          locale: 'th',
                        })}`
                      )}
                    </p>
                    {event.extendedProps.description && (
                      <p className="text-sm text-gray-500">
                        {event.extendedProps.description}
                      </p>
                    )}
                  </li>
                );
                
              })
            )}
          </ul>
        </div>

        <div className="w-9/12">
        <FullCalendar
            height="85vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialView="dayGridMonth"
            locale="th"
            buttonText={{
              today: 'วันนี้',
              month: 'เดือน',
              week: 'สัปดาห์',
              day: 'วัน',
            }}
            editable
            selectable
            selectMirror
            dayMaxEvents
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            datesSet={handleDatesSet}
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
};

export default Calendar;
