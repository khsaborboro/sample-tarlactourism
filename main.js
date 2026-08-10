
/* =========================================================
   CUSTOM CURSOR — dot follows instantly, ring trails (lerp)
   ========================================================= */
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const invertTargets = 'a.magnetic, .bg-ember';
  document.querySelectorAll('[data-hover]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add(el.matches(invertTargets) ? 'hovered-invert' : 'hovered');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered', 'hovered-invert');
    });
  });
})();

/* =========================================================
   MOBILE MENU TOGGLE
   ========================================================= */
(function () {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  const lines = btn.querySelectorAll('.hamburger-line');
  let open = false;

  function setOpen(state) {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    menu.style.maxHeight = open ? menu.scrollHeight + 'px' : '0px';
    lines[0].style.transform = open ? 'translateY(3px) rotate(45deg)' : 'none';
    lines[1].style.transform = open ? 'translateY(-3px) rotate(-45deg)' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => setOpen(!open));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && open) setOpen(false);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // ===================== MOBILE MENU TOGGLE =====================
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburgerLines = menuBtn.querySelectorAll('.hamburger-line');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      
      // Toggle accessibility attribute
      menuBtn.setAttribute('aria-expanded', !isExpanded);

      if (!isExpanded) {
        // OPEN MENU: Remove max-h-0 and add a large max-height to trigger transition
        mobileMenu.classList.remove('max-h-0');
        mobileMenu.classList.add('max-h-[2000px]', 'border-b');
        
        // Transform hamburger icon into an "X"
        if (hamburgerLines.length >= 2) {
          hamburgerLines[0].style.transform = 'translateY(3.5px) rotate(45deg)';
          hamburgerLines[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
        }
      } else {
        // CLOSE MENU: Restore max-h-0 to hide
        mobileMenu.classList.add('max-h-0');
        mobileMenu.classList.remove('max-h-[2000px]', 'border-b');
        
        // Restore hamburger icon
        if (hamburgerLines.length >= 2) {
          hamburgerLines[0].style.transform = 'none';
          hamburgerLines[1].style.transform = 'none';
        }
      }
    });
  }

  // ===================== MEGA MENU TOGGLE =====================
  const megaMenuBtn = document.getElementById('megaMenuBtn');
  const megaMenu = document.getElementById('mega-menu');
  const megaMenuClose = document.getElementById('megaMenuClose');
  const megaMenuChevron = document.getElementById('megaMenuChevron');

  if (megaMenuBtn && megaMenu && megaMenuClose) {
    // Open Mega Menu
    megaMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent immediate closing
      const isHidden = megaMenu.classList.contains('hidden');
      
      if (isHidden) {
        megaMenu.classList.remove('hidden');
        megaMenuBtn.setAttribute('aria-expanded', 'true');
        if (megaMenuChevron) megaMenuChevron.style.transform = 'rotate(180deg)';
      } else {
        megaMenu.classList.add('hidden');
        megaMenuBtn.setAttribute('aria-expanded', 'false');
        if (megaMenuChevron) megaMenuChevron.style.transform = 'rotate(0deg)';
      }
    });

    // Close Mega Menu via Close Button
    megaMenuClose.addEventListener('click', () => {
      megaMenu.classList.add('hidden');
      megaMenuBtn.setAttribute('aria-expanded', 'false');
      if (megaMenuChevron) megaMenuChevron.style.transform = 'rotate(0deg)';
    });

    // Close Mega Menu if clicking outside of it
    document.addEventListener('click', (e) => {
      if (!megaMenu.classList.contains('hidden') && !megaMenu.contains(e.target) && !megaMenuBtn.contains(e.target)) {
        megaMenu.classList.add('hidden');
        megaMenuBtn.setAttribute('aria-expanded', 'false');
        if (megaMenuChevron) megaMenuChevron.style.transform = 'rotate(0deg)';
      }
    });
  }
});

/* =========================================================
   MAGNETIC BUTTON PULL
   ========================================================= */
(function () {
  const items = document.querySelectorAll('.magnetic');
  items.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
})();

/* =========================================================
   3D TILT ON DESTINATION CARDS
   ========================================================= */
