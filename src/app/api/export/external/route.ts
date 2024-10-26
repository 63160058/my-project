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

    // Convert D_date to ISO-8601 format
    const D_dateISO = new Date(date).toISOString(); // Convert to ISO-8601 DateTime

    // Prepare D_time
    let D_timeString;

    // Check if time is provided
    if (time) {
      const timeParts = time.split(':');
      // Ensure timeParts has hours and minutes
      if (timeParts.length >= 2) {
        // Create D_time using a fixed date
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
        D_time: D_timeString, // Use the converted D_time
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
