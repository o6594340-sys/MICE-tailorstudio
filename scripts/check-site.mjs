import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const { slides, venueDetails, venueLinks } = await import(new URL('../dist/content.js', import.meta.url));

assert.match(html, /<a class="skip-link" href="#main-content">/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /<div id="slides-root"><\/div>/);

assert.equal(slides.length, 12);
assert.deepEqual(slides.map(({ id }) => id), [1, 2, 3, 'key-visuals', 'visual-applications', 4, 5, 6, 7, 8, 'shared-game', 9]);
const keyVisuals = slides.find(({ id }) => id === 'key-visuals');
assert.equal(keyVisuals.navigable, false);
assert.equal(keyVisuals.title, 'ГРАНАТ. Запас прочности');
assert.equal(keyVisuals.body, '«ГРАНАТ. Запас прочности» — это не броня и не показная сила. Это накопленный опыт, свой круг и внутренний ресурс, который помогает сохранять точность в работе и в решениях. Оба визуальных направления говорят об этом по-разному, но остаются в характере клуба «Гранат».');
assert.deepEqual(keyVisuals.keyVisuals.map(({ title, src }) => [title, src]), [
  ['Вариант 1. Точка попадания', 'assets/granat-key-visual-hit.jpg'],
  ['Вариант 2. Внутренняя опора', 'assets/granat-key-visual-support.jpg'],
]);
const visualApplications = slides.find(({ id }) => id === 'visual-applications');
assert.equal(visualApplications.navigable, false);
assert.equal(visualApplications.title, 'Визуальное направление');
assert.equal(visualApplications.body, 'Предлагаем развить выбранное визуальное направление в цельную айдентику мероприятия. Чёрный, графит и глубокий красный сохраняют связь с клубом «Гранат», а собранная геометрия добавляет теме «Запас прочности» характер и точность.');
assert.deepEqual(visualApplications.visualApplications.map(({ src }) => src), [
  'assets/granat-visual-press-wall.jpg',
  'assets/granat-visual-table-and-diploma.jpg',
]);
assert.equal(visualApplications.applicationCaption, 'Это примеры возможного применения visual key. После выбора направления дорабатываем композицию, тексты и носители по официальным правилам TNPRO и клуба «Гранат».');
assert.equal(slides[1].title, 'Прочность не берётся из воздуха.');
assert.equal(slides[2].title, 'То, на чём держится сильный профессионал.');
assert.equal(slides[5].title, 'День 1. Опыт');
assert.equal(slides[5].subtitle, 'Опыт становится сильнее, когда им делятся.');
assert.deepEqual(slides[5].body, ['Сбор, регистрация и приветственный кофе. Затем деловая программа “ГРАНАТА”: ТЕХНОНИКОЛЬ о рынке, продуктах и решениях реальных задач; разговор о качестве и репутации; истории подрядчиков; круглый стол без дистанции между сценой и залом.', 'После обеда продолжается деловая часть и проходит ежегодное награждение с вручением сертификатов. Затем заселение и свободное время.', 'Здесь не слушают лекцию. Здесь сверяют опыт.']);
assert.equal(slides[6].title, 'Вечер 1. Круг');
assert.equal(slides[6].subtitle, 'Когда официальная часть закончена, начинается главное.');
assert.deepEqual(slides[6].body, ['Общий стол, хорошая кухня, лёгкая деликатная динамика ведущего, уважение к достижениям и людям в зале.', 'После банкета вечер продолжается по интересам: бар, сигары, кальяны, бильярд, боулинг, музыка и разговоры. Это не обязательная активность для всех, а возможность выбрать своё.']);
assert.equal(slides[7].title, 'День 2. Точный ход');
assert.equal(slides[7].subtitle, 'Спокойствие, фокус, общая цель.');
assert.match(slides[7].body.join(' '), /После обеда начинается единый для всех командный турнир “Точный ход”/u);
assert.match(slides[7].body.join(' '), /лазерным или пневматическим, с инструкторами и всеми необходимыми мерами безопасности/u);
assert.equal(slides[8].title, 'Вечер 2. Свой ритм');
assert.equal(slides[8].subtitle, 'После общего дела вечер идёт в своём ритме.');
assert.deepEqual(slides[8].body, ['Сытный вечерний фуршет, хороший бар и итоги командного зачёта. Затем каждый выбирает своё: бильярд, сигарную или лаунж-зону, кальяны, баню, музыку и разговоры.', 'Без второй обязательной церемонии и без программы ради программы. Остаётся время для людей, с которыми хочется поговорить.']);
assert.equal(slides[9].title, 'День 3. Спокойный выход');
assert.equal(slides[9].body, 'Завтрак, своё время, SPA и организованный выезд в Москву.');
const sharedGame = slides.find(({ id }) => id === 'shared-game');
assert.equal(sharedGame.navigable, false);
assert.equal(sharedGame.eyebrow, 'День 2. Общая игра');
assert.equal(sharedGame.title, 'Точный ход');
assert.equal(sharedGame.subtitle, 'Запас прочности в действии.');
assert.deepEqual(sharedGame.body, ['В стрельбе важна не только точность первого попадания. Важнее сохранить спокойствие после промаха, быстро скорректироваться и довести общий результат до цели.', 'Предлагаем общий командный стрелковый турнир: смешанные команды проходят несколько понятных рубежей, набирают баллы и сходятся в финале. Здесь опыт каждого усиливает команду, а команда добавляет уверенности каждому.', 'Вот это и есть запас прочности: не безошибочность, а способность собраться, сделать точный ход и идти дальше.', 'На площадке со своей стрелковой инфраструктурой используем её возможности. На других площадках привозим мобильный лазерный или пневматический формат с инструкторами и организованной зоной проведения. Точную механику выбираем после подтверждения территории; турнир проходит во второй половине дня, до алкоголя.']);
assert.equal(slides[11].title, 'Площадки для обсуждения');
assert.equal(slides[11].body, 'Каждая площадка по-разному собирает деловую часть, отдых и свободное время. Откройте карточку, чтобы посмотреть детали.');
assert.deepEqual(slides[11].venueCards.map(({ title, meta, reason, slug }) => ({ title, meta, reason, slug })), [
  { title: 'Moscow Country Club', meta: '12–13 км от МКАД · 30–45 минут в пути', reason: 'Загородный клуб рядом с Москвой', slug: 'moscow-country-club' },
  { title: 'Русские Сезоны Курорт Пересвет', meta: '70 км от МКАД · 1,5–2 часа в пути', reason: 'Спортивная инфраструктура и большая территория', slug: 'peresvet' },
  { title: 'Конгресс-отель «Ареал»', meta: '17 км от МКАД · 45–60 минут в пути', reason: 'Ключевые зоны программы в одном здании', slug: 'areal' },
  { title: 'FreshWind', meta: 'Около 50 км от МКАД · 1–1,5 часа в пути', reason: 'Большая деловая и вечерняя база', slug: 'freshwind' },
  { title: 'AZIMUT Парк Отель Переславль', meta: 'Около 120 км от Москвы · до 2 часов в пути', reason: 'Парк-отель с собранным размещением группы', slug: 'azimut-pereslavl' },
  { title: 'Комплекс отдыха «Завидово»', meta: '117 км от Москвы · 2–2,5 часа в пути', reason: 'Большая территория и активный досуг', slug: 'zavidovo' },
  { title: 'LES Art Resort', meta: 'Ориентир: 1–1,5 часа в пути', reason: 'Курорт с насыщенной инфраструктурой отдыха', slug: 'les-art-resort' },
]);
assert.doesNotMatch(JSON.stringify(slides[11].venueCards), /Финалист|Резерв|Рекомендуем|Выбор|Основной вариант|Альтернатива/u);

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
const mccGeneral = tabSlides('Moscow Country Club', 'general')[0];
const mccGeneralBody = Array.isArray(mccGeneral.body) ? mccGeneral.body.join(' ') : mccGeneral.body;
assert.match(mccGeneralBody, /Moscow Country Club — статусный загородный клуб в 12–13 км от МКАД/u);
assert.match(mccGeneralBody, /От таунхаусов до конференции и ресторанов — 5–7 минут спокойным шагом\./u);
assert.deepEqual(mccGeneral.reference, {
  prefix: 'Оценка гостей на ',
  label: 'Ostrovok.ru',
  href: 'https://ostrovok.ru/hotel/russia/nakhabino/mid7807955/moscow_country_club_8/?dateless_form=yes',
  suffix: ': 8,3/10 · 25 отзывов.',
});
const mccFacts = tabSlides('Moscow Country Club', 'facts')[0].items.map(({ text }) => text).join(' ');
assert.match(mccFacts, /Конференц-зал «Лебединое озеро»: 178,5 м², до 120 гостей\./u);
assert.match(mccFacts, /Для вечерних форматов: Forest Country Hall, 239 м², до 100 гостей, и ресторан «Акценты», 284 м², до 130 гостей\./u);
const mccScenario = tabSlides('Moscow Country Club', 'scenario');
assert.equal(mccScenario.at(-1).meta, 'На территории');
assert.deepEqual(mccScenario.at(-1).body, [
  'Что включено в проживание: бассейн, сауна, хамам, тренажёрный зал и групповые занятия для взрослых по расписанию.',
  'Дополнительные возможности: гольф, крытый теннис, лёд, настольный теннис и бильярд. Эти форматы можно предложить гостям как свободные индивидуальные маршруты по интересам.Важно учесть: для наружной командной активности в ноябре нужен резервный вариант внутри. Работу зимних объектов и SPA необходимо подтвердить на выбранные даты.',
]);
assert.equal(mccScenario.at(-1).closing, '');
assert.equal(tabSlides('Пересвет', 'general')[0].media[0].src, 'assets/peresvet-night.jpg');
assert.equal(tabSlides('Пересвет', 'facts')[0].media[0].src, 'assets/peresvet-stravinsky.jpg');
assert.equal(tabSlides('Пересвет', 'facts')[0].media.at(-1).src, 'assets/peresvet-room.png');
assert.deepEqual(tabSlides('Пересвет', 'scenario')[0].media.map(({ src }) => src), [
  'assets/peresvett-ozero.png',
  'assets/peresvet-utesov.jpg',
]);
const peresvetGeneral = tabSlides('Пересвет', 'general')[0];
const peresvetGeneralBody = Array.isArray(peresvetGeneral.body) ? peresvetGeneral.body.join(' ') : peresvetGeneral.body;
assert.match(peresvetGeneralBody, /«Русские Сезоны Курорт Пересвет» — большой спортивный курорт/u);
assert.match(peresvetGeneralBody, /55 номеров Standard в Congress Hotel и 35 номеров Standard Comfort в Comfort Hotel/u);
assert.match(peresvetGeneralBody, /Перед финальным подтверждением важно сверить размещение группы/u);
assert.equal(peresvetGeneral.closing, '');
const peresvetFacts = tabSlides('Пересвет', 'facts')[0].items.map(({ text }) => text).join(' ');
assert.match(peresvetFacts, /Зал «Стравинский», 583 м²\./u);
assert.match(peresvetFacts, /В «Ozero» после 23:00 возможен спокойный формат без музыки\./u);
const peresvetScenario = tabSlides('Пересвет', 'scenario');
assert.equal(peresvetScenario.at(-1).meta, 'Свободное время на курорте');
assert.deepEqual(peresvetScenario.at(-1).body, [
  'Ледовая арена, боулинг, бильярд, теннис, спортивные активности и искусственная волна. Для отдыха предусмотрены два бассейна, SPA и тренажёрный зал.',
  'Все активности планируются по слотам и потокам. До окончательного выбора площадки необходимо подтвердить ноябрьский график работы SPA, ледовой арены, боулинга и тенниса, а также отсутствие реконструкций.',
]);
assert.doesNotMatch(JSON.stringify(venue('Пересвет')), /Финалист|«Точный ход»/u);
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
assert.doesNotMatch(visibleData, /₽|бюджет|стоимост|ценов|\bАК\b|экономич/u);
assert.doesNotMatch(visibleData, /уточнить|Уточнить|запросить|Запросить|требует|Требует|спорного НДС|вопросы к площадкам/u);

