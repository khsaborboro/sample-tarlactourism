
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
       LIGHTBOX MODAL SCRIPT
       ========================================================= */
    (function () {
      const lightbox = document.getElementById('lightbox');
      const frame = document.getElementById('lightbox-frame');
      const img = document.getElementById('lightbox-img');
      const caption = document.getElementById('lightbox-caption');
      const closeBtn = document.getElementById('lightbox-close');
      if (!lightbox || !img) return;

      function openLightbox(src, cap) {
        img.src = src;
        img.alt = cap || '';
        caption.textContent = (cap || '') + '  ·  tap image to zoom';
        img.classList.remove('zoomed');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        img.src = '';
        img.classList.remove('zoomed');
      }

      document.querySelectorAll('[data-lightbox]').forEach((el) => {
        el.addEventListener('click', () => {
          openLightbox(el.dataset.lightbox, el.dataset.caption);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
      });

      img.addEventListener('click', (e) => {
        e.stopPropagation();
        img.classList.toggle('zoomed');
        if (img.classList.contains('zoomed')) {
          frame.scrollLeft = 0;
          frame.scrollTop = 0;
        }
      });
    })();

   /* =========================================================
           SHOWCASE THUMBNAIL CAROUSEL — slide arrows + active state
           ========================================================= */
           (function () {
          const track = document.getElementById('showcase-slider-track');
          const prevBtn = document.getElementById('showcasePrev');
          const nextBtn = document.getElementById('showcaseNext');
          if (!track) return;
 
          function slideAmount() {
            const firstItem = track.querySelector('.showcase-thumb-card');
            if (!firstItem) return 280;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap || style.gap || '16');
            return firstItem.getBoundingClientRect().width + gap;
          }
 
          const cards = () => Array.from(track.querySelectorAll('.showcase-thumb-card'));
          let currentIndex = 0;
          let autoplayTimer = null;
          const AUTOPLAY_DELAY = 3000; // ms between auto-slides
 
          function goToIndex(index, smooth = true) {
            const items = cards();
            if (!items.length) return;
            currentIndex = ((index % items.length) + items.length) % items.length; // wraps both directions
            const target = items[currentIndex];
            track.scrollTo({
              left: target.offsetLeft - track.offsetLeft,
              behavior: smooth ? 'smooth' : 'auto'
            });
            setActiveCard(items[currentIndex]);
          }
 
          function setActiveCard(activeEl) {
            cards().forEach((card) => {
              card.classList.remove('active-thumb', 'border-ember');
              card.classList.add('border-ash');
            });
            activeEl.classList.add('active-thumb', 'border-ember');
            activeEl.classList.remove('border-ash');
          }
 
          function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
              goToIndex(currentIndex + 1);
            }, AUTOPLAY_DELAY);
          }
 
          function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
 
          function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
          }
 
          prevBtn && prevBtn.addEventListener('click', () => {
            goToIndex(currentIndex - 1);
            restartAutoplay();
          });
          nextBtn && nextBtn.addEventListener('click', () => {
            goToIndex(currentIndex + 1);
            restartAutoplay();
          });
 
          // Pause while the user is hovering or actively interacting, resume after.
          track.addEventListener('mouseenter', stopAutoplay);
          track.addEventListener('mouseleave', startAutoplay);
          track.addEventListener('touchstart', stopAutoplay, { passive: true });
          track.addEventListener('touchend', () => setTimeout(startAutoplay, AUTOPLAY_DELAY));
 
          // Expose for the onclick handlers below.
          window.__showcaseGoToIndex = goToIndex;
          window.__showcaseRestartAutoplay = restartAutoplay;
 
          startAutoplay();
        })();
 
        // Marks the clicked thumbnail as active (ember border), centers it, and restarts
        // the autoplay timer so the loop continues from the clicked slide.
        // Hook your own logic here (e.g. swapping a main hero image/video/description)
        // using the passed index if this thumbnail strip drives other content on the page.
        function selectShowcaseItem(index, el) {
          document.querySelectorAll('.showcase-thumb-card').forEach((card) => {
            card.classList.remove('active-thumb', 'border-ember');
            card.classList.add('border-ash');
          });
          el.classList.add('active-thumb', 'border-ember');
          el.classList.remove('border-ash');
          el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
 
          if (typeof window.__showcaseGoToIndex === 'function') {
            window.__showcaseGoToIndex(index, true);
          }
          if (typeof window.__showcaseRestartAutoplay === 'function') {
            window.__showcaseRestartAutoplay();
          }
 
          // TODO: sync main showcase content to `index` here, e.g.:
          // updateShowcaseMain(index);
        }

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
