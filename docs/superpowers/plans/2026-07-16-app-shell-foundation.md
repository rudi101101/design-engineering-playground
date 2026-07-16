# App Shell & Data Engineering Track Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a static React app that renders the Data Engineering track through the schema and page structure defined in `docs/specs/CONTENT-MODEL.md` and `docs/specs/APP-SHELL.md`, proven end-to-end with two fully-authored sample terms, then deployed to Vercel.

**Architecture:** A Vite-built React SPA with three routes (landing, track list, term detail) reading from a file-based content registry — one plain JS module per term, per CONTENT-MODEL.md. A standalone content-validation script enforces the schema's structural rules (required fields, cross-reference integrity, translation completeness) independently of the UI, runnable via `npm run validate-content`. Progress/XP and language preference live in `localStorage` via small framework-free helper modules kept separate from rendering components, so they're unit-testable without a DOM.

**Tech Stack:** React 18, Vite, Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`), React Router v6, `react-markdown`, Vitest + Testing Library, plain JavaScript (no TypeScript), deployed to Vercel.

## Global Constraints

- Plain JavaScript only — no TypeScript. (`docs/specs/TECH-STACK.md`)
- Tailwind CSS using the DESIGN.md tokens verbatim (colors, radii, shadows, type scale). (`docs/specs/TECH-STACK.md`, `docs/DESIGN.md`)
- React Router for all routing; React Flow is out of scope for this plan (belongs to Sub-project C). (`docs/specs/TECH-STACK.md`)
- `react-markdown` renders every content field; code blocks use one consistent style (dark box, language label, copy button) — never terminal-window chrome. (`docs/specs/CONTENT-MODEL.md`)
- Every term's `id` (slug) is globally unique across all tracks. (`docs/specs/CONTENT-MODEL.md`)
- Broken `prerequisites`/`related` references are a build-time **error**; a missing translation on an otherwise-populated field is a build-time **warning**, never a hard failure. (`docs/specs/CONTENT-MODEL.md`)
- `exampleEnterprise` content must use generic/fictitious business scenarios — never real company names. (`docs/specs/CONTENT-MODEL.md`)
- The language toggle switches the entire UI (chrome + content), persists to `localStorage`, defaults to `id` on first visit. (`docs/specs/APP-SHELL.md`)
- Progress/XP is tracked and persisted per track in `localStorage`. (`docs/specs/APP-SHELL.md`)
- No backend, no database, no TypeScript, no testing framework beyond what this plan introduces (Vitest — needed to satisfy this plan's test-first tasks; not previously decided in TECH-STACK.md, flagged here as the minimal addition required to write real tests). Static build only. (`docs/specs/TECH-STACK.md`)

---

## File Structure

```
design-engineering-playground/
  package.json
  vite.config.js
  index.html
  scripts/
    validate-content.js
  src/
    main.jsx
    App.jsx
    router.jsx
    index.css
    test-setup.js
    lib/
      validateContent.js
      validateContent.test.js
      progress.js
      progress.test.js
    i18n/
      LanguageContext.jsx
      LanguageContext.test.jsx
    content/
      index.js
      data-engineering/
        index.js
        etl.js
        caching-layers.js
    components/
      CodeBlock.jsx
      MarkdownRenderer.jsx
      MarkdownRenderer.test.jsx
      TrackCard.jsx
      TermCard.jsx
    pages/
      LandingPage.jsx
      LandingPage.test.jsx
      TrackListPage.jsx
      TrackListPage.test.jsx
      TermDetailPage.jsx
      TermDetailPage.test.jsx
```

---

### Task 1: Project Scaffold (Vite + React + Tailwind v4 + Vitest)

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/test-setup.js`
- Create: `src/smoke.test.js`
- Create: `.gitignore`

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, and `npm test` pipeline that every later task builds on.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "design-engineering-playground",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "validate-content": "node scripts/validate-content.js"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "react-markdown": "^9.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.1",
    "@tailwindcss/vite": "^4.0.0",
    "jsdom": "^25.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Write `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
});
```

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Design & Engineering Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write `src/index.css` with the DESIGN.md tokens**

```css
@import "tailwindcss";

@theme {
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

  --font-jakarta: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif;

  --text-caption: 11px;
  --text-label: 12px;
  --text-body: 14px;
  --text-card-title: 16px;
  --text-section-title: 18px;
  --text-heading: 28px;
  --text-stat-display: 36px;

  --radius-pill: 9999px;
  --radius-button: 12px;
  --radius-input: 10px;
  --radius-notification-card: 24px;

  --shadow-card: 0px 8px 24px -4px rgba(20, 23, 31, 0.06);
  --shadow-card-hover: 0px 16px 32px -8px rgba(20, 23, 31, 0.10);
}

body {
  background-color: var(--color-lavender-canvas);
  color: var(--color-ink);
  font-family: var(--font-jakarta);
}
```

- [ ] **Step 5: Write `src/test-setup.js`**

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Write a smoke test to verify the test pipeline, `src/smoke.test.js`**

```js
import { describe, it, expect } from 'vitest';

