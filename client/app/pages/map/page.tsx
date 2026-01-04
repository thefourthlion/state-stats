import React from "react";
import { Metadata } from "next";
import Map from "../../../components/Map";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Interactive State Map - Click Any US State for Detailed Information",
  description:
    "Explore an interactive map of the United States. Click on any state to view detailed information including taxes (income, sales, property, capital gains), cost of living, median home prices, politics, education rankings, crime rates, demographics, gun laws, abortion laws, and more. Free interactive US state map.",
  keywords: [
    "state map",
    "interactive US map",
    "United States map",
    "political map",
    "state information map",
    "US states interactive",
    "state political leaning",
    "interactive state map",
    "clickable state map",
    "US map with state data",
    "state data map",
    "political leaning map",
    "state information by map",
    "interactive state information",
    "US states map tool",
    "state facts map",
    "state statistics map",
    "state comparison map",
    "visual state data",
    "state map tool",
  ],
  openGraph: {
    title: "Interactive State Map - Click Any US State for Detailed Information | State Analytica",
    description:
      "Explore an interactive map of the United States. Click on any state to view detailed information including taxes, politics, education, demographics, and more.",
    url: "https://stateanalytica.com/pages/map",
    siteName: siteConfig.seo.openGraph.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Interactive State Map - State Analytica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive State Map - Click Any US State for Detailed Information",
    description:
      "Explore an interactive map of the United States with detailed state information.",
    images: [`${siteConfig.url}/og-image.png`],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "https://stateanalytica.com/pages/map",
  },
};

const MapPage = () => {
  const mapPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Interactive State Map - State Analytica",
    description: "Interactive map of the United States with detailed state information.",
    url: "https://stateanalytica.com/pages/map",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Interactive State Map",
      applicationCategory: "ReferenceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
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
          name: "Interactive State Map",
          item: "https://stateanalytica.com/pages/map",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapPageSchema) }}
      />
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
    </>
  );
};

export default MapPage;
