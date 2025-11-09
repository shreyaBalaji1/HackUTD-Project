"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Heart } from "lucide-react";

export default function CarFilterPage() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [carsData, setCarsData] = useState([]);

  const [filters, setFilters] = useState({
    cost: [0, 100000],
    year: "",
    type: "",
    fuel: "",
    engine: "",
  });

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    setCompareList(JSON.parse(localStorage.getItem("compareCars") || "[]"));
    
    // Fetch cars from database
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => setCarsData(data))
      .catch((err) => console.error("Failed to fetch cars:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("compareCars", JSON.stringify(compareList));
  }, [compareList]);

  const toggleFavorite = (car) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === car.id);
      const updated = exists
        ? prev.filter((c) => c.id !== car.id)
        : [...prev, car];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompare = (car) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) return prev.filter((c) => c.id !== car.id);
      if (prev.length >= 3) return prev;
      return [...prev, car];
    });
  };

  const filteredCars = carsData.filter((car) => {
    const carModel = car.model || "";
    const carBody = car.body || "";
    const carFuel = car.fuel || "";
    const carEngine = car.engine || "";
    
    return (
      carModel.toLowerCase().includes(query.toLowerCase()) &&
      car.cost >= filters.cost[0] &&
      car.cost <= filters.cost[1] &&
      (filters.year === "" || car.year === Number(filters.year)) &&
      (filters.type === "" || carBody === filters.type) &&
      (filters.fuel === "" || carFuel === filters.fuel) &&
      (filters.engine === "" || carEngine.includes(filters.engine))
    );
  });

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({
      cost: [0, 100000],
      year: "",
      type: "",
      fuel: "",
      engine: "",
    });
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-6 py-10 max-w-7xl mx-auto">

        <h2 className="text-4xl font-semibold mb-10 text-center text-gray-900 tracking-tight">
          Car Search & Filter
        </h2>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-8">
          <Input
            placeholder="Search by model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-gray-300"
          />
          <Button variant="secondary" className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-10 bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Filter Options
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
              className="text-sm"
            >
              Reset Filters
            </Button>
          </CardHeader>

          <CardContent className="grid md:grid-cols-3 gap-6">
            {/* COST */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Cost Range ($)
              </label>
              <Slider
                min={0}
                max={100000}
                step={5000}
                value={filters.cost}
                onValueChange={(v) => setFilter("cost", v)}
              />
              <p className="text-sm text-gray-500 mt-1">
                ${filters.cost[0]} - ${filters.cost[1]}
              </p>
            </div>

            {/* YEAR */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Year
              </label>
              <Select onValueChange={(v) => setFilter("year", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Type
              </label>
              <Select onValueChange={(v) => setFilter("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FUEL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <Select onValueChange={(v) => setFilter("fuel", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ENGINE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Engine
              </label>
              <Select onValueChange={(v) => setFilter("engine", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EV">EV</SelectItem>
                  <SelectItem value="I4">I4</SelectItem>
                  <SelectItem value="V6">V6</SelectItem>
                  <SelectItem value="V8">V8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-8">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="w-full md:w-1/3 flex justify-center">
                <img
                  src={`/cars/${car.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                  alt={car.model}
                  className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => (e.target.src = "/cars/default.jpg")}
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3 text-left">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                  {car.model}
                  <button onClick={() => toggleFavorite(car)}>
                    <Heart
                      size={24}
                      stroke="red"
                      fill={favorites.some((f) => f.id === car.id) ? "red" : "none"}
                      className="hover:scale-110 transition"
                    />
                  </button>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 text-sm text-gray-700">
                  <p>Year: {car.year}</p>
                  <p>Type: {car.body || "N/A"}</p>
                  <p>Fuel: {car.fuel}</p>
                  <p>Engine: {car.engine}</p>
                  <p className="font-semibold text-gray-900">
                    Cost: ${car.cost.toLocaleString()}
                  </p>
                  <p>Interest: {car.interest}%</p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={compareList.some((c) => c.id === car.id)}
                    onChange={() => toggleCompare(car)}
                    className="accent-red-500 cursor-pointer"
                  />
                  Compare
                </label>
              </div>
            </Card>
          ))}

          {filteredCars.length === 0 && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>

        {/* Floating Compare Button */}
        {compareList.length >= 2 && (
          <button
            onClick={() => (window.location.href = "/compare")}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
          >
            Compare {compareList.length} Cars
          </button>
        )}
      </div>
    </div>
  );
}
