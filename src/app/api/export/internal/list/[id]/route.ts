import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const EDIT_Export_Internal = await prisma.officialdocument.findUnique({
      where: { id: Number(id) },
    });

    if (!EDIT_Export_Internal) {
      return NextResponse.json({ error: 'Export_Internal not found' }, { status: 404 });
    }

    return NextResponse.json(EDIT_Export_Internal, { status: 200 });
  } catch (error) {
    console.error('Error fetching Export_Internal:', error);
    return NextResponse.json({ error: 'Failed to fetch Export_Internal' }, { status: 500 });
  }
};
