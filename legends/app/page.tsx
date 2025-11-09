// Updated Toyota-style car filter page with sidebar filtering
"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";

const carsData = [
  {
    model: "Tesla Model 3",
    year: 2023,
    type: "Sedan",
    fuel: "Electric",
    engine: "EV",
    cost: 45000,
    interest: 3.5,
  },
  {
    model: "Ford Mustang",
    year: 2021,
    type: "Coupe",
    fuel: "Gasoline",
    engine: "V8",
    cost: 55000,
    interest: 4.0,
  },
  {
    model: "Toyota Corolla",
    year: 2022,
    type: "Sedan",
    fuel: "Hybrid",
    engine: "I4",
    cost: 25000,
    interest: 2.9,
  },
  {
    model: "BMW X5",
    year: 2020,
    type: "SUV",
    fuel: "Diesel",
    engine: "V6",
    cost: 62000,
    interest: 4.5,
  },
];

// Toyota-style Navbar component
function ToyotaNavbar() {
  return (
    <nav className="w-full border-b bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Toyota" className="h-8 w-auto" />
        <span className="text-xl font-semibold">Toyota</span>
      </div>
      <ul className="hidden md:flex gap-6 text-sm font-medium">
        <li className="hover:text-red-600 cursor-pointer">Vehicles</li>
        <li className="hover:text-red-600 cursor-pointer">Shopping Tools</li>
        <li className="hover:text-red-600 cursor-pointer">Certified</li>
        <li className="hover:text-red-600 cursor-pointer">More</li>
      </ul>
      <button className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
        Sign In
      </button>
    </nav>
  );
}

export default function CarFilterPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    cost: [0, 100000],
    year: "",
    type: "",
    fuel: "",
    engine: "",
    interest: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applySidebarFilter = (category: string) => {
    switch (category) {
      case "crossovers":
        handleFilterChange("type", "SUV");
        break;
      case "cars":
        handleFilterChange("type", "Sedan");
        break;
      case "trucks":
        handleFilterChange("type", "Truck");
        break;
      case "performance":
        handleFilterChange("type", "Coupe");
        break;
      case "electrified":
        handleFilterChange("fuel", "Electric");
        break;
      default:
        break;
    }
  };

  const filteredCars = carsData.filter((car) => {
    return (
      car.model.toLowerCase().includes(query.toLowerCase()) &&
      car.cost >= filters.cost[0] &&
      car.cost <= filters.cost[1] &&
      (filters.year === "" || car.year === Number(filters.year)) &&
      (filters.type === "" || car.type === filters.type) &&
      (filters.fuel === "" || car.fuel === filters.fuel) &&
      (filters.engine === "" || car.engine === filters.engine) &&
      (filters.interest === "" || car.interest <= Number(filters.interest))
    );
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Vehicles</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => applySidebarFilter("crossovers")}
              className="hover:text-red-600"
            >
              Crossovers & SUVs
            </button>
          </li>
          <li>
            <button
              onClick={() => applySidebarFilter("cars")}
              className="hover:text-red-600"
            >
              Cars & Minivan
            </button>
          </li>
          <li>
            <button
              onClick={() => applySidebarFilter("trucks")}
              className="hover:text-red-600"
            >
              Trucks
            </button>
          </li>
          <li>
            <button
              onClick={() => applySidebarFilter("performance")}
              className="hover:text-red-600"
            >
              Performance
            </button>
          </li>
          <li>
            <button
              onClick={() => applySidebarFilter("electrified")}
              className="hover:text-red-600"
            >
              Electrified
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Toyota Vehicle Search & Filter 🚗
        </h1>

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

        {/* Filters */}
        <Card className="mb-8 bg-white text-black border-2 border-red-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-black">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 text-black">
            {/* Cost */}
            <div>
              <label className="text-sm font-medium">Cost Range ($)</label>
              <Slider
                min={0}
                max={100000}
                step={5000}
                value={filters.cost}
                onValueChange={(value) => handleFilterChange("cost", value)}
              />
              <p className="text-sm mt-1">
                ${filters.cost[0]} - ${filters.cost[1]}
              </p>
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium">Year</label>
              <Select onValueChange={(v) => handleFilterChange("year", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">—</SelectItem>
                  {[2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                    <SelectItem key={yr} value={yr.toString()}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-medium">Type of Car</label>
              <Select onValueChange={(v) => handleFilterChange("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">—</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuel */}
            <div>
              <label className="text-sm font-medium">Fuel Type</label>
              <Select onValueChange={(v) => handleFilterChange("fuel", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">—</SelectItem>
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Engine */}
            <div>
              <label className="text-sm font-medium">Engine</label>
              <Select onValueChange={(v) => handleFilterChange("engine", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">—</SelectItem>
                  <SelectItem value="EV">EV</SelectItem>
                  <SelectItem value="I4">I4</SelectItem>
                  <SelectItem value="V6">V6</SelectItem>
                  <SelectItem value="V8">V8</SelectItem>
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

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car, i) => (
            <Card key={i} className="hover:shadow-lg transition-all border">
              <CardContent className="p-4">
                <img
                  src={`/cars/${car.model
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.jpg`}
                  alt={car.model}
                  className="w-full h-48 object-cover rounded-lg mb-4 border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/cars/default.jpg";
                  }}
                />
                <h3 className="text-xl font-bold mb-2">{car.model}</h3>
                <p>Year: {car.year}</p>
                <p>Type: {car.type}</p>
                <p>Fuel: {car.fuel}</p>
                <p>Engine: {car.engine}</p>
                <p className="font-semibold">
                  Cost: ${car.cost.toLocaleString()}
                </p>
                <p>Interest: {car.interest}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No cars match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
