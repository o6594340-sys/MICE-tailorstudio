import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

assert.match(html, /<a class="skip-link" href="#main-content">/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /<div id="slides-root"><\/div>/);

const { slides } = await import(new URL('../dist/content.js', import.meta.url));

assert.equal(slides.length, 7);
assert.deepEqual(slides.map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7]);
assert.equal(slides[1].title, 'Прочность не берётся из воздуха.');
assert.equal(slides[3].closing, 'Здесь не слушают лекцию. Здесь сверяют опыт.');
assert.equal(slides[6].closing, 'ГРАНАТ. Запас прочности — в своём круге.');
assert.match(slides[5].body, /конкретную механику выберем под площадку/);

const main = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8');

assert.match(main, /function renderSlides\(slideData\)/);
assert.match(main, /new IntersectionObserver/);
assert.match(main, /window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);

const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');

for (const value of [
  ':root',
  '.screen--experience',
  '.screen--circle',
  '.screen--rhythm',
  '.screen--finale',
  '@media (prefers-reduced-motion: reduce)',
  '@media (max-width: 640px)',
]) {
  assert.ok(css.includes(value), `Missing ${value}`);
}

assert.match(css, /--granat-red:\s*#B1000B/i);
assert.match(css, /overflow-x:\s*clip/);
assert.match(css, /\.screen--rhythm \.screen-title\s*\{\s*max-width:\s*none;\s*font-size:\s*clamp\(2rem, 9vw, 3\.4rem\);/);

for (const asset of [
  'assets/granat-forum-hall.png',
  'assets/granat-club-night.png',
  'assets/granat-club-challenge.png',
  'assets/granat-community-finale.png',
]) {
  assert.ok(css.includes(asset), `Missing refreshed club visual: ${asset}`);
  await access(new URL(`../dist/${asset}`, import.meta.url));
}

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

assert.match(readme, /python -m http\.server 4173 --directory dist/);
assert.match(readme, /node scripts\/check-site\.mjs/);
