import React from "react";
import { Metadata } from "next";
import Moving from "../../../components/Moving";

export const metadata: Metadata = {
  title: "Moving Calculator",
  description:
    "Calculate the financial and lifestyle impact of moving between states. Compare taxes, cost of living, political climate, education, and more to make informed relocation decisions.",
  keywords: [
    "moving calculator",
    "state moving calculator",
    "relocation calculator",
    "moving cost calculator",
    "compare moving costs",
    "state relocation tool",
    "moving financial impact",
    "state to state moving",
  ],
  openGraph: {
    title: "Moving Calculator - State Analytica",
    description:
      "Calculate the financial and lifestyle impact of moving between states. Compare taxes, cost of living, and more.",
    url: "https://stateanalytica.com/pages/movingcalculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Calculator - State Analytica",
    description:
      "Calculate the financial and lifestyle impact of moving between states.",
  },
};

const MovingCalculator = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="content-header gradient-text">Moving Calculator</h1>
        <p className="text-center text-lg text-default-600 dark:text-default-400 mb-8 max-w-2xl mx-auto">
          Compare two states and see the financial and lifestyle impact of your
          move.
        </p>
        <div className="content-body">
          <Moving />
        </div>
      </div>
    </div>
  );
};

export default MovingCalculator;
