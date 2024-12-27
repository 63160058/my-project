import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params; // Extract `id` from URL parameters
  console.log('Updating announcement with ID:', id);

  try {
    // Parse the request body
    const data = await req.json();

    // Validate data
    if (!id || !data) {
      return NextResponse.json({ message: 'Incomplete data' }, { status: 400 });
    }

    // Update the database
    const updatedAnnouncement = await prisma.announcements.update({
      where: { id: Number(id)},
      data: {
        A_date1: new Date(data.A_date1).toISOString(),
        A_Book_number: data.A_Book_number,
        A_date2: new Date(data.A_date2).toISOString(),
        A_Subject: data.A_Subject,
        A_date3: new Date(data.A_date3).toISOString(),
        A_endorser1: data.A_endorser1,
        A_date4: new Date(data.A_date4).toISOString(),
        A_date5: new Date(data.A_date5).toISOString(),
        A_endorser2: data.A_endorser2,
        A_Agency: data.A_Agency,
      },
    });

    console.log('Successfully updated:', updatedAnnouncement);

    // Return the updated data
    return NextResponse.json(updatedAnnouncement, { status: 200 });
  } catch (error: any) {
    console.error('Error updating announcement:', error.message || error);
    return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects
  }
};
