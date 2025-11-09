"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function CalculatorPage() {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [baseRate, setBaseRate] = useState(4.0);
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("finance");
  const [leaseTerm, setLeaseTerm] = useState(36);

  // ------- calculations remain unchanged -------- //
  const calculateFinance = (customRate = baseRate) => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const months = (parseInt(loanTerm) || 0) * 12;

    if (price <= 0 || months <= 0) {
      alert("Please enter a valid car price and loan term.");
      return;
    }

    const loanAmount = price - down;

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

    const best = results.reduce((best, c) =>
      parseFloat(c.total) < parseFloat(best.total) ? c : best
    );

    results.forEach((r) => (r.isBest = r.name === best.name));
    setResults(results);
  };

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

  const COLORS = ["#1E3A8A", "#DC2626"];

  return (
    <div className={`${inter.className} max-w-4xl mx-auto p-6`}>
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Car {mode === "finance" ? "Payment" : "Lease"} Calculator
      </h1>

      <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-gray-700">
            {mode === "finance"
              ? "Financing Comparison"
              : "Lease Payment Estimate"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-full p-1">
              {["finance", "lease"].map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`px-5 py-1 rounded-full text-sm font-medium transition-all
                    ${
                      mode === item
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                >
                  {item === "finance" ? "Finance" : "Lease"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Car Price ($)"
              value={carPrice}
              setValue={setCarPrice}
            />
            <Field
              label="Down Payment ($)"
              value={downPayment}
              setValue={setDownPayment}
            />

            {mode === "finance" ? (
              <>
                <Field
                  label="Loan Term (years)"
                  value={loanTerm}
                  setValue={setLoanTerm}
                />
                <Field
                  label="Credit Score (optional)"
                  value={creditScore}
                  setValue={setCreditScore}
                />
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">
                  Lease Term (months)
                </label>
                <Select
                  onValueChange={(v) => setLeaseTerm(Number(v))}
                  defaultValue={leaseTerm.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
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

          {/* Slider */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Adjust Base {mode === "finance" ? "Interest" : "Money Factor"}:{" "}
              <span className="font-semibold">
                {baseRate.toFixed(2)}%
              </span>
            </label>
            <Slider
              min={2.0}
              max={8.0}
              step={0.1}
              value={[baseRate]}
              onValueChange={(v) => setBaseRate(v[0])}
            />
            <p className="text-xs text-gray-500 mt-1">
              Adjust for market fluctuations.
            </p>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {mode === "finance"
              ? "Compare Financing Options"
              : "Estimate Lease Payment"}
          </Button>

          {results.length > 0 && (
            <>
              {/* Table */}
              <ResultsTable results={results} mode={mode} />

              {/* Chart */}
              {mode === "finance" && (
                <Chart
                  results={results}
                  carPrice={carPrice}
                  downPayment={downPayment}
                  COLORS={COLORS}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function Field({ label, value, setValue }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function ResultsTable({ results, mode }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        {mode === "finance" ? "Financing Comparison" : "Lease Estimate"}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <Th>{mode === "finance" ? "Lender" : "Lease Option"}</Th>
              <Th>Rate (%)</Th>
              <Th>Monthly ($)</Th>
              <Th>Total Cost ($)</Th>
              <Th>Interest ($)</Th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className={`border-b ${
                  r.isBest ? "bg-green-50 font-semibold" : "hover:bg-gray-50"
                }`}
              >
                <Td>{r.name}</Td>
                <Td>{r.adjustedRate}%</Td>
                <Td className="text-red-600">${r.monthly}</Td>
                <Td>${parseFloat(r.total).toLocaleString()}</Td>
                <Td>${parseFloat(r.interest).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Chart({ results, carPrice, downPayment, COLORS }) {
  return (
    <div className="mt-12 text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Breakdown
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
              { name: "Interest", value: parseFloat(results[0]?.interest || 0) },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {COLORS.map((c, i) => (
              <Cell key={i} fill={c} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Th({ children }) {
  return <th className="p-3 font-medium">{children}</th>;
}

function Td({ children }) {
  return <td className="p-4">{children}</td>;
}
