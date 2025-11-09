"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  const removeFavorite = (car) => {
    const updated = favorites.filter((f) => f.model !== car.model);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-center">❤️ Your Favorite Cars</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t added any favorites yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car, i) => (
            <Card
              key={i}
              className="border-2 border-red-600 bg-white text-black p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">{car.model}</h3>
                <button onClick={() => removeFavorite(car)}>
                  <Heart size={20} stroke="red" fill="red" />
                </button>
              </div>
              <div className="grid grid-cols-2 text-sm gap-x-4 gap-y-1">
                <p>Year: {car.year}</p>
                <p>Type: {car.type}</p>
                <p>Fuel: {car.fuel}</p>
                <p>Engine: {car.engine}</p>
                <p className="font-semibold">Cost: ${car.cost.toLocaleString()}</p>
                <p>Interest: {car.interest}%</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
