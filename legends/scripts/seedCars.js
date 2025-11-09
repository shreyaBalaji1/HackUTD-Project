// scripts/seedCars.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const carsPath = path.join(__dirname, '../cars.json');
  const cars = JSON.parse(fs.readFileSync(carsPath, 'utf-8'));

  // Optional: Clear existing Car data first
  await prisma.car.deleteMany();

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }
  console.log(`Seeded ${cars.length} cars into the database.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
