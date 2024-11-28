// app/api/calendar/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Destructure the data sent in the request
    const { title, description, start, end, allDay } = data;

    // Ensure the required fields are provided
    if (!title || !start || !end || allDay === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse start and end dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Insert the event data into the database
    const event = await prisma.event_calendar.create({
      data: {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        all_day: allDay,
      },
    });

    // Return the inserted event data
    return NextResponse.json(
      { id: event.event_id, title: event.title },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


