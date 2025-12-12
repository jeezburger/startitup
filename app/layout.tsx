import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load local Melodrama fonts
const melodrama = localFont({
  src: [
    { path: "../public/fonts/Melodrama-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Melodrama-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Melodrama-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Melodrama-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/Melodrama-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-melodrama",
  display: "swap",
});

// Load Google fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartItUp",
  description: "Your AI startup builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${melodrama.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
