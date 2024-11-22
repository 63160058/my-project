import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const UPLOAD_DIR = path.resolve("src/app/assets/files");

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

    // Convert D_date to ISO-8601 format
    const D_dateISO = new Date(date).toISOString();

    // Prepare D_time
    let D_timeString;
    if (time) {
      const timeParts = time.split(':');
      if (timeParts.length >= 2) {
        D_timeString = new Date(`1970-01-01T${time}:00Z`).toISOString();
      } else {
        throw new Error('Invalid time format');
      }
    } else {
      throw new Error('Time is required');
    }

    // Save to database
    const officialdocument = await prisma.officialdocument.create({
      data: {
        D_type: 'external',
        D_id: id,
        D_date: D_dateISO,
        D_from: from,
        D_to: to,
        D_story: story,
        D_comment: comment,
        D_time: D_timeString,
        D_file: (body.file as File).name
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
<<<<<<< HEAD
}


export async function DELETE(req: Request, { params }: { params: { userid: string } }) {
  const { userid } = params;

  if (!userid) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const deletedDocument = await prisma.officialdocument.delete({
      where: { id: userid },
    });

    return NextResponse.json({ message: 'Document deleted successfully', data: deletedDocument });
  } catch (error: any) {
    console.error('Error deleting document:', error.message);
    return NextResponse.json({ error: 'Failed to delete document', details: error.message }, { status: 500 });
  }
}
=======
};
>>>>>>> 4dae3f2b0d57cdf89a51d1c02c75e2aaff96860e
