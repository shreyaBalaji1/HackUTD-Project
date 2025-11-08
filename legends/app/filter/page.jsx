"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Heart } from "lucide-react";

const carsData = [
  { model: "Tesla Model 3", year: 2023, type: "Sedan", fuel: "Electric", engine: "EV", cost: 45000, interest: 3.5 },
  { model: "Ford Mustang", year: 2021, type: "Coupe", fuel: "Gasoline", engine: "V8", cost: 55000, interest: 4.0 },
  { model: "Toyota Corolla", year: 2022, type: "Sedan", fuel: "Hybrid", engine: "I4", cost: 25000, interest: 2.9 },
  { model: "BMW X5", year: 2020, type: "SUV", fuel: "Diesel", engine: "V6", cost: 62000, interest: 4.5 },
];

export default function CarFilterPage() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    cost: [0, 100000],
    year: "",
    type: "",
    fuel: "",
    engine: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (car) => {
    setFavorites((prev) => {
      const isFav = prev.some((fav) => fav.model === car.model);
      return isFav ? prev.filter((f) => f.model !== car.model) : [...prev, car];
    });
  };

  const filteredCars = carsData.filter((car) => {
    return (
      car.model.toLowerCase().includes(query.toLowerCase()) &&
      car.cost >= filters.cost[0] &&
      car.cost <= filters.cost[1] &&
      (filters.year === "" || car.year === Number(filters.year)) &&
      (filters.type === "" || car.type === filters.type) &&
      (filters.fuel === "" || car.fuel === filters.fuel) &&
      (filters.engine === "" || car.engine === filters.engine)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">🚗 Car Search & Filter</h1>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="Search by model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="secondary">
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className="mb-8 border-2 border-red-600 bg-white text-black shadow-md">
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Cost Range ($)</label>
            <Slider
              min={0}
              max={100000}
              step={5000}
              value={filters.cost}
              onValueChange={(value) => handleFilterChange("cost", value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              ${filters.cost[0]} - ${filters.cost[1]}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Year</label>
            <Select onValueChange={(v) => handleFilterChange("year", v)}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <SelectItem key={yr} value={yr.toString()}>{yr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Type of Car</label>
            <Select onValueChange={(v) => handleFilterChange("type", v)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Coupe">Coupe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <Select onValueChange={(v) => handleFilterChange("fuel", v)}>
              <SelectTrigger><SelectValue placeholder="Select fuel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Engine</label>
            <Select onValueChange={(v) => handleFilterChange("engine", v)}>
              <SelectTrigger><SelectValue placeholder="Select engine" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EV">EV</SelectItem>
                <SelectItem value="I4">I4</SelectItem>
                <SelectItem value="V6">V6</SelectItem>
                <SelectItem value="V8">V8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <Input
              type="number"
              placeholder="Enter interest rate"
              onChange={(e) => handleFilterChange("interest", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Car Results */}
      <div className="space-y-6 mt-10">
        {filteredCars.map((car, i) => (
          <Card
            key={i}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 border-2 border-red-600 bg-white text-black rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {/* Car Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={`/cars/${car.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                alt={car.model}
                className="w-full max-w-sm h-48 object-cover rounded-lg border-2 border-red-600"
                onError={(e) => (e.target.src = "/cars/default.jpg")}
              />
            </div>

            {/* Car Details */}
            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  {car.model}
                  <button
                    onClick={() => toggleFavorite(car)}
                    className="transition-all hover:scale-110"
                  >
                    <Heart
                      size={24}
                      stroke="red"
                      fill={favorites.some((fav) => fav.model === car.model) ? "red" : "none"}
                      className="text-red-600 w-6 h-6"
                    />


                  </button>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                <p>Year: {car.year}</p>
                <p>Type: {car.type}</p>
                <p>Fuel: {car.fuel}</p>
                <p>Engine: {car.engine}</p>
                <p className="font-semibold">Cost: ${car.cost.toLocaleString()}</p>
                <p>Interest: {car.interest}%</p>
              </div>
            </div>
          </Card>
        ))}

        {filteredCars.length === 0 && (
          <p className="text-center text-gray-500">
            No cars match your search and filters.
          </p>
        )}
      </div>
    </div>
  );
}
