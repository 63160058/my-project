import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export const POST = async (req: NextApiRequest) => {
    try {
        // ดึงข้อมูลจาก body
        const { fileName } = await req.json();
        console.log('fileName', fileName);

        // ตรวจสอบว่า fileName ถูกส่งมาหรือไม่
        if (!fileName) {
            return NextResponse.json({ error: 'Missing required fields: fileName.' }, { status: 400 });
        }

        // กำหนด path สำหรับไฟล์ที่เก็บไว้
        const filePath = path.join(process.cwd(), 'src', 'app', 'assets', 'files', fileName);
        console.log('filePath', filePath);

        // ตรวจสอบว่าไฟล์มีอยู่ในระบบหรือไม่
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found.' }, { status: 404 });
        }

        // อ่านไฟล์จากที่เก็บและส่งกลับไปยัง client
        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            },
        });

    } catch (error) {
        console.error('Error downloading file:', error.message);
        console.error(error.stack); // แสดง stack trace สำหรับการดีบัก
        return NextResponse.json({ error: 'Failed to process the file request.' }, { status: 500 });
    }
};
