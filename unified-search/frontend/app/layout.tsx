import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Local instrument serif font (place your .ttf/woff2 in src/fonts/)
export const instrument = localFont({
  src: [{ path: "../src/fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "komo",
  description: "get into it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
