import { slides, venueDetails } from './content.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeObserver;

if (!reducedMotion.matches) {
  document.documentElement.classList.add('has-motion');
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function renderItems(items = []) {
  if (!items.length) {
    return null;
  }

  const list = createElement('ul', 'screen-items');

  items.forEach((item) => {
    const listItem = createElement('li', 'screen-item');

    if (typeof item === 'string') {
      listItem.textContent = item;
    } else {
      listItem.append(
        createElement('h3', 'screen-item__title', item.title),
        createElement('p', 'screen-item__text', item.text),
      );
    }

    list.append(listItem);
  });

  return list;
}

function renderMedia(media = []) {
  if (!media.length) {
    return null;
  }

  const gallery = createElement('div', 'screen-media');

  media.forEach(({ src, alt, caption }) => {
    const figure = createElement('figure', 'screen-media__figure');
    const image = document.createElement('img');

    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    figure.append(image, createElement('figcaption', 'screen-media__caption', caption));
    gallery.append(figure);
  });

  return gallery;
}

function renderCatalogueCards(cards = []) {
  if (!cards.length) {
    return null;
  }

  const list = createElement('nav', 'catalogue-cards');
  list.setAttribute('aria-label', 'Площадки');

  cards.forEach(({ title, reason, slug, finalist }) => {
    const card = createElement('a', finalist ? 'catalogue-card catalogue-card--finalist' : 'catalogue-card');
    const name = createElement('h2', 'catalogue-card__title', title);
    const explanation = createElement('p', 'catalogue-card__reason', reason);

    card.href = `#venue/${slug}`;
    card.setAttribute('aria-label', `${title}: ${reason} Открыть площадку`);
    card.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      window.history.replaceState(null, '', '#screen-4');
      window.location.hash = `venue/${slug}`;
    });

    if (finalist) {
      card.append(createElement('span', 'catalogue-card__status', 'Рекомендуем'));
    }

    card.append(name, explanation, createElement('span', 'catalogue-card__action', 'Открыть площадку →'));
    list.append(card);
  });

  return list;
}

function renderSlide(slide) {
  const section = document.createElement('section');
  const content = createElement('div', 'screen-content');
  const index = createElement('span', 'screen-index', String(slide.id).padStart(2, '0'));
  const title = createElement('h1', 'screen-title', slide.title);

  section.id = `screen-${slide.id}`;
  section.className = `screen screen--${slide.scene}`;
  section.setAttribute('aria-labelledby', `screen-${slide.id}-title`);
  title.id = `screen-${slide.id}-title`;
  content.append(index);

  if (slide.eyebrow) content.append(createElement('p', 'screen-context', slide.eyebrow));
  content.append(title);
  if (slide.displayTitle) content.append(createElement('p', 'screen-display-title', slide.displayTitle));
  if (slide.meta) content.append(createElement('p', 'screen-meta', slide.meta));
  if (slide.body) content.append(createElement('p', 'screen-body', slide.body));

  const media = renderMedia(slide.media);
  if (media) content.append(media);

  const catalogueCards = renderCatalogueCards(slide.venueCards);
  if (catalogueCards) content.append(catalogueCards);

  const itemList = renderItems(slide.items);
  if (itemList) content.append(itemList);
  if (slide.closing) content.append(createElement('p', 'screen-closing', slide.closing));

  section.append(content);
  return section;
}

function renderDetailBlock(slide) {
  const block = createElement('article', 'venue-tab-content');
  const title = createElement('h2', 'venue-tab-content__title', slide.title);

  block.append(title);
  if (slide.eyebrow) block.append(createElement('p', 'screen-context', slide.eyebrow));
  if (slide.meta) block.append(createElement('p', 'screen-meta', slide.meta));
  if (slide.body) block.append(createElement('p', 'screen-body', slide.body));

  const media = renderMedia(slide.media);
  if (media) block.append(media);

  const itemList = renderItems(slide.items);
  if (itemList) block.append(itemList);
  if (slide.closing) block.append(createElement('p', 'screen-closing', slide.closing));
  return block;
}

