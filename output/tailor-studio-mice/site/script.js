const body = document.body;
const menu = document.querySelector('.site-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const menuLinks = [...document.querySelectorAll('.site-menu nav a')];
const menuVisual = document.querySelector('.photo-slot--menu');
const header = document.querySelector('.site-header');
const main = document.querySelector('main');
const footer = document.querySelector('.site-footer');
const chapter = document.querySelector('.chapter b');
let lastFocused = null;

const heroScene = document.querySelector('.hero-scene');
if (heroScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const resetHeroScene = () => {
    heroScene.classList.remove('is-engaged');
    heroScene.style.setProperty('--hero-x', '0px');
    heroScene.style.setProperty('--hero-y', '0px');
  };
  heroScene.addEventListener('pointerenter', () => heroScene.classList.add('is-engaged'));
  heroScene.addEventListener('pointerleave', resetHeroScene);
  heroScene.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = heroScene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroScene.style.setProperty('--hero-x', `${Math.round(x * 24)}px`);
    heroScene.style.setProperty('--hero-y', `${Math.round(y * 24)}px`);
  });
}

const menuLabels = {
  china: ['Living China', 'streets after dark'],
  formats: ['Shared purpose', 'from meeting room to banquet hall'],
  destinations: ['Many energies', 'city, garden, mountain, water'],
  sourcing: ['Local mix', 'hospitality and venues at scale'],
  approach: ['In the moment', 'observed, not staged'],
  contact: ['Start here', 'bring us the purpose and the people']
};

function swapMedia(figure, source, alt) {
  const image = figure.querySelector('img');
  if (!image || image.getAttribute('src') === source) return;
  figure.classList.add('is-changing');
  figure.setAttribute('aria-busy', 'true');
  const next = new Image();
  next.onload = () => {
    image.src = source;
    image.alt = alt;
    requestAnimationFrame(() => {
      figure.classList.remove('is-changing');
      figure.removeAttribute('aria-busy');
    });
  };
  next.onerror = () => {
    figure.classList.remove('is-changing');
    figure.removeAttribute('aria-busy');
  };
  next.src = source;
}

function setMenu(open) {
  if (!open) {
    header.removeAttribute('inert');
    main.removeAttribute('inert');
    footer.removeAttribute('inert');
  }
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  body.classList.toggle('menu-open', open);
  if (open) {
    lastFocused = document.activeElement;
    header.setAttribute('inert', '');
    main.setAttribute('inert', '');
    footer.setAttribute('inert', '');
    setTimeout(() => {
      if (menu.classList.contains('is-open')) menuClose.focus({ preventScroll: true });
    }, 80);
  } else if (lastFocused) {
    lastFocused.focus();
  }
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menuLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
  const updateMenuVisual = () => {
    const [title, note] = menuLabels[link.dataset.menuImage];
    menuVisual.querySelector('span').textContent = title;
    menuVisual.querySelector('small').textContent = note;
  };
  link.addEventListener('mouseenter', updateMenuVisual);
  link.addEventListener('focus', updateMenuVisual);
});
document.addEventListener('keydown', (event) => {
  if (!menu.classList.contains('is-open')) return;
  if (event.key === 'Escape') setMenu(false);
  if (event.key === 'Tab') {
    const focusable = [menuClose, ...menuLinks];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const formatPreview = document.querySelector('.format-preview');
document.querySelectorAll('.format-row').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.format-row').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');
    formatPreview.dataset.format = button.dataset.title.toLowerCase();
    formatPreview.querySelector('span').textContent = button.dataset.title;
    formatPreview.querySelector('small').textContent = button.dataset.note;
    swapMedia(formatPreview, button.dataset.image, button.dataset.alt);
  });
});

const curiosityRail = document.querySelector('.statement-collage');
const curiosityHint = document.querySelector('#curiosity-scroll-hint span');
if (curiosityHint) {
  curiosityHint.textContent = window.matchMedia('(min-width: 801px)').matches
    ? 'Drag → to explore'
    : 'Swipe → to explore';
}
if (curiosityRail) {
  curiosityRail.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const step = Math.min(curiosityRail.clientWidth * .8, 360);
    if (event.key === 'ArrowRight') curiosityRail.scrollBy({ left: step, behavior: 'auto' });
    if (event.key === 'ArrowLeft') curiosityRail.scrollBy({ left: -step, behavior: 'auto' });
    if (event.key === 'Home') curiosityRail.scrollTo({ left: 0, behavior: 'auto' });
    if (event.key === 'End') curiosityRail.scrollTo({ left: curiosityRail.scrollWidth, behavior: 'auto' });
  });
}

const destinationPhoto = document.querySelector('.destination-photo');
const destinationPanel = document.querySelector('.destination-panel');
const destinationTabs = [...document.querySelectorAll('.destination-tabs button')];
destinationTabs.forEach((button, index) => {
  button.addEventListener('click', () => {
    destinationTabs.forEach((item) => {
      item.setAttribute('aria-selected', 'false');
      item.tabIndex = -1;
    });
    button.setAttribute('aria-selected', 'true');
    button.tabIndex = 0;
    destinationPhoto.querySelector('span').textContent = button.dataset.city;
    destinationPhoto.querySelector('small').textContent = button.dataset.theme;
    swapMedia(destinationPhoto, button.dataset.image, button.dataset.alt);
    destinationPanel.classList.add('is-changing');
    destinationPanel.setAttribute('aria-busy', 'true');
    destinationPanel.querySelector('p').textContent = button.dataset.copy;
    destinationPanel.setAttribute('aria-labelledby', button.id);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      destinationPanel.classList.remove('is-changing');
      destinationPanel.removeAttribute('aria-busy');
    }));
  });
  button.addEventListener('keydown', (event) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % destinationTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + destinationTabs.length) % destinationTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = destinationTabs.length - 1;
    destinationTabs[nextIndex].focus();
    destinationTabs[nextIndex].click();
  });
});

const sections = [...document.querySelectorAll('[data-chapter]')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) chapter.textContent = visible.target.dataset.chapter;
}, { rootMargin: '-20% 0px -58% 0px', threshold: [0, .2, .5, .8] });
sections.forEach((section) => observer.observe(section));
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });
