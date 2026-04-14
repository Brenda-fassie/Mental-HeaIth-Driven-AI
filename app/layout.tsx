import type { Metadata } from "next";
import { Geist, Geist_Mono, Comfortaa, Gloria_Hallelujah } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

const gloriaHallelujah = Gloria_Hallelujah({
  weight: "400",
  variable: "--font-gloria",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rooftop - Safe Spaces for Support",
  description: "Join secure, peer-led mental health support groups facilitated by AI. Share, connect, and heal together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} ${gloriaHallelujah.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
