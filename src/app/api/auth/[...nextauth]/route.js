
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const authOptions = {

  providers: [
    CredentialsProvider({
      
      name: 'Credentials',
      credentials: {
       
      },
      async authorize(credentials, req) {
       const {email, password} = credentials;
try {

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error('No user found');
  }

  const isValid = await bcryptjs.compare(password, user.password);

  if (!isValid) {
    throw new Error('Invalid password');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
} catch (error) {
  console.error(error);
}
    

        
      }
    })
  ],
  Session: {
    strategy: 'jwt', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}
const handler = NextAuth(authOptions);

export  { handler as GET, handler as POST };