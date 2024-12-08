import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { event_id } = req.body;

    try {
      await prisma.event_calendar.delete({
        where: { event_id },
      });
      res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