describe('test runner smoke test', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Write `.gitignore`**

```
node_modules
dist
.vercel
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: install completes with no errors.

- [ ] **Step 9: Run the smoke test to verify the pipeline works**

Run: `npm test`
Expected: `1 passed` (the smoke test), 0 failed.

- [ ] **Step 10: Commit**

```bash
git add package.json vite.config.js index.html src/index.css src/test-setup.js src/smoke.test.js .gitignore package-lock.json
git commit -m "Scaffold Vite + React + Tailwind v4 + Vitest project"
```

---

### Task 2: Content Validation Core Logic

**Files:**
- Create: `src/lib/validateContent.js`
- Test: `src/lib/validateContent.test.js`

**Interfaces:**
- Produces: `validateTerms(terms: object[]) -> { errors: string[], warnings: string[] }`, used by Task 3's CLI script and reused by no other task in this plan.

- [ ] **Step 1: Write the failing tests**

```js
// src/lib/validateContent.test.js
import { describe, it, expect } from 'vitest';
import { validateTerms } from './validateContent';

function makeValidTerm(overrides = {}) {
  return {
    id: 'sample-term',
    track: 'data-engineering',
    category: 'Pipeline',
    color: '#3e5eea',
    icon: 'M0 0h24v24H0z',
    simulation: 'generic',
    tools: ['Spark'],
    prerequisites: [],
    related: [],
    name: { id: 'Contoh Term', en: 'Sample Term' },
    content: {
      description: { id: 'Deskripsi.', en: 'Description.' },
      concept: { id: 'Analogi.', en: 'Analogy.' },
      methodology: { id: 'Cara kerja.', en: 'How it works.' },
      objective: { id: 'Kenapa.', en: 'Why.' },
      goal: { id: 'Target.', en: 'Goal.' },
      exampleImplementation: { id: 'Contoh.', en: 'Example.' },
      exampleEnterprise: { id: 'Skenario.', en: 'Scenario.' },
      prosAndCons: {
        pros: { id: '- baik', en: '- good' },
        cons: { id: '- buruk', en: '- bad' },
      },
    },
    ...overrides,
  };
}

describe('validateTerms', () => {
  it('returns no errors or warnings for a fully valid term', () => {
    const { errors, warnings } = validateTerms([makeValidTerm()]);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it('errors on duplicate ids', () => {
    const { errors } = validateTerms([makeValidTerm(), makeValidTerm()]);
    expect(errors).toContain('Duplicate term id: "sample-term"');
  });

  it('errors when a required scalar field is missing', () => {
    const term = makeValidTerm();
    delete term.color;
    const { errors } = validateTerms([term]);
    expect(errors).toContain('Term "sample-term" is missing required field: color');
  });

  it('errors when prerequisites reference a non-existent id', () => {
    const term = makeValidTerm({ prerequisites: ['does-not-exist'] });
    const { errors } = validateTerms([term]);
    expect(errors).toContain(
      'Term "sample-term" has prerequisites reference to unknown term id: "does-not-exist"'
    );
  });

  it('warns (not errors) when one language of a content field is empty', () => {
    const term = makeValidTerm();
    term.content.goal.en = '';
    const { errors, warnings } = validateTerms([term]);
    expect(errors).toEqual([]);
    expect(warnings).toContain(
      'Term "sample-term" field "content.goal" is missing an "en" translation'
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- validateContent`
Expected: FAIL — `validateContent.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

```js
// src/lib/validateContent.js
const REQUIRED_SCALAR_FIELDS = ['id', 'track', 'category', 'color', 'icon', 'simulation'];
const REQUIRED_ARRAY_FIELDS = ['tools', 'prerequisites', 'related'];
const BILINGUAL_FIELD_PATHS = [
  ['name'],
  ['content', 'description'],
  ['content', 'concept'],
  ['content', 'methodology'],
  ['content', 'objective'],
  ['content', 'goal'],
  ['content', 'exampleImplementation'],
  ['content', 'exampleEnterprise'],
  ['content', 'prosAndCons', 'pros'],
  ['content', 'prosAndCons', 'cons'],
];

function getAtPath(obj, path) {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function pathLabel(path) {
  return path.join('.');
}

export function validateTerms(terms) {
  const errors = [];
  const warnings = [];
  const idSet = new Set();

  for (const term of terms) {
    if (idSet.has(term.id)) {
      errors.push(`Duplicate term id: "${term.id}"`);
    }
    idSet.add(term.id);
  }

  for (const term of terms) {
    for (const field of REQUIRED_SCALAR_FIELDS) {
      if (!term[field]) {
        errors.push(`Term "${term.id}" is missing required field: ${field}`);
      }
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
      if (!Array.isArray(term[field])) {
        errors.push(`Term "${term.id}" is missing required array field: ${field}`);
      }
    }

    for (const path of BILINGUAL_FIELD_PATHS) {
      const value = getAtPath(term, path);
      if (!value || (!value.id && !value.en)) {
        errors.push(`Term "${term.id}" is missing required field: ${pathLabel(path)}`);
        continue;
      }
      if (!value.id) {
        warnings.push(`Term "${term.id}" field "${pathLabel(path)}" is missing an "id" translation`);
      }
      if (!value.en) {
        warnings.push(`Term "${term.id}" field "${pathLabel(path)}" is missing an "en" translation`);
      }
    }
  }

  for (const term of terms) {
    for (const refField of ['prerequisites', 'related']) {
      for (const refId of term[refField] || []) {
        if (!idSet.has(refId)) {
          errors.push(
            `Term "${term.id}" has ${refField} reference to unknown term id: "${refId}"`
          );
        }
      }
    }
  }

  return { errors, warnings };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- validateContent`
Expected: `5 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validateContent.js src/lib/validateContent.test.js
git commit -m "Add content schema validation logic"
```

---

### Task 3: Content Registry, CLI Script, and First Term (ETL)

**Files:**
- Create: `src/content/data-engineering/etl.js`
- Create: `src/content/data-engineering/index.js`
- Create: `src/content/index.js`
- Create: `scripts/validate-content.js`

**Interfaces:**
- Consumes: `validateTerms` from Task 2 (`src/lib/validateContent.js`).
- Produces: `tracks` (array of `{ id, name, terms, termCount }`), `allTerms` (flat array), `getTermById(id)`, `getTrackById(id)` — all exported from `src/content/index.js` and used by every page component in Tasks 8–10.

- [ ] **Step 1: Write the first term, `src/content/data-engineering/etl.js`**

```js
export default {
  id: 'etl',
  track: 'data-engineering',
  category: 'Pipeline',
  color: '#22d3ee',
  icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3',
  simulation: 'etl',
  tools: ['Apache Spark', 'SSIS', 'Talend', 'Informatica', 'Pentaho'],
  prerequisites: [],
  related: [],
  name: {
    id: 'ETL — Extract, Transform, Load',
    en: 'ETL — Extract, Transform, Load',
  },
  content: {
    description: {
      id: 'ETL adalah pola pemrosesan data klasik: data diambil dari sumbernya (Extract), diubah bentuknya di server staging terpisah — dibersihkan, digabung, diformat ulang (Transform) — baru kemudian dimuat ke tempat penyimpanan akhir seperti data warehouse (Load). Urutan ini penting: transformasi terjadi sebelum data sampai ke tujuan akhirnya, biasanya di server/engine ETL yang terpisah dari warehouse itu sendiri. Pola ini sudah dipakai puluhan tahun sebelum cloud data warehouse yang murah dan bertenaga jadi umum, karena dulu compute di warehouse mahal dan terbatas.',
      en: "ETL is the classic data processing pattern: data is pulled from its source (Extract), reshaped on a separate staging server — cleaned, joined, reformatted (Transform) — and only then loaded into its final destination such as a data warehouse (Load). The order matters: transformation happens before the data reaches its final destination, usually on an ETL engine/server separate from the warehouse itself. This pattern predates cheap, powerful cloud data warehouses by decades, back when warehouse compute was expensive and limited.",
    },
    concept: {
      id: 'Bayangkan kamu pindah rumah. Daripada masukin semua barang apa adanya ke rumah baru (termasuk barang rusak, kardus kosong, dan barang yang gak kepake lagi), kamu dulu sortir dan bersihin semuanya di garasi tetangga (staging) — buang yang rusak, gabung barang sejenis jadi satu kardus, kasih label rapi. Baru setelah itu, kamu angkut yang udah rapi ke rumah baru. Garasi tetangga itu "staging server", rumah baru itu "data warehouse".',
      en: 'Imagine moving houses. Instead of dumping everything into the new house as-is (including broken items, empty boxes, stuff you don\'t need anymore), you first sort and clean everything in a neighbor\'s garage (staging) — throw away what\'s broken, combine similar items into one labeled box. Only then do you move the tidy boxes into the new house. The neighbor\'s garage is the "staging server", the new house is the "data warehouse".',
    },
    methodology: {
      id: 'Tiga tahap berurutan: (1) Extract — baca data mentah dari sumber (database operasional, API, file), biasanya lewat query atau koneksi terjadwal. (2) Transform — di server/engine staging terpisah, data dibersihkan (hapus duplikat, null handling), digabung (join antar sumber), diagregasi, dan diformat ulang sesuai skema tujuan. (3) Load — hasil yang sudah bersih dimuat ke warehouse tujuan, biasanya lewat bulk insert terjadwal (batch).',
      en: 'Three sequential stages: (1) Extract — read raw data from the source (operational database, API, files), usually via a query or scheduled connection. (2) Transform — on a separate staging server/engine, data is cleaned (deduplication, null handling), joined across sources, aggregated, and reshaped to match the destination schema. (3) Load — the now-clean result is loaded into the destination warehouse, typically via a scheduled bulk batch insert.',
    },
    objective: {
      id: 'Sebelum data dianalisis, ia sering datang kotor, tersebar di banyak sistem, dan dalam format yang beda-beda. ETL dibutuhkan supaya orang yang menganalisis data selalu berhadapan dengan data yang sudah bersih dan konsisten di warehouse, bukan data mentah yang berantakan dari puluhan sumber berbeda.',
      en: 'Before data can be analyzed, it often arrives dirty, scattered across many systems, and in inconsistent formats. ETL exists so that the people analyzing data always work with data that is already clean and consistent in the warehouse, not raw, messy data from dozens of different sources.',
    },
    goal: {
      id: 'Warehouse tujuan hanya berisi data yang sudah tervalidasi, terduplikasi, dan terformat sesuai skema yang disepakati, sehingga query analitik di atasnya bisa langsung dipercaya tanpa perlu membersihkan data lagi setiap kali dipakai.',
      en: 'The destination warehouse contains only validated, deduplicated data formatted to an agreed schema, so analytical queries on top of it can be trusted immediately, without needing to re-clean the data every time it is used.',
    },
    exampleImplementation: {
      id: 'Alur teknis umum pakai Apache Spark sebagai engine transform:\n\n1. **Extract** — baca data dari MySQL:\n```sql\nSELECT * FROM klaim WHERE tanggal >= CURRENT_DATE - 1\n```\n2. **Transform** — di Spark, bersihkan dan gabung:\n```python\ndf = df.dropDuplicates(["klaim_id"]).join(dim_cabang, "cabang_id")\n```\n3. **Load** — tulis hasil ke warehouse:\n```python\ndf.write.mode("append").saveAsTable("warehouse.fact_klaim")\n```',
      en: 'A typical technical flow using Apache Spark as the transform engine:\n\n1. **Extract** — read data from MySQL:\n```sql\nSELECT * FROM claims WHERE claim_date >= CURRENT_DATE - 1\n```\n2. **Transform** — clean and join in Spark:\n```python\ndf = df.dropDuplicates(["claim_id"]).join(dim_branch, "branch_id")\n```\n3. **Load** — write the result to the warehouse:\n```python\ndf.write.mode("append").saveAsTable("warehouse.fact_claims")\n```',
    },
    exampleEnterprise: {
      id: 'Sebuah perusahaan asuransi menjalankan job ETL tiap malam jam 01.00: data klaim harian diambil dari database operasional, dibersihkan dan digabung dengan data cabang & nasabah di server staging terpisah, lalu dimuat ke data warehouse pusat. Tim analitik yang datang pagi harinya langsung bisa bikin laporan tanpa perlu membersihkan data sendiri.',
      en: 'An insurance company runs an ETL job every night at 1 AM: daily claims data is pulled from the operational database, cleaned and joined with branch and customer data on a separate staging server, then loaded into the central data warehouse. The analytics team arriving the next morning can immediately build reports without having to clean the data themselves.',
    },
    prosAndCons: {
      pros: {
        id: '- Data yang sampai ke warehouse sudah pasti bersih dan konsisten\n- Warehouse gak perlu compute besar karena transformasi terjadi di tempat lain\n- Cocok untuk warehouse lama yang computenya terbatas/mahal',
        en: '- Data arriving at the warehouse is guaranteed clean and consistent\n- The warehouse doesn\'t need heavy compute since transformation happens elsewhere\n- Well suited to older warehouses with limited/expensive compute',
      },
      cons: {
        id: '- Butuh server/engine transform terpisah, jadi ada biaya infrastruktur tambahan\n- Data mentah asli seringkali tidak disimpan, jadi sulit re-transform kalau ada kesalahan\n- Kurang fleksibel dibanding ELT modern yang transformnya di dalam warehouse',
        en: '- Requires a separate transform server/engine, adding infrastructure cost\n- The original raw data is often not retained, making it hard to re-transform if something goes wrong\n- Less flexible than modern ELT, which transforms inside the warehouse itself',
      },
    },
  },
};
```

- [ ] **Step 2: Write `src/content/data-engineering/index.js`**

```js
import etl from './etl';

export const dataEngineeringTerms = [etl];
```

- [ ] **Step 3: Write `src/content/index.js`**

```js
import { dataEngineeringTerms } from './data-engineering';

export const tracks = [
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    terms: dataEngineeringTerms,
    termCount: dataEngineeringTerms.length,
  },
];

export const allTerms = tracks.flatMap((track) => track.terms);

export function getTermById(id) {
  return allTerms.find((term) => term.id === id);
}

export function getTrackById(id) {
  return tracks.find((track) => track.id === id);
}
```

- [ ] **Step 4: Write the CLI script, `scripts/validate-content.js`**

```js
import { allTerms } from '../src/content/index.js';
import { validateTerms } from '../src/lib/validateContent.js';

const { errors, warnings } = validateTerms(allTerms);

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✖ ${error}`);
  }
  process.exit(1);
}

console.log(`✔ ${allTerms.length} term(s) validated, 0 errors, ${warnings.length} warning(s).`);
```

- [ ] **Step 5: Run the validator to confirm the first term passes**

Run: `npm run validate-content`
Expected: `✔ 1 term(s) validated, 0 errors, 0 warning(s).`

- [ ] **Step 6: Commit**

```bash
git add src/content scripts/validate-content.js
git commit -m "Add content registry, validation CLI, and ETL term"
```

---

### Task 4: Second Term (Caching Layers)

**Files:**
- Create: `src/content/data-engineering/caching-layers.js`
- Modify: `src/content/data-engineering/index.js`

**Interfaces:**
- Consumes: same shape as Task 3's `etl.js`.
- Produces: a second entry in `dataEngineeringTerms`, proving the schema and validator handle more than one term and more than one category.

- [ ] **Step 1: Write `src/content/data-engineering/caching-layers.js`**

```js
export default {
  id: 'caching-layers',
  track: 'data-engineering',
  category: 'Performa',
  color: '#22c55e',
  icon: 'M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01',
  simulation: 'caching',
  tools: ['Redis', 'CloudFlare CDN', 'Memcached', 'Varnish'],
  prerequisites: [],
  related: [],
  name: {
    id: 'Lapisan Cache (Caching Layers)',
    en: 'Caching Layers',
  },
  content: {
    description: {
      id: 'Caching layer adalah lapisan penyimpanan sementara yang diletakkan di antara pengguna dan sumber data utama (database), bertujuan menyimpan salinan data yang sering diakses supaya request berikutnya tidak perlu menempuh seluruh jalur menuju database. Dalam praktiknya, caching diterapkan berlapis-lapis: mulai dari cache di sisi browser pengguna, cache di edge/CDN yang tersebar secara geografis, hingga cache di server (misalnya Redis) yang berada dekat dengan aplikasi. Setiap lapisan punya karakteristik latency dan kapasitas berbeda.',
      en: "A caching layer is a temporary storage layer placed between the user and the primary data source (the database), designed to hold copies of frequently accessed data so subsequent requests don't need to travel the full path to the database. In practice, caching is applied in multiple tiers: from a cache on the user's browser, to a geographically distributed edge/CDN cache, to a server-side cache (e.g. Redis) sitting close to the application. Each layer has different latency and capacity characteristics.",
    },
    concept: {
      id: 'Bayangkan kamu tinggal di sebuah rumah. Barang yang paling sering kamu pakai — kunci, dompet, HP — kamu taruh di meja dekat pintu (cache paling dekat, paling cepat diambil). Barang yang agak jarang dipakai kamu taruh di lemari kamar. Kalau ternyata barangnya gak ada di kedua tempat itu, baru kamu ke toko (ini "database" — sumber kebenaran, tapi paling jauh dan paling lama dicapai). Begitu kamu beli dari toko, barang itu kamu taruh juga di meja dekat pintu, supaya lain kali gak perlu ke toko lagi.',
      en: "Imagine you live in a house. The things you use most often — keys, wallet, phone — you keep on a table by the door (the closest, fastest cache). Things you use less often go in a closet in your room. If it turns out the item isn't in either place, you go to the store (this is the \"database\" — the source of truth, but the farthest and slowest to reach). Once you buy it from the store, you also place it on the table by the door, so next time you don't need to go to the store again.",
    },
    methodology: {
      id: 'Request dicek berurutan dari layer paling cepat ke paling lambat: browser cache dulu, lalu CDN, lalu server cache (Redis). Kalau ditemukan di satu layer (cache hit), request langsung dijawab dari situ tanpa lanjut ke layer berikutnya. Kalau tidak ditemukan di semua layer (cache miss), barulah request diteruskan ke database, dan hasilnya disalin balik ke tiap layer cache yang dilewati tadi.',
      en: 'A request is checked sequentially from the fastest layer to the slowest: browser cache first, then CDN, then server cache (Redis). If found in any layer (a cache hit), the request is answered immediately from there without continuing further. If not found in any layer (a cache miss), the request is finally forwarded to the database, and the result is copied back into each cache layer it passed through.',
    },
    objective: {
      id: 'Database tidak sanggup menangani ribuan atau jutaan permintaan baca secara langsung — tiap permintaan yang benar-benar sampai ke database itu mahal (I/O, lock contention, latency tinggi). Caching dibutuhkan supaya sebagian besar traffic baca bisa diselesaikan sebelum menyentuh database sama sekali.',
      en: "A database can't directly handle thousands or millions of read requests — every request that actually reaches the database is expensive (I/O, lock contention, high latency). Caching exists so that most read traffic can be resolved before ever touching the database.",
    },
    goal: {
      id: 'Dari 1.000 permintaan baca, hanya segelintir (misalnya 3) yang benar-benar sampai ke database, sisanya terjawab di layer cache terdekat dengan latency mendekati 0ms, sehingga database tetap ringan walau traffic-nya tinggi.',
      en: 'Out of 1,000 read requests, only a handful (say, 3) actually reach the database — the rest are answered at the nearest cache layer with latency close to 0ms, keeping the database lightly loaded even under high traffic.',
    },
    exampleImplementation: {
      id: 'Cache diterapkan berlapis, dari yang paling dekat ke pengguna:\n\n1. **Browser** — diatur lewat response header:\n```\nCache-Control: max-age=3600\n```\n2. **CDN** — TTL edge cache diset lewat page rule provider (mis. Cloudflare).\n3. **Redis** — server-side cache dengan expiry otomatis:\n```\nSETEX user:42 3600 "<data>"\n```',
      en: 'Cache is applied in layers, from closest to the user:\n\n1. **Browser** — set via a response header:\n```\nCache-Control: max-age=3600\n```\n2. **CDN** — edge cache TTL set via the provider\'s page rules (e.g. Cloudflare).\n3. **Redis** — server-side cache with automatic expiry:\n```\nSETEX user:42 3600 "<data>"\n```',
    },
    exampleEnterprise: {
      id: 'Sebuah platform e-commerce menyimpan data profil produk yang sering dilihat di Redis dengan expiry 1 jam. Saat traffic melonjak pas flash sale, 97% permintaan lihat produk terjawab dari Redis, dan database utama tetap stabil melayani transaksi checkout yang jauh lebih kritikal.',
      en: 'An e-commerce platform stores frequently-viewed product profile data in Redis with a 1-hour expiry. During a flash-sale traffic spike, 97% of product-view requests are answered from Redis, keeping the primary database stable enough to serve the far more critical checkout transactions.',
    },
    prosAndCons: {
      pros: {
        id: '- Mengurangi beban database secara drastis untuk data yang sering diakses\n- Latency baca jadi jauh lebih rendah buat pengguna\n- Bisa diterapkan bertahap per layer tanpa mengubah database',
        en: "- Drastically reduces database load for frequently accessed data\n- Much lower read latency for users\n- Can be adopted incrementally, layer by layer, without changing the database",
      },
      cons: {
        id: '- Data di cache bisa basi kalau sumber datanya berubah tapi cache belum expire\n- Menambah kompleksitas: perlu strategi invalidation yang jelas\n- Butuh infrastruktur & monitoring tambahan (Redis, CDN, dst)',
        en: '- Cached data can go stale if the source changes before the cache expires\n- Adds complexity: requires a clear invalidation strategy\n- Requires additional infrastructure and monitoring (Redis, CDN, etc.)',
      },
    },
  },
};
```

- [ ] **Step 2: Update `src/content/data-engineering/index.js`**

```js
import etl from './etl';
import cachingLayers from './caching-layers';

export const dataEngineeringTerms = [etl, cachingLayers];
```

- [ ] **Step 3: Run the validator to confirm both terms pass**

Run: `npm run validate-content`
Expected: `✔ 2 term(s) validated, 0 errors, 0 warning(s).`

- [ ] **Step 4: Commit**

```bash
git add src/content/data-engineering/caching-layers.js src/content/data-engineering/index.js
git commit -m "Add Caching Layers term"
```

---

### Task 5: Progress/XP Tracking

**Files:**
- Create: `src/lib/progress.js`
- Test: `src/lib/progress.test.js`

**Interfaces:**
- Produces: `getTrackProgress(trackId) -> { seen: string[], xp: number }`, `markTermSeen(trackId, termId) -> { seen, xp }`, `getTotalXp(trackIds: string[]) -> number` — used by Task 8 (LandingPage) and Task 10 (TermDetailPage).

- [ ] **Step 1: Write the failing tests**

```js
// src/lib/progress.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getTrackProgress, markTermSeen, getTotalXp } from './progress';

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty progress for a track with no history', () => {
    expect(getTrackProgress('data-engineering')).toEqual({ seen: [], xp: 0 });
  });

  it('marks a term as seen and awards 10 xp', () => {
    const result = markTermSeen('data-engineering', 'etl');
    expect(result.seen).toEqual(['etl']);
    expect(result.xp).toBe(10);
  });

  it('does not award xp twice for the same term', () => {
    markTermSeen('data-engineering', 'etl');
    const result = markTermSeen('data-engineering', 'etl');
    expect(result.seen).toEqual(['etl']);
    expect(result.xp).toBe(10);
  });

  it('sums xp across multiple tracks', () => {
    markTermSeen('data-engineering', 'etl');
    markTermSeen('database', 'normalization');
    expect(getTotalXp(['data-engineering', 'database'])).toBe(20);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- progress`
Expected: FAIL — `progress.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

```js
// src/lib/progress.js
const STORAGE_PREFIX = 'progress:';
const XP_PER_TERM = 10;

export function getTrackProgress(trackId) {
  const raw = localStorage.getItem(STORAGE_PREFIX + trackId);
  if (!raw) return { seen: [], xp: 0 };
  return JSON.parse(raw);
}

export function markTermSeen(trackId, termId) {
  const progress = getTrackProgress(trackId);
  if (progress.seen.includes(termId)) return progress;
  const updated = {
    seen: [...progress.seen, termId],
    xp: progress.xp + XP_PER_TERM,
  };
  localStorage.setItem(STORAGE_PREFIX + trackId, JSON.stringify(updated));
  return updated;
}

export function getTotalXp(trackIds) {
  return trackIds.reduce((sum, id) => sum + getTrackProgress(id).xp, 0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- progress`
Expected: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/progress.js src/lib/progress.test.js
git commit -m "Add per-track progress/XP tracking with localStorage persistence"
```

---

### Task 6: Language Context

**Files:**
- Create: `src/i18n/LanguageContext.jsx`
- Test: `src/i18n/LanguageContext.test.jsx`

**Interfaces:**
- Produces: `<LanguageProvider>` and `useLanguage() -> { language: 'id' | 'en', toggleLanguage: () => void }` — used by every page component in Tasks 8–10.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/i18n/LanguageContext.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

function Consumer() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to "id"', () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('id');
  });

  it('toggles between id and en and persists to localStorage', () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(localStorage.getItem('language')).toBe('en');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- LanguageContext`
Expected: FAIL — `LanguageContext.jsx` does not exist yet.

- [ ] **Step 3: Write the implementation**

```jsx
// src/i18n/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'id'
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- LanguageContext`
Expected: `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/LanguageContext.jsx src/i18n/LanguageContext.test.jsx
git commit -m "Add global language toggle with localStorage persistence"
```

---

### Task 7: Markdown Rendering (MarkdownRenderer + CodeBlock)

**Files:**
- Create: `src/components/CodeBlock.jsx`
- Create: `src/components/MarkdownRenderer.jsx`
- Test: `src/components/MarkdownRenderer.test.jsx`

**Interfaces:**
- Produces: `<MarkdownRenderer text={string} />` — used by Task 10 (TermDetailPage) to render every content field.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/components/MarkdownRenderer.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders bold text', () => {
    render(<MarkdownRenderer text="this is **bold**" />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('renders fenced code blocks via CodeBlock with a language label', () => {
    render(<MarkdownRenderer text={'```bash\necho hi\n```'} />);
    expect(screen.getByText('bash')).toBeInTheDocument();
    expect(screen.getByText('echo hi')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- MarkdownRenderer`
Expected: FAIL — `MarkdownRenderer.jsx` does not exist yet.

- [ ] **Step 3: Write `src/components/CodeBlock.jsx`**

```jsx
import { useState } from 'react';

export function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-button bg-ink overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-black/20">
        <span className="text-caption font-semibold text-slate-gray uppercase">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="text-caption font-semibold text-pure-white/70 hover:text-pure-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-body text-pure-white">
        <code>{value}</code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 4: Write `src/components/MarkdownRenderer.jsx`**

```jsx
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

export function MarkdownRenderer({ text }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || '');
          if (inline) {
            return (
              <code className="px-1 py-0.5 rounded bg-hairline-border text-body">
                {children}
              </code>
            );
          }
          return (
            <CodeBlock
              language={match ? match[1] : ''}
              value={String(children).replace(/\n$/, '')}
            />
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- MarkdownRenderer`
Expected: `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/CodeBlock.jsx src/components/MarkdownRenderer.jsx src/components/MarkdownRenderer.test.jsx
git commit -m "Add MarkdownRenderer and CodeBlock components"
```

---

### Task 8: Landing Page (Track Selector)

**Files:**
- Create: `src/components/TrackCard.jsx`
- Create: `src/pages/LandingPage.jsx`
- Test: `src/pages/LandingPage.test.jsx`

**Interfaces:**
- Consumes: `tracks` from `src/content/index.js` (Task 3), `getTrackProgress`/`getTotalXp` from `src/lib/progress.js` (Task 5), `useLanguage` from `src/i18n/LanguageContext.jsx` (Task 6).
- Produces: `<LandingPage />`, routed at `/` in Task 11.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/pages/LandingPage.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderPage() {
  render(
    <MemoryRouter>
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a card for each track', () => {
    renderPage();
    expect(screen.getByText('Data Engineering')).toBeInTheDocument();
  });

  it('shows 0 XP when nothing has been learned yet', () => {
    renderPage();
    expect(screen.getByText('0 XP')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- LandingPage`
Expected: FAIL — `LandingPage.jsx` does not exist yet.

- [ ] **Step 3: Write `src/components/TrackCard.jsx`**

```jsx
import { Link } from 'react-router-dom';

export function TrackCard({ track, seenCount }) {
  const total = track.termCount;
  const pct = total === 0 ? 0 : Math.round((seenCount / total) * 100);

  return (
    <Link
      to={`/${track.id}`}
      className="block rounded-notification-card bg-pure-white shadow-card p-5 hover:shadow-card-hover transition-shadow"
    >
      <h3 className="text-card-title font-semibold text-ink">{track.name}</h3>
      <p className="text-label text-slate-gray mt-1">
        {seenCount}/{total} dipelajari
      </p>
      <div className="h-1.5 rounded-pill bg-hairline-border mt-3 overflow-hidden">
        <div
          className="h-full rounded-pill bg-indigo-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Write `src/pages/LandingPage.jsx`**

```jsx
import { useLanguage } from '../i18n/LanguageContext';
import { TrackCard } from '../components/TrackCard';
import { getTotalXp, getTrackProgress } from '../lib/progress';
import { tracks } from '../content';

export function LandingPage() {
  const { language, toggleLanguage } = useLanguage();
  const totalXp = getTotalXp(tracks.map((track) => track.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-heading font-bold text-ink">
          Design & Engineering Playground
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-label font-semibold text-ink">
            {language === 'id' ? 'ID' : 'EN'}
          </button>
          <span className="text-label font-semibold text-indigo-primary">{totalXp} XP</span>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            seenCount={getTrackProgress(track.id).seen.length}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- LandingPage`
Expected: `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/TrackCard.jsx src/pages/LandingPage.jsx src/pages/LandingPage.test.jsx
git commit -m "Add LandingPage with track cards and combined XP"
```

---

### Task 9: Track List Page (Category Sections, Filter Pills, Search)

**Files:**
- Create: `src/components/TermCard.jsx`
- Create: `src/pages/TrackListPage.jsx`
- Test: `src/pages/TrackListPage.test.jsx`

**Interfaces:**
- Consumes: `getTrackById` from `src/content/index.js` (Task 3), `useLanguage` from Task 6.
- Produces: `<TrackListPage />`, routed at `/:trackId` in Task 11.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/pages/TrackListPage.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TrackListPage } from './TrackListPage';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/data-engineering']}>
      <LanguageProvider>
        <Routes>
          <Route path="/:trackId" element={<TrackListPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('TrackListPage', () => {
  it('shows every category section when "All" is active', () => {
    renderPage();
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Performa')).toBeInTheDocument();
  });

  it('narrows to one category when its pill is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Pipeline' }));
    expect(screen.getByText('ETL — Extract, Transform, Load')).toBeInTheDocument();
    expect(screen.queryByText('Lapisan Cache (Caching Layers)')).not.toBeInTheDocument();
  });

  it('filters terms by search query', () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('Cari term...'), {
      target: { value: 'caching' },
    });
    expect(screen.queryByText('ETL — Extract, Transform, Load')).not.toBeInTheDocument();
    expect(screen.getByText('Lapisan Cache (Caching Layers)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- TrackListPage`
Expected: FAIL — `TrackListPage.jsx` does not exist yet.

- [ ] **Step 3: Write `src/components/TermCard.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export function TermCard({ term, trackId }) {
  const { language } = useLanguage();
  return (
    <Link
      to={`/${trackId}/${term.id}`}
      className="block rounded-notification-card bg-pure-white shadow-card p-4 hover:shadow-card-hover transition-shadow"
      style={{ borderTop: `3px solid ${term.color}` }}
    >
      <span
        className="text-caption font-semibold uppercase"
        style={{ color: term.color }}
      >
        {term.category}
      </span>
      <h3 className="text-card-title font-semibold text-ink mt-1">
        {term.name[language]}
      </h3>
    </Link>
  );
}
```

- [ ] **Step 4: Write `src/pages/TrackListPage.jsx`**

```jsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrackById } from '../content';
import { useLanguage } from '../i18n/LanguageContext';
import { TermCard } from '../components/TermCard';

export function TrackListPage() {
  const { trackId } = useParams();
  const { language } = useLanguage();
  const track = getTrackById(trackId);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = useMemo(
    () => ['All', ...new Set(track.terms.map((term) => term.category))],
    [track]
  );

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return track.terms.filter((term) => {
      if (!query) return true;
      return term.name[language].toLowerCase().includes(query);
    });
  }, [track, search, language]);

  const termsByCategory = useMemo(() => {
    const groups = {};
    for (const term of filteredTerms) {
      if (activeCategory !== 'All' && term.category !== activeCategory) continue;
      groups[term.category] = groups[term.category] || [];
      groups[term.category].push(term);
    }
    return groups;
  }, [filteredTerms, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-heading font-bold text-ink mb-4">{track.name}</h1>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cari term..."
        className="w-full rounded-input border border-hairline-border px-4 py-2 mb-4 text-body"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 rounded-pill text-label font-semibold ${
              activeCategory === category
                ? 'bg-indigo-wash text-indigo-primary'
                : 'bg-pure-white border border-hairline-border text-slate-gray'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {Object.entries(termsByCategory).map(([category, terms]) => (
        <section key={category} className="mb-8">
          <h2 className="text-section-title font-bold text-ink mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {terms.map((term) => (
              <TermCard key={term.id} term={term} trackId={track.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- TrackListPage`
Expected: `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/TermCard.jsx src/pages/TrackListPage.jsx src/pages/TrackListPage.test.jsx
git commit -m "Add TrackListPage with category sections, filter pills, and search"
```

---

### Task 10: Term Detail Page (Tabs, Metadata, Prev/Next)

**Files:**
- Create: `src/pages/TermDetailPage.jsx`
- Test: `src/pages/TermDetailPage.test.jsx`

**Interfaces:**
- Consumes: `getTermById`/`getTrackById` from Task 3, `useLanguage` from Task 6, `MarkdownRenderer` from Task 7, `markTermSeen` from Task 5.
- Produces: `<TermDetailPage />`, routed at `/:trackId/:termId` in Task 11.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/pages/TermDetailPage.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TermDetailPage } from './TermDetailPage';
import { LanguageProvider } from '../i18n/LanguageContext';
import { getTrackProgress } from '../lib/progress';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/data-engineering/etl']}>
      <LanguageProvider>
        <Routes>
          <Route path="/:trackId/:termId" element={<TermDetailPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('TermDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Overview content by default', () => {
    renderPage();
    expect(screen.getByText(/ETL adalah pola pemrosesan data klasik/)).toBeInTheDocument();
  });

  it('switches to Teknis tab content when clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Teknis' }));
    expect(screen.getByText(/Tiga tahap berurutan/)).toBeInTheDocument();
    expect(
      screen.queryByText(/ETL adalah pola pemrosesan data klasik/)
    ).not.toBeInTheDocument();
  });

  it('marks the term as seen and awards xp on mount', () => {
    renderPage();
    expect(getTrackProgress('data-engineering')).toEqual({ seen: ['etl'], xp: 10 });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- TermDetailPage`
Expected: FAIL — `TermDetailPage.jsx` does not exist yet.

- [ ] **Step 3: Write `src/pages/TermDetailPage.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTermById, getTrackById } from '../content';
import { useLanguage } from '../i18n/LanguageContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { markTermSeen } from '../lib/progress';

const TABS = ['overview', 'teknis', 'bisnis'];
const TAB_LABELS = { overview: 'Overview', teknis: 'Teknis', bisnis: 'Bisnis' };

export function TermDetailPage() {
  const { trackId, termId } = useParams();
  const { language } = useLanguage();
  const track = getTrackById(trackId);
  const term = getTermById(termId);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    markTermSeen(trackId, termId);
  }, [trackId, termId]);

  const index = track.terms.findIndex((t) => t.id === termId);
  const prevTerm = track.terms[index - 1];
  const nextTerm = track.terms[index + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/${trackId}`} className="text-label text-slate-gray">
        ← {track.name} / {term.category}
      </Link>
      <h1 className="text-heading font-bold text-ink mt-2">{term.name[language]}</h1>

      <div className="rounded-notification-card bg-hairline-border/40 h-40 flex items-center justify-center my-6 text-slate-gray text-label">
        Ilustrasi: {term.simulation}
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-button text-label font-semibold ${
              activeTab === tab ? 'bg-indigo-wash text-indigo-primary' : 'text-slate-gray'
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <MarkdownRenderer text={term.content.description[language]} />
          <MarkdownRenderer text={term.content.concept[language]} />
          <MarkdownRenderer text={term.content.objective[language]} />
          <MarkdownRenderer text={term.content.goal[language]} />
        </div>
      )}
      {activeTab === 'teknis' && (
        <div>
          <MarkdownRenderer text={term.content.methodology[language]} />
          <MarkdownRenderer text={term.content.exampleImplementation[language]} />
        </div>
      )}
      {activeTab === 'bisnis' && (
        <div>
          <MarkdownRenderer text={term.content.exampleEnterprise[language]} />
          <MarkdownRenderer text={term.content.prosAndCons.pros[language]} />
          <MarkdownRenderer text={term.content.prosAndCons.cons[language]} />
        </div>
      )}

      <div className="mt-8 text-label text-slate-gray space-y-1">
        <p><strong className="text-ink">Tools:</strong> {term.tools.join(', ')}</p>
        {term.prerequisites.length > 0 && (
          <p><strong className="text-ink">Prerequisites:</strong> {term.prerequisites.join(', ')}</p>
        )}
        {term.related.length > 0 && (
          <p><strong className="text-ink">Related:</strong> {term.related.join(', ')}</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        {prevTerm ? (
          <Link to={`/${trackId}/${prevTerm.id}`} className="text-indigo-primary text-label">
            ← {prevTerm.name[language]}
          </Link>
        ) : (
          <span />
        )}
        {nextTerm ? (
          <Link to={`/${trackId}/${nextTerm.id}`} className="text-indigo-primary text-label">
            {nextTerm.name[language]} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- TermDetailPage`
Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/TermDetailPage.jsx src/pages/TermDetailPage.test.jsx
git commit -m "Add TermDetailPage with tabs, metadata, and prev/next navigation"
```

---

### Task 11: Router Wiring and App Entry Point

**Files:**
- Create: `src/router.jsx`
- Create: `src/App.jsx`
- Create: `src/main.jsx`

**Interfaces:**
- Consumes: `LandingPage` (Task 8), `TrackListPage` (Task 9), `TermDetailPage` (Task 10), `LanguageProvider` (Task 6).
- Produces: the running app, verified manually via the dev server (this task has no new unit tests — the pages it wires together are already tested individually).

- [ ] **Step 1: Write `src/router.jsx`**

```jsx
import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TrackListPage } from './pages/TrackListPage';
import { TermDetailPage } from './pages/TermDetailPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/:trackId', element: <TrackListPage /> },
  { path: '/:trackId/:termId', element: <TermDetailPage /> },
]);
```

- [ ] **Step 2: Write `src/App.jsx`**

```jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LanguageProvider } from './i18n/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
```

- [ ] **Step 3: Write `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: Run the full test suite to confirm nothing broke**

Run: `npm test`
Expected: all tests across every file pass (smoke test + validateContent + progress + LanguageContext + MarkdownRenderer + LandingPage + TrackListPage + TermDetailPage).

- [ ] **Step 5: Start the dev server and manually verify the three routes**

Run: `npm run dev`
Expected: server starts (typically `http://localhost:5173`). Open it in a browser and confirm:
- `/` shows the Data Engineering track card with `0/2 dipelajari`
- `/data-engineering` shows two category sections, "Pipeline" and "Performa", each with one term card
- `/data-engineering/etl` shows the ETL detail page with working Overview/Teknis/Bisnis tabs, and after visiting it, going back to `/` shows `1/2 dipelajari` and `10 XP`

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 6: Commit**

```bash
git add src/router.jsx src/App.jsx src/main.jsx
git commit -m "Wire up routing and app entry point"
```

---

### Task 12: Deploy to Vercel

**Files:**
- Create: `vercel.json`

**Interfaces:**
- Consumes: the built `dist/` output from `npm run build`.
- Produces: a live static deployment.

- [ ] **Step 1: Write `vercel.json`** (SPA rewrite so client-side routes like `/data-engineering/etl` don't 404 on refresh)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Verify the production build works locally**

Run: `npm run build && npm run preview`
Expected: build succeeds with no errors; the preview server serves the same three routes correctly (spot-check `/`, `/data-engineering`, and `/data-engineering/etl`, including a hard refresh on the last one to confirm the rewrite works once deployed).

Stop the preview server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "Add Vercel SPA rewrite config"
```

- [ ] **Step 4: Deploy**

Run: `npx vercel --prod` (requires the user to authenticate/select the project interactively — this step is run by the user, not scripted further here)
Expected: Vercel prints a live production URL serving the app.

---

## Self-Review Notes

- **Spec coverage:** CONTENT-MODEL.md's schema (Task 3/4), validation rules (Task 2), and markdown/code-block authoring rules (Task 7) are all implemented and tested. APP-SHELL.md's routing (Task 11), landing page (Task 8), track list page with grouped categories + filter pills + search (Task 9), term detail page with tabs and prev/next (Task 10), language switching (Task 6), and progress/XP tracking (Task 5) are all implemented and tested. TECH-STACK.md's choices (plain JS, Tailwind v4, React Router, react-markdown, Vercel) are all used as specified.
- **Explicitly out of scope for this plan** (per GAME-LAYER.md and CONTENT-MODEL.md's incremental-authoring intent, and confirmed during brainstorming): porting the ~40 GSAP illustration/simulation functions from the old `data101 (1).html` (Task 10 renders a placeholder illustration slot instead), the interactive React Flow game layer (Sub-project C), and writing the remaining ~99 Data Engineering terms plus any other tracks (Sub-project D). These are follow-on plans built on top of this foundation.
- **Type consistency check:** `getTrackProgress`/`markTermSeen`/`getTotalXp` signatures (Task 5) match their usage in LandingPage (Task 8) and TermDetailPage (Task 10). `getTermById`/`getTrackById`/`tracks`/`allTerms` (Task 3) match their usage in all three page components. `useLanguage()`'s `{ language, toggleLanguage }` shape (Task 6) is used consistently across LandingPage, TrackListPage, TermDetailPage, and TermCard.
