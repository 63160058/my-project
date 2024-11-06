import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const officialletter = await prisma.officialletter.findMany();
    return NextResponse.json(officialletter);
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

    // Convert L_date to ISO-8601 format
    const L_dateISO = new Date(date).toISOString(); // Convert to ISO-8601 DateTime

    // Prepare L_time
    let L_timeString;

    // Check if time is provided
    if (time) {
      const timeParts = time.split(':');
      // Ensure timeParts has hours and minutes
      if (timeParts.length >= 2) {
        // Create L_time using a fixed date
        L_timeString = new Date(`1970-01-01T${time}:00Z`).toISOString();
      } else {
        throw new Error('Invalid time format');
      }
    } else {
      throw new Error('Time is required');
    }

    const officialletter = await prisma.officialletter.create({
      data: {
        L_type: 'external',
        L_id: id,
        L_date: L_dateISO,
        L_from: from,
        L_to: to,
        L_story: story,
        L_comment: comment,
        L_time: L_timeString, // Use the converted L_time
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
}
