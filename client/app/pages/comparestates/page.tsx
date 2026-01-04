import React from "react";
import { Metadata } from "next";
import CompareState from "../../../components/CompareState";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Compare States - Side-by-Side State Comparison Tool",
  description:
    "Compare up to three US states side-by-side across taxes (income, sales, property, capital gains), cost of living, politics, education rankings, crime rates, demographics, gun laws, abortion laws, and more. Free interactive tool to find the best state for your needs.",
  keywords: [
    "compare states",
    "state comparison tool",
    "compare US states",
    "state vs state",
    "side by side state comparison",
    "compare taxes by state",
    "state income tax comparison",
    "state sales tax comparison",
    "property tax comparison",
    "state cost of living comparison",
    "compare state politics",
    "state political comparison",
    "compare state education",
    "state crime rate comparison",
    "compare state demographics",
    "best state comparison",
    "state comparison for moving",
    "compare states before moving",
    "which state is better",
    "state vs state comparison tool",
  ],
  openGraph: {
    title: "Compare States - Side-by-Side State Comparison Tool | State Analytica",
    description:
      "Compare up to three US states side-by-side across taxes, cost of living, politics, education, crime rates, and more. Free interactive tool.",
    url: "https://stateanalytica.com/pages/comparestates",
    siteName: siteConfig.seo.openGraph.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Compare States - State Analytica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare States - Side-by-Side State Comparison Tool",
    description:
      "Compare up to three US states side-by-side across taxes, cost of living, politics, education, and more.",
    images: [`${siteConfig.url}/og-image.png`],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "https://stateanalytica.com/pages/comparestates",
  },
};

const CompareStates = () => {
  const compareStatesSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare States - State Analytica",
    description: "Compare up to three US states side-by-side across taxes, cost of living, politics, education, and more.",
    url: "https://stateanalytica.com/pages/comparestates",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "State Comparison Tool",
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
          name: "Compare States",
          item: "https://stateanalytica.com/pages/comparestates",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareStatesSchema) }}
      />
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
    </>
  );
};

export default CompareStates;
