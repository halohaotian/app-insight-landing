import type { Metadata } from "next";
import localFont from "next/font/local";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AppInsight - AI-Powered App Review Analysis & Requirement Mining",
  description: "Discover real user needs from app store reviews using AI. Extract pain points, cluster requirements, and prioritize features automatically.",
  metadataBase: new URL("https://appinsight.site"),
  alternates: { canonical: "https://appinsight.site" },
  openGraph: {
    title: "AppInsight - AI-Powered App Review Analysis & Requirement Mining",
    description: "Discover real user needs from app store reviews using AI.",
    url: "https://appinsight.site",
    siteName: "AppInsight",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
