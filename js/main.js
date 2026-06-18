// ============================================
// NayePankh Foundation — Site Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Dark mode toggle ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke-linecap="round"/></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Apply saved preference
  const savedTheme = localStorage.getItem('nayepankh-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }

  if (themeToggle) {
    themeToggle.innerHTML = body.classList.contains('dark') ? sunIcon : moonIcon;

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
      localStorage.setItem('nayepankh-theme', isDark ? 'dark' : 'light');
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        // Close siblings for a clean accordion feel
        item.parentElement.querySelectorAll('.faq-item').forEach(sib => sib.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 12;
      header.style.boxShadow = scrolled ? '0 4px 24px -8px rgba(34,34,30,0.12)' : 'none';
      lastScroll = window.scrollY;
    });
  }

  /* ---------- Animated counters (stat bands) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Volunteer form: posts to /api/volunteer (Neon DB) ---------- */
const volunteerForm = document.getElementById('volunteer-form');
if (volunteerForm) {
  volunteerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = volunteerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const payload = {
      name: document.getElementById('v-name').value.trim(),
      email: document.getElementById('v-email').value.trim(),
      phone: document.getElementById('v-phone').value.trim(),
      city: document.getElementById('v-city').value.trim(),
      program: document.getElementById('v-program').value,
      availability: document.getElementById('v-availability').value,
      message: document.getElementById('v-message').value.trim(),
    };

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      volunteerForm.style.display = 'none';
      document.getElementById('volunteer-success').classList.add('show');
    } catch (err) {
      console.error('Volunteer submit error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('Something went wrong submitting your application. Please try again.');
    }
  });
}

/* ---------- Contact form: posts to /api/contact (Neon DB) ---------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const payload = {
      name: document.getElementById('c-name').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      subject: document.getElementById('c-subject').value.trim(),
      message: document.getElementById('c-message').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      contactForm.style.display = 'none';
      document.getElementById('contact-success').classList.add('show');
    } catch (err) {
      console.error('Contact submit error:', err);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('Something went wrong sending your message. Please try again.');
    }
  });
        }
/* ---------- AI Chat Widget ---------- */
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  if (chatBubble && chatWindow && chatForm) {
    let chatHistory = [];

    chatBubble.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open') && chatMessages.children.length === 0) {
        addBotMessage("Hi! I'm Pankh, NayePankh's assistant. Ask me about our programs, volunteering, or donating.");
      }
    });

    function addMessage(text, sender) {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${sender}`;
      msg.textContent = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(text) {
      addMessage(text, 'bot');
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'chat-msg bot typing';
      typing.id = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById('chat-typing');
      if (typing) typing.remove();
    }

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';
      showTyping();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: chatHistory }),
        });
        const data = await res.json();
        hideTyping();

        if (!res.ok) throw new Error(data.error || 'Chat failed');

        addBotMessage(data.reply);
        chatHistory.push({ role: 'user', parts: [{ text }] });
        chatHistory.push({ role: 'model', parts: [{ text: data.reply }] });
      } catch (err) {
        hideTyping();
        console.error('Chat error:', err);
        addBotMessage("Sorry, I'm having trouble responding right now. Please try again in a moment.");
      }
    });
  }
  
});
