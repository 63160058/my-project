import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event_calendar.findMany();
    console.log('Fetched events:', events); // Log events
    return NextResponse.json(events); // Return JSON response
  } catch (error) {
    console.error('Error fetching events:', error); // Log errors
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
  }
}
