"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SpreadSheet.scss";

// Define the State type based on the data structure
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

const SpreadSheet = () => {
  const [states, setStates] = useState<State[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof State>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
      setStates(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch states data");
      setLoading(false);
      console.error("Error fetching states:", err);
    }
  };

  const handleSort = (column: keyof State) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as sort column with ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Helper function to convert letter grade to numeric value for sorting
  const gradeToNumber = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      "A+": 12,
      A: 11,
      "A-": 10,
      "B+": 9,
      B: 8,
      "B-": 7,
      "C+": 6,
      C: 5,
      "C-": 4,
      "D+": 3,
      D: 2,
      "D-": 1,
      F: 0,
    };

    return gradeMap[grade] !== undefined ? gradeMap[grade] : -1;
  };

  // Helper function to convert political leaning to numeric value for sorting
  const politicalLeaningToNumber = (leaning: string): number => {
    const leaningMap: { [key: string]: number } = {
      "Dark Blue": 0,
      Blue: 1,
      "Light Blue": 2,
      Purple: 3,
      "Light Red": 4,
      Red: 5,
      "Dark Red": 6,
    };

    return leaningMap[leaning] !== undefined ? leaningMap[leaning] : -1;
  };

  const sortedStates = [...states].sort((a, b) => {
    // For political leaning column
    if (sortColumn === "PoliticalLeaning") {
      const valueA = politicalLeaningToNumber(a[sortColumn] as string);
      const valueB = politicalLeaningToNumber(b[sortColumn] as string);

      if (sortDirection === "asc") {
        return valueA - valueB; // Ascending: Blue to Red
      } else {
        return valueB - valueA; // Descending: Red to Blue
      }
    }

    // For grade columns (Abortion, GunLaws)
    const gradeColumns: (keyof State)[] = ["Abortion", "GunLaws"];

    if (gradeColumns.includes(sortColumn)) {
      const valueA = gradeToNumber(a[sortColumn] as string);
      const valueB = gradeToNumber(b[sortColumn] as string);

      if (sortDirection === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }

    // For numerical columns
    const numericColumns: (keyof State)[] = [
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
    ];

    if (numericColumns.includes(sortColumn)) {
      const valueA = parseFloat(a[sortColumn] as string);
      const valueB = parseFloat(b[sortColumn] as string);

      if (sortDirection === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    } else {
      // For text columns, compare as strings
      const valueA = String(a[sortColumn]);
      const valueB = String(b[sortColumn]);

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
  });

  // Define which columns to display (excluding internal fields)
  const displayColumns: (keyof State)[] = [
    "Name",
    "MedianHomePrice",
    "CapitalGainsTax",
    "IncomeTax",
    "SalesTax",
    "PropertyTaxes",
    "Abortion",
    "CostOfLiving",
    "K12SchoolPerformance",
    "HigherEdSchoolPerformance",
    "ForestedLand",
    "GunLaws",
    "MinimumWage",
    "Population",
    "ViolentCrimes",
    "PoliticalLeaning",
  ];

  // Format column headers for display (add spaces between camel case)
  const formatColumnName = (name: string) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  // Determines if a column is sortable
  const isSortableColumn = (column: keyof State) => {
    return [
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
      "Abortion",
      "GunLaws",
      "PoliticalLeaning", // Added PoliticalLeaning
    ].includes(column);
  };

  // Format the grade for display
  const formatGrade = (grade: string) => {
    // This can be expanded to add styling or other formatting
    return grade;
  };

  // Format political leaning with appropriate color
  const getPoliticalLeaningColor = (leaning: string): string => {
    const colorMap: { [key: string]: string } = {
      "Dark Blue": "#0d47a1",
      Blue: "#1976d2",
      "Light Blue": "#29b6f6",
      Purple: "#673ab7",
      "Light Red": "#ef5350",
      Red: "#d32f2f",
      "Dark Red": "#b71c1c",
    };

    return colorMap[leaning] || "#6b7280";
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-full px-4">
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-10 bg-default-50 dark:bg-default-100/10">
                  <tr>
                    <th className="px-4 py-4 text-center font-bold text-default-700 dark:text-default-300 border-b-2 border-default-300 sticky left-0 z-20 bg-default-50 dark:bg-default-100/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      #
                    </th>
                    {displayColumns.map((column) => (
                      <th
                        className={`px-4 py-4 text-left font-bold text-default-700 dark:text-default-300 border-b-2 border-default-300 whitespace-nowrap ${
                          isSortableColumn(column)
                            ? "cursor-pointer hover:bg-pastel-teal/10 transition-colors select-none"
                            : ""
                        }`}
                        key={column}
                        onClick={() =>
                          isSortableColumn(column) ? handleSort(column) : null
                        }
                      >
                        <div className="flex items-center gap-2">
                          {formatColumnName(column)}
                          {isSortableColumn(column) && (
                            <span className="text-pastel-teal">
                              {sortColumn === column
                                ? sortDirection === "asc"
                                  ? "▲"
                                  : "▼"
                                : ""}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStates.map((state, index) => (
                    <tr
                      className="hover:bg-default-100 dark:hover:bg-default-50/5 transition-colors"
                      key={state._id}
                    >
                      <td className="px-4 py-3 text-center font-semibold text-default-600 dark:text-default-400 border-b border-default-200 dark:border-default-100 sticky left-0 z-10 bg-default-50 dark:bg-default-100/5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {index + 1}
                      </td>
                      {displayColumns.map((column) => {
                        const value = state[column];
                        let displayValue = value;

                        // Special formatting for grade columns
                        if (column === "Abortion" || column === "GunLaws") {
                          displayValue = formatGrade(value as string);
                        }

                        return (
                          <td
                            className={`px-4 py-3 border-b border-default-200 dark:border-default-100 ${
                              column === "Name"
                                ? "font-semibold text-foreground"
                                : "text-default-600 dark:text-default-400"
                            }`}
                            data-label={formatColumnName(column)}
                            key={`${state._id}-${column}`}
                          >
                            {column === "PoliticalLeaning" ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-default-300"
                                  style={{
                                    backgroundColor: getPoliticalLeaningColor(
                                      value as string,
                                    ),
                                  }}
                                />
                                <span>{displayValue}</span>
                              </div>
                            ) : (
                              displayValue
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpreadSheet;
