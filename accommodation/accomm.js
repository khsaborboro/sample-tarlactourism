
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
            label: 'Nigth-Stayed Visitor arrivals',
            data: [127403, 138333, 166668, 102437],
            borderColor: '#0d9488',
            backgroundColor: gradient, borderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#0d9488',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
            fill: true,
          }]
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
              titleFont: { family: 'IBM Plex Mono' },
              bodyFont: { family: 'IBM Plex Mono' },
              padding: 10,
            }
          },
          scales: {
            x: { grid: { color: '#d4d4d8' }, ticks: { color: '#52525b', font: { family: 'IBM Plex Mono', size: 11 } } },
            y: {
              grid: { color: '#d4d4d8' },
              ticks: {
                color: '#52525b',
                font: { family: 'IBM Plex Mono', size: 11 },
                callback: (v) => (v / 1000) + 'k'
              }
            }
          }
        }
      });
    })();

    /* =========================================================
       SHOWCASE SLIDER SCRIPT
       ========================================================= */
    (function () {
      const showcaseItems = [
        {
          badge: 'La Maja Rica Hotel',
          title: 'La Maja Rica Hotel',
          desc: 'La Maja Rica Hotel is a premier destination for comfort and elegance in Tarlac City. Featuring well-appointed rooms, a relaxing pool area, and a popular in-house restaurant, it offers a blend of modern amenities and warm hospitality.',
          rooms: ['Superior Room', 'Deluxe Suite', 'Executive Pool View'],
          img: 'Hotels/la-maja-rica-5.jpg',
          caption: 'La Maja Rica Hotel — Sunset & Pool View',
          link: 'lamajarica.html'
        },
        {
          badge: 'Luisita Central Park Hotel',
          title: 'Luisita Central Park Hotel',
          desc: 'Located within the Luisita Business Park, the hotel features stylish rooms, a swimming pool, fitness center, and on-site dining with easy access to Luisita Golf and Country Club.',
          rooms: ['Standard Deluxe', 'Executive Suite', 'Presidential Room'],
          img: 'Hotels/luisita-hotel-3.jpg',
          caption: 'Luisita Central Park Hotel — Tarlac City',
          link: 'https://www.facebook.com/centralparkhoteltarlac'
        },
        {
          badge: 'L Square Hotel',
          title: 'L Square Hotel',
          desc: 'A stylish 3-star boutique hotel in Tarlac City offering well-appointed rooms, free Wi-Fi, buffet breakfast, shuttle service, Café Teodora, and A Lounge Music Bar.',
          rooms: ['Standard Twin', 'Deluxe Queen', 'Family Suite'],
          img: 'Hotels/l-square.jpg',
          caption: 'L Square Hotel — MacArthur Hwy, Tarlac City',
          link: 'https://www.facebook.com/lsquaretarlac/'
        },
        {
          badge: 'Asiaten Hotel',
          title: 'Asiaten Hotel',
          desc: 'Offers simple, budget-friendly comfort in the heart of Tarlac City with clean air-conditioned rooms, free Wi-Fi, and convenient access to local attractions.',
          rooms: ['Standard Single', 'Double Room', 'Family Comfort'],
          img: 'Hotels/asiaten-hotel.jpg',
          caption: 'Asiaten Hotel — San Rafael, Tarlac City',
          link: 'https://acesse.one/03u8qab'
        },
        {
          badge: 'Microtel by Wyndham',
          title: 'Microtel by Wyndham Tarlac',
          desc: 'Perfect for travelers looking for a streamlined experience with comfortable rooms, fresh country air, and proximity to Luisita Golf & Country Club.',
          rooms: ['2-Queen Bed Room', '1-Queen Suite', 'Accessible Room'],
          img: 'Hotels/microtel-tarlac.webp',
          caption: 'Microtel by Wyndham — Hacienda Luisita',
          link: 'https://www.microtel-tarlac.com/contact'
        },
        {
          badge: 'Achitel Tarlac',
          title: 'Achitel Tarlac',
          desc: 'A modern 2-star aparthotel with private bathrooms, flat-screen TVs, kitchenettes, 24-hour front desk, and free parking — a short drive from SM City Tarlac.',
          rooms: ['Studio Apartment', '1-Bedroom Suite', 'Deluxe Kitchenette'],
          img: 'Hotels/achitel.jpg',
          caption: 'Achitel Tarlac — San Sebastian, Tarlac City',
          link: 'https://www.facebook.com/people/ACHI-HOTEL/61557618629089/'
        }
      ];

      let currentIndex = 0;

      window.selectShowcaseItem = function (index) {
        if (index < 0 || index >= showcaseItems.length) return;
        currentIndex = index;
        const data = showcaseItems[index];

        const titleEl = document.getElementById('showcase-title');
        const badgeEl = document.getElementById('showcase-badge');
        const descEl = document.getElementById('showcase-desc');
        const linkEl = document.getElementById('showcase-link');
        const roomsEl = document.getElementById('showcase-rooms');

        if (titleEl) titleEl.textContent = data.title;
        if (badgeEl) badgeEl.textContent = data.badge;
        if (descEl) descEl.textContent = data.desc;

        if (roomsEl && data.rooms) {
          roomsEl.innerHTML = data.rooms.map(room =>
            `<span class="px-3 py-1.5 rounded-lg bg-panel border border-ash text-bone shadow-sm hover:border-ember/60 transition-colors">${room}</span>`
          ).join('');
        }

        if (linkEl) {
          linkEl.setAttribute('href', data.link);
        }

        const cards = document.querySelectorAll('.showcase-thumb-card');
        cards.forEach((card, i) => {
          if (i === index) {
            card.classList.add('border-ember');
            card.classList.remove('border-ash');
          } else {
            card.classList.remove('border-ember');
            card.classList.add('border-ash');
          }
        });

        if (typeof window.openLightbox === 'function' && data.img) {
          window.openLightbox(data.img, data.caption || data.title);
        }
      };

      const prevBtn = document.getElementById('slide-prev-btn');
      const nextBtn = document.getElementById('slide-next-btn');
      const track = document.getElementById('showcase-slider-track');

      let isAnimating = false;
      let autoRotateTimer = null;

      function rotateNextSmooth() {
        if (!track || isAnimating) return;
        const firstCard = track.firstElementChild;
        if (!firstCard) return;
        isAnimating = true;
        const cardWidth = firstCard.offsetWidth + 16;

        track.scrollBy({ left: cardWidth, behavior: 'smooth' });

        setTimeout(() => {
          track.appendChild(firstCard);
          track.scrollLeft -= cardWidth;
          isAnimating = false;
        }, 450);
      }

      function rotatePrevSmooth() {
        if (!track || isAnimating) return;
        const lastCard = track.lastElementChild;
        if (!lastCard) return;
        isAnimating = true;
        const cardWidth = lastCard.offsetWidth + 16;

        track.insertBefore(lastCard, track.firstElementChild);
        track.scrollLeft += cardWidth;

        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });

        setTimeout(() => {
          isAnimating = false;
        }, 450);
      }

      function startAutoRotate() {
        stopAutoRotate();
        autoRotateTimer = setInterval(rotateNextSmooth, 4000);
      }

      function stopAutoRotate() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);
      }

      if (track) {
        startAutoRotate();
        track.addEventListener('mouseenter', stopAutoRotate);
        track.addEventListener('mouseleave', startAutoRotate);
        track.addEventListener('touchstart', stopAutoRotate, { passive: true });
        track.addEventListener('touchend', startAutoRotate, { passive: true });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          stopAutoRotate();
          rotatePrevSmooth();
          startAutoRotate();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stopAutoRotate();
          rotateNextSmooth();
          startAutoRotate();
        });
      }
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

      window.openLightbox = function openLightbox(src, cap) {
        img.src = src;
        img.alt = cap || '';
        caption.textContent = (cap || '') + '  ·  tap image to zoom';
        img.classList.remove('zoomed');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      };

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
     hotel function / description of defferents hotels
       ========================================================= */
       

    (function () {
    // Hotel slide data — each entry drives the top showcase (image, title,
    // subtitle, description, room types) when its card becomes active.
    const STAYS_SLIDES = [
      {
        src: 'Hotels/lamaja-lobby.jpg',
        video: 'Video/LA MAJA RICA3.mp4',
        caption: 'La Maja Rica Hotel',
        title: 'La Maja Rica Hotel',
        subtitle: 'Tarlac City',
        desc: 'La Maja Rica Hotel is a premier destination for comfort and elegance in Tarlac City. Featuring well-appointed rooms, a relaxing pool area, and a popular in-house restaurant, it offers a blend of modern amenities and warm hospitality. Conveniently located near major highways, business centers, and local attractions, La Maja Rica is perfect for travelers seeking both relaxation and accessibility in the heart of the city.',
        rooms: ['Superior Room', 'Deluxe Suite', 'Executive Pool View']
      },
      {
        src: 'Hotels/luisita-hotel-3.jpg',
        video: null, // add a video path here once available
        caption: 'Luisita Central Park Hotel',
        title: 'Luisita Central Park Hotel',
        subtitle: 'San Miguel, Tarlac City',
        desc: 'Set within the Luisita Central Park estate, this hotel pairs resort-style grounds with easy access to golf, dining, and leisure facilities. Its spacious rooms and landscaped surroundings make it a favorite for both business travelers and families looking to unwind.',
        rooms: ['Standard Room', 'Family Suite', 'Garden View Room']
      },
      {
        src: 'Hotels/l-square.jpg',
        video: null, // add a video path here once available
        caption: 'L Square Hotel',
        title: 'L Square Hotel',
        subtitle: 'Tarlac City',
        desc: 'L Square Hotel offers modern, no-fuss accommodations right in the heart of the city, ideal for travelers who want a comfortable stay within walking distance of shops, restaurants, and business centers.',
        rooms: ['Standard Room', 'Deluxe Room', 'Suite']
      },
      {
        src: 'Hotels/asiaten-hotel.jpg',
        video: null, // add a video path here once available
        caption: 'Asiaten Hotel',
        title: 'Asiaten Hotel',
        subtitle: 'Tarlac City',
        desc: 'Asiaten Hotel combines contemporary Asian-inspired design with practical amenities, offering a relaxed atmosphere for guests visiting Tarlac for leisure or work.',
        rooms: ['Classic Room', 'Deluxe Room', 'Family Room']
      },
      {
        src: 'Hotels/microtel-tarlac.webp',
        video: null, // add a video path here once available
        caption: 'Microtel by Wyndham',
        title: 'Microtel by Wyndham',
        subtitle: 'Tarlac City',
        desc: 'Part of the globally recognized Wyndham brand, Microtel Tarlac delivers reliable, business-friendly accommodations with consistent service standards, making it a dependable choice for both corporate and leisure travelers.',
        rooms: ['Queen Room', 'Twin Room', 'Suite']
      },
      {
        src: 'Hotels/achitel.jpg',
        video: null, // add a video path here once available
        caption: 'Achitel Tarlac',
        title: 'Achitel Tarlac',
        subtitle: 'Tarlac City',
        desc: 'Achitel Tarlac offers cozy, budget-friendly rooms suited for travelers who want clean, comfortable lodging without frills, close to the city\'s main attractions and transport links.',
        rooms: ['Standard Room', 'Deluxe Room']
      }
    ];
 
    const stage = document.getElementById('stays-coverflow');
    const dotsWrap = document.getElementById('stays-dots');
 
    // Top Showcase Elements
    const topTitle = document.getElementById('stays-showcase-title');
    const topSubtitle = document.getElementById('stays-showcase-subtitle');
    const topDesc = document.getElementById('stays-showcase-desc');
    const topVideo = document.getElementById('stays-showcase-video');
    const topImg = document.getElementById('stays-showcase-img');
    const topRooms = document.getElementById('stays-showcase-rooms');
 
    if (!stage) return;
 
    let activeIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 4200;
    const CARD_WIDTH = 360;
    const CARD_HEIGHT_RATIO = 0.62;
    const MAX_VISIBLE_OFFSET = 3;
 
    // Build slide elements once
    const slideEls = STAYS_SLIDES.map((data, i) => {
      const el = document.createElement('div');
      el.className = 'stays-slide absolute top-1/2 left-1/2 rounded-2xl border-[3px] border-ember overflow-hidden cursor-pointer bg-panel shadow-xl';
      el.style.width = CARD_WIDTH + 'px';
      el.style.height = Math.round(CARD_WIDTH * CARD_HEIGHT_RATIO) + 'px';
      el.style.transition = 'transform 0.5s ease, opacity 0.5s ease, z-index 0s';
      el.setAttribute('data-hover', '');
      el.setAttribute('data-lightbox', data.src);
      el.setAttribute('data-caption', data.caption);
 
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.caption;
      img.className = 'w-full h-full object-cover pointer-events-none';
      el.appendChild(img);
 
      el.addEventListener('click', () => {
        if (i === activeIndex) {
          openLightbox(data.src, data.caption);
        } else {
          goToIndex(i);
          restartAutoplay();
        }
      });
 
      stage.appendChild(el);
      return el;
    });
 
    // Build dots
    const dotEls = STAYS_SLIDES.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.className = 'stays-dot w-3 h-3 rounded-full transition-colors';
      dot.addEventListener('click', () => {
        goToIndex(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
 
    function shortestOffset(i, active, total) {
      let diff = i - active;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    }
 
    function render() {
      const total = slideEls.length;
      slideEls.forEach((el, i) => {
        const offset = shortestOffset(i, activeIndex, total);
        const absOffset = Math.abs(offset);
 
        if (absOffset > MAX_VISIBLE_OFFSET) {
          el.style.opacity = '0';
          el.style.zIndex = '0';
          el.style.pointerEvents = 'none';
          el.style.transform = `translate(-50%, -50%) translateX(${offset > 0 ? 1 : -1} * 100%) scale(0.5)`;
          return;
        }
 
        const scale = 1 - absOffset * 0.16;
        const translateX = offset * (CARD_WIDTH * 0.62);
        const translateZ = -absOffset * 40;
        const opacity = 1 - absOffset * 0.22;
        const z = 10 - absOffset;
 
        el.style.opacity = String(Math.max(opacity, 0.15));
        el.style.zIndex = String(z);
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`;
      });
 
      dotEls.forEach((dot, i) => {
        dot.style.backgroundColor = i === activeIndex ? '#0d9488' : 'rgba(0,0,0,0.25)';
        dot.style.transform = i === activeIndex ? 'scale(1.3)' : 'scale(1)';
      });
 
      // === UPDATING THE TOP SHOWCASE ===
      updateShowcaseDisplay();
    }
 
    // Swaps the big media (video, falling back to image) + text block to
    // match the active card. Coverflow cards below always stay as images.
    function updateShowcaseDisplay() {
      if (!topTitle) return;
 
      const currentData = STAYS_SLIDES[activeIndex];
      const hasVideo = Boolean(currentData.video);
 
      // Fade out whichever media is currently showing
      if (topVideo) topVideo.style.opacity = '0';
      if (topImg) topImg.style.opacity = '0';
 
      setTimeout(() => {
        // Swap text
        topTitle.textContent = currentData.title;
        topSubtitle.textContent = currentData.subtitle;
        topDesc.textContent = currentData.desc;
 
        // Swap room type pills
        if (topRooms) {
          topRooms.innerHTML = '';
          currentData.rooms.forEach((room) => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1.5 rounded-lg bg-panel border border-ash text-bone shadow-sm hover:border-ember/60 transition-colors';
            span.textContent = room;
            topRooms.appendChild(span);
          });
        }
 
        if (hasVideo && topVideo) {
          // Show the video for this hotel and start it playing
          topVideo.src = currentData.video;
          topVideo.poster = currentData.src;
          topVideo.classList.remove('hidden');
          if (topImg) topImg.classList.add('hidden');
 
          topVideo.play().catch(() => {
            // Autoplay may be blocked; poster frame still shows.
          });
          topVideo.style.opacity = '1';
        } else {
          // No video yet for this hotel — fall back to its photo
          if (topVideo) {
            topVideo.pause();
            topVideo.classList.add('hidden');
          }
          if (topImg) {
            topImg.src = currentData.src;
            topImg.alt = currentData.title;
            topImg.classList.remove('hidden');
            topImg.style.opacity = '1';
          }
        }
      }, 150); // small delay for a smooth crossfade
    }
 
    function goToIndex(i) {
      const total = slideEls.length;
      activeIndex = ((i % total) + total) % total;
      render();
    }
 
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goToIndex(activeIndex + 1), AUTOPLAY_DELAY);
    }
 
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
 
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
 
    stage.addEventListener('mouseenter', stopAutoplay);
    stage.addEventListener('mouseleave', startAutoplay);
    stage.addEventListener('touchstart', stopAutoplay, { passive: true });
    stage.addEventListener('touchend', () => setTimeout(startAutoplay, AUTOPLAY_DELAY));
 
    render();
    startAutoplay();
 
    // ---- Lightbox wiring (shared modal, same as dioramas) ----
    const modal = document.getElementById('jvy-lightbox');
    const modalImg = document.getElementById('jvy-lightbox-img');
    const modalCaption = document.getElementById('jvy-lightbox-caption');
    const closeBtn = document.getElementById('jvy-lightbox-close');
 
    function openLightbox(src, cap) {
      if (!modal || !modalImg) return;
      modalImg.src = src;
      modalImg.alt = cap || '';
      modalCaption.textContent = cap || '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
 
    function closeLightbox() {
      if (!modal) return;
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      modalImg.src = '';
    }
 
    closeBtn && closeBtn.addEventListener('click', closeLightbox);
    modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
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