const main = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8');
assert.match(main, /function parseVenueRoute\(/);
assert.match(main, /venueDetails\.find/);
assert.match(main, /← К площадкам/);
assert.match(main, /function renderVenueSection\(/);
assert.match(main, /\['general', 'Общее'\]/);
assert.match(main, /'Размещение и деловая часть'/);
assert.match(main, /'Вечер и сценарий'/);
assert.match(main, /slide\.reference\.href/);
assert.match(main, /link\.target = '_blank'/);
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
assert.match(main, /function renderKeyVisuals\(keyVisuals\)/);
assert.match(main, /function renderVisualApplications\(visualApplications\)/);
assert.match(main, /slideData\.filter\(\(slide\) => slide\.navigable !== false\)/);
assert.match(main, /function renderMedia/);
assert.match(main, /function renderCatalogueCards/);
assert.match(main, /cards\.forEach\(\(\{ title, meta, reason, slug \}\)/);
assert.doesNotMatch(main, /catalogue-card--finalist|catalogue-card__status|Рекомендуем/u);
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
assert.match(css, /\.key-visuals-grid/);
assert.match(css, /\.screen--key-visuals/);
assert.match(css, /\.screen--visual-applications/);

await access(new URL('../dist/assets/granat-ruby-space.png', import.meta.url));
await access(new URL('../dist/assets/granat-key-visual-hit.jpg', import.meta.url));
await access(new URL('../dist/assets/granat-key-visual-support.jpg', import.meta.url));
await access(new URL('../dist/assets/granat-visual-press-wall.jpg', import.meta.url));
await access(new URL('../dist/assets/granat-visual-table-and-diploma.jpg', import.meta.url));
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
assert.match(readme, /python -m http\.server 4173 --directory dist/);
assert.match(readme, /node scripts\/check-site\.mjs/);
