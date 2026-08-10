
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
       ORGANIZATIONAL CHART CONTROLS (View Toggle, Filter & Search)
       ========================================================= */
    (function () {
      const interactiveBtn = document.getElementById('viewInteractiveBtn');
      const imageBtn = document.getElementById('viewImageBtn');
      const interactiveContainer = document.getElementById('interactiveOrgContainer');
      const imageContainer = document.getElementById('imageOrgContainer');

      if (interactiveBtn && imageBtn && interactiveContainer && imageContainer) {
        interactiveBtn.addEventListener('click', () => {
          interactiveContainer.classList.remove('hidden');
          imageContainer.classList.add('hidden');
          interactiveBtn.className = 'px-4 py-2 rounded-lg bg-ember text-void font-medium transition-all shadow-sm flex items-center gap-2';
          imageBtn.className = 'px-4 py-2 rounded-lg text-smoke hover:text-bone transition-all flex items-center gap-2';
        });

        imageBtn.addEventListener('click', () => {
          imageContainer.classList.remove('hidden');
          interactiveContainer.classList.add('hidden');
          imageBtn.className = 'px-4 py-2 rounded-lg bg-ember text-void font-medium transition-all shadow-sm flex items-center gap-2';
          interactiveBtn.className = 'px-4 py-2 rounded-lg text-smoke hover:text-bone transition-all flex items-center gap-2';
        });
      }

      const filterBtns = document.querySelectorAll('.org-filter-btn');
      const staffCards = document.querySelectorAll('.staff-card');

      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterBtns.forEach((b) => {
            b.classList.remove('active', 'bg-void', 'text-bone', 'shadow-xs');
            b.classList.add('bg-void/50', 'text-smoke');
          });
          btn.classList.add('active', 'bg-void', 'text-bone', 'shadow-xs');
          btn.classList.remove('bg-void/50', 'text-smoke');

          const filter = btn.getAttribute('data-filter');
          staffCards.forEach((card) => {
            const position = card.getAttribute('data-position');
            if (filter === 'all' || position === filter) {
              card.style.display = '';
              card.style.opacity = '1';
            } else {
              card.style.opacity = '0.2';
            }
          });
        });
      });

      const searchInput = document.getElementById('orgSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase().trim();
          const allCards = document.querySelectorAll('.staff-card, .org-card');
          allCards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            if (!q || text.includes(q)) {
              card.style.opacity = '1';
            } else {
              card.style.opacity = '0.2';
            }
          });
        });
      }
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

      // recalc mobile menu height since content size just changed
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && mobileMenu.style.maxHeight !== '0px' && mobileMenu.style.maxHeight !== '') {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
      }
    });
  });
})();



