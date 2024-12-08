import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // ใช้ NextResponse ในการตอบกลับ

const prisma = new PrismaClient();

// ใช้ async handler ในการจัดการการลบข้อมูล
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;  // ดึงค่าจาก URL params แทน query
  console.log('Deleting event with ID:', id);

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    // ลบ event จากฐานข้อมูล โดยแปลง id เป็น number
    const deletedEvent = await prisma.event_calendar.delete({
      where: { event_id: Number(id) },
    });

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
};
