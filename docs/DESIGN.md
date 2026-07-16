# Meetcan — Vendor Dashboard & Productivity Style Reference
> Friendly SaaS control room with soft gradient signals

**Theme:** light

Meetcan sits on a cool-lavender canvas (#f6f7fb) with a single vivid indigo (#3e5eea) as its primary chromatic voice, layered against a family of soft pastel washes — coral, amber, and mint — reserved strictly for status communication, never for primary actions. Headlines and UI type share one geometric sans (Plus Jakarta Sans) run across a wide weight range, from 800-weight stat numbers that shout at a glance to 500-weight labels that whisper metadata; the effect is authoritative-but-approachable, built for a vendor checking their pipeline between meetings. Elevation is shadow-first rather than border-first: white cards float on the lavender canvas with a soft diffused shadow, and the primary button and active navigation state get a signature *tinted* shadow — the accent color bleeding softly into the shadow itself, a small but deliberate premium touch. Corners are generously rounded throughout (16–24px on cards, full pill on badges and buttons), and every status — under review, submitted, expired, scheduled — gets its own color-coded pill so the eye can triage a table without reading a single word. On mobile, the same language continues into a companion productivity surface: an inbox-style list with an illustrated avatar for personality, a gradient-filled active-view pill, and count badges that keep dense information scannable. The overall feel is "friendly enterprise" — colorful enough to feel human, structured enough to feel like a serious operating tool.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Canvas | `#f6f7fb` | `--color-lavender-canvas` | Page background — cool, faintly tinted off-white that separates from pure-white cards |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, sidebar, table rows, input fills |
| Hairline Border | `#ecedf3` | `--color-hairline-border` | Card outlines, table dividers, sidebar separators — secondary to shadow, not primary structure |
| Ink | `#14161f` | `--color-ink` | Primary headings, stat numbers, strong body text |
| Slate Gray | `#6b7280` | `--color-slate-gray` | Secondary text, table meta, helper copy, timestamps |
| Faint Gray | `#9ca3af` | `--color-faint-gray` | Placeholder text, disabled state, decorative icon strokes |
| Indigo Primary | `#3e5eea` | `--color-indigo-primary` | Primary CTA fill, logo mark, active nav pill, link accent — the only chromatic voice used for actions |
| Indigo Deep | `#2a44c7` | `--color-indigo-deep` | Gradient end-stop for primary button/active pill, pressed/hover state |
| Indigo Wash | `#e6ecff` | `--color-indigo-wash` | Info-status pill background ("Schedule"), soft selected-row tint |
| Success Green | `#16a34a` | `--color-success-green` | Positive status text — "Submitted", "Live Now", positive delta arrows |
| Success Wash | `#e3f9ea` | `--color-success-wash` | Positive status pill background, mint stat-card wash |
| Warning Amber | `#c9821a` | `--color-warning-amber` | Caution status text — "Under review", "Pending Schedule" |
| Warning Wash | `#fff4de` | `--color-warning-wash` | Caution status pill background, amber stat-card wash |
| Danger Red | `#e0393e` | `--color-danger-red` | Negative status text — "Expired", destructive actions |
| Danger Wash | `#fde8e8` | `--color-danger-wash` | Negative status pill background, coral stat-card wash |
| Lavender Tag | `#7c5cfc` | `--color-lavender-tag` | Secondary categorical tag — "Needs Review" style labels on mobile |
| Lavender Tag Wash | `#ede9fe` | `--color-lavender-tag-wash` | Background for lavender categorical tags |
| Coral Chip | `#f1495b` | `--color-coral-chip` | Solid icon-chip fill (decorative, status-tied — not for buttons) |
| Amber Chip | `#ffa53d` | `--color-amber-chip` | Solid icon-chip fill (decorative, status-tied — not for buttons) |
| Emerald Chip | `#22c55e` | `--color-emerald-chip` | Solid icon-chip fill (decorative, status-tied — not for buttons) |

## Tokens — Typography

### Plus Jakarta Sans — Single-family system spanning display, heading, body, and UI. A geometric sans with rounded terminals that reads as professional without being cold. Weight does the hierarchy work: 800 for stat numbers and hero greetings, 700 for section titles, 600 for card titles and buttons, 500 for labels and metadata, 400 for dense table body copy. · `--font-jakarta`
- **Substitute:** Inter or General Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 28px, 36px
- **Line height:** 1.1, 1.2, 1.3, 1.4, 1.5
- **Letter spacing:** -0.02em at 36px, -0.01em at 28px, 0.01em at 12px and below
- **Role:** Display, heading, body, and UI typeface in one family — weight and size carry hierarchy instead of font-switching, keeping dashboard and mobile surfaces feeling like one product.

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | Token |
|------|------|--------|-------------|----------------|-------|
| caption / badge | 11px | 600 | 1.3 | 0.02em | `--text-caption` |
| label / meta | 12px | 500 | 1.4 | 0.01em | `--text-label` |
| body | 14px | 400 | 1.5 | — | `--text-body` |
| card-title | 16px | 600 | 1.4 | — | `--text-card-title` |
| section-title | 18px | 700 | 1.3 | — | `--text-section-title` |
| heading | 28px | 700 | 1.2 | -0.01em | `--text-heading` |
| stat-display | 36px | 800 | 1.1 | -0.02em | `--text-stat-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** balanced

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| badges / pills | 9999px |
| buttons | 12px |
| avatars | 9999px |
| icon-chips | 12px |
| inputs | 10px |
| stat-cards | 20px |
| notification-cards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| card | `rgba(20, 23, 31, 0.06) 0px 8px 24px -4px` | `--shadow-card` |
| card-hover | `rgba(20, 23, 31, 0.10) 0px 16px 32px -8px` | `--shadow-card-hover` |
| button-tinted | `rgba(62, 94, 234, 0.35) 0px 8px 16px -6px` | `--shadow-button-tinted` |
| nav-active-tinted | `rgba(62, 94, 234, 0.30) 0px 6px 14px -4px` | `--shadow-nav-active-tinted` |

### Layout

- **Dashboard content max-width:** 1280px
- **Sidebar width:** 240px
- **Section gap:** 32px
- **Card padding:** 20px–24px
- **Card gap:** 16px

## Components

### Gradient Stat Card
**Role:** Top-row dashboard metrics — 'New Request', 'New Feedback', 'Meeting Request', 'Schedule'

White base with a soft diagonal wash of a status-tied pastel (coral, amber, mint) fading to white, 20px radius, 20px padding, `--shadow-card`. A 40px rounded-12px icon-chip in a solid semantic color (coral/amber/emerald) sits top-left beside the label and a small "View All" link. The metric itself is 36px weight 800 Ink, with a small delta row below in 12px weight 500 (green up-arrow + "vs. last week" in Slate Gray).

### Primary Filled Button
**Role:** Highest-priority action — 'Create campaign', primary form submits

12px-radius rectangle, gradient fill from Indigo Primary to Indigo Deep, white text at weight 600, 10px 20px padding, leading plus-icon. Carries the signature tinted shadow (`--shadow-button-tinted`) so it visually lifts off the page even without a hairline border. Use once per viewport maximum.

### Status Pill Badge
**Role:** Inline status marker in tables and cards — 'Under review', 'Submitted', 'Expired', 'Schedule', 'Pending Schedule', 'Live Now'

Fully rounded (9999px) pill, 4px 10px padding, 11px weight 600 text, small leading status dot or icon. Background is the wash tone, text is the saturated tone of the same semantic color (never color alone — always paired with the status word, per accessibility guidance). Never use for anything but status communication.

### Data Table Row
**Role:** 'Recent Meeting Request' list — Title, Company, Status, Requested columns

No card chrome per row — 14px weight 400 Ink text on white background, `--color-hairline-border` 1px divider between rows, 12px vertical padding. Status column renders a Status Pill Badge; Requested column renders relative time in 12px Slate Gray. Rows get a subtle Indigo Wash background on hover.

### Upcoming Meeting Card
**Role:** Sidebar meeting preview — 'Director of IT — Debox Agency'

White fill, 16px radius, 16px padding, thin `--color-hairline-border` outline, no shadow (secondary-priority surface). Title in 14px weight 600, company in 12px Slate Gray, then a date pill and duration pill (Indigo Wash background, 11px weight 600 Indigo Primary text) side by side, and a small overlapping avatar stack (24px circles, 2px white ring, -8px overlap) at the bottom.

### Campaign Card
**Role:** 'Active Campaigns' grid — feature/status preview tiles

White fill over a faint pastel gradient wash matching the card's dominant status color, 20px radius, `--shadow-card`, 20px padding. Status Pill Badge top-left, date top-right in 12px Slate Gray. 16px weight 600 title, 14px weight 400 description (2-line clamp), then a row of outline category tags (11px weight 600, 1px hairline border, 9999px radius) and a 'View All' link with trailing arrow at the bottom edge.

### Sidebar Nav Item
**Role:** Primary navigation — Dashboard, Business Profile, Campaigns, Availability, Request, Schedule, Completed

40px height, 12px radius, icon (20px, Faint Gray stroke) + 14px weight 500 label. Active state fills with Indigo Wash background and Indigo Primary text/icon, no border. Grouped under uppercase 11px weight 600 Slate Gray section labels ('BUSINESS', 'MEETINGS', 'ACCOUNT') with 16px gap above each group.

### Meeting Credits Widget
**Role:** Sidebar usage meter — 'Meeting Credits — 24/50'

Rounded-20px card with a soft indigo-to-lavender gradient background (distinct from the neutral sidebar), 20px padding. Large 'Available' figure at 28px weight 800, then a segmented progress bar (rounded-full track, Indigo Primary fill, 6px height) with a 'Used / Available' legend row in 12px weight 500.

### Illustrated Avatar
**Role:** Personality element on the mobile productivity surface — sender avatars in notification cards

Semi-flat illustrated character portrait (not a photo, not a generic initial-circle), 40–48px, fully rounded, no border. Used once per notification card as the human touchpoint against otherwise flat UI chrome — the mobile equivalent of the dashboard's avatar-stack proof-of-people.

### Active View Pill (Mobile)
**Role:** Selected sidebar view on the mobile productivity surface — 'Inbox' with unread count

Full-width rounded-14px pill, gradient fill Indigo Primary → Indigo Deep, white icon + label at weight 600, count badge in a translucent white circle at trailing edge. Carries `--shadow-nav-active-tinted`. Inactive views sit directly on white with a plain Faint Gray icon and a neutral gray count pill (no fill, no shadow).

### Notification / Task Card
**Role:** Mobile inbox card — 'Marcus Novak proposed a new component', 'Reviewing the Q3 deck'

White fill, 24px radius (the most generous radius in the system — mobile cards read softer than dashboard cards), 20px padding, `--shadow-card`. Illustrated Avatar + sender name + a small Lavender Tag ('Needs Review') on the header row, 16px weight 700 title, 14px weight 400 body copy, then a single inline action button (Indigo Wash pill background, Indigo Primary text + check icon) — never more than one primary action per card.

## Do's and Don'ts

### Do
- Keep Indigo Primary (#3e5eea) as the only color used for actionable buttons and links — every other saturated color in the palette is reserved for status communication, never for actions
- Pair every status color with a text label, not color alone — 'Submitted' in green text, never a bare green dot
- Use the tinted shadow (accent color bleeding into the shadow) on exactly two elements per screen: the primary button and the active navigation state — this is the signature move, don't dilute it by applying it everywhere
- Let card radius scale with intimacy: 16px for low-priority sidebar cards, 20px for dashboard stat/campaign cards, 24px for mobile notification cards
- Run Plus Jakarta Sans across the full weight range (400–800) instead of switching typefaces — hierarchy comes from weight and size, not font-mixing
- Use the pastel gradient wash on stat and campaign cards sparingly — it should read as a soft tint behind white, never a fully saturated background
- Give every notification/task card exactly one primary action button — resist stacking multiple CTAs in a single card

### Don't
- Do not use Indigo Primary for destructive actions — Danger Red is reserved for that semantic meaning exclusively
- Do not add a second saturated accent color alongside Indigo — coral, amber, emerald, and lavender are status/decorative tones only, not additional brand accents
- Do not outline every card with a heavy border in addition to its shadow — pick one elevation device per card (shadow for stat/campaign cards, hairline border for low-priority sidebar cards)
- Do not use pure black (#000000) anywhere — Ink (#14161f) is the darkest value in the system
- Do not render status information as color-only dots or bars — always pair with the status word for accessibility
- Do not use generic circular spinners for loading states — use skeleton placeholders matching the card's real dimensions
- Do not let the illustrated-avatar personality element appear more than once per card — one human touchpoint per unit of content is the rule

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f6f7fb` | Full-page lavender-tinted background |
| 1 | Sidebar / Low-priority Card | `#ffffff` | Nav rail, upcoming-meeting cards — hairline border, no shadow |
| 2 | Elevated Card | `#ffffff` | Stat cards, campaign cards, notification cards — `--shadow-card` |
| 3 | Gradient Widget | `linear-gradient(135deg, #e6ecff, #f6f7fb)` | Meeting Credits widget, active nav pill — indigo-tinted surfaces |

## Elevation

- **Low-priority card (sidebar, upcoming meeting):** none — `1px solid #ecedf3` only
- **Elevated card (stat, campaign, notification):** `rgba(20, 23, 31, 0.06) 0px 8px 24px -4px`
- **Elevated card, hover:** `rgba(20, 23, 31, 0.10) 0px 16px 32px -8px`
- **Primary button:** `rgba(62, 94, 234, 0.35) 0px 8px 16px -6px`
- **Active nav pill:** `rgba(62, 94, 234, 0.30) 0px 6px 14px -4px`

## Imagery

Visual language avoids photography entirely on the dashboard surface — the only "faces" are small circular avatar photos in overlapping stacks (proof-of-people on meeting cards). The mobile productivity surface introduces one illustrated character avatar per notification as a personality beat, semi-flat digital-illustration style, never photographic and never a generic initial-circle. All functional icons are simple outline-style SVGs at 1.5px stroke in Faint Gray or Indigo Primary — never emoji, never filled/solid icon sets except inside the solid-color icon-chips on stat cards. Decorative color is delivered entirely through soft gradient washes behind cards, not through illustration or texture.

## Layout

Dashboard is a fixed 240px sidebar plus fluid content area, content capped near 1280px. Top row is a 4-up grid of equal-width Gradient Stat Cards (collapses to 2-up on tablet, 1-up on mobile). Below, a 2:1 split — a wide 'Recent Meeting Request' table on the left, a narrow 'Upcoming Meetings' stack on the right — then a full-width 4-up 'Active Campaigns' grid at the bottom (collapses the same way as the stat row). Section gaps are 32px; card gaps within a grid are 16px. The mobile productivity surface uses a single-column list: a slim left rail of view names with count badges (Inbox as the filled active pill), and a main column of full-width Notification/Task Cards stacked with 12px gaps, topped by an 'AI priority' filter chip and a compact '+ New' primary button.

## Agent Prompt Guide

Quick Color Reference:
- page background: #f6f7fb
- card surface: #ffffff
- primary text: #14161f
- secondary text: #6b7280
- border / hairline: #ecedf3
- primary action + links: #3e5eea (gradient to #2a44c7)
- success status: text #16a34a on #e3f9ea
- warning status: text #c9821a on #fff4de
- danger status: text #e0393e on #fde8e8
- info status: text #3e5eea on #e6ecff

Example Component Prompts:

1. Gradient stat card: white fill over a faint coral-to-white diagonal wash, 20px radius, shadow rgba(20,23,31,0.06) 0px 8px 24px -4px, 20px padding. 40px rounded-12px coral icon-chip top-left. Metric at 36px Plus Jakarta Sans weight 800 #14161f. Delta row below at 12px weight 500 with green up-arrow and #6b7280 "vs. last week" text.

2. Primary button: 12px radius rectangle, gradient fill #3e5eea to #2a44c7, white text weight 600 14px, 10px 20px padding, leading plus icon, shadow rgba(62,94,234,0.35) 0px 8px 16px -6px. One per viewport maximum.

3. Status pill badge: 9999px radius, 4px 10px padding, 11px weight 600 text. For warning: #fff4de background with #c9821a text. Always pair the color with the status word.

4. Data table row: 14px weight 400 #14161f text, 1px #ecedf3 bottom divider, 12px vertical padding, status column renders a Status Pill Badge, relative-time column at 12px #6b7280. Row background tints to #e6ecff on hover.

5. Mobile notification card: white fill, 24px radius, shadow rgba(20,23,31,0.06) 0px 8px 24px -4px, 20px padding. Illustrated avatar (40px, fully rounded) + sender name + lavender tag (#ede9fe background, #7c5cfc text) on header row. Title 16px weight 700, body 14px weight 400 #6b7280. Single action button: #e6ecff background pill, #3e5eea text + check icon.

## Gradient Icon-Chip Pattern

The signature move of this system is the paired icon-chip + pastel wash: every stat and campaign card gets a small solid-color icon-chip (coral, amber, or emerald, 40px, 12px radius) that names its semantic category at a glance, echoed by a much softer version of the same hue washing diagonally across the card background behind the white surface. Rules: exactly one chip color per card, the wash must stay under ~15% opacity-equivalent lightness so white content stays fully legible on top, and the chip color must match the card's Status Pill Badge color when one is present — the two should never disagree about what state the card is communicating.

## Similar Brands

- **ClickUp** — Same colorful, status-pill-driven dashboard language with pastel card washes and dense-but-friendly information design
- **Notion** — Same illustrated-avatar personality touch against otherwise flat, functional UI chrome
- **Cal.com** — Same soft-shadow card system with a single indigo/blue accent carrying all primary actions
- **Linear** — Same weight-driven typographic hierarchy within a single font family, no font-mixing for emphasis
- **Superhuman** — Same calm, high-density inbox list pattern with a single filled active-view state on mobile

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-canvas: #f6f7fb;
  --color-pure-white: #ffffff;
  --color-hairline-border: #ecedf3;
  --color-ink: #14161f;
  --color-slate-gray: #6b7280;
  --color-faint-gray: #9ca3af;
  --color-indigo-primary: #3e5eea;
  --color-indigo-deep: #2a44c7;
  --color-indigo-wash: #e6ecff;
  --color-success-green: #16a34a;
  --color-success-wash: #e3f9ea;
  --color-warning-amber: #c9821a;
  --color-warning-wash: #fff4de;
  --color-danger-red: #e0393e;
  --color-danger-wash: #fde8e8;
  --color-lavender-tag: #7c5cfc;
  --color-lavender-tag-wash: #ede9fe;
  --color-coral-chip: #f1495b;
  --color-amber-chip: #ffa53d;
  --color-emerald-chip: #22c55e;

  /* Typography — Font Family */
  --font-jakarta: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --tracking-caption: 0.02em;
  --text-label: 12px;
  --leading-label: 1.4;
  --tracking-label: 0.01em;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-card-title: 16px;
  --leading-card-title: 1.4;
  --text-section-title: 18px;
  --leading-section-title: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: -0.01em;
  --text-stat-display: 36px;
  --leading-stat-display: 1.1;
  --tracking-stat-display: -0.02em;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --dashboard-max-width: 1280px;
  --sidebar-width: 240px;
  --section-gap: 32px;
  --card-padding: 20px;
  --card-gap: 16px;

  /* Border Radius */
  --radius-pill: 9999px;
  --radius-button: 12px;
  --radius-icon-chip: 12px;
  --radius-input: 10px;
  --radius-stat-card: 20px;
  --radius-notification-card: 24px;

  /* Shadows */
  --shadow-card: rgba(20, 23, 31, 0.06) 0px 8px 24px -4px;
  --shadow-card-hover: rgba(20, 23, 31, 0.10) 0px 16px 32px -8px;
  --shadow-button-tinted: rgba(62, 94, 234, 0.35) 0px 8px 16px -6px;
  --shadow-nav-active-tinted: rgba(62, 94, 234, 0.30) 0px 6px 14px -4px;

  /* Surfaces */
  --surface-canvas: #f6f7fb;
  --surface-low-priority-card: #ffffff;
  --surface-elevated-card: #ffffff;
  --surface-gradient-widget: linear-gradient(135deg, #e6ecff, #f6f7fb);
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-canvas: #f6f7fb;
  --color-pure-white: #ffffff;
  --color-hairline-border: #ecedf3;
  --color-ink: #14161f;
  --color-slate-gray: #6b7280;
  --color-faint-gray: #9ca3af;
  --color-indigo-primary: #3e5eea;
  --color-indigo-deep: #2a44c7;
  --color-indigo-wash: #e6ecff;
  --color-success-green: #16a34a;
  --color-success-wash: #e3f9ea;
  --color-warning-amber: #c9821a;
  --color-warning-wash: #fff4de;
  --color-danger-red: #e0393e;
  --color-danger-wash: #fde8e8;
  --color-lavender-tag: #7c5cfc;
  --color-lavender-tag-wash: #ede9fe;
  --color-coral-chip: #f1495b;
  --color-amber-chip: #ffa53d;
  --color-emerald-chip: #22c55e;

  /* Typography */
  --font-jakarta: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.3;
  --text-label: 12px;
  --leading-label: 1.4;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-card-title: 16px;
  --leading-card-title: 1.4;
  --text-section-title: 18px;
  --leading-section-title: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --text-stat-display: 36px;
  --leading-stat-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-pill: 9999px;
  --radius-button: 12px;
  --radius-icon-chip: 12px;
  --radius-input: 10px;
  --radius-stat-card: 20px;
  --radius-notification-card: 24px;

  /* Shadows */
  --shadow-card: rgba(20, 23, 31, 0.06) 0px 8px 24px -4px;
  --shadow-card-hover: rgba(20, 23, 31, 0.10) 0px 16px 32px -8px;
  --shadow-button-tinted: rgba(62, 94, 234, 0.35) 0px 8px 16px -6px;
  --shadow-nav-active-tinted: rgba(62, 94, 234, 0.30) 0px 6px 14px -4px;
}
```
