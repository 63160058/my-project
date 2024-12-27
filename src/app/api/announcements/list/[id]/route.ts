import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const EDIT_announcements = await prisma.announcements.findUnique({
      where: { id: Number(id) },
    });

    if (!EDIT_announcements) {
      return NextResponse.json({ error: 'Export_Internal not found' }, { status: 404 });
    }

    return NextResponse.json(EDIT_announcements, { status: 200 });
  } catch (error) {
    console.error('Error fetching EDIT_announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch EDIT_announcements' }, { status: 500 });
  }
};
