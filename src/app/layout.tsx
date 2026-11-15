import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendPulse AI | Enterprise Anomaly Detection Platform",
  description: "AI-powered social media trend anomaly detection & real-time monitoring engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
