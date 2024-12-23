import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const EDIT_Import_Inxternal = await prisma.officialletter.findUnique({
      where: { id: Number(id) },
    });

    if (!EDIT_Import_Inxternal) {
      return NextResponse.json({ error: 'Import_Internal not found' }, { status: 404 });
    }

    return NextResponse.json(EDIT_Import_Inxternal, { status: 200 });
  } catch (error) {
    console.error('Error fetching Import_Internal:', error);
    return NextResponse.json({ error: 'Failed to fetch Import_Internal' }, { status: 500 });
  }
};
