import { slides, venueLinks } from './content.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

function renderItems(items) {
  if (!items.length) {
    return null;
  }

  const list = createElement('ul', 'screen-items');

  items.forEach((item) => {
    const listItem = createElement('li', 'screen-item');

    if (typeof item === 'string') {
      listItem.textContent = item;
    } else {
      const title = createElement('h3', 'screen-item__title', item.title);
      const text = createElement('p', 'screen-item__text', item.text);
      listItem.append(title, text);
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
    const label = createElement('figcaption', 'screen-media__caption', caption);

    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    figure.append(image, label);
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

  cards.forEach(({ title, reason, screen, finalist }) => {
    const card = createElement('a', finalist ? 'catalogue-card catalogue-card--finalist' : 'catalogue-card');
    const name = createElement('h2', 'catalogue-card__title', title);
    const explanation = createElement('p', 'catalogue-card__reason', reason);
    const action = createElement('span', 'catalogue-card__action', 'Открыть площадку →');

    card.href = `#screen-${screen}`;
    card.setAttribute('aria-label', `${title}: ${reason} Открыть площадку, экран ${screen}`);

    if (finalist) {
      card.append(createElement('span', 'catalogue-card__status', 'Рекомендуем'));
    }

    card.append(name, explanation, action);
    list.append(card);
  });

  return list;
}

function renderVenueNavigation(slide) {
  if (!slide.venue) {
    return null;
  }

  const navigation = createElement('nav', 'venue-navigation');
  navigation.setAttribute('aria-label', `Навигация по площадке ${slide.venue}`);

  const catalogueLink = createElement('a', 'venue-navigation__link', 'К площадкам');
  catalogueLink.href = '#screen-6';

  const comparisonLink = createElement('a', 'venue-navigation__link', 'К сравнению');
  comparisonLink.href = '#screen-35';

  const siteLink = createElement('a', 'venue-navigation__link', 'Сайт площадки ↗');
  siteLink.href = venueLinks[slide.venue];
  siteLink.target = '_blank';
  siteLink.rel = 'noreferrer';

  navigation.append(catalogueLink, comparisonLink, siteLink);
  return navigation;
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

  if (slide.eyebrow) {
    content.append(createElement('p', 'screen-context', slide.eyebrow));
  }

  content.append(title);

  if (slide.displayTitle) {
    content.append(createElement('p', 'screen-display-title', slide.displayTitle));
  }

  if (slide.meta) {
    content.append(createElement('p', 'screen-meta', slide.meta));
  }

  if (slide.body) {
    content.append(createElement('p', 'screen-body', slide.body));
  }

  const media = renderMedia(slide.media);

  if (media) {
    content.append(media);
  }

  const catalogueCards = renderCatalogueCards(slide.venueCards);

  if (catalogueCards) {
    content.append(catalogueCards);
  }

  const itemList = renderItems(slide.items);

  if (itemList) {
    content.append(itemList);
  }

  if (slide.closing) {
    content.append(createElement('p', 'screen-closing', slide.closing));
  }

  const venueNavigation = renderVenueNavigation(slide);

  if (venueNavigation) {
    content.append(venueNavigation);
  }

  section.append(content);
  return section;
}

function renderSlides(slideData) {
  const root = document.querySelector('#slides-root');
  root.replaceChildren(...slideData.map(renderSlide));
}

function renderNavigation(slideData) {
  const nav = document.querySelector('#screen-nav');

  nav.replaceChildren(
    ...slideData.map((slide) => {
      const item = document.createElement('li');
      const link = createElement('a', 'screen-nav__link', String(slide.id).padStart(2, '0'));

      link.href = `#screen-${slide.id}`;
      link.setAttribute('aria-label', `Экран ${slide.id}: ${slide.title}`);
      item.append(link);
      return item;
    }),
  );
}

function observeActiveScreen() {
  const links = [...document.querySelectorAll('.screen-nav__link')];
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!active) {
        return;
      }

      links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${active.target.id}`;
        link.toggleAttribute('aria-current', isActive);
      });
    },
    { threshold: [0.35, 0.6], rootMargin: '-18% 0px -45% 0px' },
  );

  document.querySelectorAll('.screen').forEach((section) => observer.observe(section));
}

renderSlides(slides);
renderNavigation(slides);
observeActiveScreen();
