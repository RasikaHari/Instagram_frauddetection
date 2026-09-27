import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InstaTrust – AI Instagram Fraud Analyzer",
  description: "Detect potentially fraudulent Instagram accounts with professional-grade AI analytics and fraud probability scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased bg-[#09090b] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