(function () {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const inner = card.querySelector('.tilt-inner');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0) rotateX(0)';
    });
  });
})();

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
(function () {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
})();

/* =========================================================
   ANIMATED COUNTERS
   ========================================================= */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  const format = (val, el) => {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const num = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
    return num + suffix;
  };
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, el);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => io.observe(el));
})();

/* =========================================================
   HERO TYPEWRITER
   ========================================================= */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['511 Barangays', '17 Municipalities', '1 City', '7 Heritage Cultures', 'Mount Pinatubo\u2019s crater lake', '3,053 sq. km of discovery'];
  let w = 0, c = 0, deleting = false;

  function tick() {
    const word = words[w];
    if (!deleting) {
      c++;
      el.textContent = word.slice(0, c);
      if (c === word.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      c--;
      el.textContent = word.slice(0, c);
      if (c === 0) { deleting = false; w = (w + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
})();



/* =========================================================
   CHART.JS — TOURIST GROWTH (SAMPLE DATA)
   ========================================================= */
(function () {
  const ctx = document.getElementById('growthChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.parentElement.clientHeight || 340);
  gradient.addColorStop(0, 'rgba(13,148,136,0.35)');
  gradient.addColorStop(1, 'rgba(13,148,136,0)');

  new Chart(ctx, { 
    type: 'line', 
    data: { 
      labels: ['2023', '2024', '2025', '2026'], 
      datasets: [{ 
        label: 'Day-Tour Visitor arrivals', 
        data: [1536728, 1639520, 1369883, 686542], 
        borderColor: '#0d9488', 
        backgroundColor: gradient, borderWidth: 2, 
        pointBackgroundColor: '#ffffff', 
        pointBorderColor: '#0d9488', 
        pointBorderWidth: 2, 
        pointRadius: 4, 
        tension: 0.4, 
        fill: true, }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#f4f4f5',
          borderColor: '#d4d4d8',
          borderWidth: 1,
          titleColor: '#000000',
          bodyColor: '#000000',
          titleFont: { family: 'IBM Plex Mono' },
          bodyFont: { family: 'IBM Plex Mono' },
          padding: 10,
        }
      },
      scales: {
        x: { grid: { color: '#d4d4d8' }, ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 14 } } },
        y: {
          grid: { color: '#d4d4d8' },
          ticks: {
            color: '#000000',
            font: { family: 'IBM Plex Mono', size: 11 },
            callback: (v) => (v / 1000) + 'k'
          }
        }
      }
    }
  });
})();

/* =========================================================
   CHART.JS — TOURIST GROWTH (Night-Stayed)
   ========================================================= */

(function () {
      const ctx = document.getElementById('growthChart1');
      if (!ctx || typeof Chart === 'undefined') return;
    
      const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, ctx.parentElement.clientHeight || 340);
      gradient.addColorStop(0, 'rgba(13,148,136,0.35)');
      gradient.addColorStop(1, 'rgba(13,148,136,0)');
    
      new Chart(ctx, { 
        type: 'line', 
        data: { 
          labels: ['2023', '2024', '2025', '2026'], 
          datasets: [{ 
            label: 'Nigth-Stayed Visitor arrivals', 
            data: [127403, 138333, 166668, 102437], 
            borderColor: '#0d9488', 
            backgroundColor: gradient, borderWidth: 2, 
            pointBackgroundColor: '#ffffff', 
            pointBorderColor: '#0d9488', 
            pointBorderWidth: 2, 
            pointRadius: 4, 
            tension: 0.4, 
            fill: true, }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          resizeDelay: 100,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#f4f4f5',
              borderColor: '#d4d4d8',
              borderWidth: 1,
              titleColor: '#000000',
              bodyColor: '#000000',
              titleFont: { family: 'IBM Plex Mono' },
              bodyFont: { family: 'IBM Plex Mono' },
              padding: 10,
            }
          },
          scales: {
            x: { grid: { color: '#d4d4d8' }, ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 14 } } },
            y: {
              grid: { color: '#d4d4d8' },
              ticks: {
                color: '#000000',
                font: { family: 'IBM Plex Mono', size: 11 },
                callback: (v) => (v / 1000) + 'k'
              }
            }
          }
        }
      });
})();

