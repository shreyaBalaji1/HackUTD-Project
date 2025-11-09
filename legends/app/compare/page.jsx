"use client";

import { useEffect, useState } from "react";

// Fuel type mapping based on model name
const fuelMapping = {
  'Camry': 'Gasoline',
  'RAV4': 'Hybrid',
  'Highlander': 'Gasoline',
  'Supra': 'Gasoline',
  'BZ4X': 'Electric',
  'Prius': 'Hybrid',
  '4Runner': 'Gasoline',
  'Tacoma': 'Gasoline',
  'Sienna': 'Hybrid',
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

// Helper function to get fuel type from car data
function getFuelType(car) {
  // If fuel already exists, use it
  if (car.fuel) return car.fuel;
  
  // Try to get from model name mapping
  if (car.model && fuelMapping[car.model]) {
    return fuelMapping[car.model];
  }
  
  // Try to infer from engine type
  if (car.engine) {
    const engineLower = car.engine.toLowerCase();
    if (engineLower.includes('electric') || engineLower.includes('ev')) {
      return 'Electric';
    }
    if (engineLower.includes('hybrid')) {
      return 'Hybrid';
    }
  }
  
  // Default to Gasoline
  return 'Gasoline';
}

export default function ComparePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadCars() {
      const stored = JSON.parse(localStorage.getItem("compareCars") || "[]");
      
      if (stored.length === 0) {
        setLoading(false);
        return;
      }
      
      // Add fuel data to cars if missing
      const updatedCars = stored.map((car) => {
        if (!car.fuel) {
          return { ...car, fuel: getFuelType(car) };
        }
        return car;
      });
      
      setCars(updatedCars);
      // Update localStorage with complete data
      localStorage.setItem("compareCars", JSON.stringify(updatedCars));
      setLoading(false);
    }
    
    loadCars();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h1 className="text-3xl font-semibold mb-4">🚘 Compare Cars</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (cars.length < 2) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center text-gray-600">
        <h1 className="text-3xl font-semibold mb-4">🚘 Compare Cars</h1>
        <p className="text-lg mb-6">
          {cars.length === 0 
            ? "You haven't selected any cars to compare yet." 
            : `You have ${cars.length} car selected. Select at least 2 cars to compare.`}
        </p>
        <p className="mb-6 text-gray-500">
          Go to the Filter page and check the "Compare" box on at least 2 cars.
        </p>
        <button
          onClick={() => {
            window.location.href = "/filter";
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Go to Cars Page
        </button>
      </div>
    );
  }

  // Features we'll show - handle both 'type' and 'body' field names
  const features = [
    { key: "year", label: "Year", format: (val) => val || "N/A" },
    { key: "type", label: "Type", format: (val, car) => car.body || car.type || "N/A" },
    { key: "fuel", label: "Fuel Type", format: (val) => val || "N/A" },
    { key: "engine", label: "Engine", format: (val) => val || "N/A" },
    { key: "cost", label: "Price", format: (val) => val ? `$${val.toLocaleString()}` : "N/A" },
    { key: "interest", label: "Interest Rate", format: (val) => val ? `${val}%` : "N/A" },
  ];

  // Helper values for highlighting
  const minCost = Math.min(...cars.map((c) => c.cost || Infinity).filter(c => c !== Infinity));
  const maxYear = Math.max(...cars.map((c) => c.year || 0));
  const minInterest = Math.min(...cars.map((c) => c.interest || Infinity).filter(i => i !== Infinity));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-center">🚗 Car Comparison</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Feature</th>
              {cars.map((car, i) => (
                <th key={i} className="border border-gray-300 p-3 text-left">
                  {car.model}
                </th>
              ))}
            </tr>
          </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={feature.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-4 font-semibold text-gray-700">
                    {feature.label}
                  </td>

                  {cars.map((car, i) => {
                    // Get value - handle both 'type' and 'body' fields
                    let rawValue;
                    if (feature.key === "type") {
                      rawValue = car.body || car.type || "N/A";
                    } else {
                      rawValue = car[feature.key];
                    }
                    const value = feature.format(rawValue, car);

                    // Highlight best values
                    let highlight = "";
                    if (feature.key === "cost" && car.cost === minCost) {
                      highlight = "text-green-600 font-bold";
                    } else if (feature.key === "year" && car.year === maxYear) {
                      highlight = "text-green-600 font-bold";
                    } else if (feature.key === "interest" && car.interest === minInterest) {
                      highlight = "text-green-600 font-bold";
                    }

                    return (
                      <td
                        key={i}
                        className={`border border-gray-300 p-4 ${highlight}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => {
            window.location.href = "/filter";
          }}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Filters
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("compareCars");
            window.location.href = "/filter";
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Clear & Return to Filter
        </button>
      </div>
    </div>
  );
}
