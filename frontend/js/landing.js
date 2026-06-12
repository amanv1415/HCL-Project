const nav = document.getElementById('landing-nav');
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

function updateNav() {
  nav?.classList.toggle('scrolled', window.scrollY > 24);
}

function closeMenu() {
  nav?.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
  const open = !nav.classList.contains('menu-open');
  nav.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 780) closeMenu();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

updateNav();
