import { NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // ใช้ NextResponse ในการตอบกลับ

const prisma = new PrismaClient();

export const POST = async (req: NextApiRequest) => {
  if (req.method === 'POST') {
    // ใช้ req.json() เพื่อดึงข้อมูลจาก body
    const { title, description, start_date, end_date, all_day } = await req.json();
    console.log('title', title, 'description', description, 'start_date', start_date, 'end_date', end_date, 'all_day', all_day);

    // ตรวจสอบว่า data ที่ส่งมามีครบหรือไม่
    if (!title || !start_date || !end_date || all_day === undefined) {
      return NextResponse.json({ error: 'Missing required fields: title, start_date, end_date, all_day.' }, { status: 400 });
    }

    try {
      // แปลง string เป็น Date
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

      // สร้าง event ใหม่
      const newEvent = await prisma.event_calendar.create({
        data: {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          all_day,
        },
      });

      return NextResponse.json(newEvent, { status: 200 });
    } catch (error) {
      console.error("Error occurred while creating event:", error);
      return NextResponse.json({ error: 'Failed to add event.' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
};
