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
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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

  const handleSort = (column: keyof State) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it as sort column with ascending direction
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Helper function to convert letter grade to numeric value for sorting
  const gradeToNumber = (grade: string): number => {
    const gradeMap: {[key: string]: number} = {
      'A+': 12, 'A': 11, 'A-': 10,
      'B+': 9, 'B': 8, 'B-': 7,
      'C+': 6, 'C': 5, 'C-': 4,
      'D+': 3, 'D': 2, 'D-': 1,
      'F': 0
    };
    
    return gradeMap[grade] !== undefined ? gradeMap[grade] : -1;
  };

  // Helper function to convert political leaning to numeric value for sorting
  const politicalLeaningToNumber = (leaning: string): number => {
    const leaningMap: {[key: string]: number} = {
      'Dark Blue': 0,
      'Blue': 1,
      'Light Blue': 2,
      'Purple': 3,
      'Light Red': 4,
      'Red': 5,
      'Dark Red': 6
    };
    
    return leaningMap[leaning] !== undefined ? leaningMap[leaning] : -1;
  };

  const sortedStates = [...states].sort((a, b) => {
    // For political leaning column
    if (sortColumn === 'PoliticalLeaning') {
      const valueA = politicalLeaningToNumber(a[sortColumn] as string);
      const valueB = politicalLeaningToNumber(b[sortColumn] as string);
      
      if (sortDirection === 'asc') {
        return valueA - valueB; // Ascending: Blue to Red
      } else {
        return valueB - valueA; // Descending: Red to Blue
      }
    }
    
    // For grade columns (Abortion, GunLaws)
    const gradeColumns: (keyof State)[] = ['Abortion', 'GunLaws'];
    
    if (gradeColumns.includes(sortColumn)) {
      const valueA = gradeToNumber(a[sortColumn] as string);
      const valueB = gradeToNumber(b[sortColumn] as string);
      
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
    
    // For numerical columns
    const numericColumns: (keyof State)[] = [
      'MedianHomePrice', 'CapitalGainsTax', 'IncomeTax', 
      'SalesTax', 'PropertyTaxes', 'CostOfLiving', 
      'K12SchoolPerformance', 'HigherEdSchoolPerformance', 
      'ForestedLand', 'MinimumWage', 'Population', 'ViolentCrimes'
    ];

    if (numericColumns.includes(sortColumn)) {
      const valueA = parseFloat(a[sortColumn] as string);
      const valueB = parseFloat(b[sortColumn] as string);
      
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    } else {
      // For text columns, compare as strings
      const valueA = String(a[sortColumn]);
      const valueB = String(b[sortColumn]);
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
  });

  // Define which columns to display (excluding internal fields)
  const displayColumns: (keyof State)[] = [
    'Name', 'MedianHomePrice', 'CapitalGainsTax', 'IncomeTax',
    'SalesTax', 'PropertyTaxes', 'Abortion', 'CostOfLiving',
    'K12SchoolPerformance', 'HigherEdSchoolPerformance', 'ForestedLand',
    'GunLaws', 'MinimumWage', 'Population', 'ViolentCrimes', 'PoliticalLeaning'
  ];

  // Format column headers for display (add spaces between camel case)
  const formatColumnName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  // Determines if a column is sortable
  const isSortableColumn = (column: keyof State) => {
    return [
      'MedianHomePrice', 'CapitalGainsTax', 'IncomeTax', 
      'SalesTax', 'PropertyTaxes', 'CostOfLiving', 
      'K12SchoolPerformance', 'HigherEdSchoolPerformance', 
      'ForestedLand', 'MinimumWage', 'Population', 'ViolentCrimes',
      'Abortion', 'GunLaws', 'PoliticalLeaning' // Added PoliticalLeaning
    ].includes(column);
  };

  // Format the grade for display
  const formatGrade = (grade: string) => {
    // This can be expanded to add styling or other formatting
    return grade;
  };

  // Format political leaning with appropriate color
  const getPoliticalLeaningClass = (leaning: string): string => {
    const classMap: {[key: string]: string} = {
      'Dark Blue': 'dark-blue',
      'Blue': 'blue',
      'Light Blue': 'light-blue',
      'Purple': 'purple',
      'Light Red': 'light-red',
      'Red': 'red',
      'Dark Red': 'dark-red'
    };
    
    return classMap[leaning] || '';
  };

  return (
    <div className="SpreadSheet">
      <div className="container">
        
        {loading && <p>Loading state data...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="row-number">#</th>
                  {displayColumns.map(column => (
                    <th 
                      key={column} 
                      onClick={() => isSortableColumn(column) ? handleSort(column) : null}
                      className={isSortableColumn(column) ? 'sortable' : ''}
                    >
                      {formatColumnName(column)}
                      {isSortableColumn(column) && (
                        <span className="sort-indicator">
                          {sortColumn === column ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStates.map((state, index) => (
                  <tr key={state._id}>
                    <td className="row-number">{index + 1}</td>
                    {displayColumns.map(column => {
                      const value = state[column];
                      let displayValue = value;
                      let customClass = '';
                      
                      // Special formatting for grade columns
                      if (column === 'Abortion' || column === 'GunLaws') {
                        displayValue = formatGrade(value as string);
                        customClass = 'grade-cell';
                      }
                      
                      // Special formatting for political leaning
                      if (column === 'PoliticalLeaning') {
                        customClass = `political-leaning ${getPoliticalLeaningClass(value as string)}`;
                      }
                      
                      return (
                        <td 
                          key={`${state._id}-${column}`}
                          data-label={formatColumnName(column)}
                          className={customClass}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpreadSheet;
