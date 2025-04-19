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
  'MedianHomePrice', 
  'CapitalGainsTax', 
  'IncomeTax', 
  'SalesTax', 
  'PropertyTaxes',
  'CostOfLiving',
  'Population', 
  'ViolentCrimes'
];

// Define metrics where higher is better
const higherIsBetter = [
  'K12SchoolPerformance', 
  'HigherEdSchoolPerformance', 
  'ForestedLand',
  'MinimumWage'
];

const CompareStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>(["California", "Texas"]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates();
  }, []);

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

  // Get a state object by name
  const getStateByName = (name: string): State | undefined => {
    return states.find(state => state.Name === name);
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
    const availableState = states.find(state => !selectedStates.includes(state.Name));
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
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Determine if a value is better compared to others for the specific metric
  const isBetterValue = (metric: keyof State, value: string, comparisonValues: string[]): boolean => {
    if (!value || value === "No state law") return false;
    
    // For minimum wage that might be "No state law"
    if (metric === 'MinimumWage' && value === "No state law") return false;
    
    const numericValue = parseFloat(value);
    const numericComparisonValues = comparisonValues
      .filter(val => val !== "No state law" && val !== "")
      .map(val => parseFloat(val));
    
    if (isNaN(numericValue) || numericComparisonValues.some(v => isNaN(v))) {
      return false;
    }
    
    if (lowerIsBetter.includes(metric as string)) {
      return numericValue === Math.min(numericValue, ...numericComparisonValues);
    }
    
    if (higherIsBetter.includes(metric as string)) {
      return numericValue === Math.max(numericValue, ...numericComparisonValues);
    }
    
    return false;
  };

  // Determine cell class based on comparison
  const getCellClass = (metric: keyof State, value: string, comparisonValues: string[]): string => {
    if (!lowerIsBetter.includes(metric as string) && !higherIsBetter.includes(metric as string)) {
      return '';
    }
    
    const isSpecialCase = metric === 'MinimumWage' && value === "No state law";
    
    if (isSpecialCase) return 'worse-value';
    
    if (isBetterValue(metric, value, comparisonValues)) {
      return 'better-value';
    } else {
      return 'worse-value';
    }
  };

  // The metrics we want to display
  const displayMetrics: (keyof State)[] = [
    'MedianHomePrice', 'CapitalGainsTax', 'IncomeTax', 'SalesTax', 'PropertyTaxes',
    'CostOfLiving', 'K12SchoolPerformance', 'HigherEdSchoolPerformance', 
    'ForestedLand', 'MinimumWage', 'Population', 'ViolentCrimes',
    'PoliticalLeaning', 'Abortion', 'GunLaws'
  ];

  // Format value for display
  const formatValue = (metric: keyof State, value: string): string => {
    if (value === "No state law") return value;
    
    // Add $ to monetary values
    if (['MedianHomePrice', 'MinimumWage'].includes(metric as string)) {
      const numValue = parseFloat(value);
      return !isNaN(numValue) ? `$${numValue.toLocaleString()}` : value;
    }
    
    // Add % to tax and percentage values
    if (['CapitalGainsTax', 'IncomeTax', 'SalesTax', 'PropertyTaxes'].includes(metric as string)) {
      return `${value}%`;
    }
    
    return value;
  };

  return (
    <div className="CompareStates">
      <div className="container">
        
        {loading && <p>Loading state data...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && (
          <div className="comparison-container">
            <div className="state-selectors">
              {selectedStates.map((stateName, index) => (
                <div key={index} className="state-selector">
                  <select 
                    value={stateName}
                    onChange={(e) => handleStateSelect(index, e.target.value)}
                  >
                    {states.map(state => (
                      <option 
                        key={state._id} 
                        value={state.Name}
                      >
                        {state.Name}
                      </option>
                    ))}
                  </select>
                  {selectedStates.length > 2 && (
                    <button 
                      className="remove-state" 
                      onClick={() => removeState(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button className="add-state" onClick={addStateToCompare}>
                + Add State
              </button>
            </div>
            
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    {selectedStates.map((stateName, index) => (
                      <th key={index}>{stateName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayMetrics.map(metric => {
                    // Get all values for this metric
                    const metricValues = selectedStates.map(stateName => {
                      const state = getStateByName(stateName);
                      return state ? state[metric] as string : '';
                    });
                    
                    return (
                      <tr key={metric as string}>
                        <td className="metric-name">{formatColumnName(metric as string)}</td>
                        {selectedStates.map((stateName, index) => {
                          const state = getStateByName(stateName);
                          const value = state ? state[metric] as string : '';
                          
                          // Get all other values for comparison
                          const otherValues = metricValues.filter((_, i) => i !== index);
                          
                          return (
                            <td 
                              key={index}
                              className={getCellClass(metric, value, otherValues)}
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
