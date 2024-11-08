import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // คีย์ลับสำหรับ JWT

export async function POST(req: Request) {
    const { User_email, password } = await req.json();

    try {
        // ตรวจสอบว่าอีเมลและรหัสผ่านถูกส่งมาครบถ้วน
        if (!User_email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // ค้นหาผู้ใช้จากฐานข้อมูลด้วยอีเมล
        const user = await prisma.user.findUnique({
            where: { User_email },
        });

        // ตรวจสอบว่าพบผู้ใช้หรือไม่
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // ตรวจสอบรหัสผ่าน
        const isValidPassword = await bcrypt.compare(password, user.password);

        // หากรหัสผ่านไม่ตรงกัน
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // หากตรวจสอบผ่าน ให้สร้าง token สำหรับ session
        const token = jwt.sign(
            { userId: user.User_id, email: user.User_email, name: `${user.User_fname} ${user.User_lname}` },
            JWT_SECRET,
            { expiresIn: '1h' } // สามารถตั้งค่าเวลาให้ token หมดอายุ เช่น 1 ชั่วโมง
        );

        // ตั้ง cookie ไว้ใน response เพื่อนำ token กลับไปให้ client
        const response = NextResponse.json({ message: 'Login successful' });
        response.headers.append(
            "Set-Cookie",
            `token=${token}; Path=/; Max-Age=3600; Secure; SameSite=Strict`
        );
        
        response.headers.append(
            "Set-Cookie",
            `email=${user.User_email}; Path=/; Max-Age=3600; Secure; SameSite=Strict`
        );

        response.headers.append(
            "Set-Cookie",
            `userName=${encodeURIComponent(`${user.User_fname} ${user.User_lname}`)}; Path=/; Max-Age=3600; Secure; SameSite=Strict`
        );

        response.headers.append(
            "Set-Cookie",
           `role=${user.role}; Path=/; Max-Age=3600; Secure; SameSite=Strict`
        );
        
        
        return response;
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
