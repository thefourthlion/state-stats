"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CompareStates.scss";

// Reuse the State interface from SpreadSheet
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
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define metrics where lower is better
const lowerIsBetter = [
  "MedianHomePrice",
  "CapitalGainsTax",
  "IncomeTax",
  "SalesTax",
  "PropertyTaxes",
  "CostOfLiving",
  "Population",
  "ViolentCrimes",
];

// Define metrics where higher is better
const higherIsBetter = [
  "K12SchoolPerformance",
  "HigherEdSchoolPerformance",
  "ForestedLand",
  "MinimumWage",
];

const CompareStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([
    "California",
    "Texas",
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/states/read`,
      );
      // Handle both old and new API response formats
      const data = response.data.data || response.data;
      setStates(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch states data");
      setLoading(false);
      console.error("Error fetching states:", err);
    }
  };

  // Get a state object by name
  const getStateByName = (name: string): State | undefined => {
    return states.find((state) => state.Name === name);
  };

  // Handle state selection
  const handleStateSelect = (index: number, stateName: string) => {
    const newSelectedStates = [...selectedStates];
    newSelectedStates[index] = stateName;
    setSelectedStates(newSelectedStates);
  };

  // Add another state to compare
  const addStateToCompare = () => {
    // Find a state not already selected
    const availableState = states.find(
      (state) => !selectedStates.includes(state.Name),
    );
    if (availableState) {
      setSelectedStates([...selectedStates, availableState.Name]);
    }
  };

  // Remove a state from comparison
  const removeState = (index: number) => {
    if (selectedStates.length <= 2) return; // Keep at least 2 states
    const newSelectedStates = [...selectedStates];
    newSelectedStates.splice(index, 1);
    setSelectedStates(newSelectedStates);
  };

  // Format column headers for display (add spaces between camel case)
  const formatColumnName = (name: string) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  // Determine if a value is better compared to others for the specific metric
  const isBetterValue = (
    metric: keyof State,
    value: string,
    comparisonValues: string[],
  ): boolean => {
    if (!value || value === "No state law") return false;

    // For minimum wage that might be "No state law"
    if (metric === "MinimumWage" && value === "No state law") return false;

    const numericValue = parseFloat(value);
    const numericComparisonValues = comparisonValues
      .filter((val) => val !== "No state law" && val !== "")
      .map((val) => parseFloat(val));

    if (isNaN(numericValue) || numericComparisonValues.some((v) => isNaN(v))) {
      return false;
    }

    if (lowerIsBetter.includes(metric as string)) {
      return (
        numericValue === Math.min(numericValue, ...numericComparisonValues)
      );
    }

    if (higherIsBetter.includes(metric as string)) {
      return (
        numericValue === Math.max(numericValue, ...numericComparisonValues)
      );
    }

    return false;
  };

  // Determine cell class based on comparison
  const getCellClass = (
    metric: keyof State,
    value: string,
    comparisonValues: string[],
  ): string => {
    if (
      !lowerIsBetter.includes(metric as string) &&
      !higherIsBetter.includes(metric as string)
    ) {
      return "";
    }

    const isSpecialCase = metric === "MinimumWage" && value === "No state law";

    if (isSpecialCase) return "worse-value";

    if (isBetterValue(metric, value, comparisonValues)) {
      return "better-value";
    } else {
      return "worse-value";
    }
  };

  // The metrics we want to display
  const displayMetrics: (keyof State)[] = [
    "MedianHomePrice",
    "CapitalGainsTax",
    "IncomeTax",
    "SalesTax",
    "PropertyTaxes",
    "CostOfLiving",
    "K12SchoolPerformance",
    "HigherEdSchoolPerformance",
    "ForestedLand",
    "MinimumWage",
    "Population",
    "ViolentCrimes",
    "PoliticalLeaning",
    "Abortion",
    "GunLaws",
  ];

  // Format value for display
  const formatValue = (metric: keyof State, value: string): string => {
    if (value === "No state law") return value;

    // Add $ to monetary values
    if (["MedianHomePrice", "MinimumWage"].includes(metric as string)) {
      const numValue = parseFloat(value);
      return !isNaN(numValue) ? `$${numValue.toLocaleString()}` : value;
    }

    // Add % to tax and percentage values
    if (
      ["CapitalGainsTax", "IncomeTax", "SalesTax", "PropertyTaxes"].includes(
        metric as string,
      )
    ) {
      return `${value}%`;
    }

    return value;
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
          <div className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 overflow-hidden shadow-lg">
            {/* State Selectors */}
            <div className="flex flex-wrap gap-3 p-6 border-b border-default-200 dark:border-default-100 bg-default-50 dark:bg-default-100/5">
              {selectedStates.map((stateName, index) => (
                <div className="relative" key={index}>
                  <select
                    className="appearance-none px-4 py-3 pr-10 rounded-lg border-2 border-default-300 dark:border-default-200 bg-background text-foreground font-semibold cursor-pointer hover:border-pastel-teal focus:outline-none focus:ring-2 focus:ring-pastel-teal transition-all"
                    onChange={(e) => handleStateSelect(index, e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378BFB8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                    }}
                    value={stateName}
                  >
                    {states.map((state) => (
                      <option key={state._id} value={state.Name}>
                        {state.Name}
                      </option>
                    ))}
                  </select>
                  {selectedStates.length > 2 && (
                    <button
                      className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-pastel-red hover:bg-pastel-red-dark text-white flex items-center justify-center text-xs font-bold transition-colors shadow-lg"
                      onClick={() => removeState(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                className="px-6 py-3 bg-pastel-green hover:bg-pastel-green-dark text-white font-semibold rounded-lg transition-colors"
                onClick={addStateToCompare}
              >
                + Add State
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-default-50 dark:bg-default-100/10">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-default-700 dark:text-default-300 border-b-2 border-default-300">
                      Metric
                    </th>
                    {selectedStates.map((stateName, index) => (
                      <th
                        className="px-6 py-4 text-left font-bold text-pastel-teal border-b-2 border-default-300"
                        key={index}
                      >
                        {stateName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayMetrics.map((metric) => {
                    // Get all values for this metric
                    const metricValues = selectedStates.map((stateName) => {
                      const state = getStateByName(stateName);
                      return state ? (state[metric] as string) : "";
                    });

                    return (
                      <tr
                        className="hover:bg-default-100 dark:hover:bg-default-50/5 transition-colors"
                        key={metric as string}
                      >
                        <td className="px-6 py-4 font-semibold text-default-700 dark:text-default-300 border-b border-default-200 dark:border-default-100">
                          {formatColumnName(metric as string)}
                        </td>
                        {selectedStates.map((stateName, index) => {
                          const state = getStateByName(stateName);
                          const value = state ? (state[metric] as string) : "";

                          // Get all other values for comparison
                          const otherValues = metricValues.filter(
                            (_, i) => i !== index,
                          );

                          const cellClass = getCellClass(
                            metric,
                            value,
                            otherValues,
                          );

                          return (
                            <td
                              className={`px-6 py-4 border-b border-default-200 dark:border-default-100 ${
                                cellClass === "better-value"
                                  ? "bg-pastel-green/10 text-pastel-green-dark dark:text-pastel-green font-semibold"
                                  : cellClass === "worse-value"
                                    ? "bg-pastel-red/10 text-pastel-red-dark dark:text-pastel-red"
                                    : ""
                              }`}
                              key={index}
                            >
                              {formatValue(metric, value)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareStates;
