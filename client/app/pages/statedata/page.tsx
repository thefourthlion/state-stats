import React from "react";
import { Metadata } from "next";
import Spreadsheet from "../../../components/SpreadSheet";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "State Data - Comprehensive Database of All 50 US States",
  description:
    "Explore comprehensive data for all 50 US states in one searchable, sortable table. View taxes (income, sales, property, capital gains), cost of living, median home prices, education rankings, crime rates, demographics, political leaning, gun laws, abortion laws, minimum wage, and more. Free searchable state database.",
  keywords: [
    "state data",
    "US state statistics",
    "state facts",
    "state database",
    "state information",
    "all 50 states data",
    "all 50 states statistics",
    "state rankings",
    "state demographics",
    "state data table",
    "searchable state data",
    "sortable state data",
    "state data spreadsheet",
    "comprehensive state data",
    "state data by category",
    "state tax data",
    "state cost of living data",
    "state education data",
    "state crime data",
    "state political data",
    "complete state information",
    "state facts and figures",
    "US states database",
  ],
  openGraph: {
    title: "State Data - Comprehensive Database of All 50 US States | State Analytica",
    description:
      "Explore comprehensive data for all 50 US states in one searchable, sortable table. View taxes, cost of living, education rankings, crime rates, and more.",
    url: "https://stateanalytica.com/pages/statedata",
    siteName: siteConfig.seo.openGraph.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "State Data - State Analytica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State Data - Comprehensive Database of All 50 US States",
    description:
      "Explore comprehensive data for all 50 US states in one searchable, sortable table.",
    images: [`${siteConfig.url}/og-image.png`],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "https://stateanalytica.com/pages/statedata",
  },
};

const StateData = () => {
  const stateDataSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "State Data - State Analytica",
    description: "Comprehensive database of all 50 US states with searchable, sortable data.",
    url: "https://stateanalytica.com/pages/statedata",
    mainEntity: {
      "@type": "Dataset",
      name: "US State Data",
      description: "Comprehensive data for all 50 US states including taxes, cost of living, education, crime, demographics, and more",
      keywords: "state data, US states, state statistics, state information",
      license: "https://stateanalytica.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://stateanalytica.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "State Data",
          item: "https://stateanalytica.com/pages/statedata",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stateDataSchema) }}
      />
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
    </>
  );
};

export default StateData;
