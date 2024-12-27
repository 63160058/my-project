import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const announcements = await prisma.announcements.findMany();
        return new Response(JSON.stringify(announcements), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ message: 'Error fetching data' }), {
            status: 500,
        });
    }
}


export async function POST(req) {
    try {
      // Parse the incoming request body
      const { A_date1, A_Book_number, A_date2, A_Subject, A_date3, A_endorser1, A_date4, A_date5, A_endorser2, A_Agency } = await req.json();
      
      // Convert the dates to ISO string with time (2024-09-27T00:00:00.000Z)
      const formattedA_date1 = new Date(A_date1).toISOString();
      const formattedA_date2 = new Date(A_date2).toISOString();
      const formattedA_date3 = new Date(A_date3).toISOString();
      const formattedA_date4 = new Date(A_date4).toISOString();
      const formattedA_date5 = new Date(A_date5).toISOString();

      console.log('A_date1', formattedA_date1, 'A_Book_number', A_Book_number, 'A_date2', formattedA_date2, 'A_Subject', A_Subject, 'A_date3', formattedA_date3, 'A_endorser1', A_endorser1, 'A_date4', formattedA_date4, 'A_date5', formattedA_date5, 'A_endorser2', A_endorser2, 'A_Agency', A_Agency);
  
      // Insert the data into the database using Prisma
      const newAnnouncement = await prisma.announcements.create({
        data: {
          A_date1: formattedA_date1,
          A_Book_number,
          A_date2: formattedA_date2,
          A_Subject,
          A_date3: formattedA_date3,
          A_endorser1,
          A_date4: formattedA_date4,
          A_date5: formattedA_date5,
          A_endorser2,
          A_Agency,
        },
      });
  
      // Return the created announcement
      return new NextResponse(JSON.stringify(newAnnouncement), { status: 201 });
    } catch (error) {
      console.error('Error creating announcement:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Error creating announcement' }),
        { status: 500 }
      );
    }
}