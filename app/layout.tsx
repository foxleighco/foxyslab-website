import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foxyslab.com"),
  title: "Foxy's Lab | Smart Home & Tech Education",
  description: "Join Foxy's Lab for expert tutorials on smart home technology, home automation, and tech education. Learn, build, and automate with confidence.",
  keywords: ["smart home", "home automation", "tech education", "YouTube", "tutorials", "IoT"],
  authors: [{ name: "Foxy's Lab" }],
  creator: "Foxy's Lab",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foxyslab.com",
    siteName: "Foxy's Lab",
    title: "Foxy's Lab | Smart Home & Tech Education",
    description: "Expert tutorials on smart home technology and tech education",
    images: [
      {
        url: "/images/foxys-lab-logo-round.png",
        width: 1200,
        height: 630,
        alt: "Foxy's Lab Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foxy's Lab | Smart Home & Tech Education",
    description: "Expert tutorials on smart home technology and tech education",
    images: ["/images/foxys-lab-logo-round.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebsiteSchema()),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
