"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Moving.scss";

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

// User preferences interface
interface UserPreferences {
  fromState: string;
  toState: string;
  income: number;
  houseValue: number;
  minimumWagePreference: "high" | "low";
  abortionStance: "pro-choice" | "pro-life";
  gunStance: "pro-2A" | "pro-gun-laws";
  politicalPreference: "red" | "blue";
  populationPreference: "small-town" | "city";
}

const Moving = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    fromState: "",
    toState: "",
    income: 105000,
    houseValue: 200000,
    minimumWagePreference: "high",
    abortionStance: "pro-choice",
    gunStance: "pro-2A",
    politicalPreference: "red",
    populationPreference: "small-town",
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/states/read`);
      setStates(response.data);

      // Set default states if available
      if (response.data.length > 0) {
        const californiaIndex = response.data.findIndex(
          (state: State) => state.Name === "California"
        );
        const texasIndex = response.data.findIndex(
          (state: State) => state.Name === "Texas"
        );

        setPreferences((prev) => ({
          ...prev,
          fromState:
            californiaIndex >= 0
              ? response.data[californiaIndex].Name
              : response.data[0].Name,
          toState:
            texasIndex >= 0
              ? response.data[texasIndex].Name
              : response.data[1].Name,
        }));
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch states data");
      setLoading(false);
      console.error("Error fetching states:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const getStateByName = (name: string): State | undefined => {
    return states.find((state) => state.Name === name);
  };

  // Get grade value for comparisons (A=4, F=0)
  const getGradeValue = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      "A+": 5,
      A: 4,
      "A-": 3.7,
      "B+": 3.3,
      B: 3,
      "B-": 2.7,
      "C+": 2.3,
      C: 2,
      "C-": 1.7,
      "D+": 1.3,
      D: 1,
      "D-": 0.7,
      F: 0,
    };

    return gradeMap[grade] || 0;
  };

  const getResultClass = (
    category: string,
    fromValue: any,
    toValue: any
  ): string => {
    if (category === "abortion") {
      const fromGrade = getGradeValue(fromValue);
      const toGrade = getGradeValue(toValue);

      if (preferences.abortionStance === "pro-choice") {
        return toGrade >= fromGrade ? "better-result" : "worse-result";
      } else {
        return toGrade <= fromGrade ? "better-result" : "worse-result";
      }
    }

    if (category === "gunLaws") {
      const fromGrade = getGradeValue(fromValue);
      const toGrade = getGradeValue(toValue);

      if (preferences.gunStance === "pro-2A") {
        return toGrade <= fromGrade ? "better-result" : "worse-result";
      } else {
        return toGrade >= fromGrade ? "better-result" : "worse-result";
      }
    }

    if (category === "politicalLeaning") {
      const isRedState = toValue.includes("Red");
      if (preferences.politicalPreference === "red") {
        return isRedState ? "better-result" : "worse-result";
      } else {
        return isRedState ? "worse-result" : "better-result";
      }
    }

    if (category === "minimumWage") {
      if (fromValue === "No state law" || toValue === "No state law") {
        return "neutral-result";
      }

      const fromWage = parseFloat(fromValue);
      const toWage = parseFloat(toValue);

      if (preferences.minimumWagePreference === "high") {
        return toWage >= fromWage ? "better-result" : "worse-result";
      } else {
        return toWage <= fromWage ? "better-result" : "worse-result";
      }
    }

    if (category === "population") {
      const fromPop = parseInt(fromValue);
      const toPop = parseInt(toValue);

      if (preferences.populationPreference === "small-town") {
        return toPop <= fromPop ? "better-result" : "worse-result";
      } else {
        return toPop >= fromPop ? "better-result" : "worse-result";
      }
    }

    return "neutral-result";
  };

  const calculateTaxImpact = (): {
    incomeTax: number;
    salesTax: number;
    propertyTax: number;
    costOfLiving: number;
    total: number;
  } => {
    const fromState = getStateByName(preferences.fromState);
    const toState = getStateByName(preferences.toState);

    if (!fromState || !toState) {
      return {
        incomeTax: 0,
        salesTax: 0,
        propertyTax: 0,
        costOfLiving: 0,
        total: 0,
      };
    }

    // Calculate income tax difference
    const fromIncomeTaxRate = parseFloat(fromState.IncomeTax) / 100;
    const toIncomeTaxRate = parseFloat(toState.IncomeTax) / 100;
    const incomeTaxDiff =
      (fromIncomeTaxRate - toIncomeTaxRate) * preferences.income;

    // Calculate sales tax difference (assuming all income after income tax is spent)
    const fromAfterIncomeTax = preferences.income * (1 - fromIncomeTaxRate);
    const toAfterIncomeTax = preferences.income * (1 - toIncomeTaxRate);

    const fromSalesTaxRate = parseFloat(fromState.SalesTax) / 100;
    const toSalesTaxRate = parseFloat(toState.SalesTax) / 100;

    const fromSalesTax = fromAfterIncomeTax * fromSalesTaxRate;
    const toSalesTax = toAfterIncomeTax * toSalesTaxRate;

    const salesTaxDiff = fromSalesTax - toSalesTax;

    // Calculate property tax difference
    const fromPropertyTaxRate = parseFloat(fromState.PropertyTaxes) / 100;
    const toPropertyTaxRate = parseFloat(toState.PropertyTaxes) / 100;
    const propertyTaxDiff =
      (fromPropertyTaxRate - toPropertyTaxRate) * preferences.houseValue;

    // Calculate cost of living impact
    const fromCostOfLiving = parseFloat(fromState.CostOfLiving);
    const toCostOfLiving = parseFloat(toState.CostOfLiving);
    const costOfLivingDiff = fromCostOfLiving - toCostOfLiving;

    // Apply the 80% assumption - only 80% of income is affected by cost of living differences
    const costOfLivingImpact =
      (costOfLivingDiff / fromCostOfLiving) * (preferences.income * 0.8);

    // Total financial impact
    const totalDiff =
      incomeTaxDiff + salesTaxDiff + propertyTaxDiff + costOfLivingImpact;

    return {
      incomeTax: incomeTaxDiff,
      salesTax: salesTaxDiff,
      propertyTax: propertyTaxDiff,
      costOfLiving: costOfLivingImpact,
      total: totalDiff,
    };
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderResults = () => {
    const fromState = getStateByName(preferences.fromState);
    const toState = getStateByName(preferences.toState);

    if (!fromState || !toState) return null;

    const taxImpact = calculateTaxImpact();

    return (
      <div className="results-container">
        <h2>
          Moving from {fromState.Name} to {toState.Name}
        </h2>

        <div className="financial-impact">
          <h3>Financial Impact (Annual)</h3>
          <div
            className={`impact-item ${taxImpact.incomeTax > 0 ? "positive" : "negative"}`}
          >
            <span>Income Tax Impact:</span>
            <span>{formatCurrency(taxImpact.incomeTax)}</span>
          </div>
          <div
            className={`impact-item ${taxImpact.salesTax > 0 ? "positive" : "negative"}`}
          >
            <span>Sales Tax Impact:</span>
            <span>{formatCurrency(taxImpact.salesTax)}</span>
          </div>
          <div
            className={`impact-item ${taxImpact.propertyTax > 0 ? "positive" : "negative"}`}
          >
            <span>Property Tax Impact:</span>
            <span>{formatCurrency(taxImpact.propertyTax)}</span>
          </div>
          <div
            className={`impact-item ${taxImpact.costOfLiving > 0 ? "positive" : "negative"}`}
          >
            <span>Cost of Living Impact:</span>
            <span>{formatCurrency(taxImpact.costOfLiving)}</span>
          </div>
          <div
            className={`impact-total ${taxImpact.total > 0 ? "positive" : "negative"}`}
          >
            <span>Total Annual Impact:</span>
            <span>{formatCurrency(taxImpact.total)}</span>
          </div>
          {taxImpact.total > 0 ? (
            <p className="impact-summary positive">
              You'll save approximately {formatCurrency(taxImpact.total)} per
              year by moving to {toState.Name}.
            </p>
          ) : (
            <p className="impact-summary negative">
              It will cost you approximately{" "}
              {formatCurrency(Math.abs(taxImpact.total))} more per year to live
              in {toState.Name}.
            </p>
          )}
        </div>

        <div className="preferences-comparison">
          <h3>Your Preferences</h3>
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>{fromState.Name}</th>
                <th>{toState.Name}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={getResultClass(
                  "abortion",
                  fromState.Abortion,
                  toState.Abortion
                )}
              >
                <td>
                  Abortion Laws{" "}
                  {preferences.abortionStance === "pro-choice"
                    ? "(Pro-Choice)"
                    : "(Pro-Life)"}
                </td>
                <td>{fromState.Abortion}</td>
                <td>{toState.Abortion}</td>
              </tr>
              <tr
                className={getResultClass(
                  "gunLaws",
                  fromState.GunLaws,
                  toState.GunLaws
                )}
              >
                <td>
                  Gun Laws{" "}
                  {preferences.gunStance === "pro-2A"
                    ? "(Pro-2A)"
                    : "(Pro-Gun Laws)"}
                </td>
                <td>{fromState.GunLaws}</td>
                <td>{toState.GunLaws}</td>
              </tr>
              <tr
                className={getResultClass(
                  "politicalLeaning",
                  fromState.PoliticalLeaning,
                  toState.PoliticalLeaning
                )}
              >
                <td>
                  Political Leaning{" "}
                  {preferences.politicalPreference === "red"
                    ? "(Red)"
                    : "(Blue)"}
                </td>
                <td>{fromState.PoliticalLeaning}</td>
                <td>{toState.PoliticalLeaning}</td>
              </tr>
              <tr
                className={getResultClass(
                  "minimumWage",
                  fromState.MinimumWage,
                  toState.MinimumWage
                )}
              >
                <td>
                  Minimum Wage{" "}
                  {preferences.minimumWagePreference === "high"
                    ? "(Higher Better)"
                    : "(Lower Better)"}
                </td>
                <td>${fromState.MinimumWage}</td>
                <td>${toState.MinimumWage}</td>
              </tr>
              <tr
                className={getResultClass(
                  "population",
                  fromState.Population,
                  toState.Population
                )}
              >
                <td>
                  Population{" "}
                  {preferences.populationPreference === "small-town"
                    ? "(Small Town)"
                    : "(City Life)"}
                </td>
                <td>{parseInt(fromState.Population).toLocaleString()}</td>
                <td>{parseInt(toState.Population).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Cost of Living Index</td>
                <td>{fromState.CostOfLiving}</td>
                <td
                  className={
                    parseFloat(toState.CostOfLiving) <
                    parseFloat(fromState.CostOfLiving)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  {toState.CostOfLiving}
                </td>
              </tr>
              <tr>
                <td>Income Tax Rate</td>
                <td>{fromState.IncomeTax}%</td>
                <td
                  className={
                    parseFloat(toState.IncomeTax) <=
                    parseFloat(fromState.IncomeTax)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  {toState.IncomeTax}%
                </td>
              </tr>
              <tr>
                <td>Sales Tax</td>
                <td>{fromState.SalesTax}%</td>
                <td
                  className={
                    parseFloat(toState.SalesTax) <=
                    parseFloat(fromState.SalesTax)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  {toState.SalesTax}%
                </td>
              </tr>
              <tr>
                <td>Property Tax Rate</td>
                <td>{fromState.PropertyTaxes}%</td>
                <td
                  className={
                    parseFloat(toState.PropertyTaxes) <=
                    parseFloat(fromState.PropertyTaxes)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  {toState.PropertyTaxes}%
                </td>
              </tr>
              <tr>
                <td>K-12 School Ranking</td>
                <td>#{fromState.K12SchoolPerformance}</td>
                <td
                  className={
                    parseInt(toState.K12SchoolPerformance) <=
                    parseInt(fromState.K12SchoolPerformance)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  #{toState.K12SchoolPerformance}
                </td>
              </tr>
              <tr>
                <td>Higher Ed Ranking</td>
                <td>#{fromState.HigherEdSchoolPerformance}</td>
                <td
                  className={
                    parseInt(toState.HigherEdSchoolPerformance) <=
                    parseInt(fromState.HigherEdSchoolPerformance)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  #{toState.HigherEdSchoolPerformance}
                </td>
              </tr>
              <tr>
                <td>Violent Crime Rate</td>
                <td>{fromState.ViolentCrimes}</td>
                <td
                  className={
                    parseFloat(toState.ViolentCrimes) <=
                    parseFloat(fromState.ViolentCrimes)
                      ? "better-result"
                      : "worse-result"
                  }
                >
                  {toState.ViolentCrimes}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="Moving">
      <div className="container">

        {loading && <p>Loading state data...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <form onSubmit={handleSubmit} className="preferences-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fromState">Moving From:</label>
                  <select
                    id="fromState"
                    name="fromState"
                    value={preferences.fromState}
                    onChange={handleChange}
                    required
                  >
                    {states.map((state) => (
                      <option key={`from-${state._id}`} value={state.Name}>
                        {state.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="toState">Moving To:</label>
                  <select
                    id="toState"
                    name="toState"
                    value={preferences.toState}
                    onChange={handleChange}
                    required
                  >
                    {states.map((state) => (
                      <option key={`to-${state._id}`} value={state.Name}>
                        {state.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="income">Annual Income:</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      id="income"
                      name="income"
                      value={preferences.income}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="houseValue">Ideal House Value:</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      id="houseValue"
                      name="houseValue"
                      value={preferences.houseValue}
                      onChange={handleChange}
                      min="0"
                      step="10000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row preferences-row">
                <div className="preference-group">
                  <span className="preference-label">Minimum Wage:</span>
                  <div className="preference-options">
                    <label
                      className={
                        preferences.minimumWagePreference === "high"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="minimumWagePreference"
                        value="high"
                        checked={preferences.minimumWagePreference === "high"}
                        onChange={handleChange}
                      />
                      Prefer Higher
                    </label>
                    <label
                      className={
                        preferences.minimumWagePreference === "low"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="minimumWagePreference"
                        value="low"
                        checked={preferences.minimumWagePreference === "low"}
                        onChange={handleChange}
                      />
                      Prefer Lower
                    </label>
                  </div>
                </div>

                <div className="preference-group">
                  <span className="preference-label">Abortion Stance:</span>
                  <div className="preference-options">
                    <label
                      className={
                        preferences.abortionStance === "pro-choice"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="abortionStance"
                        value="pro-choice"
                        checked={preferences.abortionStance === "pro-choice"}
                        onChange={handleChange}
                      />
                      Pro-Choice
                    </label>
                    <label
                      className={
                        preferences.abortionStance === "pro-life"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="abortionStance"
                        value="pro-life"
                        checked={preferences.abortionStance === "pro-life"}
                        onChange={handleChange}
                      />
                      Pro-Life
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row preferences-row">
                <div className="preference-group">
                  <span className="preference-label">Gun Laws Stance:</span>
                  <div className="preference-options">
                    <label
                      className={
                        preferences.gunStance === "pro-2A" ? "selected" : ""
                      }
                    >
                      <input
                        type="radio"
                        name="gunStance"
                        value="pro-2A"
                        checked={preferences.gunStance === "pro-2A"}
                        onChange={handleChange}
                      />
                      Pro-2A
                    </label>
                    <label
                      className={
                        preferences.gunStance === "pro-gun-laws"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="gunStance"
                        value="pro-gun-laws"
                        checked={preferences.gunStance === "pro-gun-laws"}
                        onChange={handleChange}
                      />
                      Pro-Gun Laws
                    </label>
                  </div>
                </div>

                <div className="preference-group">
                  <span className="preference-label">Political Leaning:</span>
                  <div className="preference-options">
                    <label
                      className={
                        preferences.politicalPreference === "red"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="politicalPreference"
                        value="red"
                        checked={preferences.politicalPreference === "red"}
                        onChange={handleChange}
                      />
                      Red
                    </label>
                    <label
                      className={
                        preferences.politicalPreference === "blue"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="politicalPreference"
                        value="blue"
                        checked={preferences.politicalPreference === "blue"}
                        onChange={handleChange}
                      />
                      Blue
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row preferences-row">
                <div className="preference-group">
                  <span className="preference-label">
                    Population Preference:
                  </span>
                  <div className="preference-options">
                    <label
                      className={
                        preferences.populationPreference === "small-town"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="populationPreference"
                        value="small-town"
                        checked={
                          preferences.populationPreference === "small-town"
                        }
                        onChange={handleChange}
                      />
                      Small Town
                    </label>
                    <label
                      className={
                        preferences.populationPreference === "city"
                          ? "selected"
                          : ""
                      }
                    >
                      <input
                        type="radio"
                        name="populationPreference"
                        value="city"
                        checked={preferences.populationPreference === "city"}
                        onChange={handleChange}
                      />
                      City Life
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-button">
                Calculate Moving Impact
              </button>
            </form>

            {showResults && renderResults()}
          </>
        )}
      </div>
    </div>
  );
};

export default Moving;
