const root = document.documentElement;
const body = document.body;
const preloader = document.querySelector('.preloader');
const navToggle = document.querySelector('.site-nav__toggle');
const navMenu = document.querySelector('.site-nav__menu');
const themeToggle = document.querySelector('.theme-toggle');
const customCursor = document.querySelector('.custom-cursor');
const yearSpan = document.querySelectorAll('[data-year]');

function hidePreloader() {
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
  }, 800);
}

window.addEventListener('load', hidePreloader);

yearSpan.forEach((span) => {
  span.textContent = new Date().getFullYear();
});

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    navMenu.classList.toggle('is-open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const handleClickOutside = (event) => {
  if (!navMenu || !navToggle) return;
  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
};

document.addEventListener('click', handleClickOutside);

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('hadi-theme', theme);
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', (!isDark).toString());
  }
};

const storedTheme = localStorage.getItem('hadi-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

const animateElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  });

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
};

if ('IntersectionObserver' in window) {
  animateElements();
} else {
  document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('is-visible'));
}

const sliderTrack = document.querySelector('.slider__track');
const sliderItems = sliderTrack ? Array.from(sliderTrack.children) : [];
const prevButton = document.querySelector('.slider__control--prev');
const nextButton = document.querySelector('.slider__control--next');
let sliderIndex = 0;

const updateSlider = () => {
  if (!sliderTrack) return;
  const itemWidth = sliderItems[0]?.getBoundingClientRect().width || 0;
  const gap = parseFloat(getComputedStyle(sliderTrack).columnGap || getComputedStyle(sliderTrack).gap || '0');
  sliderTrack.style.transform = `translateX(${-sliderIndex * (itemWidth + gap)}px)`;
};

const clampSliderIndex = () => {
  const maxIndex = Math.max(0, sliderItems.length - 1);
  sliderIndex = Math.min(Math.max(sliderIndex, 0), maxIndex);
  updateSlider();
};

prevButton?.addEventListener('click', () => {
  sliderIndex -= 1;
  clampSliderIndex();
});

nextButton?.addEventListener('click', () => {
  sliderIndex += 1;
  clampSliderIndex();
});

window.addEventListener('resize', updateSlider);
updateSlider();

const moveCursor = (event) => {
  if (!customCursor) return;
  customCursor.style.left = `${event.clientX}px`;
  customCursor.style.top = `${event.clientY}px`;
};

const toggleCursor = (active) => {
  if (!customCursor) return;
  customCursor.classList.toggle('custom-cursor--active', active);
};

document.addEventListener('mousemove', moveCursor);

document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('mouseenter', () => toggleCursor(true));
  el.addEventListener('mouseleave', () => toggleCursor(false));
});

const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  });
});
