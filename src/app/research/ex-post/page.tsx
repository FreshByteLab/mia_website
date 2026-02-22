import type { Metadata } from "next";
import ExPostClient from "@/app/research/ex-post/ExPostClient";

export const metadata: Metadata = {
  title: "Ex-Post Risk & Return Research | Maverick Investment Aperture",
  description:
    "Historical realized risk-return studies with total return, drawdown, rolling volatility, and correlation analytics.",
};

export default function ExPostPage() {
  return <ExPostClient />;
}
