import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // ใช้ NextResponse ในการตอบกลับ

const prisma = new PrismaClient();

// ใช้ async handler ในการจัดการการอัปเดตข้อมูล
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;  // ดึงค่าจาก URL params แทน query
  console.log('UPDATE event with ID:', id);

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  // ดึงข้อมูลจาก body ของ request
  const { title, description, start_date, end_date, all_day } = await req.json();

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
  if (!title || !start_date || !end_date || all_day === undefined) {
    return NextResponse.json({ error: 'Missing required fields: title, start_date, end_date, all_day.' }, { status: 400 });
  }

  try {
    // แปลงวันที่เป็น Date object
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // ตรวจสอบว่า start_date และ end_date เป็นวันที่ที่ถูกต้องหรือไม่
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for start_date or end_date.' }, { status: 400 });
    }

    // ตรวจสอบว่า all_day เป็น boolean หรือไม่
    if (typeof all_day !== 'boolean') {
      return NextResponse.json({ error: 'The "all_day" field must be a boolean.' }, { status: 400 });
    }

    // อัปเดตกิจกรรม
    const updatedEvent = await prisma.event_calendar.update({
      where: { event_id: Number(id) },
      data: {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        all_day,
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
};
