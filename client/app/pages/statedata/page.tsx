import React from "react";
import { Metadata } from "next";
import Spreadsheet from "../../../components/SpreadSheet";

export const metadata: Metadata = {
  title: "State Data",
  description:
    "Explore comprehensive data for all 50 US states in one searchable, sortable table. View taxes, cost of living, education rankings, crime rates, and more.",
  keywords: [
    "state data",
    "US state statistics",
    "state facts",
    "state database",
    "state information",
    "all 50 states data",
    "state rankings",
    "state demographics",
  ],
  openGraph: {
    title: "State Data - State Analytica",
    description:
      "Explore comprehensive data for all 50 US states in one searchable, sortable table.",
    url: "https://stateanalytica.com/pages/statedata",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "State Data - State Analytica",
    description:
      "Explore comprehensive data for all 50 US states in one searchable, sortable table.",
  },
};

const StateData = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="content-header gradient-text">State Data</h1>
        <p className="text-center text-lg text-default-600 dark:text-default-400 mb-8 max-w-2xl mx-auto">
          Explore comprehensive data for all 50 US states in one searchable,
          sortable table.
        </p>
        <div className="content-body">
          <Spreadsheet />
        </div>
      </div>
    </div>
  );
};

export default StateData;
