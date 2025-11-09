import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.car.deleteMany();

  // MSRP for 2025 models
  const msrp = {
    Camry: 32000,
    RAV4: 35000,
    Highlander: 45000,
    Supra: 55000,
    BZ4X: 42000,
    Prius: 28000,
    '4Runner': 50000,
    Tacoma: 39000,
    Sienna: 41000,
  };

  const trims = {
    Camry: 'XSE',
    RAV4: 'Hybrid XLE',
    Highlander: 'Platinum',
    Supra: '3.0 Premium',
    BZ4X: 'Limited',
    Prius: 'XLE Nightshade',
    '4Runner': 'TRD Pro',
    Tacoma: 'Limited',
    Sienna: 'Platinum',
  };

  const bodies = {
    Camry: 'Sedan',
    RAV4: 'SUV',
    Highlander: 'SUV',
    Supra: 'Coupe',
    BZ4X: 'SUV',
    Prius: 'Hatchback',
    '4Runner': 'SUV',
    Tacoma: 'Truck',
    Sienna: 'Minivan',
  };

  const engines = {
    Camry: '2.5L I4',
    RAV4: '2.5L Hybrid',
    Highlander: '3.5L V6',
    Supra: '3.0L Turbo I6',
    BZ4X: 'Electric',
    Prius: '1.8L Hybrid',
    '4Runner': '4.0L V6',
    Tacoma: '2.4L Turbo',
    Sienna: '2.5L Hybrid',
  };

  const colors = ['White', 'Silver', 'Black', 'Red', 'Blue', 'Gray', 'Green', 'Blue', 'White'];
  const interest = [3.5, 3.2, 3.8, 4.0, 2.9, 2.7, 4.2, 3.6, 3.1];

  // Fuel types for each model
  const fuels = {
    Camry: 'Gasoline',
    RAV4: 'Hybrid',
    Highlander: 'Gasoline',
    Supra: 'Gasoline',
    BZ4X: 'Electric',
    Prius: 'Hybrid',
    '4Runner': 'Gasoline',
    Tacoma: 'Gasoline',
    Sienna: 'Hybrid',
  };

  const models = Object.keys(msrp);
  const cars = [];
  for (const model of models) {
    const key = model as keyof typeof msrp;
    for (let year = 2025; year >= 2020; year--) {
      cars.push({
        make: 'Toyota',
        model,
        year,
        trim: trims[key],
        body: bodies[key],
        engine: engines[key],
        fuel: fuels[key],
        color: colors[models.indexOf(model)],
        cost: msrp[key] - (2025 - year) * 1200,
        interest: interest[models.indexOf(model)],
      });
    }
  }

  await prisma.car.createMany({ data: cars });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
