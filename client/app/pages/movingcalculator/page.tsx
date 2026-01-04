import React from "react";
import { Metadata } from "next";
import Moving from "../../../components/Moving";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Moving Calculator - Calculate Cost of Moving Between States",
  description:
    "Calculate the financial and lifestyle impact of moving between states. Compare taxes (income, sales, property, capital gains), cost of living, median home prices, political climate, education rankings, crime rates, and more. Free relocation calculator to make informed moving decisions.",
  keywords: [
    "moving calculator",
    "state moving calculator",
    "relocation calculator",
    "moving cost calculator",
    "compare moving costs",
    "state relocation tool",
    "moving financial impact",
    "state to state moving",
    "calculate moving costs",
    "moving between states calculator",
    "relocation cost calculator",
    "state moving comparison",
    "moving financial impact calculator",
    "cost of moving calculator",
    "moving expenses calculator",
    "relocation impact calculator",
    "should I move calculator",
    "moving cost comparison",
    "state relocation impact",
    "moving financial analysis",
    "compare states for moving",
    "moving decision calculator",
  ],
  openGraph: {
    title: "Moving Calculator - Calculate Cost of Moving Between States | State Analytica",
    description:
      "Calculate the financial and lifestyle impact of moving between states. Compare taxes, cost of living, and more to make informed relocation decisions.",
    url: "https://stateanalytica.com/pages/movingcalculator",
    siteName: siteConfig.seo.openGraph.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Moving Calculator - State Analytica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Calculator - Calculate Cost of Moving Between States",
    description:
      "Calculate the financial and lifestyle impact of moving between states. Free relocation calculator.",
    images: [`${siteConfig.url}/og-image.png`],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "https://stateanalytica.com/pages/movingcalculator",
  },
};

const MovingCalculator = () => {
  const movingCalculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Moving Calculator - State Analytica",
    description: "Calculate the financial and lifestyle impact of moving between states.",
    url: "https://stateanalytica.com/pages/movingcalculator",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Moving Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Tax comparison",
        "Cost of living comparison",
        "Home price comparison",
        "Political climate comparison",
        "Education comparison",
        "Crime rate comparison",
      ],
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
          name: "Moving Calculator",
          item: "https://stateanalytica.com/pages/movingcalculator",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movingCalculatorSchema) }}
      />
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
    </>
  );
};

export default MovingCalculator;
