# Granat Venue Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** End the main Granat presentation at the venue catalogue and open every venue in a compact, URL-addressable detail view.

**Architecture:** Keep the static HTML presentation. Split `content.js` into four main-flow slides and an exported venue-detail collection with stable slugs and three existing-content tabs. Let `main.js` render either the main flow or one venue from the hash route; do not add a design system or fetch data.

**Tech Stack:** Static ES modules, HTML, CSS, Node.js assertions in `scripts/check-site.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-24-granat-venue-navigation-design.md`

## Global Constraints

- Do not rewrite, add, or remove surviving venue copy, photos, colour tokens, typography, or art direction.
- Do not expose prices, budgets, or financial blocks.
- Main-flow navigation ends at the catalogue; it has no finalist, comparison, shortlist, or sequential venue screens.
- Every venue view has `Общее`, `Размещение и деловая часть`, `Сценарий`, and `← К площадкам`.
- Preserve external venue-site links and keyboard-accessible interactions.

## Review Focus

- Direct `#venue/<slug>` loads must render the intended venue.
- Unknown slugs must recover to the catalogue.
- Browser Back from a detail view must return to the catalogue.
- Missing optional media must not break a tab.
- Primary navigation must have exactly four entries.

---

### Task 1: Separate main-flow and venue-detail data

**Files:**
- Modify: `dist/content.js`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Produces: `slides` with IDs 1–4 only.
- Produces: `venueDetails` as `{ slug, title, tabs, externalUrl }[]`.

- [ ] **Step 1: Write a failing structural assertion**

Add this to `scripts/check-site.mjs`:

```js
assert.equal(slides.length, 4);
assert.equal(venueDetails.length, 7);
assert.deepEqual(Object.keys(venueDetails[0].tabs), ['general', 'facts', 'scenario']);
```

- [ ] **Step 2: Prove the assertion fails**

Run `node scripts/check-site.mjs`. Expected: failure because the current module has the long vertical `slides` array and no `venueDetails` export.

- [ ] **Step 3: Implement the compact data model**

Export only existing slides 1–4 as `slides`. Map the current portrait, facts, scenario, decision items, closing text and media into `venueDetails` for all seven cards. Preserve wording and arrays in their current order. Use deterministic slugs such as `moscow-country-club`; put decision items and closing in `scenario` so no venue fact disappears.

- [ ] **Step 4: Prove the structural assertions pass**

Run `node scripts/check-site.mjs`. Expected: exit code 0.

- [ ] **Step 5: Commit the data split**

Run:

```bash
git add dist/content.js scripts/check-site.mjs
git commit -m "feat: separate Granat venue detail data"
```

### Task 2: Render compact route-based venue details

**Files:**
- Modify: `dist/main.js`
- Modify: `dist/styles.css`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: `slides` and `venueDetails`.
- Produces: `parseVenueRoute()`, `renderRoute()`, and keyboard-accessible tab controls.

- [ ] **Step 1: Write failing route checks**

Add checks requiring `parseVenueRoute`, `venueDetails.find`, `← К площадкам`, a `tablist`, and all three tab labels. Example:

```js
assert.match(mainSource, /function parseVenueRoute\(/);
assert.match(mainSource, /← К площадкам/);
assert.match(mainSource, /role', 'tablist'/);
assert.match(mainSource, /'Размещение и деловая часть'/);
```

- [ ] **Step 2: Prove the route checks fail**

Run `node scripts/check-site.mjs`. Expected: failure because cards currently point to `#screen-<number>`.

- [ ] **Step 3: Implement routing and tabs**

Make venue cards link to `#venue/<slug>`. `parseVenueRoute()` resolves that slug from `venueDetails`; `renderRoute()` replaces `#slides-root` with either four main slides or one venue view. An unknown venue hash must replace itself with `#screen-4`. Render three existing-data tabs as `button` controls in a `role="tablist"`; their matching panels preserve media and items. Add an anchor `← К площадкам` with `href="#screen-4"` and retain the external venue link.

- [ ] **Step 4: Add only scoped control styles**

Add rules for `.venue-detail`, `.venue-tabs`, `.venue-tab`, and `.venue-tab-panel`, reusing existing CSS variables, focus treatments, media cards and responsive breakpoint. Do not alter existing header, cards, image, font, or colour-token rules.

- [ ] **Step 5: Prove interaction checks pass**

Run `node scripts/check-site.mjs`. Expected: exit code 0 and no sequential venue link pattern.

- [ ] **Step 6: Commit the interaction**

Run:

```bash
git add dist/main.js dist/styles.css scripts/check-site.mjs
git commit -m "feat: open Granat venues in detail views"
```

### Task 3: Lock the flow and verify it in the browser

**Files:**
- Modify: `README.md`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Consumes: completed main and venue-detail renderers.
- Produces: documented routes and regression coverage.

- [ ] **Step 1: Add a regression check for the main route**

Add:

```js
assert.deepEqual(slides.map(({ id }) => id), [1, 2, 3, 4]);
assert.doesNotMatch(mainSource, /card\.href = `#screen-/);
```

- [ ] **Step 2: Run the regression check**

Run `node scripts/check-site.mjs`. Expected: exit code 0 on the completed implementation.

- [ ] **Step 3: Document supported routes**

Add this concise README section:

```markdown
## Navigation

- `#screen-1` through `#screen-4` — main presentation.
- `#venue/<slug>` — one venue detail view; `← К площадкам` returns to `#screen-4`.
```

- [ ] **Step 4: Verify visual flow locally**

Check that the fourth main screen is final; a finalist and a non-finalist card both open venue details; each view has three tabs; the back link returns to the catalogue; and an invalid venue hash recovers to the catalogue.

- [ ] **Step 5: Run the full verification**

Run `node scripts/check-site.mjs`. Expected: exit code 0.

- [ ] **Step 6: Commit checks and documentation**

Run:

```bash
git add README.md scripts/check-site.mjs
git commit -m "test: lock Granat venue navigation flow"
```
