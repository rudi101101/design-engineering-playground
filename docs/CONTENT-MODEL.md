# Content Model & Taxonomy — Design

**Status:** Approved
**Date:** 2026-07-16
**Scope:** Sub-project A of the learning-platform revamp (see context below). This spec covers *only* the content schema, file organization, and authoring rules — not the app shell, UI, or interactive game layer.

## Context

This project is being revamped from a single monolithic HTML file (`data101 (1).html`, 101 Data Engineering terms with a 5-field schema: konsep/met/proses/contoh/tools) into a React + Vite static site covering multiple learning tracks (Data Engineering, Database, API, Security, and others — scope is intentionally open-ended: "semuanya").

The revamp was broken into four sub-projects:
- **A. Content Model & Taxonomy** (this document)
- **B. App Shell & Data Engineering Track** — Vite/React scaffold, DESIGN.md visual system, migrate the 101 existing terms into the new schema
- **C. Interactive Game Layer** — a per-concept interactive exercise, distinct from the passive illustration/animation
- **D. Additional Tracks** — Database, API, Security, etc., authored against this same schema

The old HTML file is left untouched during this phase. It is retained as source reference material until Sub-project B migrates its content into the new format.

## Term Schema

Every concept ("term") is one object of the following shape:

```
Term {
  id: string              // globally unique slug across ALL tracks, e.g. "caching-layers"
  track: string           // owning track, e.g. "data-engineering"
  category: string        // category within the track, e.g. "Performa"
  color: string           // hex accent color for card/icon
  icon: string            // SVG path for the icon
  simulation: string      // key mapped to an illustration/animation component
  tools: string[]         // related tools/technologies — not translated (same in both languages)
  prerequisites: string[] // ids of other terms the reader should understand first
  related: string[]       // ids of other terms "often confused with" (feeds the app-level compare feature)

  name: { id: string, en: string }   // the term's display name

  content: {
    description:           { id: string, en: string }  // markdown — long, detailed narrative explanation
    concept:                { id: string, en: string }  // markdown — analogy/metaphor, one or more as needed
    methodology:            { id: string, en: string }  // markdown — technical mechanism / how it works
    objective:              { id: string, en: string }  // markdown — why this is needed, what problem it solves
    goal:                   { id: string, en: string }  // markdown — the concrete, measurable outcome achieved
    exampleImplementation:  { id: string, en: string }  // markdown — technical example, may include code blocks
    exampleEnterprise:      { id: string, en: string }  // markdown — generic/fictitious business scenario
    prosAndCons: {
      pros: { id: string, en: string }  // markdown bullet list
      cons: { id: string, en: string }  // markdown bullet list
    }
  }
}
```

### Field semantics

| Field | Meaning |
|---|---|
| `description` | Long, detailed narrative — what it is, why it's relevant, full context. Deliberately not a short summary; the goal is thorough understanding. |
| `concept` | One or more analogies/metaphors that make the abstract idea intuitive (e.g. "imagine caching like a house with a table by the door, a closet, and a garage before you'd go to the store"). Not a technical restatement — a mental-model bridge. Number of analogies flexes with concept complexity. |
| `methodology` | The technical mechanism — how it actually works under the hood. |
| `objective` | Why this concept exists — what problem it solves, why it's needed. |
| `goal` | The concrete, ideally measurable outcome achieved when applied correctly (derived from the objective). |
| `exampleImplementation` | Concrete technical example — may freely mix prose, numbered steps, and code/config blocks. |
| `exampleEnterprise` | A realistic business scenario using **generic or fictitious** company names/situations — never real company names (e.g. not "Astra", "AHM"). |
| `prerequisites` | References (by `id`) to other terms that should be understood first. |
| `related` | References (by `id`) to terms this one is "often confused with." Not a written comparison — the comparison itself is rendered dynamically at the app level (side-by-side view pulling both terms' existing fields), not authored per pair. This avoids the combinatorial-explosion problem of hand-written pairwise comparisons. |
| `prosAndCons` | Two markdown bullet lists. Uses the same `{id, en}` markdown shape as every other content field — no special-cased data type. |

All content fields share the exact same `{id: string, en: string}` markdown-string shape, so a single markdown-rendering component handles every field uniformly.

## File Organization

- **One file per term** — e.g. `content/data-engineering/caching-layers.ts`, containing exactly one `Term` object.
- **One index file per track** — e.g. `content/data-engineering/index.ts` — imports every term file in that track and exports an ordered array. Contains no content itself.
- **One global registry** — `content/index.ts` — combines all tracks into a single lookup, used to validate `id` uniqueness and to resolve `prerequisites`/`related` references across tracks.

```
content/
  data-engineering/
    index.ts
    caching-layers.ts
    medallion-architecture.ts
    ...
  database/
    index.ts
    ...
  index.ts   ← global registry
```

Adding a new term = one new file + one new import line in that track's index. No other file needs to change.

## Cross-Referencing & Validation

- `prerequisites` and `related` reference other terms by their global `id`.
- **Broken references are a build-time error.** If an `id` referenced in `prerequisites`/`related` doesn't exist in the global registry, the build fails with a clear message naming the offending file, field, and missing id — never a silently dead link in the UI.
- **Missing translations are a build-time warning, not a hard failure.** If one language's content is populated for a field while the other is empty, the build logs a warning (file + field) but still succeeds. In the UI, a field with a missing translation falls back to the language that does exist, with a small "not yet translated" indicator — never a blank section or crash. This reflects that content (400+ terms × 8 content fields × 2 languages) will be authored incrementally.

## Content Authoring Rules

- Every content field is a **markdown string** — bold, bullet/numbered lists, and fenced code blocks are all valid and expected, freely mixed within a single field. One shared markdown-to-React renderer handles all of them.
- **Code blocks use one consistent style everywhere** (bash, JSON, SQL, Redis commands, etc.): a dark rounded box with a small header showing the language label and a copy button, with syntax highlighting. No macOS-style traffic-light window chrome for inline code — that treatment is reserved for Sub-project C (the interactive game layer), where it may be used to simulate an actual terminal session, not for static code snippets inside a content field.
- `exampleEnterprise` must use a generic or fictitious company/scenario — real company names (e.g. Astra, AHM) are not permitted anywhere in content.
- `concept` must contain at least one analogy; write as many as the concept's complexity warrants.

## Out of Scope (deferred to later sub-projects)

- A written/authored "Comparison" field was considered and explicitly dropped in favor of the lighter `related` reference list — the actual side-by-side comparison UI is an app-level feature (Sub-project B), not authored content.
- The interactive game layer (Sub-project C) is a separate concern from the `simulation` (illustration/animation) field and is not designed here.
- Migrating the existing 101 Data Engineering terms into this schema happens in Sub-project B, not here.