/* =========================================================
   CHART.JS — LGU SUBMISSION STATUS (DONUT)
   ========================================================= */
   (function () {
  const ctx = document.getElementById('submissionDonut');
  if (!ctx || typeof Chart === 'undefined') return;

  const labels = ['Camiling','Anao','Capas','La Paz','San Manuel','Concepcion','Ramos','San Clemente','Victoria','San Jose','Tarlac City','Bamban','Mayantoc'];
  const data   = [17, 12.8, 12.8, 12.8, 8.5, 6.4, 6.4, 6.4, 6.4, 4.6, 3.5, 1.7, 1.7];
  const colors = ['#7f1d1d','#71717a','#0d9488','#a21caf','#a1a1aa','#22c55e','#166534','#be123c','#f97316','#0ea5a3','#d4d4d8','#a3a34a','#3f3f46'];

  new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 2 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#f4f4f5', borderColor: '#d4d4d8', borderWidth: 1,
          titleColor: '#000000', bodyColor: '#000000',
          titleFont: { family: 'IBM Plex Mono' }, bodyFont: { family: 'IBM Plex Mono' }, padding: 10,
          callbacks: { label: (c) => `${c.label}: ${c.raw}%` }
        }
      }
    }
  });

  const legendEl = document.getElementById('donutLegend');
  if (legendEl) {
    legendEl.innerHTML = labels.map((l, i) =>
      `<div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${colors[i]}"></span>${l}</div>`
    ).join('');
  }
})();

/* =========================================================
   CHART.JS — VISITOR ARRIVALS BY SITE (BAR + LINE)
   ========================================================= */
   (function () {
  const ctx = document.getElementById('arrivalBarChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const labels   = ['Concepcion','Mayantoc','San Jose','San Clemente','Capas','San Manuel','Tarlac City','La Paz','Ramos','Camiling','Anao','Bamban','Victoria'];
  const totals   = [228700, 131800, 104500, 81700, 31700, 25300, 24300, 23900, 15600, 11500, 3000, 3400, 3600];

  new Chart(ctx, {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Total Stats',
          data: totals,
          backgroundColor: '#0d9488',
          borderRadius: 4,
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      plugins: {
        legend: {
          position: 'top', align: 'center',
          labels: { color: '#000000', font: { family: 'IBM Plex Mono', size: 14 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: '#0d9488', borderColor: '#d4d4d8', borderWidth: 1,
          titleFont: { family: 'IBM Plex Mono' }, bodyFont: { family: 'IBM Plex Mono' }, padding: 10
        }
      },
      scales: {
        x: { grid: { color: '#d4d4d8' }, ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 10 } } },
        y: {
          grid: { color: '#d4d4d8' },
          ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 11 }, callback: (v) => (v / 1000) + 'K' }
        },
        y1: {
          position: 'right',
          grid: { display: true },
        }
      }
    }
  });
})();

/* =========================================================
   CHART.JS — VISITOR ARRIVALS BY SITE (BAR + LINE)1
   ========================================================= */

