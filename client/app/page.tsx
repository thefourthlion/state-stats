import { Metadata } from "next";
import Landing from "../components/Landing";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Compare all 50 US states with comprehensive data on taxes, cost of living, politics, education, crime rates, and demographics. Free interactive tools including state comparison, moving calculator, interactive map, and searchable state database to help you make smarter relocation decisions.",
  keywords: [
    "compare US states",
    "state comparison tool",
    "compare states",
    "US state comparison",
    "state data",
    "state statistics",
    "moving calculator",
    "relocation calculator",
    "state moving calculator",
    "best state to move to",
    "best states to live",
    "where to move",
    "state taxes comparison",
    "compare state taxes",
    "state income tax",
    "cost of living by state",
    "cost of living comparison",
    "cheapest states to live",
    "state political leaning",
    "best states for education",
    "state education rankings",
    "state demographics",
    "state crime rates",
    "safest states",
    "state rankings",
    "state facts",
    "all 50 states data",
    "interactive state map",
    "state comparison for moving",
    "which state should I move to",
  ],
  openGraph: {
    title: "State Analytica - Compare US States: Taxes, Cost of Living & More",
    description:
      "Compare all 50 US states with comprehensive data on taxes, cost of living, politics, education, crime rates, and demographics. Free interactive tools to help you make smarter relocation decisions.",
    url: "https://stateanalytica.com",
    siteName: siteConfig.seo.openGraph.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "State Analytica - Compare US States",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State Analytica - Compare US States: Taxes, Cost of Living & More",
    description:
      "Compare all 50 US states with comprehensive data on taxes, cost of living, politics, education, and more. Free interactive tools.",
    images: [`${siteConfig.url}/og-image.png`],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "https://stateanalytica.com",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function Home() {
  // Add structured data for homepage
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "State Analytica - Compare US States",
    description: siteConfig.description,
    url: siteConfig.url,
    mainEntity: {
      "@type": "WebApplication",
      name: "State Analytica",
      applicationCategory: "ReferenceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "State comparison tool",
        "Moving calculator",
        "Interactive state map",
        "Searchable state database",
        "Tax comparison",
        "Cost of living data",
        "Education rankings",
        "Crime statistics",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <Landing />
    </>
  );
}
