"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 🔹 Same car data used in your Filter and Car Detail pages
const carsData = [
  { model: "Tesla Model 3", year: 2023, type: "Sedan", fuel: "Electric", engine: "EV", cost: 45000 },
  { model: "Ford Mustang", year: 2021, type: "Coupe", fuel: "Gasoline", engine: "V8", cost: 55000 },
  { model: "Toyota Corolla", year: 2022, type: "Sedan", fuel: "Hybrid", engine: "I4", cost: 25000 },
  { model: "BMW X5", year: 2020, type: "SUV", fuel: "Diesel", engine: "V6", cost: 62000 },
  { model: "Hyundai Ioniq 6", year: 2023, type: "Sedan", fuel: "Electric", engine: "EV", cost: 48000 },
  { model: "Polestar 2", year: 2023, type: "Sedan", fuel: "Electric", engine: "EV", cost: 47000 },
  { model: "Honda Civic", year: 2022, type: "Sedan", fuel: "Gasoline", engine: "I4", cost: 24000 },
  { model: "Audi Q7", year: 2021, type: "SUV", fuel: "Diesel", engine: "V6", cost: 65000 },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  const removeFavorite = (model) => {
    const updated = favorites.filter((c) => c.model !== model);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🔹 Smart recommendations (from real cars)
  const getRecommendations = (car) => {
    return carsData.filter(
      (c) =>
        c.model !== car.model &&
        c.fuel === car.fuel &&
        Math.abs(c.cost - car.cost) <= 10000
    );
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">No Favorites Yet</h2>
        <p>❤️ Start adding cars to your favorites to see recommendations!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
        ❤️ Your Favorite Cars
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
                    <p>Type: {car.type}</p>
                    <p>Fuel: {car.fuel}</p>
                    <p>Cost: ${car.cost.toLocaleString()}</p>

                    <div className="flex gap-3 mt-3">
                      <Button
                        variant="destructive"
                        onClick={() => removeFavorite(car.model)}
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
                            {r.year} • {r.type}
                          </p>
                          <p className="text-sm text-gray-700 font-medium">
                            ${r.cost.toLocaleString()}
                          </p>
                          <Link
                            href={`/car/${r.model.toLowerCase().replace(/\s+/g, "-")}`}
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