(function () {
  const ctx = document.getElementById('arrivalBarChart1');
  if (!ctx || typeof Chart === 'undefined') return;

  const labels   = ['Concepcion','Mayantoc','San Jose','San Clemente','Capas','San Manuel','Tarlac City','La Paz','Ramos','Camiling','Anao','Bamban','Victoria'];
  const domestic   = [228700, 131800, 104500, 81700, 31700, 25300, 24300, 23900, 15600, 11500, 3000, 3400, 3600];
  const foreign   = [2287, 1318, 1045, 817, 317, 253, 243, 239, 156, 115, 300, 340, 360];

  new Chart(ctx, {
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Domestic',
          data: domestic,
          borderColor: '#1aa6b7',
          backgroundColor: '#0d9488',
          borderRadius: 4,
          order: 2
        },
        {
          type: 'line',
          label: 'Forgeign',
          data: foreign,
          borderColor: '#1aa6b7',
          backgroundColor: '#0d9488',
          borderRadius: 4,
          order: 2
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      plugins: {
        legend: {
          position: 'bottom', align: 'center',
          labels: { color: '#000000', font: { family: 'IBM Plex Mono', size: 14 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: '#0d9488', borderColor: '#d4d4d8', borderWidth: 1,
          titleFont: { family: 'IBM Plex Mono' }, bodyFont: { family: 'IBM Plex Mono' }, padding: 10
        }
      },
      scales: {
        x: { grid: { color: '#d4d4d8' }, 
        ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 10     
        } 
      } 
      },
        y: {
          grid: { color: '#d4d4d8' },
          ticks: { color: '#000000', font: { family: 'IBM Plex Mono', size: 11 }, callback: (v) => (v / 1000) + 'K' }
        },
        y1: {
          position: 'right',
          grid: { display: true },
        }
      }
    }
  });
})();

 /* =========================================================
     DIORAMA SHOWCASE — prev/next paging between slide groups
     ========================================================= */
     (function () {
    const section = document.getElementById('diorama');
    if (!section) return;
    const prevBtn = document.getElementById('dioramaPrev');
    const nextBtn = document.getElementById('dioramaNext');
    const slides = Array.from(section.querySelectorAll('.diorama-slide, .stat-card'));
    const perPage = 4;
    const totalPages = Math.max(1, Math.ceil(slides.length / perPage));
    let currentPage = 0;
 
    function render() {
      slides.forEach((slide, i) => {
        const page = Math.floor(i / perPage);
        slide.style.display = (page === currentPage) ? '' : 'none';
      });
    }
 
    prevBtn && prevBtn.addEventListener('click', () => {
      currentPage = (currentPage - 1 + totalPages) % totalPages;
      render();
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      currentPage = (currentPage + 1) % totalPages;
      render();
    });
 
    render();
  })();

 
  /* =========================================================
     DIORAMA LIGHTBOX — click any collage photo to view full size
     ========================================================= */
     (function () {
    const modal = document.getElementById('diorama-lightbox');
    const img = document.getElementById('diorama-lightbox-img');
    const caption = document.getElementById('diorama-lightbox-caption');
    const closeBtn = document.getElementById('diorama-lightbox-close');
    if (!modal || !img) return;
 
    function openModal(src, cap) {
      img.src = src;
      img.alt = cap || '';
      caption.textContent = cap || '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
 
    function closeModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      img.src = '';
    }
 
    document.querySelectorAll('#diorama-gallery [data-lightbox]').forEach((el) => {
      el.addEventListener('click', () => {
        openModal(el.getAttribute('data-lightbox'), el.getAttribute('data-caption'));
      });
    });
 
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  })();

/* =========================================================
   MEGA MENU — "UNLOCK TARLAC" full-width dropdown
   ========================================================= */
(function () {
  const btn = document.getElementById('megaMenuBtn');
  const chevron = document.getElementById('megaMenuChevron');
  const menu = document.getElementById('mega-menu');
  const closeBtn = document.getElementById('megaMenuClose');
  const tabs = document.querySelectorAll('.mega-tab');
  const panels = document.querySelectorAll('.mega-panel');
  if (!btn || !menu) return;

  let open = false;

  function setOpen(state) {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('hidden', !open);
    if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  closeBtn && closeBtn.addEventListener('click', () => setOpen(false));

  document.addEventListener('click', (e) => {
    if (open && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.megaTab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('text-bone', active);
        t.classList.toggle('font-semibold', active);
        t.classList.toggle('text-smoke', !active);
      });
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.megaPanel !== target);
      });
    });
  });
})();

/* =========================================================
   MEGA MENU (MOBILE) — tab switching inside slide-down menu
   ========================================================= */
(function () {
  const tabsM = document.querySelectorAll('.mega-tab-m');
  const panelsM = document.querySelectorAll('.mega-panel-m');
  if (!tabsM.length) return;

  tabsM.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.megaTabM;
      tabsM.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('text-bone', active);
        t.classList.toggle('font-semibold', active);
        t.classList.toggle('text-smoke', !active);
      });
      panelsM.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.megaPanelM !== target);
      });

      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && mobileMenu.style.maxHeight !== '0px' && mobileMenu.style.maxHeight !== '') {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
      }
    });
  });
})();


