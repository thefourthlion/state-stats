"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import usTopo from "us-atlas/states-10m.json";
import "../styles/Map.scss";

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
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia"
};

const getPoliticalColor = (leaning: string): string => {
  switch (leaning) {
    case "Dark Blue": return "#0d47a1";
    case "Blue": return "#0d47a1";
    case "Light Blue": return "#29b6f6";
    case "Purple": return "#673ab7";
    case "Light Red": return "#ef5350";
    case "Red": return "#b71c1c";
    case "Dark Red": return "#b71c1c";
    default: return "#D3D3D3";
  }
};

const formatValue = (key: string, value: string): string => {
  if (key === "Population" || key === "MedianHomePrice") {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  }
  if (key === "IncomeTax" || key === "SalesTax" || key === "PropertyTaxes" || key === "CapitalGainsTax") {
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
    const abbr = Object.entries(NAME_BY_ABBR).find(([, n]) => n === s.Name)?.[0];
    if (abbr) idx.set(abbr, s);
  }
  return idx;
}, [states]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/states/read`);
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
    <div className="Map">
      <div className="container">
        {loading && <div className="loading">Loading map data...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="map-container">
            <div className="us-map">
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
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleClick(geo)}
                          style={{
                            default: { outline: "none", fill },
                            hover: { outline: "none", opacity: 0.9 },
                            pressed: { outline: "none", opacity: 0.85 },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>

            <div className="map-legend">
              <h4>Political Leaning</h4>
              <div className="legend-items">
                {[
                  ["dark-blue", "Dark Blue"],
                  ["blue", "Blue"],
                  ["light-blue", "Light Blue"],
                  ["purple", "Purple"],
                  ["light-red", "Light Red"],
                  ["red", "Red"],
                  ["dark-red", "Dark Red"],
                ].map(([cls, label]) => (
                  <div className="legend-item" key={cls}>
                    <div className={`color-box ${cls}`}></div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedState && (
          <div className="state-details">
            <h2>{selectedState.Name}</h2>
            <div className="details-grid">
              <div className="detail-card">
                <h3>Economic</h3>
                <p>Median Home: <strong>${formatValue("MedianHomePrice", selectedState.MedianHomePrice)}</strong></p>
                <p>Income Tax: <strong>{formatValue("IncomeTax", selectedState.IncomeTax)}</strong></p>
                <p>Sales Tax: <strong>{formatValue("SalesTax", selectedState.SalesTax)}</strong></p>
                <p>Property Tax: <strong>{formatValue("PropertyTaxes", selectedState.PropertyTaxes)}</strong></p>
                <p>Cost of Living: <strong>{selectedState.CostOfLiving}</strong></p>
                <p>Minimum Wage: <strong>{formatValue("MinimumWage", selectedState.MinimumWage)}</strong></p>
              </div>
              <div className="detail-card">
                <h3>Social & Political</h3>
                <p>Political Leaning: <strong>{selectedState.PoliticalLeaning}</strong></p>
                <p>Abortion Laws: <strong>{selectedState.Abortion}</strong></p>
                <p>Gun Laws: <strong>{selectedState.GunLaws}</strong></p>
              </div>
              <div className="detail-card">
                <h3>Demographics & Environment</h3>
                <p>Population: <strong>{formatValue("Population", selectedState.Population)}</strong></p>
                <p>Violent Crimes: <strong>{selectedState.ViolentCrimes}</strong></p>
                <p>Forested Land: <strong>{selectedState.ForestedLand}%</strong></p>
              </div>
              <div className="detail-card">
                <h3>Education</h3>
                <p>K-12 Rank: <strong>#{selectedState.K12SchoolPerformance}</strong></p>
                <p>Higher Ed Rank: <strong>#{selectedState.HigherEdSchoolPerformance}</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
