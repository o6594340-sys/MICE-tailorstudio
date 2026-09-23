# ГРАНАТ. Запас прочности Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish an accessible responsive one-page presentation of the seven approved «ГРАНАТ. Запас прочности» screens.

**Architecture:** A buildless static Site lives in `dist/`. `content.js` is the sole source of visible event copy; `main.js` renders semantic slide sections from it; `styles.css` owns the visual system. A small Node verifier prevents accidental loss or rewording of approved material before release.

**Tech Stack:** Static HTML, CSS, vanilla ES modules, Node.js built-in modules, Sites static hosting.

**Spec:** `docs/superpowers/specs/2026-09-23-granat-zapas-prochnosti-design.md`

## Global Constraints

- Create only the seven-screen concept presentation. Do not add registration, tickets, forms, CMS, storage, integrations, or a general club website.
- Preserve the source TЗ copy and meaning. `dist/content.js` is the only visible-content source.
- Use deep black, `#B1000B`, and a red-pink gradient as a local light source, not an all-page wash.
- Screens 4–7 must be dense atmospheric scenes with the existing large meaning phrases, never sparse text on black.
- Exclude literal pomegranates outside the brand mark, Oriental decor, gold, concrete, camouflage, confetti, white cards, gym imagery and default corporate-landing patterns.
- In co-branding, TNPRO is left and Granat is right, separated by `×` and clear space.
- Support semantic landmarks, skip link, visible focus, contrast-safe text, `prefers-reduced-motion`, and zero horizontal scroll at 320px.
- Publish privately through Sites only after all checks pass. Document local preview and validation in README.

## Review Focus

- The checker asserts seven ordered screen ids, mandated Russian phrases, and conditional wording for venue-dependent elements.
- Browser QA covers 320px and 1440px widths, no clipping or horizontal scroll, and keyboard navigation.
- Reduced-motion disables non-essential visual movement.
- Co-branding never displays Granat ahead of TNPRO.
- SPA, fire, bar, and challenge are presented only with the TЗ’s conditional/choice framing, not as guaranteed venue inventory.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `dist/index.html` | Document shell, metadata, skip link, co-brand header, slide root. |
| `dist/content.js` | Seven approved text/data objects. |
| `dist/main.js` | Semantic section rendering, navigation and active-screen state. |
| `dist/styles.css` | Tokens, seven scene compositions, responsive and accessibility rules. |
| `dist/assets/granat-mark.svg` | Web-ready vector mark prepared from supplied approved material. |
| `scripts/check-site.mjs` | Dependency-free source/content verification. |
| `.openai/hosting.json` | Static Sites manifest. |
| `README.md` | Local preview and verification commands. |

### Task 1: Create the static Site shell and brand asset

**Files:**
- Create: `dist/index.html`
- Create: `dist/assets/granat-mark.svg`
- Create: `.openai/hosting.json`
- Create: `scripts/check-site.mjs`

**Interfaces:**
- Produces: `<main id="main-content">` and `<div id="slides-root"></div>` for `renderSlides(slideData)`.

- [ ] **Step 1: Write the failing shell test**

```js
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(html, /<a class="skip-link" href="#main-content">/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /<div id="slides-root"><\/div>/);
```

- [ ] **Step 2: Run it and verify failure**

Run: `node scripts/check-site.mjs`

Expected: failure because `dist/index.html` is absent.

- [ ] **Step 3: Create the accessible shell**

Implement the exact skeleton:

```html
<body>
  <a class="skip-link" href="#main-content">Перейти к содержанию</a>
  <header class="site-header" aria-label="Навигация по презентации">
    <a class="brand-lockup" href="#screen-1" aria-label="TNPRO × Гранат">
      <span class="tnpro-wordmark">TNPRO</span><span aria-hidden="true">×</span>
      <img src="assets/granat-mark.svg" alt="Гранат" width="120" height="40">
    </a>
    <nav aria-label="Экраны презентации"><ol id="screen-nav"></ol></nav>
  </header>
  <main id="main-content"><div id="slides-root"></div></main>
  <script type="module" src="main.js"></script>
</body>
```

Prepare `granat-mark.svg` as a vector brand asset from the supplied approved source, with no PDF-page background. Add `.openai/hosting.json`:

```json
{ "static": { "directory": "dist" } }
```

