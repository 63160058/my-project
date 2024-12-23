import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // ใช้ NextResponse ในการตอบกลับ

const prisma = new PrismaClient();

// ใช้ async handler ในการจัดการการลบข้อมูล
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;  // ดึงค่าจาก URL params แทน query
  console.log('Deleting Export-External with ID:', id);

  if (!id) {
    return NextResponse.json({ error: 'Export-External ID is required' }, { status: 400 });
  }

  try {
    // ลบ Export-Internal จากฐานข้อมูล โดยแปลง id เป็น number
    const deletedExport_Internal= await prisma.officialdocument.delete({
      where: { id: Number(id) },
    });

    if (!deletedExport_Internal) {
      return NextResponse.json({ error: 'Export-External not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Export-External deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Export-External:', error);
    return NextResponse.json({ error: 'Failed to delete Export-External' }, { status: 500 });
  }
};
