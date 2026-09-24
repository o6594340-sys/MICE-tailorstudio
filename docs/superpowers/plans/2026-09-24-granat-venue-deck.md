# Granat Venue Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing seven-screen concept site with a 36-screen, navigable Russian presentation for selecting the venue of the November 2026 Granat event.

**Architecture:** Keep the static HTML, CSS and browser JavaScript stack. Store verified slide facts separately from rendering, add navigable venue sections and use official venue imagery only. Use the Granat visual system as a decision-making grammar: ruby signals, route diagrams, status labels and restrained editorial typography.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node assertion script.

**Spec:** `C:\Users\usrr\Downloads\ТЗ_навигационная_архитектура_презентации_ГРАНАТ_v2.md` and `C:\Users\usrr\Downloads\ТЗ_на_презентацию_ГРАНАТ_Запас_прочности_послайдово.md`

## Global Constraints

- Russian language, 16:9 composition, 36 meaningful slides.
- Exclude Cosmos Collection «Изумрудный лес» completely.
- Seven venues: MCC, Пересвет, «Ареал», FreshWind, AZIMUT Переславль, «Завидово», LES Art Resort.
- Preserve facts, numbers, venue-room names and confirmation status exactly as supplied.
- Do not use stock people, camouflage, construction jokes, gold luxury, QR codes or generic white cards.
- Venue images must come from official venue sources; absent imagery receives `Визуал запрашиваем у отеля`.
- All venue-site buttons are real links; all venue subsections have working internal navigation.
- Avoid unnecessary long dashes in Russian copy.
- No publication or access change until the user requests it after review.

## Review Focus

- Slide 6 must never include «Изумрудный лес» and must contain exactly seven venue cards.
- A venue may never display an unconfirmed rooming or activity claim as confirmed.
- Every venue section must provide an accessible return to the venue index and comparison slide.
- A supplied external venue link must be a real anchor with its exact official URL.
- The 390px layout must retain readable tables, status labels and controls.

---

### Task 1: Replace presentation data with decision architecture

**Files:**
- Modify: `dist/content.js`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Produces: `slides`, an ordered array of 36 renderable slide objects with `id`, `kind`, `title`, `content`, `status`, `links` and `navigation` fields.

- [ ] **Step 1: Write the failing test**

```js
assert.equal(slides.length, 36);
assert.deepEqual(slides.slice(7, 35).map(({ venue }) => venue), [
  'Moscow Country Club', 'Moscow Country Club', 'Moscow Country Club', 'Moscow Country Club',
  'Русские Сезоны Курорт Пересвет', 'Русские Сезоны Курорт Пересвет', 'Русские Сезоны Курорт Пересвет', 'Русские Сезоны Курорт Пересвет',
]);
assert.doesNotMatch(JSON.stringify(slides), /Изумрудн/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/check-site.mjs`

Expected: failing assertion because the old deck contains seven slides.

- [ ] **Step 3: Write minimal implementation**

Create the 36-slide ordered data model from navigation v2. Use slides 1–7 for event logic and selection, slides 8–34 for the seven venue mini-sections, slide 35 for comparison and slide 36 for the short-list action.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/check-site.mjs`

Expected: all assertions pass.

### Task 2: Build decision-oriented slide renderers

**Files:**
- Modify: `dist/main.js`
- Modify: `dist/styles.css`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: typed slide objects from `content.js`.
- Produces: semantic deck sections, status labels, real anchors, venue navigation controls and responsive comparison tables.

- [ ] **Step 1: Write the failing test**

```js
assert.match(main, /function renderVenueNavigation/);
assert.match(main, /target="_blank"/);
assert.match(css, /\.venue-status--confirmed/);
assert.match(css, /\.venue-status--request/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/check-site.mjs`

Expected: failing assertion because the old renderer only supports narrative screens.

- [ ] **Step 3: Write minimal implementation**

Add renderers for the venue catalogue, photographic fact panels, scenario matrix, comparison table and fixed bottom navigation. Keep controls small, focusable and consistent. Use actual anchors for official venue URLs.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/check-site.mjs`

Expected: all assertions pass.

### Task 3: Establish the Granat decision visual system

**Files:**
- Modify: `dist/styles.css`
- Create: `dist/assets/` venue image manifest or approved local assets

**Interfaces:**
- Produces: dark graphite surface, ruby decision signals, graphic route motifs and distinct layout modes for context, catalogue, venue facts and comparison.

- [ ] **Step 1: Write the failing test**

```js
assert.match(css, /\.slide--venue-portrait/);
assert.match(css, /\.slide--venue-facts/);
assert.match(css, /\.slide--venue-scenario/);
assert.match(css, /\.slide--comparison/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/check-site.mjs`

Expected: failing assertion because the current CSS has only seven scene styles.

- [ ] **Step 3: Write minimal implementation**

Create one coherent system with four different compositions. Use ruby only to show recommendation, route, focus and status. Never reuse one background as a substitute for venue evidence.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/check-site.mjs`

Expected: all assertions pass.

### Task 4: Add verified official media and source attribution

**Files:**
- Modify: `dist/content.js`
- Create: `dist/assets/venue-*`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: official media URLs or supplied venue assets.
- Produces: distinct accommodation, conference and evening-space media references per venue, with source anchors or honest missing-visual labels.

- [ ] **Step 1: Write the failing test**

```js
for (const slide of slides.filter(({ venue }) => venue)) {
  assert.ok(slide.media?.sourceUrl || slide.media?.status === 'request');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/check-site.mjs`

Expected: failing assertion because existing synthetic artwork has no official source.

- [ ] **Step 3: Write minimal implementation**

Attach only traceable official venue imagery and source links. If one is unavailable, render the required request label without inventing a replacement.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/check-site.mjs`

Expected: all assertions pass.

### Task 5: Verify the deck and prepare review

**Files:**
- Modify: `scripts/check-site.mjs` only if an uncovered regression needs a durable test.

- [ ] **Step 1: Run content and interaction checks**

Run: `node scripts/check-site.mjs`

Expected: passing 36-slide, links, exclusion and status assertions.

- [ ] **Step 2: Inspect desktop and 390px layouts**

Capture the title, venue catalogue, one venue mini-section, comparison slide and final action slide at both sizes. Check typography, controls, table overflow and status contrast.

- [ ] **Step 3: Run the UI detector**

Run: `node C:\Users\usrr\.agents\skills\impeccable\scripts\detect.mjs --json dist/index.html dist/styles.css dist/main.js`

Expected: address mechanical findings in one batch.

- [ ] **Step 4: Present the reviewed local deck**

Do not deploy. Ask for approval of the complete content and visual system before any public release.
