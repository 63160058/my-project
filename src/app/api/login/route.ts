import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const {  User_email , password } = await req.json();
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          User_email ,
        },
      });
  
      if (!user) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
  
      return NextResponse.json(user, { status: 201 });
  
    } catch (error) {
      console.error('Error occurred:', error);
      return NextResponse.json({ message: 'Error occurred' }, { status: 500 });
    }
  }
    
