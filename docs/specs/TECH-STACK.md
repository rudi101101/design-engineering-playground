# Tech Stack — Design

**Status:** Approved
**Date:** 2026-07-16
**Scope:** Cross-cutting technical decisions for the learning-platform revamp, applying across [CONTENT-MODEL.md](./CONTENT-MODEL.md), [APP-SHELL.md](./APP-SHELL.md), and [GAME-LAYER.md](./GAME-LAYER.md). Consolidates choices that were made piecemeal across those three specs into one reference.

## Decisions

| Area | Choice | Why |
|---|---|---|
| **Language** | JavaScript (plain React, no TypeScript) | Consistent with the project's "simple aja" direction; the user is more comfortable in plain JS than adding TS ceremony to a personal project. |
| **Content safety net** | A small custom build-time validation script | Since there's no TypeScript to catch structural mistakes in the 11-field × bilingual × cross-referenced content (per CONTENT-MODEL.md), a lightweight script checks: all required fields present per term, every `prerequisites`/`related` id resolves to a real term in the global registry (hard error if not), and flags (warns, doesn't fail) any field missing one language's translation. |
| **Build tool** | Vite | Fast, zero-config-friendly, deploys cleanly to Vercel as a static site. No SSR/backend needed since there's no database. |
| **Framework** | React | As specified from the start of the project. |
| **Routing** | React Router | The standard SPA routing library for React — most community support/documentation, no need for anything fancier for this project's route structure (`/`, `/:trackSlug`, `/:trackSlug/:termSlug`). |
| **Styling** | Tailwind CSS | `../DESIGN.md` already documents its tokens as a Tailwind v4 `@theme` block — using Tailwind means those tokens plug in directly with no re-authoring into another styling system. |
| **Markdown rendering** | `react-markdown` | The standard, well-maintained library for rendering markdown strings to React elements — used for every content field defined in CONTENT-MODEL.md (bold, lists, fenced code blocks). Paired with a custom code-block renderer per CONTENT-MODEL.md's authoring rules (dark box, language label, copy button — no terminal-window chrome). |
| **Animation (illustrations)** | GSAP + Anime.js | Carried over from the original `data101 (1).html` prototype; used for the passive per-term `simulation` field. |
| **Animation (interactive game layer)** | React Flow + GSAP + Anime.js | Per GAME-LAYER.md — React Flow provides the draggable-node/curved-edge diagram engine; GSAP/Anime.js layer on top for animation polish (flowing particles, easing, reveal transitions). |
| **Deployment** | Vercel | Static build, zero-config deploy. No environment variables or secrets needed — there is no backend or database. |

## Non-Goals

- No TypeScript, no backend framework, no database, no CMS, no SSR — the site is a fully static SPA build.
- No state-management library beyond React's built-in state/Context — the app's state (active language, progress/XP, expanded filters) is simple enough not to need Redux/Zustand/etc.
- No testing framework decision made here — deferred until/unless it becomes a felt need during implementation.
