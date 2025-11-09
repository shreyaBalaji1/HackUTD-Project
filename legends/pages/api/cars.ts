import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { engine, year, body, interest, costMin, costMax } = req.query;
    const where: any = {};
    if (engine && typeof engine === 'string' && engine.trim() !== '') {
      where.engine = {
        not: null,
        contains: engine
      };
    }
    if (year && typeof year === 'string' && year.trim() !== '') {
      where.year = Number(year);
    }
    if (body && typeof body === 'string' && body.trim() !== '') {
      where.body = body;
    }
    if (interest && typeof interest === 'string' && interest.trim() !== '') {
      where.interest = Number(interest);
    }
    if ((costMin && !isNaN(Number(costMin))) || (costMax && !isNaN(Number(costMax)))) {
      where.cost = {};
      if (costMin && !isNaN(Number(costMin))) where.cost.gte = Number(costMin);
      if (costMax && !isNaN(Number(costMax))) where.cost.lte = Number(costMax);
    }
    const cars = await prisma.car.findMany({ where });
    res.status(200).json(cars);
  } catch (error) {
    console.error('API /api/cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars', details: error instanceof Error ? error.message : error });
  }
}
