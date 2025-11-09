import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulated AI search parser (in production, you'd use OpenAI API)
function parseNaturalLanguageQuery(query: string): {
  priceMax?: number;
  priceMin?: number;
  fuel?: string[];
  body?: string[];
  keywords: string[];
} {
  const lowerQuery = query.toLowerCase();
  const parsed: any = {
    keywords: []
  };

  // Price parsing
  if (lowerQuery.includes('under')) {
    const match = lowerQuery.match(/under\s+\$?(\d+)[k,]?/);
    if (match) {
      const amount = parseInt(match[1]);
      parsed.priceMax = amount > 1000 ? amount : amount * 1000;
    }
  }
  if (lowerQuery.includes('affordable') || lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
    parsed.priceMax = 30000;
  }
  if (lowerQuery.includes('luxury') || lowerQuery.includes('premium')) {
    parsed.priceMin = 50000;
  }

  // Fuel type parsing
  const fuelTypes = [];
  if (lowerQuery.includes('hybrid')) fuelTypes.push('Hybrid');
  if (lowerQuery.includes('electric') || lowerQuery.includes('ev')) fuelTypes.push('Electric');
  if (lowerQuery.includes('eco') || lowerQuery.includes('green') || lowerQuery.includes('efficient')) {
    fuelTypes.push('Hybrid', 'Electric');
  }
  if (lowerQuery.includes('gas') || lowerQuery.includes('gasoline')) fuelTypes.push('Gasoline');
  if (fuelTypes.length > 0) parsed.fuel = fuelTypes;

  // Body type parsing
  const bodyTypes = [];
  if (lowerQuery.includes('suv')) bodyTypes.push('SUV');
  if (lowerQuery.includes('sedan')) bodyTypes.push('Sedan');
  if (lowerQuery.includes('truck')) bodyTypes.push('Truck');
  if (lowerQuery.includes('minivan') || lowerQuery.includes('family')) bodyTypes.push('Minivan', 'SUV');
  if (lowerQuery.includes('coupe') || lowerQuery.includes('sports')) bodyTypes.push('Coupe');
  if (bodyTypes.length > 0) parsed.body = bodyTypes;

  // Use case parsing
  if (lowerQuery.includes('family') || lowerQuery.includes('kids')) {
    if (!parsed.body) parsed.body = [];
    parsed.body.push('SUV', 'Minivan');
  }
  if (lowerQuery.includes('commute') || lowerQuery.includes('daily')) {
    parsed.keywords.push('efficient', 'reliable');
  }
  if (lowerQuery.includes('road trip') || lowerQuery.includes('travel')) {
    parsed.keywords.push('comfortable', 'spacious');
  }

  return parsed;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    // Parse natural language query using AI logic
    const parsed = parseNaturalLanguageQuery(query);
    
    // Build Prisma where clause
    const where: any = {};
    
    if (parsed.priceMax) {
      where.cost = { lte: parsed.priceMax };
    }
    if (parsed.priceMin) {
      where.cost = { ...where.cost, gte: parsed.priceMin };
    }
    
    if (parsed.fuel && parsed.fuel.length > 0) {
      where.fuel = { in: parsed.fuel };
    }
    
    if (parsed.body && parsed.body.length > 0) {
      where.body = { in: parsed.body };
    }

    // Fetch matching cars
    const cars = await prisma.car.findMany({ 
      where,
      orderBy: { cost: 'asc' },
      take: 20 
    });

    res.status(200).json({
      cars,
      parsed,
      interpretation: generateInterpretation(query, parsed, cars.length)
    });
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ error: 'AI search failed' });
  }
}

function generateInterpretation(query: string, parsed: any, count: number): string {
  const parts = [];
  
  if (parsed.priceMax) {
    parts.push(`under $${parsed.priceMax.toLocaleString()}`);
  }
  if (parsed.fuel) {
    parts.push(parsed.fuel.join(' or '));
  }
  if (parsed.body) {
    parts.push(parsed.body.join(' or '));
  }
  
  const filters = parts.length > 0 ? parts.join(', ') : 'all cars';
  return `Found ${count} ${filters} matching "${query}"`;
}
