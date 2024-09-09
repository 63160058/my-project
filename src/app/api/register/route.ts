import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { User_email, password, User_fname, User_lname } = await req.json();
  try {
      if (!User_email || !password) {
          return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
      }

      const existingUser = await prisma.user.findFirst({
          where: {
            User_email,
          },
      });

      if (existingUser) {
          return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
          data: {
              User_email: User_email,
              password: hashedPassword,
              User_fname: User_fname,
              User_lname: User_lname,
              role: 'user',
              
          },
      });

      return NextResponse.json(user, { status: 201 });
  } catch (error) {
      return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}
    
