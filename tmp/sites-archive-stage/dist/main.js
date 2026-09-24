import { slides } from './content.js';

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

  const itemList = renderItems(slide.items);

  if (itemList) {
    content.append(itemList);
  }

  if (slide.closing) {
    content.append(createElement('p', 'screen-closing', slide.closing));
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
