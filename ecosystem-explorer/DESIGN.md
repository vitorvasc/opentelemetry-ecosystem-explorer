# Design System

This document outlines the design principles, patterns, and tokens used in the OpenTelemetry Ecosystem Explorer. It serves as a guide for AI agents and developers working on UI elements to ensure visual consistency and quality.

> **v1 update (2026-04):** the explorer is being aligned with [opentelemetry.io](https://opentelemetry.io). The site should feel like a sub-product of the OTel project, not a separate microsite. This guide reflects that alignment — see "Alignment with opentelemetry.io" at the bottom for the source-of-truth references.

## Overview

The Ecosystem Explorer mirrors the visual language of opentelemetry.io: a Bootstrap-5-flavored layout with light + dark theming, an always-dark navbar, OTel brand purple/orange/yellow accents, and the Docsy-derived chrome (`td-*` patterns) translated into our Tailwind v4 stack.

The design emphasizes:

- **Continuity with opentelemetry.io** — same nav, footer, hero, type, and brand colors so visitors feel they're inside the same project
- **Light and dark parity** — every component must work in both themes; the theme toggle is part of the navbar
- **Clarity first** — clear information hierarchy through color, spacing, and typography
- **Consistent motion** — unified animation timing and easing
- **Accessibility** — WCAG AA compliance with proper contrast and semantic markup

---

## Design Principles

### 1. Stay Visually Continuous With opentelemetry.io

A user clicking from `opentelemetry.io/ecosystem/` to the Explorer should not feel they have left the site. That means: same logo lockup, same dark navbar, same primary buttons, same footer layout, same purple `#4f62ad` accent. Diverge only where the explorer needs richer interactivity (filters, three-pane detail) than the static Hugo site supports.

### 2. Light + Dark Parity

Every page must render correctly in both light and dark themes. The navbar is always dark (matching opentelemetry.io). The body switches between a light surface (`#ffffff` / `#f8f9fa`) and a dark surface (`#0b0d12` / `#11141b`) based on `data-bs-theme`. Pick tokens, not hardcoded colors.

### 3. Clarity First

Information hierarchy guides users naturally:

- Primary actions use OTel orange/yellow (`--color-primary`)
- Secondary or branding accents use OTel purple (`--color-secondary`)
- Background elements recede through lower contrast
- Whitespace provides visual breathing room

### 4. Consistent Motion

All animations follow a unified timing system:

- Default transition: `200ms ease-in-out` (matches Bootstrap defaults)
- Micro-interactions: `150ms ease-out`
- Complex animations: `300ms ease-in-out`
- Use `transform` and `opacity` for performant animations
- Honor `prefers-reduced-motion`

---

## Color System

### Brand Tokens (aligned with opentelemetry.io)

opentelemetry.io exposes these colors via meta tags and stylesheets:

| Token | Source | Hex |
|---|---|---|
| OTel Purple (brand) | `<meta name=theme-color>`, `mask-icon`, `msapplication-TileColor` | `#4f62ad` |
| OTel Orange/Yellow (accent) | Logo gradient end stop, kapa `data-project-color` | `#f5a800` |
| Light surface | Default page bg | `#ffffff` |
| Dark surface | `prefers-color-scheme: dark` page bg | `#0b0d12` |
| Light text | Default | near-black |
| Dark text | dark mode | `#e6e6e6` |

### CSS Custom Properties

All colors are defined in `src/themes.ts` and applied as CSS custom properties. **HSL is preferred** so we can derive variants with opacity:

```css
/* Brand */
--color-primary: 38 95% 52%;        /* OTel orange/yellow #f5a800 */
--color-primary-foreground: 0 0% 0%;
--color-secondary: 230 38% 49%;     /* OTel purple #4f62ad */
--color-secondary-foreground: 0 0% 100%;

/* Light theme (default) */
--color-background: 0 0% 100%;      /* #ffffff */
--color-foreground: 220 13% 15%;    /* near-black */
--color-card: 210 17% 98%;          /* #f8f9fa surface */
--color-card-secondary: 210 14% 95%;
--color-muted: 210 14% 92%;
--color-muted-foreground: 220 9% 40%;
--color-border: 210 14% 88%;

/* Dark theme — applied via [data-bs-theme="dark"] */
[data-bs-theme="dark"] {
  --color-background: 222 25% 6%;     /* #0b0d12 */
  --color-foreground: 0 0% 90%;       /* #e6e6e6 */
  --color-card: 222 23% 9%;           /* #11141b */
  --color-card-secondary: 222 22% 13%;
  --color-muted: 222 22% 11%;
  --color-muted-foreground: 220 14% 65%;
  --color-border: 222 18% 22%;
}

/* Always-dark navbar — matches opentelemetry.io */
.navbar-otel {
  --color-background: 222 25% 6%;
  --color-foreground: 0 0% 95%;
}
```

### Semantic Tokens

```css
--color-success: 145 63% 42%;   /* stable */
--color-info: 200 85% 45%;      /* beta / informational */
--color-warning: 38 95% 52%;    /* alpha — uses brand orange */
--color-error: 0 70% 50%;       /* deprecated / unmaintained */
```

### Usage Guidelines

#### Primary (OTel Orange/Yellow `#f5a800`)

- Primary CTAs (matches `btn btn-primary` in opentelemetry.io)
- The "alpha" stability pill
- Highlight accents in stats and gradient text

#### Secondary (OTel Purple `#4f62ad`)

- Branded surfaces (the `td-box--primary` stats band on opentelemetry.io is purple — we should match)
- Hero background tint and gradient stops
- Secondary buttons in dark mode (`btn btn-secondary`)
- Iconography for ecosystem cards

#### Background Layers

- `background` — page base (light or dark depending on theme)
- `card` — elevated surfaces
- `card-secondary` — hover states and nested cards
- `muted` — table-row striping, code chips, type badges
- `border` — dividers and outlines

#### Text Hierarchy

- `foreground` — primary text (headings, body)
- `muted-foreground` — secondary text (captions, labels)
- Lower opacity variants — tertiary text

---

## Typography

### Font Stack

Match opentelemetry.io: a sans serif for UI, mono for code. The site uses the Bootstrap/Docsy default (system stack), so we use the same:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* code */
```

### Size Scale

Use the Bootstrap display scale for hero text, then a tighter Tailwind scale for body. Don't invent new sizes.

| Use | Size | Weight |
|---|---|---|
| Hero headline (matches `display-4` / `display-6`) | 3rem–3.75rem | 600 |
| Page title (matches `h1`) | 2.25rem | 700 |
| Section heading (`h2`) | 1.75rem | 700 |
| Subsection (`h3`) | 1.25rem | 600 |
| Body | 1rem | 400 |
| Small / muted (`small`) | 0.875rem | 400 |
| Eyebrow / pill | 0.75rem uppercase tracking-widest | 600 |

### Weight Conventions

- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text, labels
- `font-semibold` (600): Subheadings, buttons
- `font-bold` (700): Primary headings

---

## Layout Primitives (mirroring Docsy)

The Hugo Docsy theme on opentelemetry.io uses these structural classes. We re-implement them in Tailwind so that templates feel familiar to anyone moving between codebases.

| Docsy class | Our equivalent | Purpose |
|---|---|---|
| `td-navbar` | `<header class="navbar-otel">` | Always-dark top navbar with logo + nav + search + lang + theme toggle |
| `td-cover-block` | `<section class="cover-block">` | Hero with dark overlay over a background image |
| `td-box td-box--white` | `<section class="box-light">` | Light-surface section |
| `td-box td-box--primary` | `<section class="box-primary">` | OTel purple-tinted feature band (e.g. ecosystem stats) |
| `td-box td-box--secondary` | `<section class="box-muted">` | Subtle gray section (e.g. CNCF callout) |
| `td-footer` | `<footer class="footer-otel">` | Two-cluster social icons + copyright |
| `td-content` | `<main class="content-area">` | Page content max-width container |

### Navbar pattern

Always dark, full-width, sticky. From left to right:

1. Logo lockup (svg + "OpenTelemetry" wordmark) — links to `opentelemetry.io`
2. Nav links: Docs · Ecosystem · Status · Community · Training · Blog · **Explorer (new)**
3. Search input ("Ask AI or search…", ⌘K shortcut)
4. Language dropdown (matches opentelemetry.io's 10-language list)
5. Theme toggle (Light / Dark / Auto)

For the explorer specifically, we add a sub-nav directly under the main navbar with breadcrumbs and explorer-specific actions (filters, view density, etc.).

### Hero pattern

```html
<section class="cover-block bg-overlay-dark">
  <img class="cover-bg" src="hero-background.png" alt="" />
  <div class="cover-content">
    <img src="opentelemetry-horizontal-color.svg" class="otel-logo" />
    <p class="display-6">Navigate the OpenTelemetry ecosystem</p>
    <div class="cta-buttons">
      <a class="btn btn-lg btn-primary">Browse components</a>
      <a class="btn btn-lg btn-secondary">Read overview</a>
    </div>
  </div>
</section>
```

### Footer pattern

Two clusters of social icons (left: mailing lists / Bluesky / Mastodon / SO / logos / meetings / analytics; right: GitHub / Slack / DevStats / privacy / trademark / marketing / build-info), centered copyright between them. Use Font Awesome icons to match opentelemetry.io exactly.

### CNCF callout

Every page closes with a `box-muted` section quoting:

> **OpenTelemetry is a CNCF incubating project.** Formed through a merger of the OpenTracing and OpenCensus projects.

Followed by the CNCF logo. This is non-negotiable — opentelemetry.io shows it on every page and we need to match.

---

## Component Patterns

### Buttons

Follow Bootstrap 5 conventions used by opentelemetry.io:

**Primary** (OTel orange):
```tsx
<button className="btn btn-primary">Browse components</button>
```

**Secondary** (outline in light, filled purple in dark):
```tsx
<button className="btn btn-secondary">Read overview</button>
```

**Outline** (for filter chips, "Reset"):
```tsx
<button className="btn btn-outline-success">Submit</button>
<button className="btn btn-outline-danger">Reset</button>
```

Sizes: `btn-sm`, default, `btn-lg`. Match opentelemetry.io which uses `btn-lg` in heroes.

### Cards

opentelemetry.io's registry page uses Bootstrap `.card` with optional `border-success` / `border-warning` for status. Mirror that:

```tsx
<div className="card registry-entry border-success">
  <div className="card-body">
    <h4 className="card-title">Component name</h4>
    <p className="card-text"><small className="text-muted">by Author</small></p>
    <div className="card-tags">
      <span className="badge text-bg-primary me-1">tag</span>
    </div>
    <ul className="list-group list-group-flush">
      <li className="list-group-item"><strong>Receiver</strong><small>Component</small></li>
    </ul>
  </div>
</div>
```

For richer card interactions in the explorer (which is JS-driven, unlike the static Hugo registry), augment the base card with:
- A 4px left-edge **type stripe** (receiver=info, processor=purple, exporter=primary, connector=pink, extension=success)
- Hover state: `card-secondary` background + subtle `box-shadow` + `transform: scale(1.01)`

### Badges

Use Bootstrap's `text-bg-*` utilities to match opentelemetry.io exactly:

| Meaning | Class |
|---|---|
| Stable | `badge text-bg-success rounded-pill` |
| Beta | `badge text-bg-info rounded-pill` |
| Alpha | `badge text-bg-warning rounded-pill` |
| Deprecated/unmaintained | `badge text-bg-danger rounded-pill` |
| Tag pill | `badge text-bg-primary rounded-pill` |
| Type label | `badge text-bg-secondary rounded-pill` |

### Stats Section (matches `ecosystem-stats-section`)

This is the canonical "by the numbers" pattern on opentelemetry.io. Reuse it.

```html
<section class="box-primary">
  <h2>The OpenTelemetry Ecosystem</h2>
  <div class="ecosystem-stats">
    <div class="ecosystem-stat">
      <div class="ecosystem-stat__number">200+</div>
      <div class="ecosystem-stat__label">Collector Components</div>
    </div>
    ...
  </div>
</section>
```

**Canonical numbers (sync with opentelemetry.io):**
- 12+ Languages
- 200+ Collector Components
- 1005+ Integrations
- 102+ Vendors

The explorer's stats should match these exactly so users don't see two different counts on sister pages.

### Signal Cards

opentelemetry.io shows four signal cards on the home page: **Traces · Metrics · Logs · Baggage**. We had originally shown "Profiles" — switch to **Baggage** to match. Profiles can return when the spec stabilizes and opentelemetry.io adopts it.

### Inline Code Elements

```tsx
<code className="bg-muted text-foreground/80 rounded px-2 py-1 text-sm font-mono">{value}</code>
```

### Striped Tables

Apply `bg-muted/40` to odd rows. Use Bootstrap-style `table-striped` semantics for consistency.

```tsx
<div className="border-border/30 overflow-hidden rounded-lg border">
  <table className="table table-sm">
    <thead className="bg-light">
      <tr><th>Key</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={item.id} className={index % 2 === 1 ? "bg-muted/40" : ""}>
          <td className="p-4">{item.content}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Status & Stability Pill Mapping (locked)

This is the source-of-truth mapping. Use it everywhere — list rows, detail headers, version timelines.

| Lifecycle | Color | Class | Border |
|---|---|---|---|
| Stable | green | `text-bg-success` | `border-success` |
| Beta | blue | `text-bg-info` | `border-info` |
| Alpha / Development | orange (brand) | `text-bg-warning` | `border-warning` |
| Deprecated / Unmaintained | red | `text-bg-danger` | `border-danger` |
| Experimental / Preview | purple | `text-bg-primary-otel` | `border-primary-otel` |

---

## Type Stripe Mapping (collector components)

A 4px left-edge stripe on every component card/row:

| Component type | Color |
|---|---|
| Receiver | OTel info blue |
| Processor | Purple `#7c3aed` |
| Exporter | OTel orange |
| Connector | Pink `#db2777` |
| Extension | Teal `#14b8a6` |

This makes type perceivable in peripheral vision without uppercase badges competing for visual weight.

---

## Animation Guidelines

### Timing Functions

```css
ease-out     /* Element entering (150ms) */
ease-in-out  /* Default (200ms) */
ease-in      /* Element exiting (150ms) */
```

### Common Patterns

**Fade in:** `animate-in fade-in duration-200`
**Slide up:** `animate-in slide-in-from-bottom-2 duration-200`
**Scale on hover:** `transition-transform duration-150 hover:scale-[1.01]`
**Theme transition:** disable transitions during theme switch (see opentelemetry.io's `[data-theme-init] *{transition:none!important}`)

---

## Spacing System

Use Tailwind's spacing scale, but pick values that match Bootstrap defaults so the page feels Docsy-flavored:

- **Section padding:** `py-12` to `py-16` (matches Bootstrap `py-5`)
- **Container max-width:** `max-w-[1320px]` (Bootstrap `container-xl`) for content, `max-w-7xl` (1280px) for narrower text-heavy pages
- **Card padding:** `p-4` to `p-6`
- **Gap between cards:** `gap-3` to `gap-4`

---

## Accessibility

All components must follow accessibility best practices as outlined in `AGENTS.md`. Specifically:

- Semantic HTML (`<nav>`, `<main>`, `<aside>`, `<article>`)
- ARIA labels for icon-only buttons (theme toggle, language menu, social icons)
- `aria-pressed` for toggle buttons
- Visible focus indicators (use Bootstrap's `:focus-visible` ring)
- WCAG AA contrast: 4.5:1 for body text, 3:1 for UI elements — verify in **both** themes
- Theme toggle must respect `prefers-color-scheme` and persist to `localStorage` under the `td-color-theme` key (matching opentelemetry.io)
- All interactive cards must be keyboard-navigable (`<a>` or `<button>`, never `<div onclick>`)

---

## Alignment with opentelemetry.io

This explorer is a CNCF-adjacent sub-product. Every design decision should ask: "would this look out of place if it were embedded inside opentelemetry.io?"

**Source-of-truth references:**

- Live site: https://opentelemetry.io/
- Registry page (the closest sibling pattern): https://opentelemetry.io/ecosystem/registry/
- Theme stack: Hugo + [Docsy theme](https://www.docsy.dev/) + Bootstrap 5
- Brand colors: theme-color `#4f62ad` (purple), accent `#f5a800` (orange)
- Logo SVG: `/img/logos/opentelemetry-horizontal-color.svg`
- Hero background: `/homepage-hero-background_hu_*.png`
- Theme toggle: stored in `localStorage` key `td-color-theme`, applied via `data-bs-theme` on `<html>`

**What the explorer adds (and opentelemetry.io doesn't have):**

- True faceted filtering with URL state (the registry page is server-rendered + client-side hide/show)
- A three-pane component detail page with version timeline + diff
- Density toggles (Cards / Compact / Table) for power users
- Pipeline-anatomy diagrams on each ecosystem landing
- Component sibling navigators

These are extensions, not departures. They should still feel Docsy-shaped.

---

## Contributing

When adding new UI components:

1. Check whether opentelemetry.io already has this pattern. If so, mirror it.
2. Use existing color tokens from `src/themes.ts`.
3. Implement the component in **both** light and dark themes — never assume dark-only.
4. Implement hover, focus, and `prefers-reduced-motion` states.
5. Verify accessibility (keyboard nav, ARIA labels, contrast in both themes).
6. Test responsive behavior across viewport sizes.
7. Document any new patterns in this file.
