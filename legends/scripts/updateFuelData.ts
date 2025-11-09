import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fuel types mapping based on model name
const fuelMapping: Record<string, string> = {
  'Camry': 'Gasoline',
  'RAV4': 'Hybrid',
  'Highlander': 'Gasoline',
  'Supra': 'Gasoline',
  'BZ4X': 'Electric',
  'Prius': 'Hybrid',
  '4Runner': 'Gasoline',
  'Tacoma': 'Gasoline',
  'Sienna': 'Hybrid',
  // Add more mappings as needed
  'Corolla': 'Gasoline',
  'Avalon': 'Gasoline',
  'Sequoia': 'Gasoline',
  'Land Cruiser': 'Gasoline',
  'Tundra': 'Gasoline',
  'Venza': 'Hybrid',
  'C-HR': 'Gasoline',
  'GR86': 'Gasoline',
  'GR Corolla': 'Gasoline',
};

async function updateFuelData() {
  try {
    // Get all cars from database
    const allCars = await prisma.car.findMany({
      take: 10 // Just check first 10
    });
    
    console.log('Sample cars from database:');
    allCars.forEach(car => {
      console.log(`  ${car.model} (ID: ${car.id}) - fuel: ${car.fuel || 'NULL'}`);
    });
    
    // Get cars without fuel data
    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { fuel: null },
          { fuel: '' }
        ]
      }
    });

    console.log(`\nFound ${cars.length} cars without fuel data`);

    let updated = 0;
    for (const car of cars) {
      const fuelType = fuelMapping[car.model];
      
      if (fuelType) {
        await prisma.car.update({
          where: { id: car.id },
          data: { fuel: fuelType }
        });
        updated++;
        console.log(`Updated ${car.model} (ID: ${car.id}) with fuel: ${fuelType}`);
      } else {
        // Try to infer from engine type
        let inferredFuel = null;
        if (car.engine) {
          const engineLower = car.engine.toLowerCase();
          if (engineLower.includes('hybrid') || engineLower.includes('electric')) {
            inferredFuel = engineLower.includes('electric') ? 'Electric' : 'Hybrid';
          } else {
            inferredFuel = 'Gasoline';
          }
        } else {
          // Default to Gasoline if we can't determine
          inferredFuel = 'Gasoline';
        }
        
        await prisma.car.update({
          where: { id: car.id },
          data: { fuel: inferredFuel }
        });
        updated++;
        console.log(`Updated ${car.model} (ID: ${car.id}) with inferred fuel: ${inferredFuel}`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} cars with fuel data`);
  } catch (error) {
    console.error('Error updating fuel data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFuelData();

