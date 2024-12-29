
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const UPLOAD_DIR = path.resolve("src/app/assets/files");

export async function GET() {
    try {
        const announcements = await prisma.announcements.findMany();
        return new Response(JSON.stringify(announcements), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 500,
        });
    }
}


export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const A_date1 = new Date(body.A_date1 as string).toISOString();
    const A_date2 = new Date(body.A_date2 as string).toISOString();
    const A_date3 = new Date(body.A_date3 as string).toISOString();
    const A_date4 = new Date(body.A_date4 as string).toISOString();
    const A_date5 = new Date(body.A_date5 as string).toISOString();
    const A_Book_number = body.A_Book_number as string;
    const A_Subject = body.A_Subject as string;
    const A_endorser1 = body.A_endorser1 as string;
    const A_endorser2 = body.A_endorser2 as string;
    const A_Agency = body.A_Agency as string;

    console.log('A_date1', A_date1, 'A_Book_number', A_Book_number, 'A_date2', A_date2, 'A_Subject', A_Subject, 'A_date3', A_date3, 'A_endorser1', A_endorser1, 'A_date4', A_date4, 'A_date5', A_date5, 'A_endorser2', A_endorser2, 'A_Agency', A_Agency);

    const file = (body.file as Blob) || null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      // ตรวจสอบว่า body.file มีค่าและมีคุณสมบัติ name ก่อนที่จะเขียนไฟล์
      const fileName = (body.file as File)?.name;
      if (fileName) {
        fs.writeFileSync(
          path.resolve(UPLOAD_DIR, fileName),
          buffer
        );
      } else {
        throw new Error('File name is missing.');
      }
    } else {
      throw new Error('No file uploaded.');
    }


    // Handle file upload
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      fs.writeFileSync(
        path.resolve(UPLOAD_DIR, (body.file as File).name),
        buffer
      );
    }




    // Save to database
    const newAnnouncement = await prisma.announcements.create({
      data: {
        A_date1: A_date1,
        A_Book_number: A_Book_number,
        A_date2: A_date2,
        A_Subject: A_Subject,
        A_date3: A_date3,
        A_endorser1: A_endorser1,
        A_date4: A_date4,
        A_date5: A_date5,
        A_endorser2: A_endorser2,
        A_Agency: A_Agency,
        A_file: (body.file as File).name
      },
    });

    return NextResponse.json(newAnnouncement);

  } catch (error: any) {
    console.error('Error creating export doc:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
};
