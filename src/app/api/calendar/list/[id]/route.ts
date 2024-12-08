import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const event = await prisma.event_calendar.findUnique({
      where: { event_id: Number(id) },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
};
