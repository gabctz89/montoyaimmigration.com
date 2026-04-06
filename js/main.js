/* ============================================================
   main.js — Stephanie Montoya | Immigration Attorney
   ============================================================ */

/* ── FADE-IN ON SCROLL ── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ── LANGUAGE TOGGLE ── */
const placeholders = {
  'inp-fname': { en: 'Your first name',   es: 'Tu nombre' },
  'inp-lname': { en: 'Your last name',    es: 'Tu apellido' },
  'inp-email': { en: 'email@example.com', es: 'correo@ejemplo.com' },
  'inp-msg':   {
    en: 'Briefly describe your case so we can best assist you...',
    es: 'Describe brevemente tu caso para que podamos orientarte mejor...'
  }
};

const pageTitles = {
  en: 'Stephanie Montoya | Immigration Attorney',
  es: 'Stephanie Montoya | Abogada de Inmigración'
};

function setLang(lang) {
  document.documentElement.lang = lang;

  // Toggle button state
  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnEs) btnEs.classList.toggle('active', lang === 'es');

  // Update all elements with data-en / data-es attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (!val) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
    el.innerHTML = val;
  });

  // Update <select> options
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + lang) || opt.textContent;
  });

  // Update input / textarea placeholders
  Object.entries(placeholders).forEach(([id, vals]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = vals[lang];
  });

  // Update page title
  document.title = pageTitles[lang] || document.title;

  // Persist selection
  localStorage.setItem('lang', lang);
}

/* ── RESTORE SAVED LANGUAGE ── */
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'en';
  setLang(saved);
});

/* ── SMOOTH SCROLL FOR ANCHOR BUTTONS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── VALIDACIÓN DEL FORMULARIO ──
document.querySelector('.form-submit').addEventListener('click', function () {

  const lang = document.documentElement.lang || 'en';

  const mensajes = {
    required: {
      en: '* This field is required',
      es: '* Este campo es obligatorio'
    },
    email: {
      en: '* Enter a valid email address',
      es: '* Ingresa un correo electrónico válido'
    }
  };

  const campos = [
    { id: 'inp-fname' },
    { id: 'inp-lname' },
    { id: 'inp-email' },
    { id: 'inp-msg'   },
  ];

  let valido = true;

  // Limpiar errores anteriores
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  campos.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el || el.value.trim() === '') {
      valido = false;
      el.classList.add('input-error');

      const msg = document.createElement('span');
      msg.className = 'field-error';
      msg.setAttribute('data-en', mensajes.required.en);
      msg.setAttribute('data-es', mensajes.required.es);
      msg.textContent = mensajes.required[lang];
      el.parentNode.appendChild(msg);

      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        el.parentNode.querySelector('.field-error')?.remove();
      }, { once: true });
    }
  });

  // Validar formato de email
  const emailEl = document.getElementById('inp-email');
  if (emailEl && emailEl.value.trim() !== '' && !emailEl.value.includes('@')) {
    valido = false;
    emailEl.classList.add('input-error');

    const msg = document.createElement('span');
    msg.className = 'field-error';
    msg.setAttribute('data-en', mensajes.email.en);
    msg.setAttribute('data-es', mensajes.email.es);
    msg.textContent = mensajes.email[lang];
    emailEl.parentNode.appendChild(msg);
  }

  if (valido) {
    alert(lang === 'es' ? '¡Mensaje enviado! Nos pondremos en contacto pronto.' : 'Message sent! We will contact you shortly.');
  }
});