import React from "react";
import { Metadata } from "next";
import Map from "../../../components/Map";

export const metadata: Metadata = {
  title: "Interactive State Map",
  description:
    "Explore an interactive map of the United States. Click on any state to view detailed information including taxes, politics, education, demographics, and more.",
  keywords: [
    "state map",
    "interactive US map",
    "United States map",
    "political map",
    "state information map",
    "US states interactive",
    "state political leaning",
  ],
  openGraph: {
    title: "Interactive State Map - State Analytica",
    description:
      "Explore an interactive map of the United States. Click on any state to view detailed information.",
    url: "https://stateanalytica.com/pages/map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive State Map - State Analytica",
    description:
      "Explore an interactive map of the United States with detailed state information.",
  },
};

const MapPage = () => {
  return (
    <div className="page">
      <div className="container">
        <h1 className="content-header gradient-text">Interactive State Map</h1>
        <p className="text-center text-lg text-default-600 dark:text-default-400 mb-8 max-w-2xl mx-auto">
          Click on any state to view its detailed information and political
          leaning.
        </p>
        <div className="content-body">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
