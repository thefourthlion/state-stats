"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Reuse the State interface
interface State {
  _id: string;
  Name: string;
  MedianHomePrice: string;
  CapitalGainsTax: string;
  IncomeTax: string;
  SalesTax: string;
  PropertyTaxes: string;
  Abortion: string;
  CostOfLiving: string;
  K12SchoolPerformance: string;
  HigherEdSchoolPerformance: string;
  ForestedLand: string;
  GunLaws: string;
  MinimumWage: string;
  Population: string;
  ViolentCrimes: string;
  PoliticalLeaning: string;
}

// User preferences interface
interface UserPreferences {
  fromState: string;
  toState: string;
  income: number;
  houseValue: number;
  minimumWagePreference: "high" | "low";
  abortionStance: "pro-choice" | "pro-life";
  gunStance: "pro-2A" | "pro-gun-laws";
  politicalPreference: "red" | "blue";
  populationPreference: "small-town" | "city";
}

const Moving = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    fromState: "",
    toState: "",
    income: 105000,
    houseValue: 200000,
    minimumWagePreference: "high",
    abortionStance: "pro-choice",
    gunStance: "pro-2A",
    politicalPreference: "red",
    populationPreference: "small-town",
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/states/read`,
      );
      setStates(response.data);

      // Set default states if available
      if (response.data.length > 0) {
        const californiaIndex = response.data.findIndex(
          (state: State) => state.Name === "California",
        );
        const texasIndex = response.data.findIndex(
          (state: State) => state.Name === "Texas",
        );

        setPreferences((prev) => ({
          ...prev,
          fromState:
            californiaIndex >= 0
              ? response.data[californiaIndex].Name
              : response.data[0].Name,
          toState:
            texasIndex >= 0
              ? response.data[texasIndex].Name
              : response.data[1].Name,
        }));
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch states data");
      setLoading(false);
      console.error("Error fetching states:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value, type } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const getStateByName = (name: string): State | undefined => {
    return states.find((state) => state.Name === name);
  };

  // Get grade value for comparisons (A=4, F=0)
  const getGradeValue = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      "A+": 5,
      A: 4,
      "A-": 3.7,
      "B+": 3.3,
      B: 3,
      "B-": 2.7,
      "C+": 2.3,
      C: 2,
      "C-": 1.7,
      "D+": 1.3,
      D: 1,
      "D-": 0.7,
      F: 0,
    };

    return gradeMap[grade] || 0;
  };

  const getResultClass = (
    category: string,
    fromValue: any,
    toValue: any,
  ): string => {
    if (category === "abortion") {
      const fromGrade = getGradeValue(fromValue);
      const toGrade = getGradeValue(toValue);

      if (preferences.abortionStance === "pro-choice") {
        return toGrade >= fromGrade ? "better-result" : "worse-result";
      } else {
        return toGrade <= fromGrade ? "better-result" : "worse-result";
      }
    }

    if (category === "gunLaws") {
      const fromGrade = getGradeValue(fromValue);
      const toGrade = getGradeValue(toValue);

      if (preferences.gunStance === "pro-2A") {
        return toGrade <= fromGrade ? "better-result" : "worse-result";
      } else {
        return toGrade >= fromGrade ? "better-result" : "worse-result";
      }
    }

    if (category === "politicalLeaning") {
      const isRedState = toValue.includes("Red");
      if (preferences.politicalPreference === "red") {
        return isRedState ? "better-result" : "worse-result";
      } else {
        return isRedState ? "worse-result" : "better-result";
      }
    }

    if (category === "minimumWage") {
      if (fromValue === "No state law" || toValue === "No state law") {
        return "neutral-result";
      }

      const fromWage = parseFloat(fromValue);
      const toWage = parseFloat(toValue);

      if (preferences.minimumWagePreference === "high") {
        return toWage >= fromWage ? "better-result" : "worse-result";
      } else {
        return toWage <= fromWage ? "better-result" : "worse-result";
      }
    }

    if (category === "population") {
      const fromPop = parseInt(fromValue);
      const toPop = parseInt(toValue);

      if (preferences.populationPreference === "small-town") {
        return toPop <= fromPop ? "better-result" : "worse-result";
      } else {
        return toPop >= fromPop ? "better-result" : "worse-result";
      }
    }

    return "neutral-result";
  };

  const calculateTaxImpact = (): {
    incomeTax: number;
    salesTax: number;
    propertyTax: number;
    costOfLiving: number;
    total: number;
  } => {
    const fromState = getStateByName(preferences.fromState);
    const toState = getStateByName(preferences.toState);

    if (!fromState || !toState) {
      return {
        incomeTax: 0,
        salesTax: 0,
        propertyTax: 0,
        costOfLiving: 0,
        total: 0,
      };
    }

    // Calculate income tax difference
    const fromIncomeTaxRate = parseFloat(fromState.IncomeTax) / 100;
    const toIncomeTaxRate = parseFloat(toState.IncomeTax) / 100;
    const incomeTaxDiff =
      (fromIncomeTaxRate - toIncomeTaxRate) * preferences.income;

    // Calculate sales tax difference (assuming all income after income tax is spent)
    const fromAfterIncomeTax = preferences.income * (1 - fromIncomeTaxRate);
    const toAfterIncomeTax = preferences.income * (1 - toIncomeTaxRate);

    const fromSalesTaxRate = parseFloat(fromState.SalesTax) / 100;
    const toSalesTaxRate = parseFloat(toState.SalesTax) / 100;

    const fromSalesTax = fromAfterIncomeTax * fromSalesTaxRate;
    const toSalesTax = toAfterIncomeTax * toSalesTaxRate;

    const salesTaxDiff = fromSalesTax - toSalesTax;

    // Calculate property tax difference
    const fromPropertyTaxRate = parseFloat(fromState.PropertyTaxes) / 100;
    const toPropertyTaxRate = parseFloat(toState.PropertyTaxes) / 100;
    const propertyTaxDiff =
      (fromPropertyTaxRate - toPropertyTaxRate) * preferences.houseValue;

    // Calculate cost of living impact
    const fromCostOfLiving = parseFloat(fromState.CostOfLiving);
    const toCostOfLiving = parseFloat(toState.CostOfLiving);
    const costOfLivingDiff = fromCostOfLiving - toCostOfLiving;

    // Apply the 80% assumption - only 80% of income is affected by cost of living differences
    const costOfLivingImpact =
      (costOfLivingDiff / fromCostOfLiving) * (preferences.income * 0.8);

    // Total financial impact
    const totalDiff =
      incomeTaxDiff + salesTaxDiff + propertyTaxDiff + costOfLivingImpact;

    return {
      incomeTax: incomeTaxDiff,
      salesTax: salesTaxDiff,
      propertyTax: propertyTaxDiff,
      costOfLiving: costOfLivingImpact,
      total: totalDiff,
    };
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderResults = () => {
    const fromState = getStateByName(preferences.fromState);
    const toState = getStateByName(preferences.toState);

    if (!fromState || !toState) return null;

    const taxImpact = calculateTaxImpact();

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2">
            Moving from{" "}
            <span className="text-pastel-teal">{fromState.Name}</span> to{" "}
            <span className="text-pastel-blue">{toState.Name}</span>
          </h2>
        </div>

        {/* Financial Impact Section */}
        <div className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-pastel-teal mb-6">
            Financial Impact (Annual)
          </h3>
          <div className="space-y-4">
            <div
              className={`flex justify-between items-center p-4 rounded-lg ${
                taxImpact.incomeTax > 0
                  ? "bg-pastel-green/10 text-pastel-green-dark"
                  : "bg-pastel-red/10 text-pastel-red-dark"
              }`}
            >
              <span className="font-semibold">Income Tax Impact:</span>
              <span className="font-bold text-lg">
                {formatCurrency(taxImpact.incomeTax)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-4 rounded-lg ${
                taxImpact.salesTax > 0
                  ? "bg-pastel-green/10 text-pastel-green-dark"
                  : "bg-pastel-red/10 text-pastel-red-dark"
              }`}
            >
              <span className="font-semibold">Sales Tax Impact:</span>
              <span className="font-bold text-lg">
                {formatCurrency(taxImpact.salesTax)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-4 rounded-lg ${
                taxImpact.propertyTax > 0
                  ? "bg-pastel-green/10 text-pastel-green-dark"
                  : "bg-pastel-red/10 text-pastel-red-dark"
              }`}
            >
              <span className="font-semibold">Property Tax Impact:</span>
              <span className="font-bold text-lg">
                {formatCurrency(taxImpact.propertyTax)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-4 rounded-lg ${
                taxImpact.costOfLiving > 0
                  ? "bg-pastel-green/10 text-pastel-green-dark"
                  : "bg-pastel-red/10 text-pastel-red-dark"
              }`}
            >
              <span className="font-semibold">Cost of Living Impact:</span>
              <span className="font-bold text-lg">
                {formatCurrency(taxImpact.costOfLiving)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-6 rounded-lg border-2 ${
                taxImpact.total > 0
                  ? "bg-pastel-green/20 border-pastel-green text-pastel-green-dark"
                  : "bg-pastel-red/20 border-pastel-red text-pastel-red-dark"
              }`}
            >
              <span className="font-bold text-lg">Total Annual Impact:</span>
              <span className="font-black text-2xl">
                {formatCurrency(taxImpact.total)}
              </span>
            </div>
            {taxImpact.total > 0 ? (
              <p className="text-center p-4 rounded-lg bg-pastel-green/10 text-pastel-green-dark font-semibold">
                You&apos;ll save approximately {formatCurrency(taxImpact.total)}{" "}
                per year by moving to {toState.Name}! 🎉
              </p>
            ) : (
              <p className="text-center p-4 rounded-lg bg-pastel-red/10 text-pastel-red-dark font-semibold">
                It will cost you approximately{" "}
                {formatCurrency(Math.abs(taxImpact.total))} more per year to
                live in {toState.Name}.
              </p>
            )}
          </div>
        </div>

        {/* Preferences Comparison */}
        <div className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 overflow-hidden shadow-lg">
          <div className="p-6 bg-default-50 dark:bg-default-100/5 border-b border-default-200 dark:border-default-100">
            <h3 className="text-2xl font-bold text-pastel-blue">
              Detailed Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-default-50 dark:bg-default-100/10">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-default-700 dark:text-default-300 border-b-2 border-default-300">
                    Factor
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-pastel-teal border-b-2 border-default-300">
                    {fromState.Name}
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-pastel-blue border-b-2 border-default-300">
                    {toState.Name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`hover:bg-default-100 dark:hover:bg-default-50/5 ${
                    getResultClass(
                      "abortion",
                      fromState.Abortion,
                      toState.Abortion,
                    ) === "better-result"
                      ? "bg-pastel-green/5"
                      : getResultClass(
                            "abortion",
                            fromState.Abortion,
                            toState.Abortion,
                          ) === "worse-result"
                        ? "bg-pastel-red/5"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Abortion Laws{" "}
                    <span className="text-sm text-default-500">
                      {preferences.abortionStance === "pro-choice"
                        ? "(Pro-Choice)"
                        : "(Pro-Life)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.Abortion}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      getResultClass(
                        "abortion",
                        fromState.Abortion,
                        toState.Abortion,
                      ) === "better-result"
                        ? "text-pastel-green-dark"
                        : getResultClass(
                              "abortion",
                              fromState.Abortion,
                              toState.Abortion,
                            ) === "worse-result"
                          ? "text-pastel-red-dark"
                          : ""
                    }`}
                  >
                    {toState.Abortion}
                  </td>
                </tr>
                <tr
                  className={`hover:bg-default-100 dark:hover:bg-default-50/5 ${
                    getResultClass(
                      "gunLaws",
                      fromState.GunLaws,
                      toState.GunLaws,
                    ) === "better-result"
                      ? "bg-pastel-green/5"
                      : getResultClass(
                            "gunLaws",
                            fromState.GunLaws,
                            toState.GunLaws,
                          ) === "worse-result"
                        ? "bg-pastel-red/5"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Gun Laws{" "}
                    <span className="text-sm text-default-500">
                      {preferences.gunStance === "pro-2A"
                        ? "(Pro-2A)"
                        : "(Pro-Gun Laws)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.GunLaws}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      getResultClass(
                        "gunLaws",
                        fromState.GunLaws,
                        toState.GunLaws,
                      ) === "better-result"
                        ? "text-pastel-green-dark"
                        : getResultClass(
                              "gunLaws",
                              fromState.GunLaws,
                              toState.GunLaws,
                            ) === "worse-result"
                          ? "text-pastel-red-dark"
                          : ""
                    }`}
                  >
                    {toState.GunLaws}
                  </td>
                </tr>
                <tr
                  className={`hover:bg-default-100 dark:hover:bg-default-50/5 ${
                    getResultClass(
                      "politicalLeaning",
                      fromState.PoliticalLeaning,
                      toState.PoliticalLeaning,
                    ) === "better-result"
                      ? "bg-pastel-green/5"
                      : getResultClass(
                            "politicalLeaning",
                            fromState.PoliticalLeaning,
                            toState.PoliticalLeaning,
                          ) === "worse-result"
                        ? "bg-pastel-red/5"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Political Leaning{" "}
                    <span className="text-sm text-default-500">
                      {preferences.politicalPreference === "red"
                        ? "(Red)"
                        : "(Blue)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.PoliticalLeaning}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      getResultClass(
                        "politicalLeaning",
                        fromState.PoliticalLeaning,
                        toState.PoliticalLeaning,
                      ) === "better-result"
                        ? "text-pastel-green-dark"
                        : getResultClass(
                              "politicalLeaning",
                              fromState.PoliticalLeaning,
                              toState.PoliticalLeaning,
                            ) === "worse-result"
                          ? "text-pastel-red-dark"
                          : ""
                    }`}
                  >
                    {toState.PoliticalLeaning}
                  </td>
                </tr>
                <tr
                  className={`hover:bg-default-100 dark:hover:bg-default-50/5 ${
                    getResultClass(
                      "minimumWage",
                      fromState.MinimumWage,
                      toState.MinimumWage,
                    ) === "better-result"
                      ? "bg-pastel-green/5"
                      : getResultClass(
                            "minimumWage",
                            fromState.MinimumWage,
                            toState.MinimumWage,
                          ) === "worse-result"
                        ? "bg-pastel-red/5"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Minimum Wage{" "}
                    <span className="text-sm text-default-500">
                      {preferences.minimumWagePreference === "high"
                        ? "(Higher Better)"
                        : "(Lower Better)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    ${fromState.MinimumWage}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      getResultClass(
                        "minimumWage",
                        fromState.MinimumWage,
                        toState.MinimumWage,
                      ) === "better-result"
                        ? "text-pastel-green-dark"
                        : getResultClass(
                              "minimumWage",
                              fromState.MinimumWage,
                              toState.MinimumWage,
                            ) === "worse-result"
                          ? "text-pastel-red-dark"
                          : ""
                    }`}
                  >
                    ${toState.MinimumWage}
                  </td>
                </tr>
                <tr
                  className={`hover:bg-default-100 dark:hover:bg-default-50/5 ${
                    getResultClass(
                      "population",
                      fromState.Population,
                      toState.Population,
                    ) === "better-result"
                      ? "bg-pastel-green/5"
                      : getResultClass(
                            "population",
                            fromState.Population,
                            toState.Population,
                          ) === "worse-result"
                        ? "bg-pastel-red/5"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Population{" "}
                    <span className="text-sm text-default-500">
                      {preferences.populationPreference === "small-town"
                        ? "(Small Town)"
                        : "(City Life)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {parseInt(fromState.Population).toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      getResultClass(
                        "population",
                        fromState.Population,
                        toState.Population,
                      ) === "better-result"
                        ? "text-pastel-green-dark"
                        : getResultClass(
                              "population",
                              fromState.Population,
                              toState.Population,
                            ) === "worse-result"
                          ? "text-pastel-red-dark"
                          : ""
                    }`}
                  >
                    {parseInt(toState.Population).toLocaleString()}
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Cost of Living Index
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.CostOfLiving}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseFloat(toState.CostOfLiving) <
                      parseFloat(fromState.CostOfLiving)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    {toState.CostOfLiving}
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Income Tax Rate
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.IncomeTax}%
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseFloat(toState.IncomeTax) <=
                      parseFloat(fromState.IncomeTax)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    {toState.IncomeTax}%
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Sales Tax
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.SalesTax}%
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseFloat(toState.SalesTax) <=
                      parseFloat(fromState.SalesTax)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    {toState.SalesTax}%
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Property Tax Rate
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    {fromState.PropertyTaxes}%
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseFloat(toState.PropertyTaxes) <=
                      parseFloat(fromState.PropertyTaxes)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    {toState.PropertyTaxes}%
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    K-12 School Ranking
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    #{fromState.K12SchoolPerformance}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseInt(toState.K12SchoolPerformance) <=
                      parseInt(fromState.K12SchoolPerformance)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    #{toState.K12SchoolPerformance}
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                    Higher Ed Ranking
                  </td>
                  <td className="px-6 py-4 border-b border-default-200 dark:border-default-100">
                    #{fromState.HigherEdSchoolPerformance}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-default-200 dark:border-default-100 font-semibold ${
                      parseInt(toState.HigherEdSchoolPerformance) <=
                      parseInt(fromState.HigherEdSchoolPerformance)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    #{toState.HigherEdSchoolPerformance}
                  </td>
                </tr>
                <tr className="hover:bg-default-100 dark:hover:bg-default-50/5">
                  <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300">
                    Violent Crime Rate
                  </td>
                  <td className="px-6 py-4">{fromState.ViolentCrimes}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      parseFloat(toState.ViolentCrimes) <=
                      parseFloat(fromState.ViolentCrimes)
                        ? "text-pastel-green-dark"
                        : "text-pastel-red-dark"
                    }`}
                  >
                    {toState.ViolentCrimes}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {loading && (
          <p className="text-center p-8 text-default-600 dark:text-default-400">
            Loading state data...
          </p>
        )}
        {error && (
          <p className="text-center p-8 text-pastel-red font-medium">{error}</p>
        )}

        {!loading && !error && (
          <>
            <form
              className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 p-8 shadow-lg mb-8"
              onSubmit={handleSubmit}
            >
              {/* State Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    className="block text-sm font-bold text-default-700 dark:text-default-300 mb-2"
                    htmlFor="fromState"
                  >
                    Moving From:
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border-2 border-default-300 dark:border-default-200 bg-background text-foreground font-semibold cursor-pointer hover:border-pastel-teal focus:outline-none focus:ring-2 focus:ring-pastel-teal transition-all"
                    id="fromState"
                    name="fromState"
                    onChange={handleChange}
                    required
                    value={preferences.fromState}
                  >
                    {states.map((state) => (
                      <option key={`from-${state._id}`} value={state.Name}>
                        {state.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-bold text-default-700 dark:text-default-300 mb-2"
                    htmlFor="toState"
                  >
                    Moving To:
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border-2 border-default-300 dark:border-default-200 bg-background text-foreground font-semibold cursor-pointer hover:border-pastel-teal focus:outline-none focus:ring-2 focus:ring-pastel-teal transition-all"
                    id="toState"
                    name="toState"
                    onChange={handleChange}
                    required
                    value={preferences.toState}
                  >
                    {states.map((state) => (
                      <option key={`to-${state._id}`} value={state.Name}>
                        {state.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    className="block text-sm font-bold text-default-700 dark:text-default-300 mb-2"
                    htmlFor="income"
                  >
                    Annual Income:
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-default-600 dark:text-default-400 font-bold">
                      $
                    </span>
                    <input
                      className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-default-300 dark:border-default-200 bg-background text-foreground font-semibold hover:border-pastel-teal focus:outline-none focus:ring-2 focus:ring-pastel-teal transition-all"
                      id="income"
                      min="0"
                      name="income"
                      onChange={handleChange}
                      required
                      step="1000"
                      type="number"
                      value={preferences.income}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-bold text-default-700 dark:text-default-300 mb-2"
                    htmlFor="houseValue"
                  >
                    Ideal House Value:
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-default-600 dark:text-default-400 font-bold">
                      $
                    </span>
                    <input
                      className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-default-300 dark:border-default-200 bg-background text-foreground font-semibold hover:border-pastel-teal focus:outline-none focus:ring-2 focus:ring-pastel-teal transition-all"
                      id="houseValue"
                      min="0"
                      name="houseValue"
                      onChange={handleChange}
                      required
                      step="10000"
                      type="number"
                      value={preferences.houseValue}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Minimum Wage */}
                  <div>
                    <span className="block text-sm font-bold text-default-700 dark:text-default-300 mb-3">
                      Minimum Wage:
                    </span>
                    <div className="flex gap-3">
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.minimumWagePreference === "high"
                            ? "border-pastel-teal bg-pastel-teal/10 text-pastel-teal font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-teal"
                        }`}
                      >
                        <input
                          checked={preferences.minimumWagePreference === "high"}
                          className="sr-only"
                          name="minimumWagePreference"
                          onChange={handleChange}
                          type="radio"
                          value="high"
                        />
                        <span className="text-center block">Prefer Higher</span>
                      </label>
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.minimumWagePreference === "low"
                            ? "border-pastel-teal bg-pastel-teal/10 text-pastel-teal font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-teal"
                        }`}
                      >
                        <input
                          checked={preferences.minimumWagePreference === "low"}
                          className="sr-only"
                          name="minimumWagePreference"
                          onChange={handleChange}
                          type="radio"
                          value="low"
                        />
                        <span className="text-center block">Prefer Lower</span>
                      </label>
                    </div>
                  </div>

                  {/* Abortion Stance */}
                  <div>
                    <span className="block text-sm font-bold text-default-700 dark:text-default-300 mb-3">
                      Abortion Stance:
                    </span>
                    <div className="flex gap-3">
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.abortionStance === "pro-choice"
                            ? "border-pastel-blue bg-pastel-blue/10 text-pastel-blue font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-blue"
                        }`}
                      >
                        <input
                          checked={preferences.abortionStance === "pro-choice"}
                          className="sr-only"
                          name="abortionStance"
                          onChange={handleChange}
                          type="radio"
                          value="pro-choice"
                        />
                        <span className="text-center block">Pro-Choice</span>
                      </label>
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.abortionStance === "pro-life"
                            ? "border-pastel-blue bg-pastel-blue/10 text-pastel-blue font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-blue"
                        }`}
                      >
                        <input
                          checked={preferences.abortionStance === "pro-life"}
                          className="sr-only"
                          name="abortionStance"
                          onChange={handleChange}
                          type="radio"
                          value="pro-life"
                        />
                        <span className="text-center block">Pro-Life</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gun Laws Stance */}
                  <div>
                    <span className="block text-sm font-bold text-default-700 dark:text-default-300 mb-3">
                      Gun Laws Stance:
                    </span>
                    <div className="flex gap-3">
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.gunStance === "pro-2A"
                            ? "border-pastel-pink bg-pastel-pink/10 text-pastel-pink font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-pink"
                        }`}
                      >
                        <input
                          checked={preferences.gunStance === "pro-2A"}
                          className="sr-only"
                          name="gunStance"
                          onChange={handleChange}
                          type="radio"
                          value="pro-2A"
                        />
                        <span className="text-center block">Pro-2A</span>
                      </label>
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.gunStance === "pro-gun-laws"
                            ? "border-pastel-pink bg-pastel-pink/10 text-pastel-pink font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-pink"
                        }`}
                      >
                        <input
                          checked={preferences.gunStance === "pro-gun-laws"}
                          className="sr-only"
                          name="gunStance"
                          onChange={handleChange}
                          type="radio"
                          value="pro-gun-laws"
                        />
                        <span className="text-center block">Pro-Gun Laws</span>
                      </label>
                    </div>
                  </div>

                  {/* Political Leaning */}
                  <div>
                    <span className="block text-sm font-bold text-default-700 dark:text-default-300 mb-3">
                      Political Leaning:
                    </span>
                    <div className="flex gap-3">
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.politicalPreference === "red"
                            ? "border-pastel-red bg-pastel-red/10 text-pastel-red font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-red"
                        }`}
                      >
                        <input
                          checked={preferences.politicalPreference === "red"}
                          className="sr-only"
                          name="politicalPreference"
                          onChange={handleChange}
                          type="radio"
                          value="red"
                        />
                        <span className="text-center block">Red</span>
                      </label>
                      <label
                        className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          preferences.politicalPreference === "blue"
                            ? "border-pastel-blue bg-pastel-blue/10 text-pastel-blue font-bold"
                            : "border-default-300 dark:border-default-200 hover:border-pastel-blue"
                        }`}
                      >
                        <input
                          checked={preferences.politicalPreference === "blue"}
                          className="sr-only"
                          name="politicalPreference"
                          onChange={handleChange}
                          type="radio"
                          value="blue"
                        />
                        <span className="text-center block">Blue</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Population Preference */}
                <div>
                  <span className="block text-sm font-bold text-default-700 dark:text-default-300 mb-3">
                    Population Preference:
                  </span>
                  <div className="flex gap-3 max-w-md">
                    <label
                      className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.populationPreference === "small-town"
                          ? "border-pastel-orange bg-pastel-orange/10 text-pastel-orange font-bold"
                          : "border-default-300 dark:border-default-200 hover:border-pastel-orange"
                      }`}
                    >
                      <input
                        checked={
                          preferences.populationPreference === "small-town"
                        }
                        className="sr-only"
                        name="populationPreference"
                        onChange={handleChange}
                        type="radio"
                        value="small-town"
                      />
                      <span className="text-center block">Small Town</span>
                    </label>
                    <label
                      className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.populationPreference === "city"
                          ? "border-pastel-orange bg-pastel-orange/10 text-pastel-orange font-bold"
                          : "border-default-300 dark:border-default-200 hover:border-pastel-orange"
                      }`}
                    >
                      <input
                        checked={preferences.populationPreference === "city"}
                        className="sr-only"
                        name="populationPreference"
                        onChange={handleChange}
                        type="radio"
                        value="city"
                      />
                      <span className="text-center block">City Life</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-8 px-8 py-4 bg-gradient-primary text-white text-lg font-bold rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
                type="submit"
              >
                Calculate Moving Impact
              </button>
            </form>

            {showResults && renderResults()}
          </>
        )}
      </div>
    </div>
  );
};

export default Moving;