- [ ] **Step 4: Verify the shell**

Run: `node scripts/check-site.mjs`

Expected: exit code `0`.

- [ ] **Step 5: Commit**

```bash
git add dist/index.html dist/assets/granat-mark.svg .openai/hosting.json scripts/check-site.mjs
git commit -m "feat: add Granat static site shell"
```

### Task 2: Freeze approved copy in one content module

**Files:**
- Create: `dist/content.js`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Produces: `export const slides`, an ordered seven-item array consumed by `renderSlides(slides)`.

- [ ] **Step 1: Extend the checker with a failing content test**

```js
const { slides } = await import(new URL('../dist/content.js', import.meta.url));
assert.equal(slides.length, 7);
assert.deepEqual(slides.map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7]);
assert.equal(slides[1].title, 'Прочность не берётся из воздуха.');
assert.equal(slides[3].closing, 'Здесь не слушают лекцию. Здесь сверяют опыт.');
assert.equal(slides[6].closing, 'ГРАНАТ. Запас прочности — в своём круге.');
assert.match(slides[5].body, /конкретную механику выберем под площадку/);
```

- [ ] **Step 2: Run it and verify failure**

Run: `node scripts/check-site.mjs`

Expected: module-not-found for `dist/content.js`.

- [ ] **Step 3: Implement the seven source objects**

```js
export const slides = [{
  id: 1, scene: 'title',
  eyebrow: 'Встреча клуба подрядчиков ТЕХНОНИКОЛЬ',
  title: 'ГРАНАТ', displayTitle: 'Запас прочности',
  meta: 'Ноябрь 2026 · Подмосковье',
  body: '', items: [], closing: ''
}];
```

Add six remaining objects with scenes `concept`, `sources`, `experience`, `circle`, `rhythm`, `finale`. Copy paragraphs to `body`, TЗ bullets to `items`, and mandatory accent phrases to `closing`; do not add marketing copy or venue guarantees.

- [ ] **Step 4: Verify content**

Run: `node scripts/check-site.mjs`

Expected: exit code `0`.

- [ ] **Step 5: Commit**

```bash
git add dist/content.js scripts/check-site.mjs
git commit -m "feat: add approved Granat presentation content"
```

### Task 3: Render semantic screens and navigation

**Files:**
- Create: `dist/main.js`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: `slides: Array<{id, scene, eyebrow, title, displayTitle, meta, body, items, closing}>`.
- Produces: `section#screen-{id}.screen--{scene}` and matching navigation links.

- [ ] **Step 1: Add failing progressive-enhancement assertions**

```js
const main = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8');
assert.match(main, /function renderSlides\(slideData\)/);
assert.match(main, /new IntersectionObserver/);
assert.match(main, /window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
```

- [ ] **Step 2: Run it and verify failure**

Run: `node scripts/check-site.mjs`

Expected: file-not-found for `dist/main.js`.

- [ ] **Step 3: Implement data-to-DOM rendering**

```js
function renderSlides(slideData) {
  const root = document.querySelector('#slides-root');
  root.replaceChildren(...slideData.map(renderSlide));
}

function renderSlide(slide) {
  const section = document.createElement('section');
  section.id = `screen-${slide.id}`;
  section.className = `screen screen--${slide.scene}`;
  section.setAttribute('aria-labelledby', `screen-${slide.id}-title`);
  return section;
}
```

Create child nodes using `textContent`, including optional list and closing phrase. Render `#screen-nav` from the data. Use one `IntersectionObserver` to set `aria-current="true"`. Only add `has-motion` when `matchMedia('(prefers-reduced-motion: reduce)').matches` is false.

- [ ] **Step 4: Verify syntax and renderer contract**

Run: `node --check dist/main.js; node --check dist/content.js; node scripts/check-site.mjs`

Expected: all commands exit `0`.

- [ ] **Step 5: Commit**

```bash
git add dist/main.js scripts/check-site.mjs
git commit -m "feat: render seven Granat presentation screens"
```

### Task 4: Build the visual system and seven scenes

**Files:**
- Create: `dist/styles.css`
- Modify: `dist/index.html`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: screen scene classes and `has-motion`.
- Produces: responsive scenes at 1440px and 320px, including focus and reduced-motion states.

- [ ] **Step 1: Add failing visual-contract tests**

