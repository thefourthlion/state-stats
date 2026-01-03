import "@/styles/globals.scss";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import AuthRouter from "./authRouter";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.seo.titleTemplate}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.website,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.seo.openGraph.siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "State Analytica - Compare US States",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    creator: siteConfig.author.twitter,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.seo.openGraph.siteName,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.website,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/pages/statedata?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error handler to catch browser extension errors
              window.addEventListener('error', function(event) {
                // Ignore errors from browser extensions (content.js, checkoutUrls, etc.)
                if (event.filename && (
                  event.filename.includes('content.js') ||
                  event.filename.includes('extension') ||
                  event.filename.includes('serviceWorker.js') ||
                  event.filename.includes('background.js') ||
                  event.message && event.message.includes('checkoutUrls')
                )) {
                  event.preventDefault();
                  console.warn('Ignored browser extension error:', event.message);
                  return true;
                }
              });
              
              // Handle unhandled promise rejections from extensions
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  event.reason.message && (
                    event.reason.message.includes('checkoutUrls') ||
                    event.reason.message.includes('Frame with ID') ||
                    event.reason.message.includes('Receiving end does not exist') ||
                    event.reason.message.includes('No tab with id')
                  ) ||
                  event.reason.toString().includes('checkoutUrls')
                )) {
                  event.preventDefault();
                  console.warn('Ignored browser extension promise rejection:', event.reason);
                  return true;
                }
              });
              
              // Ensure page is visible even if there are errors
              (function() {
                if (document.body) {
                  document.body.style.display = 'block';
                  document.body.style.visibility = 'visible';
                  document.body.style.opacity = '1';
                }
                // Diagnostic logging
                console.log('Page loaded, body exists:', !!document.body);
                console.log('React root exists:', !!document.getElementById('__next'));
                console.log('Current URL:', window.location.href);
              })();
              
              // Check if React has hydrated
              window.addEventListener('DOMContentLoaded', function() {
                console.log('DOM Content Loaded');
                setTimeout(function() {
                  const root = document.getElementById('__next');
                  if (!root || root.children.length === 0) {
                    console.error('React root is empty or missing!');
                    // Try to show a fallback message
                    if (document.body) {
                      document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Loading...</h1><p>If this message persists, there may be a JavaScript error. Check the console.</p></div>' + document.body.innerHTML;
                    }
                  } else {
                    console.log('React root has content:', root.children.length, 'children');
                  }
                }, 2000);
              });
            `,
          }}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable,
        )}
      >
        <noscript>
          <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
            <h1>JavaScript Required</h1>
            <p>This application requires JavaScript to function. Please enable JavaScript in your browser.</p>
          </div>
        </noscript>
        <Providers>
          <AuthRouter>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthRouter>
        </Providers>
      </body>
    </html>
  );
}
