import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const { slides, venueDetails, venueLinks } = await import(new URL('../dist/content.js', import.meta.url));

assert.match(html, /<a class="skip-link" href="#main-content">/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /<div id="slides-root"><\/div>/);

assert.equal(slides.length, 9);
assert.deepEqual(slides.map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.equal(slides[1].title, 'Прочность не берётся из воздуха.');
assert.equal(slides[2].title, 'То, на чём держится сильный профессионал.');
assert.equal(slides[3].title, 'День 1. Опыт');
assert.equal(slides[3].subtitle, 'Опыт становится сильнее, когда им делятся.');
assert.deepEqual(slides[3].body, ['Сбор, регистрация и приветственный кофе. Затем деловая программа “ГРАНАТА”: ТЕХНОНИКОЛЬ о рынке, продуктах и решениях реальных задач; разговор о качестве и репутации; истории подрядчиков; круглый стол без дистанции между сценой и залом.', 'После обеда продолжается деловая часть и проходит ежегодное награждение с вручением сертификатов. Затем заселение и свободное время.', 'Здесь не слушают лекцию. Здесь сверяют опыт.']);
assert.equal(slides[4].title, 'Вечер 1. Круг');
assert.equal(slides[4].subtitle, 'Когда официальная часть закончена, начинается главное.');
assert.deepEqual(slides[4].body, ['Общий стол, хорошая кухня, лёгкая деликатная динамика ведущего, уважение к достижениям и людям в зале.', 'После банкета вечер продолжается по интересам: бар, сигары, кальяны, бильярд, боулинг, музыка и разговоры. Это не обязательная активность для всех, а возможность выбрать своё.']);
assert.equal(slides[5].title, 'День 2. Точный ход');
assert.equal(slides[5].subtitle, 'Спокойствие, фокус, общая цель.');
assert.match(slides[5].body.join(' '), /После обеда начинается единый для всех командный турнир “Точный ход”/u);
assert.match(slides[5].body.join(' '), /лазерным или пневматическим, с инструкторами и всеми необходимыми мерами безопасности/u);
assert.equal(slides[6].title, 'Вечер 2. Свой ритм');
assert.equal(slides[6].subtitle, 'После общего дела вечер идёт в своём ритме.');
assert.deepEqual(slides[6].body, ['Сытный вечерний фуршет, хороший бар и итоги командного зачёта. Затем каждый выбирает своё: бильярд, сигарную или лаунж-зону, кальяны, баню, музыку и разговоры.', 'Без второй обязательной церемонии и без программы ради программы. Остаётся время для людей, с которыми хочется поговорить.']);
assert.equal(slides[7].title, 'День 3. Спокойный выход');
assert.equal(slides[7].body, 'Завтрак, своё время, SPA и организованный выезд в Москву.');
assert.equal(slides[8].title, 'Семь площадок. Три рекомендации.');
assert.equal(slides[8].body, 'Единая логика оценки: дорога, размещение, зал, два вечера, «Точный ход», маршруты, ограничения.');
assert.deepEqual(slides[8].venueCards.map(({ slug }) => slug), [
  'moscow-country-club', 'peresvet', 'areal', 'freshwind', 'azimut-pereslavl', 'zavidovo', 'les-art-resort',
]);

assert.equal(venueDetails.length, 7);
assert.deepEqual(Object.keys(venueDetails[0].tabs), ['general', 'facts', 'scenario']);
assert.equal(Object.keys(venueLinks).length, 7);
assert.equal(venueLinks['Пересвет'], 'https://peresvethotel.ru/');
assert.deepEqual(venueDetails.map(({ title }) => title), [
  'Moscow Country Club', 'Пересвет', '«Ареал»', 'FreshWind', 'AZIMUT Переславль', '«Завидово»', 'LES Art Resort',
]);

const venue = (title) => venueDetails.find((entry) => entry.title === title);
const tabSlides = (title, tab) => venue(title).tabs[tab].slides;

assert.equal(tabSlides('FreshWind', 'scenario')[1].closing, 'Резерв: компактный вариант для более камерного сценария.');
assert.deepEqual(tabSlides('FreshWind', 'facts')[0].media.map(({ src }) => src), ['assets/freshwind-room.jpg', 'assets/freshwind-conference-hall.jpg']);
assert.deepEqual(tabSlides('FreshWind', 'scenario')[0].media.map(({ src }) => src), [
  'assets/freshwind-bowling.jpg',
  'assets/freshwind-fresh.png',
]);
assert.equal(tabSlides('Moscow Country Club', 'facts')[0].media[0].src, 'assets/mcc-forest-country-hall.jpg');
assert.equal(tabSlides('Moscow Country Club', 'facts')[0].media.at(-1).src, 'assets/mcc-room.jpg');
assert.equal(tabSlides('Moscow Country Club', 'scenario')[0].media[0].src, 'assets/mcc-accents.jpg');
assert.equal(tabSlides('Moscow Country Club', 'general')[0].media.at(-1).src, 'assets/mcc-hero.jpg');
assert.equal(tabSlides('Пересвет', 'general')[0].media[0].src, 'assets/peresvet-night.jpg');
assert.equal(tabSlides('Пересвет', 'facts')[0].media[0].src, 'assets/peresvet-stravinsky.jpg');
assert.equal(tabSlides('Пересвет', 'facts')[0].media.at(-1).src, 'assets/peresvet-room.png');
assert.deepEqual(tabSlides('Пересвет', 'scenario')[0].media.map(({ src }) => src), [
  'assets/peresvett-ozero.png',
  'assets/peresvet-utesov.jpg',
]);
assert.equal(tabSlides('AZIMUT Переславль', 'facts')[0].media[0].src, 'assets/azimut-zalesskiy-theatre.jpg');
assert.equal(tabSlides('AZIMUT Переславль', 'scenario')[0].media[0].src, 'assets/azimut-pereslavl-banquet.jpg');
assert.equal(tabSlides('AZIMUT Переславль', 'scenario')[0].media.at(-1).src, 'assets/azimut-banya.jpg');
assert.equal(tabSlides('AZIMUT Переславль', 'general')[0].media.at(-1).src, 'assets/azimut-hero.jpg');
assert.equal(tabSlides('AZIMUT Переславль', 'facts')[0].media.at(-1).src, 'assets/azimut-room.jpg');
assert.equal(tabSlides('«Ареал»', 'general')[0].media[0].src, 'assets/areal-marmelada.jpg');
assert.equal(tabSlides('«Ареал»', 'facts')[0].media[0].src, 'assets/areal-dunay.jpg');
assert.equal(tabSlides('«Ареал»', 'facts')[0].media.at(-1).src, 'assets/areal-room.jpg');
assert.deepEqual(tabSlides('«Ареал»', 'scenario')[0].media.map(({ src }) => src), [
  'assets/areal-kurshevel.jpg',
  'assets/areal-bowling.jpg',
]);
assert.equal(tabSlides('FreshWind', 'general')[0].media.at(-1).src, 'assets/freshwind-hero.jpg');
assert.equal(tabSlides('«Завидово»', 'scenario')[1].closing, 'Резерв: сильный модуль «Точный ход», но длинный маршрут и погодный риск.');
assert.equal(tabSlides('«Завидово»', 'general')[0].media.at(-1).src, 'assets/radisson-hero.jpg');
assert.equal(tabSlides('«Завидово»', 'facts')[0].media[0].src, 'assets/zavidovo-chaika.jpg');
assert.equal(tabSlides('«Завидово»', 'facts')[0].media.at(-1).src, 'assets/zavidovo-room.jpg');
assert.equal(tabSlides('«Завидово»', 'scenario')[0].media[0].src, 'assets/zavidovo-sadko.jpg');
assert.equal(tabSlides('«Завидово»', 'scenario')[0].media[1].src, 'assets/zavidovo-shooting-centre.jpg');
assert.equal(tabSlides('LES Art Resort', 'general')[0].media[0].src, 'assets/les-placeholder-resort.png');
assert.equal(tabSlides('LES Art Resort', 'facts')[0].media[0].src, 'assets/les-conference-hall.jpg');
assert.equal(tabSlides('LES Art Resort', 'scenario')[0].media[0].src, 'assets/les-banquet-hall.jpg');
assert.equal(tabSlides('LES Art Resort', 'general')[0].media.at(-1).src, 'assets/lesart-hero.jpeg');
assert.equal(tabSlides('LES Art Resort', 'facts')[0].media.at(-1).src, 'assets/lesart-room.jpg');
assert.match(tabSlides('LES Art Resort', 'facts')[0].items[1].text, /455 м²/u);
assert.match(tabSlides('LES Art Resort', 'scenario')[0].items[0].text, /«Оптимус», 300 м²/u);

const visibleData = JSON.stringify({ slides, venueDetails });
assert.doesNotMatch(visibleData, /₽|бюджет|стоимост|ценов|\bАК\b|экономич|доплат/u);
assert.doesNotMatch(visibleData, /Подтвердить|подтвердить|уточнить|Уточнить|запросить|Запросить|требует|Требует|спорного НДС|вопросы к площадкам/u);

const main = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8');
assert.match(main, /function parseVenueRoute\(/);
assert.match(main, /venueDetails\.find/);
assert.match(main, /← К площадкам/);
assert.match(main, /function renderVenueSection\(/);
assert.match(main, /\['general', 'Общее'\]/);
assert.match(main, /'Размещение и деловая часть'/);
assert.match(main, /'Вечер и сценарий'/);
assert.doesNotMatch(main, /role', 'tablist'/);
assert.doesNotMatch(main, /card\.href = `#screen-/);
assert.match(main, /window\.location\.replace\('#screen-9'\)/);
assert.match(main, /window\.addEventListener\('hashchange', renderRoute\)/);
assert.match(main, /window\.scrollTo\(\{ top: 0, behavior: 'auto' \}\)/);
assert.match(main, /window\.history\.replaceState\(null, '', '#screen-9'\)/);
assert.match(main, /skipLink\.addEventListener\('click'/);
assert.match(main, /mainContent\.focus\(\)/);
assert.match(main, /function renderSlides\(slideData\)/);
assert.match(main, /function renderBody\(body\)/);
assert.match(main, /function renderMedia/);
assert.match(main, /function renderCatalogueCards/);
assert.match(main, /catalogue-card--finalist/);
assert.match(main, /catalogue-card__reason/);
assert.match(main, /Открыть площадку →/);
assert.match(main, /new IntersectionObserver/);
assert.match(main, /window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);

const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
assert.match(css, /--granat-red:\s*#B1000B/i);
assert.match(css, /overflow-x:\s*clip/);
assert.match(css, /\.catalogue-cards/);
assert.match(css, /\.catalogue-card--finalist/);
assert.match(css, /\.catalogue-card__action/);
assert.doesNotMatch(css, /--bone|--mono/);
assert.match(css, /color:\s*var\(--text\)/);
assert.match(css, /font-family:\s*var\(--body\)/);

await access(new URL('../dist/assets/granat-ruby-space.png', import.meta.url));
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
assert.match(readme, /python -m http\.server 4173 --directory dist/);
assert.match(readme, /node scripts\/check-site\.mjs/);
