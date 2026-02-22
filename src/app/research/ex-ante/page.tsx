import type { Metadata } from "next";
import ExAnteClient from "@/app/research/ex-ante/ExAnteClient";

export const metadata: Metadata = {
  title: "Ex-Ante CMA Research | Maverick Investment Aperture",
  description:
    "Forward-looking capital market assumptions by universe, currency, hedge ratio, and horizon.",
};

export default function ExAntePage() {
  return <ExAnteClient />;
}
