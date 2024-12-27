import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // ใช้ NextResponse ในการตอบกลับ

const prisma = new PrismaClient();

// ใช้ async handler ในการจัดการการลบข้อมูล
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;  // ดึงค่าจาก URL params แทน query
  console.log('Deleting Announcements with ID:', id);

  if (!id) {
    return NextResponse.json({ error: 'deleted_announcements ID is required' }, { status: 400 });
  }

  try {
    // ลบ Export-Internal จากฐานข้อมูล โดยแปลง id เป็น number
    const deleted_announcements= await prisma.announcements.delete({
      where: { id: Number(id) },
    });

    if (!deleted_announcements) {
      return NextResponse.json({ error: 'deleted_announcements not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Announcements deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Announcements:', error);
    return NextResponse.json({ error: 'Failed to delete Announcements' }, { status: 500 });
  }
};