```js
const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
for (const value of [':root', '.screen--experience', '.screen--circle', '.screen--rhythm', '.screen--finale', '@media (prefers-reduced-motion: reduce)', '@media (max-width: 640px)']) {
  assert.ok(css.includes(value), `Missing ${value}`);
}
assert.match(css, /--granat-red:\s*#B1000B/i);
assert.match(css, /overflow-x:\s*clip/);
```

- [ ] **Step 2: Run it and verify failure**

Run: `node scripts/check-site.mjs`

Expected: file-not-found for `dist/styles.css`.

- [ ] **Step 3: Implement scene-specific CSS**

Add the stylesheet link to `index.html`, then define:

```css
:root {
  --ink: #08090d;
  --ink-raised: #11121a;
  --granat-red: #B1000B;
  --granat-glow: linear-gradient(135deg, #8c0014 0%, #ff0057 58%, #ffb1ca 100%);
  --text: #f5f3f0;
  --muted: #b5b2b5;
}
html { overflow-x: clip; scroll-behavior: smooth; }
body { margin: 0; background: var(--ink); color: var(--text); }
```

Use CSS grid, type and pseudo-element light fields only. Scenes 1–2 have minimal depth; 3 is an uneven connected triptych; 4 is a dense peer-to-peer professional route; 5 is a warm club rhythm; 6 is an open choice-map; 7 is a dark circular finale. Add `:focus-visible`, `.skip-link:focus`, and a reduced-motion block that disables animation and transition. At `max-width: 640px`, use one column and readable hierarchy without horizontal scroll.

- [ ] **Step 4: Verify static visual contracts**

Run: `node scripts/check-site.mjs`

Expected: exit code `0`.

- [ ] **Step 5: Commit**

```bash
git add dist/styles.css dist/index.html scripts/check-site.mjs
git commit -m "feat: style Granat ruby-light presentation"
```

### Task 5: Add runbook, perform QA and publish privately

**Files:**
- Create: `README.md`
- Modify: `scripts/check-site.mjs` only if QA reveals a source-level defect.

**Interfaces:**
- Consumes: final static output in `dist/`.
- Produces: a verified private Sites URL and reproducible local workflow.

- [ ] **Step 1: Add a failing readiness test**

```js
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
assert.match(readme, /python -m http\.server 4173 --directory dist/);
assert.match(readme, /node scripts\/check-site\.mjs/);
```

- [ ] **Step 2: Run it and verify failure**

Run: `node scripts/check-site.mjs`

Expected: file-not-found for `README.md`.

- [ ] **Step 3: Write exact operating instructions**

```markdown
## Локальный просмотр
python -m http.server 4173 --directory dist

Откройте http://localhost:4173.

## Проверка
node scripts/check-site.mjs
node --check dist/content.js
node --check dist/main.js
```

State that the sibling `Granat club` materials are reference-only and untouched.

- [ ] **Step 4: Verify source and browser behaviour**

Run: `node scripts/check-site.mjs; node --check dist/content.js; node --check dist/main.js`.

Serve `dist` and inspect at 1440px and 320px. Verify all seven scenes, navigation, readable Russian text, keyboard focus, no horizontal overflow and motion reduction. Confirm screens 4–7 feel scenographic and dense without extra programme promises.

- [ ] **Step 5: Release with Sites**

Use the Sites static workflow for this checkout: archive output, save version, deploy privately, then report the URL only after status is `succeeded`.

- [ ] **Step 6: Commit**

```bash
git add README.md scripts/check-site.mjs
git commit -m "docs: add Granat site runbook"
```

## Plan self-review

- **Spec coverage:** Tasks 1–4 cover structure, co-branding, black/ruby visual system, dense scenes 4–7, source-controlled copy, responsive design, accessibility and motion. Task 5 covers README, verification, visual QA and private release.
- **Placeholder scan:** This plan contains no deferred requirements or undefined interfaces.
- **Type consistency:** `slides` is defined in Task 2, consumed by `renderSlides(slideData)` in Task 3, and its `scene` values match Task 4 selectors.
- **Review-focus mapping:** content fidelity is tested in Task 2; viewport, motion and hierarchy are tested and inspected in Tasks 4–5; conditional venue wording is tested in Task 2 and reviewed in Task 5.
