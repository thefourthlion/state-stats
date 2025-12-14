import React from "react";
import { Metadata } from "next";
import CompareState from "../../../components/CompareState";

export const metadata: Metadata = {
  title: "Compare States",
  description:
    "Compare up to three US states side-by-side across taxes, cost of living, politics, education, crime rates, and more. Find the best state for your needs.",
  keywords: [
    "compare states",
    "state comparison tool",
    "compare US states",
    "state vs state",
    "compare taxes by state",
    "state cost of living comparison",
    "compare state politics",
  ],
  openGraph: {
    title: "Compare States - State Analytica",
    description:
      "Compare up to three US states side-by-side across taxes, cost of living, politics, education, and more.",
    url: "https://stateanalytica.com/pages/comparestates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare States - State Analytica",
    description:
      "Compare up to three US states side-by-side across taxes, cost of living, politics, and education.",
  },
};

const CompareStates = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="content-header gradient-text">Compare States</h1>
        <p className="text-center text-lg text-default-600 dark:text-default-400 mb-8 max-w-2xl mx-auto">
          Select up to three states to compare across taxes, cost of living,
          politics, and more.
        </p>
        <div className="content-body">
          <CompareState />
        </div>
      </div>
    </div>
  );
};

export default CompareStates;
