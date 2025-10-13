"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import usTopo from "us-atlas/states-10m.json";

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

  // TopoJSON -> GeoJSON
  const geoStates = useMemo(() => {
    // usTopo.objects.states contains features with properties: { name, abbr? }
    // us-atlas states-10m uses FIPS IDs; we'll rely on properties.name for joins.
    // Some builds don't ship "name" — fallback to mapping by postal abbr via a helper if needed.
    const geoJson = feature(usTopo as any, (usTopo as any).objects.states);
    return geoJson ? [geoJson] : [];
  }, []);

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
        setStates(response.data);
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
    console.log("🗺️ Clicked geo:", geo);
    console.log("📍 Properties:", geo?.properties);
    console.log("🏛️ States loaded:", states.length);
    
    const name: string | undefined = geo?.properties?.name;
    console.log("🔍 Looking for:", name);
    
    let found: State | undefined = name ? byName.get(name) : undefined;

    if (!found) {
      // If the GeoJSON lacks "name" but has a USPS code, try that path.
      const abbr: string | undefined =
        geo?.properties?.postal || geo?.properties?.stusps; // different atlases annotate differently
      console.log("🔤 Trying abbr:", abbr);
      if (abbr) found = byAbbr.get(abbr);

      // Try matching by ID (some atlases use state FIPS codes)
      if (!found && geo?.id) {
        console.log("🆔 Trying ID:", geo.id);
        const matchedState = states.find((s) => {
          // Try to match by any available identifier
          return (
            s.Name === name ||
            Object.entries(NAME_BY_ABBR).find(
              ([_abbr, fullName]) => fullName === s.Name,
            )?.[0] === _abbr
          );
        });
        if (matchedState) found = matchedState;
      }
    }

    console.log(found ? `✅ Found: ${found.Name}` : "❌ Not found!");
    
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
        
        {/* Debug Info */}
        {!loading && !error && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm">
            <strong>Debug Info:</strong> Loaded {states.length} states | 
            ByName has {byName.size} entries | 
            ByAbbr has {byAbbr.size} entries |
            {selectedState ? ` Selected: ${selectedState.Name}` : ' No state selected'}
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
                <Geographies geography={geoStates}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const name: string | undefined = geo?.properties?.name;
                      const abbr: string | undefined =
                        geo?.properties?.postal || geo?.properties?.stusps;
                      const stateData =
                        (name && byName.get(name)) ||
                        (abbr && byAbbr.get(abbr)) ||
                        null;

                      const fill = stateData
                        ? getPoliticalColor(stateData.PoliticalLeaning)
                        : "#D3D3D3";

                      return (
                        <Geography
                          geography={geo}
                          key={geo.rsmKey}
                          onClick={() => handleClick(geo)}
                          style={{
                            default: {
                              fill,
                              stroke: "#FFFFFF",
                              strokeWidth: 0.75,
                              outline: "none",
                            },
                            hover: {
                              fill,
                              stroke: "#78BFB8",
                              strokeWidth: 2,
                              cursor: "pointer",
                              outline: "none",
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
                    })
                  }
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
