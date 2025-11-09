"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [carsData, setCarsData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
    
    // Fetch cars from API to use for recommendations
    async function fetchCars() {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCarsData(data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setCarsData([]);
      }
    }
    fetchCars();
  }, []);

  const removeFavorite = (car) => {
    const updated = favorites.filter((f) => f.id !== car.id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🔹 Smart recommendations based on fuel type, car type, price range, and engine
  const getRecommendations = (car) => {
    if (carsData.length === 0) return [];
    
    // Get fuel type - handle both fuel field and model-based inference
    const carFuel = car.fuel || getFuelFromModel(car.model) || "Gasoline";
    const carType = car.body || car.type || "";
    const carCost = car.cost || 0;
    const carEngine = car.engine || "";
    
    // Score cars based on similarity
    const scored = carsData
      .filter((c) => c.id !== car.id) // Exclude the favorite car itself
      .map((c) => {
        let score = 0;
        const cFuel = c.fuel || getFuelFromModel(c.model) || "Gasoline";
        const cType = c.body || c.type || "";
        const cCost = c.cost || 0;
        const cEngine = c.engine || "";
        
        // Fuel type match (highest priority)
        if (cFuel === carFuel) score += 10;
        
        // Car type match
        if (cType && carType && cType === carType) score += 5;
        
        // Price range similarity (within $10k)
        const priceDiff = Math.abs(cCost - carCost);
        if (priceDiff <= 10000) score += 5;
        else if (priceDiff <= 20000) score += 2;
        
        // Engine similarity
        if (cEngine && carEngine) {
          const engineLower = cEngine.toLowerCase();
          const carEngineLower = carEngine.toLowerCase();
          if (engineLower.includes(carEngineLower) || carEngineLower.includes(engineLower)) {
            score += 3;
          }
        }
        
        return { car: c, score };
      })
      .filter((item) => item.score > 0) // Only include cars with some similarity
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 3) // Top 3 recommendations
      .map((item) => item.car);
    
    return scored;
  };
  
  // Helper to get fuel from model name (same as compare page)
  const getFuelFromModel = (model) => {
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
    };
    return fuelMapping[model] || null;
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">No Favorites Yet</h2>
        <p>Start adding cars to your favorites to see recommendations!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
         Your Favorite Cars
      </h1>

      <div className="space-y-10">
        {favorites.map((car, i) => {
          const recs = getRecommendations(car);

          return (
            <div key={i}>
              {/* Favorite Car Card */}
              <Card className="border-2 border-red-600 bg-white text-black rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={`/cars/${car.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                    alt={car.model}
                    onError={(e) => (e.target.src = "/cars/default.jpg")}
                    className="w-full md:w-1/3 h-48 object-cover rounded-lg border-2 border-red-600"
                  />

                  <div className="flex-1 text-left space-y-2">
                    <h2 className="text-2xl font-bold">{car.model}</h2>
                    <p>Year: {car.year}</p>
                    <p>Type: {car.body || car.type || "N/A"}</p>
                    <p>Fuel: {car.fuel || getFuelFromModel(car.model) || "N/A"}</p>
                    <p>Engine: {car.engine || "N/A"}</p>
                    <p>Cost: ${car.cost?.toLocaleString?.() ?? car.cost}</p>

                    <div className="flex gap-3 mt-3">
                      <Button
                        variant="destructive"
                        onClick={() => removeFavorite(car)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Remove
                      </Button>

                      <Button
                        onClick={() =>
                          (window.location.href = `/calculator?price=${car.cost}`)
                        }
                        className="bg-gray-800 hover:bg-gray-900 text-white"
                      >
                        Calculate Loan
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 🔹 Smart Recommendations Section */}
              {recs.length > 0 && (
                <div className="mt-6 border-l-4 border-red-600 pl-4">
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    🔍 Because you liked the {car.model}, you might also like:
                  </h3>

                  <p className="text-xs text-gray-500 italic mb-3">
                    💡 Smart recommendations based on fuel type and price range
                  </p>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recs.map((r, idx) => (
                      <Card
                        key={idx}
                        className="bg-white border border-gray-300 rounded-lg hover:shadow-md transition p-3"
                      >
                        <img
                          src={`/cars/${r.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                          alt={r.model}
                          onError={(e) => (e.target.src = "/cars/default.jpg")}
                          className="w-full h-36 object-cover rounded-md border border-gray-200"
                        />
                        <CardContent className="mt-2 text-center">
                          <p className="font-semibold">{r.model}</p>
                          <p className="text-sm text-gray-600">
                            {r.year} • {r.body || r.type || "N/A"}
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            ${r.cost?.toLocaleString?.() ?? r.cost}
                          </p>
                          <Link
                            href={`/filter`}
                            className="text-red-600 hover:underline text-sm mt-1 block"
                          >
                            View Details
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
