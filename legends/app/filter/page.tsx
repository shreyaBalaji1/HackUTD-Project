"use client";


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";


import { useEffect } from "react";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  trim?: string;
  body?: string;
  engine?: string;
  color?: string;
  cost: number;
  interest: number;
};

export default function CarFilterPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    cost: [0, 100000],
    year: "",
    body: "",
    engine: "",
    interest: "",
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      setError("");
      try {
        // Build query string for filters
        const params = new URLSearchParams();
        if (filters.engine) params.append("engine", filters.engine);
        if (filters.year) params.append("year", filters.year);
        if (filters.body) params.append("body", filters.body);
        if (filters.interest) params.append("interest", filters.interest);
        params.append("costMin", filters.cost[0].toString());
        params.append("costMax", filters.cost[1].toString());
        const res = await fetch(`/api/cars?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        setCars(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredCars = cars.filter((car) => {
    return car.model.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Toyota Vehicle Search & Filter 🚗 </h1>

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
      <Card className="mb-8 bg-white text-black border-2 border-red-600 shadow-md">
        <CardHeader>
          <CardTitle className="text-black">Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-black">
          {/* Cost Range */}
          <div>
            <label className="text-sm font-medium">Cost Range ($)</label>
            <Slider
              min={0}
              max={100000}
              step={5000}
              value={filters.cost}
              onValueChange={(value) => handleFilterChange("cost", value)}
            />
            <p className="text-sm text-black mt-1">
              ${filters.cost[0]} - ${filters.cost[1]}
            </p>
          </div>

          {/* Year */}
          <div>
            <label className="text-sm font-medium">Year</label>
            <Select onValueChange={(v) => handleFilterChange("year", v)}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">—</SelectItem>
                {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <SelectItem key={yr} value={yr.toString()}>{yr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Type */}
          <div>
            <label className="text-sm font-medium">Body Type</label>
            <Select onValueChange={(v) => handleFilterChange("body", v)}>
              <SelectTrigger><SelectValue placeholder="Select body type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">—</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Coupe">Coupe</SelectItem>
                <SelectItem value="Minivan">Minivan</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Removed Fuel filter: not in DB */}

          {/* Engine */}
          <div>
            <label className="text-sm font-medium">Engine</label>
            <Select
              value={filters.engine}
              onValueChange={(v) => handleFilterChange("engine", v)}
            >
              <SelectTrigger><SelectValue placeholder="Select engine" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">—</SelectItem>
                <SelectItem value="EV">EV</SelectItem>
                <SelectItem value="I4">I4</SelectItem>
                <SelectItem value="V6">V6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interest Rate */}
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
      <div className="space-y-6">
        {loading && <p className="text-center text-gray-500">Loading cars...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredCars.map((car, i) => (
          <Card
            key={car.id || i}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 border border-black bg-white text-black hover:shadow-lg hover:border-red-600 transition-all"
          >
            {/* Car Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={`/cars/${car.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                alt={car.model}
                className="w-full max-w-sm h-48 object-cover rounded-lg border-2 border-red-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cars/default.jpg";
                }}
              />
            </div>

            {/* Car Details */}
            <div className="flex-1 space-y-2 text-left">
              <h2 className="text-2xl font-bold text-black">{car.model}</h2>
              <p className="italic text-gray-700 text-sm mb-2">
                {car.year} {car.make} {car.model} is a {car.body?.toLowerCase() || "vehicle"} with a {car.engine || "unknown"} engine. Priced at ${car.cost.toLocaleString()} with a finance rate of {car.interest}%.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                <p>Year: {car.year}</p>
                <p>Make: {car.make}</p>
                <p>Model: {car.model}</p>
                <p>Body: {car.body || "-"}</p>
                <p>Engine: {car.engine || "-"}</p>
                <p>Color: {car.color || "-"}</p>
                <p className="font-semibold">Cost: ${car.cost.toLocaleString()}</p>
                <p>Interest: {car.interest}%</p>
              </div>
            </div>
          </Card>
        ))}

        {!loading && !error && filteredCars.length === 0 && (
          <p className="text-center text-gray-500">No cars match your filters.</p>
        )}
      </div>
    </div>
  );
}
