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
    const name: string | undefined = geo?.properties?.name;
    let found: State | undefined = name ? byName.get(name) : undefined;

    if (!found) {
      // If the GeoJSON lacks "name" but has a USPS code, try that path.
      const abbr: string | undefined =
        geo?.properties?.postal || geo?.properties?.stusps; // different atlases annotate differently
      if (abbr) found = byAbbr.get(abbr);
      // Last resort: map FIPS to name/abbr if you decide to add that later.
    }

    if (found) setSelectedState(found);
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
            {/* Map Container */}
            <div className="w-full max-w-4xl mx-auto relative">
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
                            default: { outline: "none", fill },
                            hover: {
                              outline: "none",
                              opacity: 0.9,
                              cursor: "pointer",
                            },
                            pressed: { outline: "none", opacity: 0.85 },
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
          <div className="rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-teal/30 p-8 mt-6 shadow-lg">
            <h2 className="text-3xl font-black text-center mb-6 text-pastel-teal">
              {selectedState.Name}
            </h2>
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
                    <span className="font-medium">Political Leaning:</span>{" "}
                    <strong className="text-foreground">
                      {selectedState.PoliticalLeaning}
                    </strong>
                  </p>
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
