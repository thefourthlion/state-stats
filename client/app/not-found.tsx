import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "404 - Page Not Found | State Analytica",
  description: "The page you are looking for does not exist. Return to State Analytica to compare US states, view state data, use our moving calculator, or explore our interactive state map.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-black mb-4 bg-gradient-hero bg-clip-text text-transparent">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-default-600 dark:text-default-400 mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="btn-primary">Go Back Home</button>
          </Link>
          <Link href="/pages/statedata">
            <button className="btn-secondary">View State Data</button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Link href="/pages/comparestates" className="p-4 rounded-lg bg-default-100 dark:bg-default-50/5 border border-default-200 hover:border-pastel-teal transition-all">
            <h3 className="font-bold text-pastel-teal mb-2">Compare States</h3>
            <p className="text-sm text-default-600 dark:text-default-400">Compare up to three states side-by-side</p>
          </Link>
          <Link href="/pages/movingcalculator" className="p-4 rounded-lg bg-default-100 dark:bg-default-50/5 border border-default-200 hover:border-pastel-teal transition-all">
            <h3 className="font-bold text-pastel-teal mb-2">Moving Calculator</h3>
            <p className="text-sm text-default-600 dark:text-default-400">Calculate moving costs between states</p>
          </Link>
          <Link href="/pages/map" className="p-4 rounded-lg bg-default-100 dark:bg-default-50/5 border border-default-200 hover:border-pastel-teal transition-all">
            <h3 className="font-bold text-pastel-teal mb-2">Interactive Map</h3>
            <p className="text-sm text-default-600 dark:text-default-400">Explore states on an interactive map</p>
          </Link>
          <Link href="/pages/statedata" className="p-4 rounded-lg bg-default-100 dark:bg-default-50/5 border border-default-200 hover:border-pastel-teal transition-all">
            <h3 className="font-bold text-pastel-teal mb-2">State Data</h3>
            <p className="text-sm text-default-600 dark:text-default-400">Browse comprehensive state data</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
