import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dividend Calculator - Calculate Your Dividend Income Instantly",
  description:
    "Find out how much you can earn from dividends with our Dividend Calculator.",
  openGraph: {
    title: "Dividend Calculator - Calculate Your Dividend Income Instantly",
    description:
      "Find out how much you can earn from dividends with our Dividend Calculator.",
    url: "https://shashi.dev/dividend-calculator",
    siteName: "Dividend Calculator",
    images: [
      {
        url: "https://shashi.dev/dividend-calculator/og-image.png", // Update with your actual image URL
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dividend Calculator - Calculate Your Dividend Income Instantly",
    description:
      "Find out how much you can earn from dividends with our Dividend Calculator.",
    images: ["https://shashi.dev/dividend-calculator/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
