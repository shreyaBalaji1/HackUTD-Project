"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CalculatorPage() {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [baseRate, setBaseRate] = useState(4.0);
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("finance"); // finance | lease
  const [leaseTerm, setLeaseTerm] = useState(36); // 24, 36, 48

  // 🧮 Finance Calculation
  const calculateFinance = (customRate = baseRate) => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const months = (parseInt(loanTerm) || 0) * 12;
    const loanAmount = price - down;

    if (price <= 0 || months <= 0) {
      alert("Please enter a valid car price and loan term.");
      return;
    }

    const lenders = [
      { name: "Chase Auto Finance", rate: customRate - 0.3 },
      { name: "Wells Fargo Auto", rate: customRate },
      { name: "Dealer Financing", rate: customRate + 0.8 },
    ];

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

    const bestDeal = results.reduce((best, curr) =>
      parseFloat(curr.total) < parseFloat(best.total) ? curr : best
    );
    results.forEach((r) => (r.isBest = r.name === bestDeal.name));
    setResults(results);
  };

  // 🚘 Lease Calculation
  const calculateLease = () => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const months = leaseTerm;
    if (price <= 0) {
      alert("Please enter a valid car price.");
      return;
    }

    const residual = price * 0.55;
    const moneyFactor = baseRate / 2400;
    const depreciation = (price - residual - down) / months;
    const interest = (price + residual) * moneyFactor;
    const leasePayment = depreciation + interest;

    const results = [
      {
        name: `${months}-Month Lease`,
        adjustedRate: baseRate.toFixed(2),
        monthly: leasePayment.toFixed(2),
        total: (leasePayment * months).toFixed(2),
        interest: (interest * months).toFixed(2),
        isBest: true,
      },
    ];

    setResults(results);
  };

  const calculate = () => {
    if (mode === "finance") calculateFinance();
    else calculateLease();
  };

  // Colors for chart
  const COLORS = ["#2563eb", "#dc2626"]; // blue + red

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-red-600">
        💰 Car {mode === "finance" ? "Payment" : "Lease"} Calculator
      </h1>

      <Card className="border-2 border-red-600 bg-white text-black shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            {mode === "finance"
              ? "Compare Financing Options"
              : "Estimate Your Lease Payment"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Toggle between Finance / Lease */}
          <div className="flex justify-center mb-2">
            <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setMode("finance")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  mode === "finance"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Finance
              </button>
              <button
                onClick={() => setMode("lease")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  mode === "lease"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Lease
              </button>
            </div>
          </div>

          {/* Input Fields */}
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

            {mode === "finance" ? (
              <>
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
                  <label className="text-sm font-medium">
                    Credit Score (optional)
                  </label>
                  <Input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    placeholder="e.g. 700"
                    className="border border-black"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Lease Term (months)</label>
                <Select
                  onValueChange={(v) => setLeaseTerm(Number(v))}
                  defaultValue={leaseTerm.toString()}
                >
                  <SelectTrigger className="border border-black">
                    <SelectValue placeholder="Select lease term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Interest / Rate Slider */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Adjust Base {mode === "finance" ? "Interest" : "Money Factor"} Rate:{" "}
              <span className="font-semibold">{baseRate.toFixed(1)}%</span>
            </label>
            <Slider
              min={2.0}
              max={8.0}
              step={0.1}
              value={[baseRate]}
              onValueChange={(val) => {
                setBaseRate(val[0]);
                calculate();
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Move the slider to simulate changing market or lease rates.
            </p>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
          >
            {mode === "finance" ? "Compare Financing Rates" : "Estimate Lease"}
          </Button>

          {/* 📊 Results Table */}
          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-center mb-4">
                {mode === "finance"
                  ? "📊 Financing Comparison"
                  : "📉 Lease Estimate"}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-center border border-gray-300 rounded-lg">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="p-3">
                        {mode === "finance" ? "Lender" : "Lease Option"}
                      </th>
                      <th className="p-3">Rate (%)</th>
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
                        <td className="p-4 font-semibold">{r.name}</td>
                        <td>{r.adjustedRate}%</td>
                        <td className="text-red-600 font-semibold">${r.monthly}</td>
                        <td>${parseFloat(r.total).toLocaleString()}</td>
                        <td>${parseFloat(r.interest).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 💹 Payment Breakdown Chart (Finance Only) */}
              {mode === "finance" && (
                <div className="mt-12 text-center">
                  <h3 className="text-2xl font-semibold text-red-600 mb-4">
                    💹 Payment Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={[
                          {
                            name: "Principal",
                            value:
                              parseFloat(carPrice) - parseFloat(downPayment || "0"),
                          },
                          {
                            name: "Interest",
                            value: parseFloat(results[0]?.interest || "0"),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <p className="mt-3 text-gray-700">
                    Total Loan Cost:{" "}
                    <span className="font-semibold text-black">
                      ${parseFloat(results[0]?.total || "0").toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
