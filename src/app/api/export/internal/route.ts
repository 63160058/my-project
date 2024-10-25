import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const officialdocument = await prisma.officialdocument.findMany()
    return NextResponse.json(officialdocument)
  } catch (error: any) {
    console.error('Error fetching export docs:', error.message, error.stack)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
