// scripts/fetchToyotaCars.js
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();


async function fetchToyotaCars() {
  // Use NHTSA Vehicle API for Toyota models
  const url = 'https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/toyota?format=json';
  const response = await fetch(url);
  const data = await response.json();
  const models = data.Results || [];

  let count = 0;
    // Fetch Toyota models for each year (1990–2025)
    const startYear = 1990;
    const endYear = 2025;
    for (let year = startYear; year <= endYear; year++) {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/toyota/modelyear/${year}?format=json`;
      const response = await fetch(url);
      const data = await response.json();
      const models = data.Results || [];
      for (const car of models) {
        const make = car.Make_Name || 'Toyota';
        const model = car.Model_Name || null;
        const trim = null;
        const body = null;
        const engine = null;
        if (make && model && year) {
          await prisma.car.create({
            data: { make, model, year, trim, body, engine }
          });
          count++;
        }
      }
      console.log(`Year ${year}: Inserted ${models.length} Toyota cars.`);
    }
    console.log(`Inserted ${count} Toyota cars from NHTSA API (1990–2025).`);
}

fetchToyotaCars()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
