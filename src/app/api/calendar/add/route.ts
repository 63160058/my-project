import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, start_date, end_date, all_day } = req.body;

    try {
      const newEvent = await prisma.event_calendar.create({
        data: {
          title,
          description,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          all_day,
        },
      });

      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add event.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
