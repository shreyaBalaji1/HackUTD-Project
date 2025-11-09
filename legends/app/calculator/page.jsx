"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function CalculatorPage() {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [baseRate, setBaseRate] = useState(4.0); // Slider-controlled base rate
  const [results, setResults] = useState([]);

  const calculate = (customRate = baseRate) => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const months = (parseInt(loanTerm) || 0) * 12;
    const loanAmount = price - down;

    if (price <= 0 || months <= 0) {
      alert("Please enter a valid car price and loan term.");
      return;
    }

    // Define lenders relative to slider base rate
    const lenders = [
      { name: "Chase Auto Finance", rate: customRate - 0.3 },
      { name: "Wells Fargo Auto", rate: customRate },
      { name: "Dealer Financing", rate: customRate + 0.8 },
    ];

    // Credit score adjustment
    const score = parseInt(creditScore) || 700;
    let adjustment = 0;
    if (score < 600) adjustment = 0.7;
    else if (score < 700) adjustment = 0.3;

    const results = lenders.map((lender) => {
      const rate = (lender.rate + adjustment) / 100 / 12;
      const monthly = (loanAmount * rate) / (1 - Math.pow(1 + rate, -months));
      const total = monthly * months;
      const interest = total - loanAmount;

      return {
        ...lender,
        adjustedRate: (lender.rate + adjustment).toFixed(2),
        monthly: monthly.toFixed(2),
        total: total.toFixed(2),
        interest: interest.toFixed(2),
      };
    });

    // Find best deal
    const bestDeal = results.reduce((best, curr) =>
      parseFloat(curr.total) < parseFloat(best.total) ? curr : best
    );
    results.forEach((r) => (r.isBest = r.name === bestDeal.name));

    setResults(results);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-red-600">
        💰 Car Payment Calculator
      </h1>

      <Card className="border-2 border-red-600 bg-white text-black shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Compare Financing Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Car Price ($)</label>
              <Input
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                placeholder="Enter total car cost"
                className="border border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Down Payment ($)</label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="Enter down payment"
                className="border border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Loan Term (years)</label>
              <Input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g. 5"
                className="border border-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Credit Score (optional)</label>
              <Input
                type="number"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="e.g. 700"
                className="border border-black"
              />
            </div>
          </div>

          {/* 🔹 Interest Rate Slider */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Adjust Base Interest Rate: <span className="font-semibold">{baseRate.toFixed(1)}%</span>
            </label>
            <Slider
              min={2.0}
              max={8.0}
              step={0.1}
              value={[baseRate]}
              onValueChange={(val) => {
                setBaseRate(val[0]);
                calculate(val[0]); // Recalculate live
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Move the slider to simulate changing market rates.
            </p>
          </div>

          <Button
            onClick={() => calculate()}
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
          >
            Compare Rates
          </Button>

          {/* 📊 Results Table */}
          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-center mb-4">
                📊 Financing Comparison
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-center border border-gray-300 rounded-lg">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="p-3">Lender</th>
                      <th className="p-3">Interest Rate (%)</th>
                      <th className="p-3">Monthly Payment ($)</th>
                      <th className="p-3">Total Cost ($)</th>
                      <th className="p-3">Interest Paid ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-b transition-colors ${
                          r.isBest 
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-md" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-4 font-semibold">
                          <div className="flex items-center gap-3">
                            <span className={r.isBest ? "text-green-700" : ""}>{r.name}</span>
                            {r.isBest && (
                              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-green-700">
                                <span>⭐</span>
                                <span>BEST DEAL</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`p-4 ${r.isBest ? "text-green-700 font-semibold" : ""}`}>
                          {r.adjustedRate}%
                        </td>
                        <td className={`p-4 font-semibold ${r.isBest ? "text-green-700" : "text-red-600"}`}>
                          ${r.monthly}
                        </td>
                        <td className={`p-4 ${r.isBest ? "text-green-700 font-semibold" : ""}`}>
                          ${parseFloat(r.total).toLocaleString()}
                        </td>
                        <td className={`p-4 ${r.isBest ? "text-green-700 font-semibold" : ""}`}>
                          ${parseFloat(r.interest).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
