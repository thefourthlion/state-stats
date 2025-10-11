"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";

const Landing = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Make Smarter State Decisions
            </h1>
            <p className="text-lg sm:text-xl text-default-600 dark:text-default-400 leading-relaxed mb-10 max-w-3xl mx-auto">
              Compare all 50 US states across taxes, cost of living, politics,
              education, and more. Find your perfect state with data-driven
              insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/pages/comparestates">
                <Button
                  className="w-full sm:w-auto bg-gradient-primary text-white font-semibold px-8 py-6 text-lg hover:opacity-90 transition-all hover:scale-105"
                  size="lg"
                >
                  Compare States Now
                </Button>
              </Link>
              <Link href="/pages/statedata">
                <Button
                  className="w-full sm:w-auto border-2 border-pastel-teal text-pastel-teal hover:bg-pastel-teal/10 font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
                  size="lg"
                  variant="bordered"
                >
                  View All Data
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-teal/20 hover:border-pastel-teal hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-black text-pastel-teal mb-2">
                50
              </div>
              <div className="text-sm uppercase tracking-wider text-default-500">
                States
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-teal/20 hover:border-pastel-teal hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-black text-pastel-teal mb-2">
                16+
              </div>
              <div className="text-sm uppercase tracking-wider text-default-500">
                Data Points
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-teal/20 hover:border-pastel-teal hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-black text-pastel-teal mb-2">
                100%
              </div>
              <div className="text-sm uppercase tracking-wider text-default-500">
                Free
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-pastel-teal mb-4">
              Powerful Tools for Your Decision
            </h2>
            <p className="text-lg text-default-600 dark:text-default-400 max-w-2xl mx-auto">
              Everything you need to make an informed choice about where to live
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link className="group" href="/pages/comparestates">
              <div className="h-full p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 hover:border-pastel-teal hover:shadow-lg hover:shadow-pastel-teal/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  ⚖️
                </div>
                <h3 className="text-2xl font-bold text-pastel-blue mb-4">
                  Compare States
                </h3>
                <p className="text-default-600 dark:text-default-400 mb-6 leading-relaxed flex-grow">
                  Side-by-side comparison of any states with color-coded
                  insights showing which state performs better in each category.
                </p>
                <span className="text-pastel-teal font-bold group-hover:translate-x-2 inline-block transition-transform">
                  Explore →
                </span>
              </div>
            </Link>

            <Link className="group" href="/pages/statedata">
              <div className="h-full p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 hover:border-pastel-teal hover:shadow-lg hover:shadow-pastel-teal/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  📊
                </div>
                <h3 className="text-2xl font-bold text-pastel-blue mb-4">
                  State Data
                </h3>
                <p className="text-default-600 dark:text-default-400 mb-6 leading-relaxed flex-grow">
                  Comprehensive sortable spreadsheet with all 50 states. Sort by
                  any metric to find leaders and laggards.
                </p>
                <span className="text-pastel-teal font-bold group-hover:translate-x-2 inline-block transition-transform">
                  Explore →
                </span>
              </div>
            </Link>

            <Link className="group" href="/pages/movingcalculator">
              <div className="h-full p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 hover:border-pastel-teal hover:shadow-lg hover:shadow-pastel-teal/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  🚚
                </div>
                <h3 className="text-2xl font-bold text-pastel-blue mb-4">
                  Moving Calculator
                </h3>
                <p className="text-default-600 dark:text-default-400 mb-6 leading-relaxed flex-grow">
                  Calculate the financial impact of moving between states
                  including cost of living adjustments and tax differences.
                </p>
                <span className="text-pastel-teal font-bold group-hover:translate-x-2 inline-block transition-transform">
                  Explore →
                </span>
              </div>
            </Link>

            <Link className="group" href="/pages/map">
              <div className="h-full p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-default-200 dark:border-default-100 hover:border-pastel-teal hover:shadow-lg hover:shadow-pastel-teal/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  🗺️
                </div>
                <h3 className="text-2xl font-bold text-pastel-blue mb-4">
                  Interactive Map
                </h3>
                <p className="text-default-600 dark:text-default-400 mb-6 leading-relaxed flex-grow">
                  Visual US map color-coded by political leaning. Click any
                  state for detailed information at a glance.
                </p>
                <span className="text-pastel-teal font-bold group-hover:translate-x-2 inline-block transition-transform">
                  Explore →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Data Categories Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-pastel-blue mb-4">
              Comprehensive State Data
            </h2>
            <p className="text-lg text-default-600 dark:text-default-400">
              We track the metrics that matter most for your relocation decision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-pink/20 hover:border-pastel-pink hover:shadow-lg hover:shadow-pastel-pink/20 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6">💰</div>
              <h4 className="text-2xl font-bold text-pastel-pink mb-6">
                Economic
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Median Home Price</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Income Tax Rates</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Sales Tax</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Property Taxes</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Capital Gains Tax</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Cost of Living Index</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Minimum Wage</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-pink/20 hover:border-pastel-pink hover:shadow-lg hover:shadow-pastel-pink/20 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6">🏛️</div>
              <h4 className="text-2xl font-bold text-pastel-pink mb-6">
                Political & Social
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Political Leaning</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Abortion Laws</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Gun Laws</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Violent Crime Rates</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-pink/20 hover:border-pastel-pink hover:shadow-lg hover:shadow-pastel-pink/20 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6">🎓</div>
              <h4 className="text-2xl font-bold text-pastel-pink mb-6">
                Education
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>K-12 Performance Rankings</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Higher Education Quality</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-default-100 dark:bg-default-50/5 border border-pastel-pink/20 hover:border-pastel-pink hover:shadow-lg hover:shadow-pastel-pink/20 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-6">🌲</div>
              <h4 className="text-2xl font-bold text-pastel-pink mb-6">
                Environment
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Forested Land Percentage</span>
                </li>
                <li className="flex items-start text-default-600 dark:text-default-400">
                  <span className="text-pastel-teal font-bold mr-3">✓</span>
                  <span>Population Density</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-pastel-teal/10 to-pastel-blue/10 border border-pastel-teal/20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Ready to Find Your Perfect State?
            </h2>
            <p className="text-lg sm:text-xl text-default-600 dark:text-default-400 mb-10">
              Start comparing states now with our free, data-driven tools
            </p>
            <Link href="/pages/comparestates">
              <Button
                className="bg-gradient-primary text-white font-semibold px-10 py-7 text-lg hover:opacity-90 transition-all hover:scale-105"
                size="lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
