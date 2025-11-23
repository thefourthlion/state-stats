"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

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

const NAME_BY_ABBR: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const FIPS_TO_STATE: Record<string, string> = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "District of Columbia",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming",
};

const getPoliticalColor = (leaning: string): string => {
  switch (leaning) {
    case "Dark Blue":
      return "#0d47a1";
    case "Blue":
      return "#0d47a1";
    case "Light Blue":
      return "#29b6f6";
    case "Purple":
      return "#673ab7";
    case "Light Red":
      return "#ef5350";
    case "Red":
      return "#b71c1c";
    case "Dark Red":
      return "#b71c1c";
    default:
      return "#D3D3D3";
  }
};

const formatValue = (key: string, value: string): string => {
  if (key === "Population" || key === "MedianHomePrice") {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  }
  if (
    key === "IncomeTax" ||
    key === "SalesTax" ||
    key === "PropertyTaxes" ||
    key === "CapitalGainsTax"
  ) {
    return `${value}%`;
  }
  if (key === "MinimumWage" && value !== "No state law") {
    return `$${value}`;
  }
  return value;
};

const Map = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  // Use TopoJSON from CDN - react-simple-maps will handle fetching and conversion
  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  // Fast lookup by state name (your dataset uses full names)
  const byName = useMemo(() => {
    const idx = new globalThis.Map<string, State>();
    for (const s of states) idx.set(s.Name, s);
    return idx;
  }, [states]);

  // Optional: if you prefer joining by postal abbreviation, create a second index
  const byAbbr = useMemo(() => {
    const idx = new globalThis.Map<string, State>();
    for (const s of states) {
      const abbr = Object.entries(NAME_BY_ABBR).find(
        ([, n]) => n === s.Name,
      )?.[0];
      if (abbr) idx.set(abbr, s);
    }
    return idx;
  }, [states]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/states/read`,
        );
        // Handle both old and new API response formats
        const data = response.data.data || response.data;
        setStates(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch states data");
        setLoading(false);
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  // Click -> find state in your dataset by either geo.properties.name or postal abbr
  const handleClick = (geo: any) => {
    const nameProps: string | undefined = geo?.properties?.name;
    const id: string | undefined = geo?.id; // FIPS code
    
    // Try to find name from FIPS code first (most reliable)
    let name = id ? FIPS_TO_STATE[id] : nameProps;
    
    // Fallback to properties name if FIPS lookup failed
    if (!name && nameProps) name = nameProps;

    console.log("🗺️ Clicked geo:", { id, nameProps, resolvedName: name });
    
    let found: State | undefined = name ? byName.get(name) : undefined;

    if (!found) {
      // Fallback strategies
      const abbr: string | undefined =
        geo?.properties?.postal || geo?.properties?.stusps;
      
      if (abbr) found = byAbbr.get(abbr);

      if (!found && name) {
        // Fuzzy match attempt
        found = states.find(s => s.Name.toLowerCase() === name!.toLowerCase());
      }
    }
    
    if (found) {
      setSelectedState(found);
      // Scroll to the details section smoothly
      setTimeout(() => {
        const detailsElement = document.querySelector(".state-details-card");
        if (detailsElement) {
          detailsElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 100);
    } else {
      console.warn(`❌ Could not find state data for: ${name} (ID: ${id})`);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-7xl">
        {loading && (
          <div className="text-center p-8 text-default-600 dark:text-default-400 font-medium">
            Loading map data...
          </div>
        )}
        {error && (
          <div className="text-center p-8 text-pastel-red font-medium">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="relative mb-8">
            {/* Instruction Banner */}
            {!selectedState && (
              <div className="text-center mb-6 p-4 bg-pastel-teal/10 border border-pastel-teal/30 rounded-lg">
                <p className="text-default-700 dark:text-default-300 font-semibold">
                  👆 Click on any state to view detailed information
                </p>
              </div>
            )}

            {/* Map Container */}
            <div className="w-full max-w-4xl mx-auto relative bg-default-50 dark:bg-default-100/5 rounded-2xl p-4 border border-default-200 dark:border-default-100">
              <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                  {({ geographies }) => {
                    console.log("📊 Total geographies:", geographies.length);
                    if (geographies.length > 0) {
                      console.log("📊 First geo sample:", geographies[0]);
                    }
                    
                    return geographies.map((geo) => {
                      const id = geo.id;
                      const name = FIPS_TO_STATE[id] || geo?.properties?.name;
                      
                      const stateData = name ? byName.get(name) : null;
                      const isSelected = selectedState?.Name === name;

                      const fill = stateData
                        ? getPoliticalColor(stateData.PoliticalLeaning)
                        : "#D3D3D3";

                      return (
                        <Geography
                          geography={geo}
                          key={geo.rsmKey}
                          onClick={() => {
                            console.log("🖱️ Clicked! Geo object:", geo);
                            console.log("🖱️ Geo.id:", geo.id);
                            console.log("🖱️ Geo.properties:", geo.properties);
                            handleClick(geo);
                          }}
                          style={{
                            default: {
                              fill,
                              stroke: isSelected ? "#78BFB8" : "#FFFFFF",
                              strokeWidth: isSelected ? 2.5 : 0.75,
                              outline: "none",
                              filter: isSelected ? "brightness(1.1)" : "none",
                            },
                            hover: {
                              fill,
                              stroke: "#78BFB8",
                              strokeWidth: 2,
                              cursor: "pointer",
                              outline: "none",
                              filter: "brightness(1.1)",
                            },
                            pressed: {
                              fill,
                              stroke: "#78BFB8",
                              strokeWidth: 2,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ComposableMap>
            </div>

            {/* Legend */}
            <div className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 p-6 mt-6">
              <h4 className="text-lg font-bold text-default-700 dark:text-default-300 mb-4">
                Political Leaning
              </h4>
              <div className="flex flex-wrap gap-4">
                {[
                  ["#0d47a1", "Dark Blue"],
                  ["#1976d2", "Blue"],
                  ["#29b6f6", "Light Blue"],
                  ["#673ab7", "Purple"],
                  ["#ef5350", "Light Red"],
                  ["#d32f2f", "Red"],
                  ["#b71c1c", "Dark Red"],
                ].map(([color, label]) => (
                  <div className="flex items-center gap-2" key={label}>
                    <div
                      className="w-4 h-4 rounded border border-default-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-default-600 dark:text-default-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State Details */}
        {selectedState && (
          <div className="state-details-card rounded-2xl bg-default-100 dark:bg-default-50/5 border-2 border-pastel-teal p-8 mt-6 shadow-lg animate-in fade-in duration-300">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-3xl font-black text-pastel-teal">
                  {selectedState.Name}
                </h2>
                <button
                  aria-label="Close details"
                  className="text-default-500 hover:text-pastel-teal transition-colors p-2 rounded-lg hover:bg-default-200 dark:hover:bg-default-50/10"
                  onClick={() => setSelectedState(null)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-6 h-6 rounded-full border-2 border-default-300"
                  style={{
                    backgroundColor: getPoliticalColor(
                      selectedState.PoliticalLeaning,
                    ),
                  }}
                />
                <span className="text-lg font-bold text-default-700 dark:text-default-300">
                  Political Leaning: {selectedState.PoliticalLeaning}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Economic Card */}
              <div className="p-6 rounded-xl bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100">
                <h3 className="text-xl font-bold text-pastel-blue mb-4 pb-3 border-b border-default-300">
                  Economic
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Median Home:</span>{" "}
                    <strong className="text-foreground">
                      $
                      {formatValue(
                        "MedianHomePrice",
                        selectedState.MedianHomePrice,
                      )}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Income Tax:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue("IncomeTax", selectedState.IncomeTax)}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Sales Tax:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue("SalesTax", selectedState.SalesTax)}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Property Tax:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue(
                        "PropertyTaxes",
                        selectedState.PropertyTaxes,
                      )}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Cost of Living:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.CostOfLiving}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Minimum Wage:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue("MinimumWage", selectedState.MinimumWage)}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Social & Political Card */}
              <div className="p-6 rounded-xl bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100">
                <h3 className="text-xl font-bold text-pastel-pink mb-4 pb-3 border-b border-default-300">
                  Social & Political
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Abortion Laws:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.Abortion}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Gun Laws:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.GunLaws}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Capital Gains Tax:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue(
                        "CapitalGainsTax",
                        selectedState.CapitalGainsTax,
                      )}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Demographics & Environment Card */}
              <div className="p-6 rounded-xl bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100">
                <h3 className="text-xl font-bold text-pastel-orange mb-4 pb-3 border-b border-default-300">
                  Demographics
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Population:</span>{" "}
                    <strong className="text-foreground">
                      {formatValue("Population", selectedState.Population)}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Violent Crimes:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.ViolentCrimes}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Forested Land:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.ForestedLand}%
                    </strong>
                  </p>
                </div>
              </div>

              {/* Education Card */}
              <div className="p-6 rounded-xl bg-default-50 dark:bg-default-100/5 border border-default-200 dark:border-default-100">
                <h3 className="text-xl font-bold text-pastel-green mb-4 pb-3 border-b border-default-300">
                  Education
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">K-12 Rank:</span>{" "}
                    <strong className="text-foreground">
                      #{selectedState.K12SchoolPerformance}
                    </strong>
                  </p>
                  <p className="text-default-600 dark:text-default-400">
                    <span className="font-medium">Higher Ed Rank:</span>{" "}
                    <strong className="text-foreground">
                      #{selectedState.HigherEdSchoolPerformance}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
