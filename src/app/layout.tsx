import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Open_Sans, Orbitron, Space_Grotesk } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maverick Investment Aperture",
  description:
    "Independent conviction. Disciplined execution. Maverick Investment Aperture is an independent investment firm built on contrarian research and rigorous risk management.",
  icons: {
    icon: "/logos/Final_transparent.png",
    shortcut: "/logos/Final_transparent.png",
    apple: "/logos/Final_transparent.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${openSans.variable} ${spaceGrotesk.variable} ${orbitron.variable} bg-midnight font-sans text-platinum antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
