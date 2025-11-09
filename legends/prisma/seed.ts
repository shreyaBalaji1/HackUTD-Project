import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.car.deleteMany();

  // Add demo cars
  await prisma.car.createMany({
    data: [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        trim: 'XSE',
        body: 'Sedan',
        engine: '2.5L I4',
        color: 'White',
        cost: 32000,
        interest: 3.5,
      },
      {
        make: 'Toyota',
        model: 'RAV4',
        year: 2024,
        trim: 'Hybrid XLE',
        body: 'SUV',
        engine: '2.5L Hybrid',
        color: 'Silver',
        cost: 35000,
        interest: 3.2,
      },
      {
        make: 'Toyota',
        model: 'Highlander',
        year: 2025,
        trim: 'Platinum',
        body: 'SUV',
        engine: '3.5L V6',
        color: 'Black',
        cost: 45000,
        interest: 3.8,
      },
      {
        make: 'Toyota',
        model: 'Supra',
        year: 2023,
        trim: '3.0 Premium',
        body: 'Coupe',
        engine: '3.0L Turbo I6',
        color: 'Red',
        cost: 55000,
        interest: 4.0,
      },
      {
        make: 'Toyota',
        model: 'BZ4X',
        year: 2025,
        trim: 'Limited',
        body: 'SUV',
        engine: 'Electric',
        color: 'Blue',
        cost: 42000,
        interest: 2.9,
      },
      {
        make: 'Toyota',
        model: 'Prius',
        year: 2022,
        trim: 'XLE Nightshade',
        body: 'Hatchback',
        engine: '1.8L Hybrid',
        color: 'Gray',
        cost: 28000,
        interest: 2.7,
      },
      {
        make: 'Toyota',
        model: '4Runner',
        year: 2024,
        trim: 'TRD Pro',
        body: 'SUV',
        engine: '4.0L V6',
        color: 'Green',
        cost: 50000,
        interest: 4.2,
      },
      {
        make: 'Toyota',
        model: 'Tacoma',
        year: 2025,
        trim: 'Limited',
        body: 'Truck',
        engine: '2.4L Turbo',
        color: 'Blue',
        cost: 39000,
        interest: 3.6,
      },
      {
        make: 'Toyota',
        model: 'Sienna',
        year: 2025,
        trim: 'Platinum',
        body: 'Minivan',
        engine: '2.5L Hybrid',
        color: 'White',
        cost: 41000,
        interest: 3.1,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
