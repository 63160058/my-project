import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const officialdocument = await prisma.officialdocument.findMany();
    return NextResponse.json(officialdocument);
  } catch (error: any) {
    console.error('Error fetching export docs:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { id, date, from, to, story, comment, time } = await req.json();

    // ตรวจสอบและแปลง D_date ให้อยู่ในรูปแบบ ISO-8601
    const D_dateISO = new Date(date).toISOString(); // แปลงเป็น ISO-8601 DateTime

    // ตรวจสอบและแปลง D_time ให้อยู่ในรูปแบบที่ถูกต้อง
    let D_timeString;

    // ตรวจสอบว่ามีการส่งเวลาเข้ามา
    if (time) {
      const timeParts = time.split(':');
      // ตรวจสอบความยาวของ timeParts เพื่อให้แน่ใจว่ามีชั่วโมงและนาที
      if (timeParts.length >= 2) {
        // สร้างค่า D_time โดยใช้วันที่คงที่
        D_timeString = new Date(`1970-01-01T${time}:00Z`).toISOString();
      } else {
        throw new Error('Invalid time format');
      }
    } else {
      throw new Error('Time is required');
    }

    const officialdocument = await prisma.officialdocument.create({
      data: {
        D_type: 'external',
        D_id: id,
        D_date: D_dateISO,
        D_from: from,
        D_to: to,
        D_story: story,
        D_comment: comment,
        D_time: D_timeString, // ใช้ค่า D_time ที่แปลงแล้ว
      },
    });
    return NextResponse.json(officialdocument);
  } catch (error: any) {
    console.error('Error creating export doc:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
