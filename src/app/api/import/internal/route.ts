import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const UPLOAD_DIR = path.resolve("src/app/assets/files");

export async function GET() {
  try {
    const officialletter = await prisma.officialletter.findMany();
    return NextResponse.json(officialletter);
  } catch (error: any) {
    console.error('Error fetching export docs:', error.message, error.stack);
    return NextResponse.json(
      { error: 'External Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const file = (body.file as Blob) || null;

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

    // Extract other fields from formData
    const id = body.id as string;
    const date = body.date as string;
    const from = body.from as string;
    const to = body.to as string;
    const story = body.story as string;
    const comment = body.comment as string;
    const time = body.time as string;

    // Convert L_date to ISO-8601 format
    const L_dateISO = new Date(date).toISOString();

    // Prepare L_time
    let L_timeString;
    if (time) {
      const timeParts = time.split(':');
      if (timeParts.length >= 2) {
        L_timeString = new Date(`1970-01-01T${time}:00Z`).toISOString();
      } else {
        throw new Error('Invalid time format');
      }
    } else {
      throw new Error('Time is required');
    }

    // Save to database
    const officialletter = await prisma.officialletter.create({
      data: {
        L_type: 'internal',
        L_id: id,
        L_date: L_dateISO,
        L_from: from,
        L_to: to,
        L_story: story,
        L_comment: comment,
        L_time: L_timeString,
        L_file: (body.file as File).name
      },
    });

    return NextResponse.json(officialletter);

  } catch (error: any) {
    console.error('Error creating export doc:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
};
