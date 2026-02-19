// ===== Theme Toggle =====
const STORAGE_KEY = 'portfolio-theme';

function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}


setTheme(getPreferredTheme());

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) setTheme(e.matches ? 'dark' : 'light');
});

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
});

navLinks.forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

const style = document.createElement('style');
style.textContent = '.nav__link.active { color: var(--color-primary) !important; font-weight: 600; }';
document.head.appendChild(style);

const homeLink = document.querySelector('.nav__link[href="#home"]');
if (homeLink) homeLink.classList.add('active');

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    showFormMessage('Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

function showFormMessage(text, type) {
    let existing = document.querySelector('.form__message');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.className = `form__message form__message--${type}`;
    msg.textContent = text;
    msg.style.cssText = `
        padding: 1rem;
        border-radius: var(--radius);
        margin-top: 1rem;
        font-weight: 500;
        background: ${type === 'success' ? 'rgba(45, 90, 107, 0.12)' : 'rgba(220, 38, 38, 0.12)'};
        color: ${type === 'success' ? 'var(--color-primary)' : '#dc2626'};
    `;
    contactForm.appendChild(msg);

    setTimeout(() => msg.remove(), 4000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .project__card, .skill__item, .education__item, .research__card, .achievements__item, .coursework__card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

const animStyle = document.createElement('style');
animStyle.textContent = `
    .visible { opacity: 1 !important; transform: translateY(0) !important; }
`;
document.head.appendChild(animStyle);