function renderVenueDetail(venue) {
  const section = document.createElement('section');
  const content = createElement('div', 'screen-content venue-detail__content');
  const back = createElement('a', 'venue-back-link', '← К площадкам');
  const title = createElement('h1', 'screen-title', venue.title);
  const externalLink = createElement('a', 'venue-external-link', 'Сайт площадки ↗');
  const tabList = createElement('div', 'venue-tabs');
  const panelRoot = createElement('div', 'venue-tab-panels');
  const tabs = [
    ['general', 'Общее'],
    ['facts', 'Размещение и деловая часть'],
    ['scenario', 'Сценарий'],
  ];
  const buttons = [];
  const panels = [];

  section.className = 'screen venue-detail screen--venue-portrait';
  section.id = `venue-${venue.slug}`;
  section.setAttribute('aria-labelledby', `venue-${venue.slug}-title`);
  title.id = `venue-${venue.slug}-title`;
  back.href = '#screen-4';
  externalLink.href = venue.externalUrl;
  externalLink.target = '_blank';
  externalLink.rel = 'noreferrer';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', `Разделы площадки ${venue.title}`);

  const selectTab = (index) => {
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      panels[buttonIndex].hidden = !selected;
    });
  };

  tabs.forEach(([key, label], index) => {
    const button = createElement('button', 'venue-tab', label);
    const panel = createElement('section', 'venue-tab-panel');
    const panelId = `venue-${venue.slug}-${key}`;

    button.type = 'button';
    button.id = `${panelId}-tab`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', String(index === 0));
    button.tabIndex = index === 0 ? 0 : -1;
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = index !== 0;
    venue.tabs[key].slides.forEach((slide) => panel.append(renderDetailBlock(slide)));

    button.addEventListener('click', () => selectTab(index));
    button.addEventListener('keydown', (event) => {
      const keyOffset = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : keyOffset === undefined ? null : (index + keyOffset + buttons.length) % buttons.length;

      if (nextIndex === null) return;
      event.preventDefault();
      selectTab(nextIndex);
      buttons[nextIndex].focus();
    });

    buttons.push(button);
    panels.push(panel);
    tabList.append(button);
    panelRoot.append(panel);
  });

  content.append(back, title, externalLink, tabList, panelRoot);
  section.append(content);
  return section;
}

function renderSlides(slideData) {
  const root = document.querySelector('#slides-root');
  root.replaceChildren(...slideData.map(renderSlide));
}

function renderNavigation(slideData) {
  const nav = document.querySelector('#screen-nav');
  nav.replaceChildren(...slideData.map((slide) => {
    const item = document.createElement('li');
    const link = createElement('a', 'screen-nav__link', String(slide.id).padStart(2, '0'));
    link.href = `#screen-${slide.id}`;
    link.setAttribute('aria-label', `Экран ${slide.id}: ${slide.title}`);
    item.append(link);
    return item;
  }));
}

function observeActiveScreen() {
  const links = [...document.querySelectorAll('.screen-nav__link')];
  activeObserver?.disconnect();
  activeObserver = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    links.forEach((link) => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`));
  }, { threshold: [0.35, 0.6], rootMargin: '-18% 0px -45% 0px' });
  document.querySelectorAll('.screen').forEach((section) => activeObserver.observe(section));
}

function parseVenueRoute() {
  const match = window.location.hash.match(/^#venue\/([a-z0-9-]+)$/);
  return match ? venueDetails.find((venue) => venue.slug === match[1]) ?? null : undefined;
}

function renderRoute() {
  const venue = parseVenueRoute();
  const navigation = document.querySelector('.site-header nav');
  const root = document.querySelector('#slides-root');

  activeObserver?.disconnect();

  if (venue) {
    navigation.hidden = true;
    root.replaceChildren(renderVenueDetail(venue));
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  if (window.location.hash.startsWith('#venue/')) {
    window.location.replace('#screen-4');
    return;
  }

  navigation.hidden = false;
  renderSlides(slides);
  renderNavigation(slides);
  observeActiveScreen();

  const target = document.querySelector(window.location.hash || '#screen-1');
  target?.scrollIntoView({ block: 'start' });
}

window.addEventListener('hashchange', renderRoute);
const skipLink = document.querySelector('.skip-link');
const mainContent = document.querySelector('#main-content');

mainContent.tabIndex = -1;
skipLink.addEventListener('click', (event) => {
  event.preventDefault();
  mainContent.focus();
});
renderRoute();
