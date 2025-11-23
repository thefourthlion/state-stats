"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  affordabilityScore?: number;
}

interface Filters {
  Abortion: string;
  GunLaws: string;
  PoliticalLeaning: string;
}

const SpreadSheet = () => {
  const [states, setStates] = useState<State[]>([]);
  const [sortColumn, setSortColumn] = useState<string>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    Abortion: "",
    GunLaws: "",
    PoliticalLeaning: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        sortBy: sortColumn,
        sortOrder: sortDirection,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add active filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/states/read`,
        { params }
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
  }, [sortColumn, sortDirection, searchTerm, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStates();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchStates]);

  const handleSort = (column: string) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as sort column with ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      Abortion: "",
      GunLaws: "",
      PoliticalLeaning: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v).length + (searchTerm ? 1 : 0);


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

  // Filter options
  const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
  const politicalLeaningOptions = ["Dark Blue", "Blue", "Light Blue", "Purple", "Light Red", "Red", "Dark Red"];

  return (
    <div className="w-full">
      <div className="w-full max-w-full px-4">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-default-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 text-foreground hover:bg-default-200 dark:hover:bg-default-50/10 transition-all font-medium flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-pastel-teal text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Affordability Sort Button */}
            <button
              onClick={() => {
                if (sortColumn === "Affordability") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortColumn("Affordability");
                  setSortDirection("asc");
                }
              }}
              className={`px-6 py-3 rounded-xl border transition-all font-medium flex items-center gap-2 ${
                sortColumn === "Affordability"
                  ? "bg-pastel-green/10 border-pastel-green text-pastel-green-dark"
                  : "bg-default-100 dark:bg-default-50/5 border-default-200 dark:border-default-100 text-foreground hover:bg-default-200 dark:hover:bg-default-50/10"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {sortColumn === "Affordability" 
                ? (sortDirection === "asc" ? "Least Expensive" : "Most Expensive")
                : "Sort by Expense"}
            </button>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-pastel-red/10 text-pastel-red hover:bg-pastel-red/20 transition-all font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Filter Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Abortion Filter */}
                <div>
                  <label className="block text-sm font-medium text-default-600 dark:text-default-400 mb-2">
                    Abortion Laws
                  </label>
                  <select
                    value={filters.Abortion}
                    onChange={(e) => handleFilterChange("Abortion", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100 text-foreground focus:outline-none focus:ring-2 focus:ring-pastel-teal focus:border-transparent"
                  >
                    <option value="">All Grades</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gun Laws Filter */}
                <div>
                  <label className="block text-sm font-medium text-default-600 dark:text-default-400 mb-2">
                    Gun Laws
                  </label>
                  <select
                    value={filters.GunLaws}
                    onChange={(e) => handleFilterChange("GunLaws", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100 text-foreground focus:outline-none focus:ring-2 focus:ring-pastel-teal focus:border-transparent"
                  >
                    <option value="">All Grades</option>
                    {gradeOptions.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Political Leaning Filter */}
                <div>
                  <label className="block text-sm font-medium text-default-600 dark:text-default-400 mb-2">
                    Political Leaning
                  </label>
                  <select
                    value={filters.PoliticalLeaning}
                    onChange={(e) => handleFilterChange("PoliticalLeaning", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100 text-foreground focus:outline-none focus:ring-2 focus:ring-pastel-teal focus:border-transparent"
                  >
                    <option value="">All Leanings</option>
                    {politicalLeaningOptions.map((leaning) => (
                      <option key={leaning} value={leaning}>
                        {leaning}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

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
                  {states.map((state, index) => (
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
            
            {/* Results Count */}
            {states.length > 0 && (
              <div className="px-4 py-3 text-center text-sm text-default-600 dark:text-default-400 border-t border-default-200 dark:border-default-100">
                Showing {states.length} state{states.length !== 1 ? "s" : ""}
                {activeFilterCount > 0 && " (filtered)"}
              </div>
            )}
            
            {states.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-default-600 dark:text-default-400">
                No states found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpreadSheet;
