(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Animate skill bars when the section enters the viewport.
  const skills = $$('.skill');
  const animateSkills = () => skills.forEach(item => {
    const bar = $('.track span', item);
    bar.style.width = `${item.dataset.level || 0}%`;
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        animateSkills();
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    const section = $('#skills');
    if (section) observer.observe(section);
  } else animateSkills();

  // Tool tiles reveal their short description on click.
  const hint = $('#toolHint');
  $$('.tool-tile').forEach(tile => tile.addEventListener('click', () => {
    $$('.tool-tile').forEach(other => other.classList.remove('active'));
    tile.classList.add('active');
    if (hint) hint.textContent = `${tile.textContent.trim()}: ${tile.dataset.tip || 'Dizayn vositasi'}.`;
  }));

  // Light/dark appearance toggle, saved for the current browser.
  const themeButton = $('#themeToggle');
  const savedTheme = (() => { try { return localStorage.getItem('cv-theme'); } catch (_) { return null; } })();
  if (savedTheme === 'light') document.body.classList.add('light');
  if (themeButton) {
    themeButton.textContent = document.body.classList.contains('light') ? '☾' : '☼';
    themeButton.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const light = document.body.classList.contains('light');
      themeButton.textContent = light ? '☾' : '☼';
      try { localStorage.setItem('cv-theme', light ? 'light' : 'dark'); } catch (_) {}
      showToast(light ? 'Yorug‘ rejim yoqildi' : 'Qorong‘i rejim yoqildi');
    });
  }

  // Print dialog can be used to save the page as PDF.
  const printButton = $('#printBtn');
  if (printButton) printButton.addEventListener('click', () => window.print());

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // Smooth in-page navigation with keyboard-friendly focus.
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
})();