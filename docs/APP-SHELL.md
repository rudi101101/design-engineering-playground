# App Shell & Data Engineering Track — Design

**Status:** Approved
**Date:** 2026-07-16
**Scope:** Sub-project B of the learning-platform revamp. Covers routing, page layouts, language switching, and progress tracking for the React app shell and the first migrated track (Data Engineering). Builds directly on [CONTENT-MODEL.md](./CONTENT-MODEL.md) for the data shape and on `../DESIGN.md` for the visual system (Meetcan-style: light theme, indigo accent, soft-shadow cards, gradient stat cards, status pills).

## Context

Part of the same four-sub-project revamp described in CONTENT-MODEL.md:
- A. Content Model & Taxonomy — done
- **B. App Shell & Data Engineering Track (this document)**
- C. Interactive Game Layer — deferred, brainstormed separately
- D. Additional Tracks — deferred

Stack: Vite + React + TypeScript, static build, deployed to Vercel. No backend/database — all content is read from the file-based `content/` structure defined in CONTENT-MODEL.md. GSAP is retained for the per-term illustration/animation ("simulation"), ported from the old file's direct-DOM approach to React refs + `useEffect` cleanup.

## Routing

Each term gets its own route — no in-place accordion expansion. Category browsing and search live on a per-track list page.

```
/                                    → Landing page (track selector)
/:trackSlug                          → Track list page (e.g. /data-engineering)
/:trackSlug/:termSlug                → Term detail page (e.g. /data-engineering/etl)
```

## Landing Page

Lists every track as a card, each showing: icon, name, a progress bar (terms learned / total terms in that track), and total combined XP shown in the header. Clicking a track card navigates to its list page.

```
+------------------------------------------------------+
| Design & Engineering Playground        [ID/EN]  420XP |
|   Pelajari data engineering, database, API, security  |
|   lewat animasi interaktif & studi kasus nyata.        |
+------------------------------------------------------+
  +----------------+  +----------------+
  | Data           |  | Database       |
  | Engineering    |  |                |
  | 12/101 ▓▓░░░░  |  | 0/40  ░░░░░░  |
  +----------------+  +----------------+
  +----------------+  +----------------+
  | API            |  | Security       |
  | 0/30  ░░░░░░   |  | 0/25  ░░░░░░  |
  +----------------+  +----------------+
```

## Track List Page

Combines category filter pills with stacked category sections:

- **Default (`All` pill active):** every category renders as its own labeled section, stacked vertically, each containing its term cards. A search bar filters across all categories regardless of which pill is active.
- **A specific category pill active:** only that category's section renders; others are hidden.
- Clicking a term card navigates to that term's detail page (`/:trackSlug/:termSlug`).

```
+--------------------------------------------------------+
| Data Engineering                    [ID/EN]  12/101 ✓  |
| [ Cari term... ]                                        |
| [All] [Arsitektur] [Pipeline] [Storage] [Modeling] ...  |
+--------------------------------------------------------+
  ARSITEKTUR
  [Medallion Architecture] [Data Lakehouse] [Lambda Architecture]
  PIPELINE
  [ETL] [ELT] [CDC] [Stream Processing]
  ... (other categories continue below)
```

## Term Detail Page

Structure, top to bottom:

1. Breadcrumb (`← Track / Category`) + language toggle
2. Term title, icon, category badge
3. Illustration/animation (the `simulation` field) — always visible, does **not** move between tabs
4. Three content tabs:
   - **Overview** (default active) — `description`, `concept`, `objective`, `goal`
   - **Teknis** — `methodology`, `exampleImplementation`
   - **Bisnis** — `exampleEnterprise`, `prosAndCons` (pros/cons side by side)
5. Always visible below the tabs, not part of any tab (metadata, not narrative content): `prerequisites` (linked chips), `related` (linked chips), `tools` (chips)
6. Previous/next term navigation

Rationale for tabs over one long scroll: keeps the page from feeling overwhelming given each term now carries 8 detailed markdown fields (vs. 5 short ones previously), while still grouping fields by "how you think about it" (understand → technical → business) rather than hiding anything behind an arbitrary click depth.

## Language Switching

- One global toggle (`[ID/EN]`) switches the **entire UI** — chrome (labels, search placeholder, progress text, nav) and all content fields together, not content alone.
- Persisted in `localStorage`; default on first visit is Indonesian (`id`).
- A field missing a translation falls back to the language that exists, with a small "not yet translated" indicator (per the warning-not-error rule in CONTENT-MODEL.md).

## Progress Tracking

- Visiting a term's detail page marks it "seen" (once), awarding XP — same mechanic as the old file's gamification, but now triggered by route navigation instead of accordion expand.
- Progress (seen-set + XP) is tracked **per track** and persisted to `localStorage` independently per track, then summed for the landing page's combined XP total.
- This progress/XP mechanic is unrelated to the interactive game layer (Sub-project C) — the game is explicitly *not* scored via XP; it's a separate interactive exercise per concept, designed later.

## Out of Scope (deferred to later sub-projects)

- The interactive game layer referenced during this discussion (an Instagram Reels-style interactive cache-warming visualization was used as inspiration) is **not** designed here — it's Sub-project C, with its own mechanics, per-concept variation, and technical approach to be brainstormed separately.
- Migrating tracks other than Data Engineering (Database, API, Security, ...) is Sub-project D, reusing this same shell and the CONTENT-MODEL schema.
- Exact color/spacing/component values are not repeated here — they're already defined in `../DESIGN.md` and apply as-is to every page described above.
