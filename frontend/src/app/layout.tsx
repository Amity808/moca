import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AirKitProvider } from "@/components/AirKitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FanVerify - Verified Fans, Authentic Experiences, Zero Scalping",
  description: "Revolutionary fan verification platform that eliminates scalping through cryptographic verification while creating exclusive perks for genuine fans.",
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
        <AirKitProvider>
          {children}
        </AirKitProvider>
      </body>
    </html>
  );
}
