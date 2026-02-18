import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-full border font-semibold text-sm px-6 py-3 transition duration-300 focus-visible:outline-none";

const variants = {
  primary: "bg-white text-ink border-transparent hover:bg-white/90 shadow-lg",
  secondary:
    "border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10",
};

export default function Button({ label, href, variant = "primary", className }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto");
    if (external) {
      return (
        <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {label}
        </a>
      );
    }
    return <Link href={href} className={classes}>{label}</Link>;
  }

  return <button className={classes}>{label}</button>;
}
