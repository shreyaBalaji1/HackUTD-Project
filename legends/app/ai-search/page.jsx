"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Heart, Sparkles, Lightbulb } from "lucide-react";

export default function AISearchPage() {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);

  // Example queries for users
  const exampleQueries = [
    "affordable hybrid SUV for families",
    "luxury sedan under $60k",
    "eco-friendly car for daily commute",
    "spacious minivan for road trips",
    "budget-friendly hybrid under $35k"
  ];

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavs);
    const storedCompare = JSON.parse(localStorage.getItem("compareCars") || "[]");
    setCompareList(storedCompare);
  }, []);

  useEffect(() => {
    localStorage.setItem("compareCars", JSON.stringify(compareList));
  }, [compareList]);

  const handleAISearch = async () => {
    if (!naturalQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/ai-search?query=${encodeURIComponent(naturalQuery)}`);
      const data = await response.json();
      setAiResults(data);
    } catch (error) {
      console.error("AI search failed:", error);
      alert("AI search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        
        {/* AI Search Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI-Powered Car Search
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Describe what you're looking for in plain English
          </p>
        </div>

        {/* Natural Language Search Bar */}
        <Card className="mb-8 border-2 border-red-600 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Input
                placeholder='Try: "affordable hybrid SUV for families"'
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
                className="flex-1 text-lg py-6"
              />
              <Button 
                onClick={handleAISearch}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Search
                  </span>
                )}
              </Button>
            </div>

            {/* Example Queries */}
            <div className="flex items-center gap-2 flex-wrap">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Try:</span>
              {exampleQueries.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setNaturalQuery(example)}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Interpretation */}
        {aiResults && (
          <Card className="mb-6 bg-blue-50 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    AI Understanding:
                  </p>
                  <p className="text-blue-800">{aiResults.interpretation}</p>
                  {aiResults.parsed && (
                    <div className="mt-2 text-sm text-blue-700">
                      <span className="font-medium">Filters applied: </span>
                      {aiResults.parsed.priceMax && <span className="mr-2">Max ${aiResults.parsed.priceMax.toLocaleString()}</span>}
                      {aiResults.parsed.fuel && <span className="mr-2">{aiResults.parsed.fuel.join(', ')}</span>}
                      {aiResults.parsed.body && <span>{aiResults.parsed.body.join(', ')}</span>}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {aiResults && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {aiResults.cars.length} Results Found
            </h3>
            
            {aiResults.cars.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 text-lg">
                  No cars match your search. Try a different query!
                </p>
              </Card>
            ) : (
              aiResults.cars.map((car) => (
                <Card
                  key={car.id}
                  className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 border-2 hover:border-red-600 hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3">
                    <img
                      src={`/cars/${car.model.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                      alt={car.model}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/cars/default.jpg")}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                      <p><span className="font-medium">Year:</span> {car.year}</p>
                      <p><span className="font-medium">Type:</span> {car.body || "N/A"}</p>
                      <p><span className="font-medium">Fuel:</span> {car.fuel || "N/A"}</p>
                      <p><span className="font-medium">Engine:</span> {car.engine || "N/A"}</p>
                      <p className="font-semibold text-red-600 text-lg">
                        ${car.cost.toLocaleString()}
                      </p>
                      <p><span className="font-medium">Interest:</span> {car.interest}%</p>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={compareList.some((c) => c.id === car.id)}
                        onChange={() => toggleCompare(car)}
                        className="accent-red-500 cursor-pointer"
                      />
                      Compare (max 3)
                    </label>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* No Results Yet */}
        {!aiResults && (
          <div className="text-center py-20">
            <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Try searching for a car using natural language!
            </p>
          </div>
        )}

        {/* Floating Compare Button */}
        {compareList.length >= 2 && (
          <button
            onClick={() => (window.location.href = "/compare")}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-red-700 transition font-semibold"
          >
            Compare {compareList.length} Cars
          </button>
        )}
      </div>
    </div>
  );
}
