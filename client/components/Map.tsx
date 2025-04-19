"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import USAMap from "react-usa-map";
import "../styles/Map.scss";

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

const Map = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [customizeMap, setCustomizeMap] = useState<{[key: string]: {fill: string}}>({}); 

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (states.length > 0) {
      // Create map colors based on political leaning
      const stateColors: {[key: string]: {fill: string}} = {};
      
      states.forEach(state => {
        const stateAbbr = getStateAbbreviation(state.Name);
        if (stateAbbr) {
          stateColors[stateAbbr] = { fill: getPoliticalColor(state.PoliticalLeaning) };
        }
      });
      
      setCustomizeMap(stateColors);
    }
  }, [states]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3002/api/states/read');
      setStates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch states data');
      setLoading(false);
      console.error('Error fetching states:', err);
    }
  };

  // Convert state name to abbreviation
  const getStateAbbreviation = (stateName: string): string => {
    const abbreviations: {[key: string]: string} = {
      "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
      "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
      "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
      "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
      "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
      "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
      "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
      "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
      "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
      "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
      "District of Columbia": "DC"
    };
    
    return abbreviations[stateName] || "";
  };

  // Get state by abbreviation
  const getStateByAbbreviation = (abbreviation: string): State | undefined => {
    const stateAbbreviations: {[key: string]: string} = {
      "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
      "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
      "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
      "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
      "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
      "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
      "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
      "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
      "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
      "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
      "DC": "District of Columbia"
    };
    
    const stateName = stateAbbreviations[abbreviation];
    return states.find(state => state.Name === stateName);
  };

  // Map click handler
  const mapHandler = (event: any) => {
    const stateAbbr = event.target.dataset.name;
    const stateData = getStateByAbbreviation(stateAbbr);
    
    if (stateData) {
      setSelectedState(stateData);
    }
  };

  // Get color based on political leaning
  const getPoliticalColor = (leaning: string): string => {
    switch (leaning) {
      case "Dark Blue": return "#0d47a1";
      case "Blue": return "#0d47a1";
      case "Light Blue": return "#29b6f6";
      case "Purple": return "#673ab7";
      case "Light Red": return "#ef5350";
      case "Red": return "#b71c1c";
      case "Dark Red": return "#b71c1c";
      default: return "#D3D3D3"; // Default gray
    }
  };

  // Format values for display
  const formatValue = (key: string, value: string): string => {
    if (key === 'Population' || key === 'MedianHomePrice') {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 0
      }).format(parseFloat(value));
    }
    if (key === 'IncomeTax' || key === 'SalesTax' || key === 'PropertyTaxes' || key === 'CapitalGainsTax') {
      return `${value}%`;
    }
    if (key === 'MinimumWage' && value !== 'No state law') {
      return `$${value}`;
    }
    return value;
  };

  return (
    <div className="Map">
      <div className="container">
        
        {loading && <div className="loading">Loading map data...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <div className="map-container">
            <div className="us-map">
              <USAMap 
                customize={customizeMap} 
                onClick={mapHandler}
              />
            </div>
            
            <div className="map-legend">
              <h4>Political Leaning</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="color-box dark-blue"></div>
                  <span>Dark Blue</span>
                </div>
                <div className="legend-item">
                  <div className="color-box blue"></div>
                  <span>Blue</span>
                </div>
                <div className="legend-item">
                  <div className="color-box light-blue"></div>
                  <span>Light Blue</span>
                </div>
                <div className="legend-item">
                  <div className="color-box purple"></div>
                  <span>Purple</span>
                </div>
                <div className="legend-item">
                  <div className="color-box light-red"></div>
                  <span>Light Red</span>
                </div>
                <div className="legend-item">
                  <div className="color-box red"></div>
                  <span>Red</span>
                </div>
                <div className="legend-item">
                  <div className="color-box dark-red"></div>
                  <span>Dark Red</span>
                </div>
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
                <p>Median Home: <strong>${formatValue('MedianHomePrice', selectedState.MedianHomePrice)}</strong></p>
                <p>Income Tax: <strong>{formatValue('IncomeTax', selectedState.IncomeTax)}</strong></p>
                <p>Sales Tax: <strong>{formatValue('SalesTax', selectedState.SalesTax)}</strong></p>
                <p>Property Tax: <strong>{formatValue('PropertyTaxes', selectedState.PropertyTaxes)}</strong></p>
                <p>Cost of Living: <strong>{selectedState.CostOfLiving}</strong></p>
                <p>Minimum Wage: <strong>{formatValue('MinimumWage', selectedState.MinimumWage)}</strong></p>
              </div>
              <div className="detail-card">
                <h3>Social & Political</h3>
                <p>Political Leaning: <strong>{selectedState.PoliticalLeaning}</strong></p>
                <p>Abortion Laws: <strong>{selectedState.Abortion}</strong></p>
                <p>Gun Laws: <strong>{selectedState.GunLaws}</strong></p>
              </div>
              <div className="detail-card">
                <h3>Demographics & Environment</h3>
                <p>Population: <strong>{formatValue('Population', selectedState.Population)}</strong></p>
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
