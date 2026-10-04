const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinksContainer = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const revealElements = document.querySelectorAll('.reveal, .reveal-sm');
const progressFills = document.querySelectorAll('.skill-progress-fill');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formFeedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

function applyTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('light-mode');
    themeToggle.textContent = '🌙';
  }
}

applyTheme(localStorage.getItem('theme') || 'dark');

themeToggle.addEventListener('click', () => {
  const nextTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

mobileMenuToggle.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  mobileMenuToggle.classList.toggle('open');
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinksContainer.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    mobileMenuToggle.classList.remove('open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  });
});

function setActiveLink() {
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}

window.addEventListener('scroll', () => {
  setActiveLink();
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', window.scrollY > 420);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => revealObserver.observe(el));

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const value = fill.dataset.progress;
      fill.style.width = `${value}%`;
      progressObserver.unobserve(fill);
    }
  });
}, { threshold: 0.45 });

progressFills.forEach((fill) => progressObserver.observe(fill));

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function showError(input, errorElement, message) {
  errorElement.textContent = message;
  input.style.borderColor = '#ff758c';
}

function clearError(input, errorElement) {
  errorElement.textContent = '';
  input.style.borderColor = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let valid = true;
  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();

  if (!nameValue) {
    showError(nameInput, nameError, 'Name is required.');
    valid = false;
  } else {
    clearError(nameInput, nameError);
  }

  if (!emailValue) {
    showError(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!isValidEmail(emailValue)) {
    showError(emailInput, emailError, 'Enter a valid email address.');
    valid = false;
  } else {
    clearError(emailInput, emailError);
  }

  if (!messageValue) {
    showError(messageInput, messageError, 'Message cannot be empty.');
    valid = false;
  } else {
    clearError(messageInput, messageError);
  }

  return valid;
}

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm()) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formFeedback.textContent = '';
  setTimeout(() => {
    formFeedback.textContent = '✅ Message sent successfully! (Demo submission)';
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    contactForm.reset();
  }, 1100);
});

[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener('input', () => {
    if (input === nameInput) clearError(nameInput, nameError);
    if (input === emailInput) clearError(emailInput, emailError);
    if (input === messageInput) clearError(messageInput, messageError);
  });
});
