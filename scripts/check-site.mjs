import { readFile } from 'node:fs/promises';
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
