# Interactive Game Layer — Design

**Status:** Approved
**Date:** 2026-07-16
**Scope:** Sub-project C of the learning-platform revamp. Covers the interaction philosophy, technical engine, data model, and UI integration for the per-concept interactive exercise — distinct from the passive `simulation` illustration/animation already defined in [CONTENT-MODEL.md](./CONTENT-MODEL.md) and referenced in [APP-SHELL.md](./APP-SHELL.md).

## Context

Inspired by an Instagram Reel-style visualization of cache warm-up (request counters ticking up, connection lines transitioning from "torn/falls through" to "instant/bounce" as cache layers warm), where the creator was observed actually moving a mouse cursor — i.e. a genuinely interactive session, not a pre-rendered animation. The goal for this project is the same quality of genuine interactivity: draggable nodes, curved connector lines, and fully clickable elements — not a passive video-like animation.

This is explicitly **not** scored via XP — it's a separate hands-on exercise per concept, decoupled from the progress/XP mechanic described in APP-SHELL.md.

## Interaction Philosophy

Two mechanics, combined and chosen per concept as fits best:

1. **Direct manipulation** — the user controls a parameter or triggers an action (drag a node, click "send request", move a slider) and observes the system react in real time. Teaches through experimentation.
2. **Predict-then-reveal** — the user guesses an outcome first (e.g. "how many of 1,000 reads do you think hit the database?"), then triggers the real simulation and compares their guess against what actually happens. Teaches through the surprise of being right or wrong.

A given term's game may use either mechanic alone or combine both (e.g. predict first, then get direct control to keep experimenting).

## Engine

- **React Flow** (`reactflow.dev`) is the core interactive-diagram engine: draggable nodes (custom shapes/icons, not just default boxes), curved/bezier connector edges, full click/drag event handling. Chosen over hand-rolling a custom drag-and-drop + SVG connector system from scratch, which would be a substantial project on its own — React Flow already solves the "draggable nodes + curved lines + fully interactive + custom content" problem out of the box, letting effort go into each concept's actual behavior rather than diagram infrastructure.
- **GSAP + Anime.js** layer on top of React Flow for animation polish — particles/dots flowing along edges, easing, reveal transitions, pulsing/glow feedback on interaction. Same libraries already used for the passive `simulation` illustrations, so no new animation dependency is introduced.
- Every visual element — nodes, edges, icons, shapes — is designed to be interactive (clickable and/or draggable), not decorative-only.
- No rigid, pre-defined library of "game archetypes" is mandated. The engine (nodes + edges + drag + click + custom per-node/edge behavior) is generic enough that similar concepts will naturally end up with similar configurations, and those patterns can be reused informally where it makes sense — without forcing every term into a fixed bucket.

## Data Model

- One **optional** file per term, separate from its core content file: `content/data-engineering/caching-layers.game.ts` alongside `content/data-engineering/caching-layers.ts`.
- Kept separate (not a field on the `Term` object from CONTENT-MODEL.md) because games are built on a fundamentally different, much slower timeline than the 11-field content, which must eventually be fully written for every term. Decoupling means content authoring is never blocked on game authoring, or vice versa.
- If a term has no `.game.ts` file, it simply has no game — this is the expected steady state for most terms for a long time, not an error condition.

## UI Integration

- The term detail page (see APP-SHELL.md) gains a **4th tab**, alongside Overview / Teknis / Bisnis — e.g. "Game" or "Coba Sendiri".
- This tab is **conditionally rendered**: it only appears if that term has a corresponding `.game.ts` file. No placeholder or "coming soon" tab is shown for terms without one — the tab simply doesn't exist yet.

## Rollout Strategy

- Games are built **incrementally, one term at a time**, with no expectation of completing all terms at once — this is explicitly fine and expected to take a long time.
- Progress is tracked via a `TASK.md` checklist (which term has a game, which doesn't), to be created during the implementation-planning phase, not as part of this design.

## Out of Scope

- Enumerating a fixed taxonomy of game "types"/archetypes — deliberately not done here; patterns will emerge organically from real per-term configs built with the React Flow + GSAP/Anime.js engine.
- Constraining React Flow's default full-canvas/pan-zoom behavior to fit inside a page tab is an implementation detail, not a design decision, and is left for the implementation plan.
- Sub-project D (additional tracks) content and games are out of scope here.
