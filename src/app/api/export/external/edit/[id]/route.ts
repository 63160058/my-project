import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve("src/app/assets/files");

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid Event ID' }, { status: 400 });
  }

  let body;
  try {
    // ใช้ formData เพื่อรับข้อมูลจากคำขอ
    const formData = await req.formData();
    body = Object.fromEntries(formData);
  } catch (error) {
    console.error('Error parsing form data:', error);
    return NextResponse.json({ error: 'Invalid or missing form data' }, { status: 400 });
  }

  const { D_id, date, time, from, to, story, comment, file } = body;
  console.log('UPDATE event with data:', { D_id, date, time, from, to, story, comment, file });

  try {
    // เตรียมข้อมูลที่จะอัปเดต
    const updateData: any = {
      D_id,
      D_date: new Date(date),
      D_time: new Date(`${date}T${time}:00Z`),
      D_from: from,
      D_to: to,
      D_story: story,
      D_comment: comment,
    };

    // จัดการไฟล์ PDF ที่อัปโหลด
    if (file) {
      const uploadedFile = file as Blob;
      const buffer = Buffer.from(await uploadedFile.arrayBuffer());

      // สร้างโฟลเดอร์หากไม่มี
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const filePath = path.resolve(UPLOAD_DIR, (file as File).name);
      fs.writeFileSync(filePath, buffer); // บันทึกไฟล์ในระบบ

      // เพิ่มชื่อไฟล์ในข้อมูลที่อัปเดต
      updateData.D_file = (file as File).name;
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedEvent = await prisma.officialdocument.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
};
