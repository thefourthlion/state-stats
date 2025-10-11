import { Metadata } from "next";
import Landing from "../components/Landing";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Compare all 50 US states across taxes, cost of living, politics, education, and more. Make smarter state decisions with data-driven insights and interactive tools.",
  keywords: [
    "compare states",
    "US states comparison",
    "state data",
    "moving calculator",
    "state rankings",
    "cost of living by state",
    "state taxes comparison",
    "best states to live",
  ],
  openGraph: {
    title: "State Analytica - Make Smarter State Decisions",
    description:
      "Compare all 50 US states across taxes, cost of living, politics, education, and more. Find your perfect state with data-driven insights.",
    url: "https://stateanalytica.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "State Analytica - Make Smarter State Decisions",
    description:
      "Compare all 50 US states across taxes, cost of living, politics, and education.",
  },
};

export default function Home() {
  return <Landing />;
}
