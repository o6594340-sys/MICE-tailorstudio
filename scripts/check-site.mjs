import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

assert.match(html, /<a class="skip-link" href="#main-content">/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /<div id="slides-root"><\/div>/);

const { slides, venueLinks } = await import(new URL('../dist/content.js', import.meta.url));

assert.equal(slides.length, 35);
assert.deepEqual(slides.map(({ id }) => id), Array.from({ length: 35 }, (_, index) => index + 1));
assert.equal(slides[1].title, 'Условия для сильного разговора и нормального отдыха');
assert.equal(slides[4].title, 'Семь площадок. Три рекомендации.');
assert.equal(slides[5].title, 'Три финалиста с разными маршрутами события');
assert.equal(slides[33].title, 'Сравнение финалистов и резервов по ключевым параметрам');
assert.equal(slides[34].title, 'Финальный шорт-лист');
assert.doesNotMatch(JSON.stringify(slides), /Критерии выбора площадки/u);
assert.equal(slides[2].body, 'Опыт, профессиональный круг, фокус, умение действовать командой. Площадка обязана выдерживать весь сценарий.');
assert.equal(slides[4].body, 'Единая логика оценки: дорога, размещение, зал, два вечера, «Точный ход», маршруты, бюджет, ограничения.');
assert.deepEqual(slides[4].venueCards.map(({ screen }) => screen), [7, 11, 15, 19, 23, 27, 31]);
assert.deepEqual([...new Set(slides.filter(({ venue }) => venue).map(({ venue }) => venue))], [
  'Moscow Country Club', 'Пересвет', '«Ареал»', 'FreshWind', 'AZIMUT Переславль', '«Завидово»', 'LES Art Resort',
]);
assert.doesNotMatch(JSON.stringify(slides), /Изумрудн|сигар|Точка опоры|можно остаться собой|—/u);
assert.doesNotMatch(JSON.stringify(slides), /Подтвердить|подтвердить|подтвержд|уточнить|Уточнить|запросить|Запросить|требует|Требует|спорного НДС|вопросы к площадкам/u);
assert.equal(Object.keys(venueLinks).length, 7);
assert.equal(venueLinks['Пересвет'], 'https://peresvethotel.ru/');
const freshWindSlides = slides.filter(({ venue }) => venue === 'FreshWind');
assert.equal(freshWindSlides[3].closing, 'Резерв: компактный вариант для более камерного сценария.');
assert.deepEqual(freshWindSlides[1].media.map(({ src }) => src), [
  'assets/freshwind-room.jpg',
  'assets/freshwind-conference-hall.jpg',
]);
assert.equal(freshWindSlides[2].media[0].src, 'assets/freshwind-bowling.jpg');
const mccSlides = slides.filter(({ venue }) => venue === 'Moscow Country Club');
assert.equal(mccSlides[1].media[0].src, 'assets/mcc-forest-country-hall.jpg');
assert.equal(mccSlides[2].media[0].src, 'assets/mcc-accents.jpg');
const peresvetSlides = slides.filter(({ venue }) => venue === 'Пересвет');
assert.equal(peresvetSlides[0].media[0].src, 'assets/peresvet-night.jpg');
assert.equal(peresvetSlides[1].media[0].src, 'assets/peresvet-stravinsky.jpg');
const azimutSlides = slides.filter(({ venue }) => venue === 'AZIMUT Переславль');
assert.equal(azimutSlides[1].media[0].src, 'assets/azimut-zalesskiy-theatre.jpg');
assert.equal(azimutSlides[2].media[0].src, 'assets/azimut-pereslavl-banquet.jpg');
const arealSlides = slides.filter(({ venue }) => venue === '«Ареал»');
assert.equal(arealSlides[0].media[0].src, 'assets/areal-marmelada.jpg');
assert.equal(arealSlides[1].media[0].src, 'assets/areal-dunay.jpg');
assert.equal(arealSlides[2].media[0].src, 'assets/areal-kurshevel.jpg');
const zavidovoSlides = slides.filter(({ venue }) => venue === '«Завидово»');
assert.equal(zavidovoSlides[3].closing, 'Резерв: сильный модуль «Точный ход», но длинный маршрут и погодный риск.');
assert.equal(zavidovoSlides[1].media[0].src, 'assets/zavidovo-chaika.jpg');
assert.equal(zavidovoSlides[2].media[0].src, 'assets/zavidovo-sadko.jpg');
assert.equal(zavidovoSlides[2].media[1].src, 'assets/zavidovo-shooting-centre.jpg');
const lesSlides = slides.filter(({ venue }) => venue === 'LES Art Resort');
assert.equal(lesSlides[0].media[0].src, 'assets/les-placeholder-resort.png');
assert.equal(lesSlides[1].media[0].src, 'assets/les-conference-hall.jpg');
assert.equal(lesSlides[2].media[0].src, 'assets/les-banquet-hall.jpg');
assert.match(lesSlides[1].items[1].text, /455 м²/u);
assert.match(lesSlides[2].items[0].text, /«Оптимус», 300 м²/u);
assert.match(lesSlides[2].items[1].text, /боулинга/u);

const main = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8');

assert.match(main, /function renderSlides\(slideData\)/);
assert.match(main, /function renderVenueNavigation/);
assert.match(main, /function renderMedia/);
assert.match(main, /function renderCatalogueCards/);
assert.match(main, /catalogue-card--finalist/);
assert.match(main, /catalogue-card__reason/);
assert.match(main, /Открыть площадку →/);
assert.match(main, /href = `#screen-\$\{screen\}`/);
assert.match(main, /catalogueLink\.href = '#screen-5'/);
assert.match(main, /comparisonLink\.href = '#screen-34'/);
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
assert.match(css, /\.screen--venue-portrait/);
assert.match(css, /\.screen--venue-facts/);
assert.match(css, /\.screen--venue-scenario/);
assert.match(css, /\.screen--comparison/);
assert.match(css, /\.catalogue-cards/);
assert.match(css, /\.catalogue-card--finalist/);
assert.match(css, /\.catalogue-card__action/);
assert.doesNotMatch(css, /--bone|--mono/);
assert.match(css, /color:\s*var\(--text\)/);
assert.match(css, /font-family:\s*var\(--body\)/);
assert.match(css, /\.screen--rhythm \.screen-title\s*\{\s*max-width:\s*none;\s*font-size:\s*clamp\(2rem, 9vw, 3\.4rem\);/);

assert.ok(css.includes('assets/granat-ruby-space.png'), 'Missing abstract club visual');
assert.match(JSON.stringify(slides), /Близко к Москве, клубный формат\./);
assert.match(JSON.stringify(slides), /Самый экономичный вариант\./);
await access(new URL('../dist/assets/granat-ruby-space.png', import.meta.url));

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

assert.match(readme, /python -m http\.server 4173 --directory dist/);
assert.match(readme, /node scripts\/check-site\.mjs/);
