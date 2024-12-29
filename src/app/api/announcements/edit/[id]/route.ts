// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
//   const { id } = params; // Extract `id` from URL parameters
//   console.log('Updating announcement with ID:', id);

//   try {
//     // Parse the request body
//     const data = await req.json();

//     // Validate data
//     if (!id || !data) {
//       return NextResponse.json({ message: 'Incomplete data' }, { status: 400 });
//     }

//     // Update the database
//     const updatedAnnouncement = await prisma.announcements.update({
//       where: { id: Number(id)},
//       data: {
//         A_date1: new Date(data.A_date1).toISOString(),
//         A_Book_number: data.A_Book_number,
//         A_date2: new Date(data.A_date2).toISOString(),
//         A_Subject: data.A_Subject,
//         A_date3: new Date(data.A_date3).toISOString(),
//         A_endorser1: data.A_endorser1,
//         A_date4: new Date(data.A_date4).toISOString(),
//         A_date5: new Date(data.A_date5).toISOString(),
//         A_endorser2: data.A_endorser2,
//         A_Agency: data.A_Agency,
//       },
//     });

//     console.log('Successfully updated:', updatedAnnouncement);

//     // Return the updated data
//     return NextResponse.json(updatedAnnouncement, { status: 200 });
//   } catch (error: any) {
//     console.error('Error updating announcement:', error.message || error);
//     return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect(); // Ensure Prisma disconnects
//   }
// };


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

  const { A_date1,  A_Book_number, A_date2, A_Subject , A_date3, A_endorser1, A_date4, A_date5, A_endorser2, A_Agency, file} = body;
  console.log('UPDATE event with data:', { A_date1, A_Book_number, A_date2, A_Subject , A_date3, A_endorser1, A_date4, A_date5, A_endorser2, A_Agency, file });

  try {
    // เตรียมข้อมูลที่จะอัปเดต
    const updateData: any = {
      A_date1: new Date(A_date1),
      A_Book_number,
      A_date2: new Date(A_date2),
      A_Subject,
      A_date3: new Date(A_date3),
      A_endorser1,
      A_date4: new Date(A_date4),
      A_date5: new Date(A_date5),
      A_endorser2,
      A_Agency,
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
      updateData.A_file = (file as File).name;
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedEvent = await prisma.announcements.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
};