/* =========================================================
   EXPLORE GALLERY — category tabs, location filter, and
   SMOOTH drag-to-scroll functionality (Desktop & Mobile).
   ========================================================= */
   (function () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const tabs = Array.from(document.querySelectorAll('#galleryCategoryTabs .gallery-tab'));
  const locationSel = document.getElementById('galleryLocation');
  const cards = Array.from(grid.querySelectorAll('.gallery-card'));
  const emptyMsg = document.getElementById('galleryEmpty');

  let activeCategory = 'all';

  // --- Filtering Logic ---
  function applyFilters() {
    const loc = locationSel ? locationSel.value : 'all';
    let visible = 0;

    cards.forEach((card) => {
      const cCat = card.dataset.category;
      const cLoc = card.dataset.location;
      
      const matches =
        (activeCategory === 'all' || cCat === activeCategory) &&
        (loc === 'all' || cLoc === loc);

      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });

    if (emptyMsg) emptyMsg.classList.toggle('hidden', visible !== 0);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.category;
      
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('active-tab', isActive);
        
        if (isActive) {
          t.classList.remove('bg-void', 'text-smoke');
          t.classList.add('bg-ember', 'text-void');
        } else {
          t.classList.remove('bg-ember', 'text-void');
          t.classList.add('bg-void', 'text-smoke');
        }
      });

      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      applyFilters();
    });
  });

  if (locationSel) locationSel.addEventListener('change', applyFilters);
  applyFilters();

  // --- SMOOTH Drag to Scroll Logic ---
  let isDown = false;
  let didDrag = false;
  let startX;
  let scrollLeft;

  // Helper to start the drag
  function startDrag(x) {
    isDown = true;
    didDrag = false;
    startX = x - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
    grid.style.cursor = 'grabbing';
    
    // CRITICAL: Disable snapping while dragging so it doesn't stutter!
    grid.style.scrollSnapType = 'none'; 
  }

  // Helper to stop the drag
  function stopDrag() {
    isDown = false;
    grid.style.cursor = 'grab';
    
    // Re-enable snapping when the user lets go
    grid.style.scrollSnapType = ''; 
  }

  // Helper to handle the drag movement
  function moveDrag(e, x) {
    if (!isDown) return;
    
    // Prevent default to stop text highlighting/image dragging on desktop
    if (e.cancelable && e.type !== 'touchmove') {
      e.preventDefault(); 
    }

    const walk = (x - startX) * 1.5; // Multiply by 1.5 for slightly faster swipe
    if (Math.abs(walk) > 5) didDrag = true; // threshold to differentiate click vs drag
    
    grid.scrollLeft = scrollLeft - walk;
  }

  // 3. Mouse Wheel Event (Scroll up/down to slide left/right)
  grid.addEventListener('wheel', (e) => {
    // Check if the scroll is mostly vertical (standard mouse wheel)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault(); // Stop the entire page from scrolling up/down
      
      // Temporarily disable snapping for a smoother mouse-wheel scroll
      grid.style.scrollSnapType = 'none';
      
      grid.scrollLeft += e.deltaY; // Convert vertical scroll to horizontal scroll
      
      // Re-enable snapping after the user stops scrolling (debounce)
      clearTimeout(grid.wheelTimeout);
      grid.wheelTimeout = setTimeout(() => {
        grid.style.scrollSnapType = '';
      }, 150);
    }
  }, { passive: false }); // passive: false is required to allow preventDefault()

  // 2. Touch Events (Mobile/Tablet)
  grid.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX), { passive: true });
  grid.addEventListener('touchend', stopDrag);
  grid.addEventListener('touchcancel', stopDrag);
  grid.addEventListener('touchmove', (e) => {
    // Only intercept if user is swiping horizontally, let them scroll down the page naturally
    if (isDown) {
        moveDrag(e, e.touches[0].pageX);
    }
  }, { passive: true });

  // 3. Prevent link click if the user was actively dragging
  grid.addEventListener('click', (e) => {
    if (didDrag) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

})();
