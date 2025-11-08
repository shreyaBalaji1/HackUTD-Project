"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CalculatorPage() {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculate = () => {
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm) * 12;

    if (!price || !down || !rate || !months) return;

    const loanAmount = price - down;
    const monthly =
      (loanAmount * rate) / (1 - Math.pow(1 + rate, -months));

    let creditAdjustment = 0;
    if (creditScore < 600) creditAdjustment = 50;
    else if (creditScore < 700) creditAdjustment = 25;

    setMonthlyPayment((monthly + creditAdjustment).toFixed(2));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-red-600">
        💰 Car Payment Calculator
      </h1>

      <Card className="border-2 border-red-600 bg-white text-black shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Estimate Your Monthly Payment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
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
              <label className="text-sm font-medium">Interest Rate (%)</label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 4.5"
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

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Credit Score</label>
              <Input
                type="number"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="e.g. 700"
                className="border border-black"
              />
            </div>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
          >
            Calculate Payment
          </Button>

          {monthlyPayment && (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-semibold text-black">
                Estimated Monthly Payment:
              </h2>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ${monthlyPayment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
