"use client";

import { useEffect, useState } from "react";

export default function ComparePage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("compareCars") || "[]");
    setCars(stored);
  }, []);

  if (cars.length < 2) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h1 className="text-3xl font-semibold mb-4">🚘 Compare Cars</h1>
        <p>Select at least two cars on the Filter page to compare.</p>
      </div>
    );
  }

  // Features we’ll show
  const features = ["year", "type", "fuel", "engine", "cost", "interest"];

  // Helper values for highlighting
  const minCost = Math.min(...cars.map((c) => c.cost));
  const maxYear = Math.max(...cars.map((c) => c.year));

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
            {features.map((feature) => (
              <tr key={feature} className="odd:bg-gray-50">
                <td className="border border-gray-300 p-3 capitalize font-medium">
                  {feature}
                </td>

                {cars.map((car, i) => {
                  const value =
                    feature === "cost"
                      ? `$${car.cost.toLocaleString()}`
                      : car[feature];

                  // Highlight best (lowest cost or newest year)
                  const highlight =
                    (feature === "cost" && car.cost === minCost) ||
                    (feature === "year" && car.year === maxYear)
                      ? "text-green-600 font-semibold"
                      : "";

                  return (
                    <td
                      key={i}
                      className={`border border-gray-300 p-3 ${highlight}`}
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

      <div className="flex justify-center mt-8">
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
