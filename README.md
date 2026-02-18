# Maverick Investment Aperture — Website

Next.js 16 · Tailwind CSS v4 · TypeScript · App Router

---

## The Mark

The MIA logo is a multi-layered symbol. Each element encodes a core investment philosophy:

### 🔵 The Aperture (outer ring)
A camera aperture controls precisely what light — and how much — enters the frame.
In markets: **disciplined, targeted exposure**. We open and close our view with intent, not noise.

### 🐂 The Bull (inner form)
Inside the aperture, the negative space forms the silhouette of a bull.
This signals **constructive conviction**: a fundamentally bullish belief in markets and human ingenuity, expressed through independent, research-driven positions.

### △ The Three Triangles → M · I · A (straddle payoff)
The three triangles simultaneously spell out **M**, **I**, and **A** — and trace the payoff diagram of a **straddle** options strategy.
A straddle profits from large moves in **either direction** — up or down.
This expresses a **volatility-aware, asymmetric** investment approach: we are structured to benefit from decisive market dislocations, not be crushed by them.

### In summary
| Element | Symbol | Philosophy |
|---|---|---|
| Aperture ring | Precision exposure | Controlled, deliberate market access |
| Bull (negative space) | Conviction | Constructive, research-backed positioning |
| Three triangles (M·I·A) | Straddle payoff | Volatility-aware, asymmetric return profile |

---

## Brand

- **Primary colour:** Gold / Amber (logo mark)
- **Background:** Deep navy-dark (`#080c14`) with navy radial gradients
- **Logo variants:**
  - `public/logos/Final.png` — stacked mark, dark bg (website hero)
  - `public/logos/sideward_navy.png` — horizontal, dark bg (navbar)
  - `public/logos/final_small.png` — small horizontal, dark bg (footer)
  - `public/logos/Final_white.png` — stacked, white/transparent (reports, light bg)
  - `public/logos/sideward_white.png` — horizontal, white (light bg)
  - `public/logos/final_small_white.png` — small, white (light bg)

---

## Development

```bash
npm run dev      # start dev server → http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

All site copy and configuration lives in [`src/content/site.ts`](src/content/site.ts).

---

## Structure

```
src/
  app/
    globals.css        # Tailwind v4 theme, dark bg, navy gradients
    layout.tsx         # Fonts: Open Sans + Space Grotesk + Orbitron
    page.tsx
  components/
    Navbar.tsx         # Sticky, blur-on-scroll, intersection-observer nav
    Hero.tsx           # Full-height logo + tagline + CTAs
    About.tsx          # Mission copy + 3 logo-symbol pillars
    Services.tsx       # 3 service cards
    Contact.tsx        # mailto CTA
    Footer.tsx
    ui/                # Button, Container
  content/
    site.ts            # ← edit here to update all copy & config
  lib/
    cn.ts
public/logos/          # All MIA logo variants
```
