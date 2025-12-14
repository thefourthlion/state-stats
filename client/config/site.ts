export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "State Analytica | Statistics on US States",
  description:
    "Compare states for moving, taxation, cost of living, and political factors with interactive tools and data visualizations.",
  url: "https://stateanalytica.com", // Replace with your actual domain

  // SEO settings
  seo: {
    titleTemplate: "State Analytica",
    defaultTitle:
      "State Analytica - Compare US States for Moving and Relocation",
    defaultDescription:
      "Interactive tools to compare US states by taxes, cost of living, politics, and more to help with relocation decisions.",
    canonical: "https://stateanalytica.com",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "State Analytica",
    },
  },

  // Main site keywords
  keywords: [
    "state comparison",
    "compare states",
    "moving calculator",
    "state taxes",
    "cost of living",
    "state rankings",
    "relocation tools",
    "state data",
    "political leaning",
    "state demographics",
  ],

  // Author information
  author: {
    name: "Everett Deleon",
    website: "https://everettdeleon.com",
    twitter: "@The_FourthLion",
    email: "everettthefourth@gmail.com",
  },

  links: {
    twitter: "https://x.com/The_FourthLion",
    github: "https://github.com/thefourthlion/everettdeleon.com",
    linkedin: "https://www.linkedin.com/in/theforthlion/",
    // Add any other social or important links
  },
};
