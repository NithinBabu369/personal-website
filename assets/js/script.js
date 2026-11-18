import {
  validateContactForm,
  buildMailtoHref,
  getActivePageSlug,
  getBlueprintSystem,
  getBlueprintStage,
  MATRIX_DENSITY_GLYPHS,
  enhanceMatrixLuminance,
  selectMatrixGlyph,
  wrapCarouselIndex,
  computeCarouselCardState,
  getSkillContext,
  getConnectedSkills,
  stepMatrixDecodeFrame,
  computeEdgeVignette,
  computeMatrixLoopProgress,
  computeMatrixFormationState,
  computeAboutBlockCell,
  computeAboutCubeTransform,
} from './portfolio-logic.js';

document.documentElement.classList.add('js-enabled');

const RECIPIENT_EMAIL = 'nithinbabuofficialid@gmail.com';

/* ==========================================================================
   Theme Toggle
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const isLight = theme === 'light';
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isLight ? 'none' : 'block';
      moonIcon.style.display = isLight ? 'block' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark theme' : 'Switch to light theme'
      );
      toggleBtn.setAttribute('aria-pressed', String(isLight));
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  };

  let savedTheme = 'dark';
  try {
    const stored = localStorage.getItem('portfolio_theme');
    if (stored === 'light' || stored === 'dark') {
      savedTheme = stored;
    }
  } catch {
    savedTheme = 'dark';
  }

  applyTheme('dark');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('portfolio_theme', next);
      } catch {
        // Ignore storage restriction
      }
    });
  }
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  const setDrawerState = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!drawer.classList.contains('is-open')) {
          drawer.hidden = true;
        }
      }, 200);
    }
  };

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    setDrawerState(!isExpanded);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setDrawerState(false);
      menuBtn.focus();
    }
  });
}

/* ==========================================================================
   Active Page Indicator across Multi-Page Routes
   ========================================================================== */
function initActivePageHighlight() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  if (!navLinks.length) return;

  const activeSlug = getActivePageSlug(window.location.pathname);

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('data-page') || getActivePageSlug(link.getAttribute('href') || '');
    if (linkPage === activeSlug) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
}

/* ==========================================================================
   Interactive Neural-Net Canvas (Matches Original Grab-Mode Configuration)
   ========================================================================== */
function initConstellationCanvas() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas || !canvas.getContext) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let ripples = [];
  let pulses = [];
  let rafId = null;
  let lastFrameTime = performance.now();
  let lastAutoPulse = 0;

  const pointer = {
    x: -9999,
    y: -9999,
    active: false,
    grabDistance: 165,
  };

  const LINK_DISTANCE = 180;

  const createParticle = (index) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.14 + Math.random() * 0.18;
    const baseSize = 2.0 + Math.random() * 1.0;
    const baseOpacity = 0.28 + Math.random() * 0.28;
    // Restrained 2-tone mix: crisp neutral nodes + subtle mint accent nodes
    const tintRoll = index % 4 === 0 ? 1 : 0;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: baseSize,
      sizePhase: Math.random() * Math.PI * 2,
      opacityPhase: Math.random() * Math.PI * 2,
      baseOpacity,
      tint: tintRoll,
    };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(104, Math.max(44, Math.round((width * height) / 17000)));
    particles = Array.from({ length: count }, (_, idx) => createParticle(idx));
  };

  const handlePointerMove = (clientX, clientY) => {
    pointer.x = clientX;
    pointer.y = clientY;
    pointer.active = true;
    if (prefersReduced) {
      drawFrame();
    }
  };

  const onMouseMove = (event) => {
    handlePointerMove(event.clientX, event.clientY);
  };

  const onTouchMove = (event) => {
    if (event.touches && event.touches.length > 0) {
      handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
    }
  };

  const onPointerLeave = () => {
    pointer.active = false;
    pointer.x = -9999;
    pointer.y = -9999;
    if (prefersReduced) {
      drawFrame();
    }
  };

  const drawFrame = (now = performance.now()) => {
    const dtMs = Math.max(4, now - lastFrameTime);
    lastFrameTime = now;
    const dtScale = Math.min(dtMs / 16.6667, 2.5);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const baseNodeRgb = isLight ? '15, 23, 42' : '255, 255, 255';
    const linkRgb = isLight ? '26, 115, 232' : '0, 191, 255';
    const mintRgb = isLight ? '15, 118, 110' : '184, 242, 230';

    ctx.clearRect(0, 0, width, height);

    // Subtle crisp click ripple wave without disturbing particle velocities
    for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx -= 1) {
      const rp = ripples[rIdx];
      rp.radius += 2.2 * dtScale;
      rp.alpha *= Math.pow(0.94, dtScale);
      if (rp.alpha <= 0.015 || rp.radius > 190) {
        ripples.splice(rIdx, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${linkRgb}, ${rp.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      if (!prefersReduced) {
        p.x += p.vx * dtScale;
        p.y += p.vy * dtScale;

        // Wrap smoothly around screen edges (out_mode: "out")
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        p.opacityPhase += 0.006 * dtScale;
        p.sizePhase += 0.008 * dtScale;
      }

      const opacity = prefersReduced
        ? p.baseOpacity
        : 0.16 + ((Math.sin(p.opacityPhase) + 1) * 0.5) * 0.42;
      const radius = prefersReduced
        ? p.r
        : 1.3 + ((Math.sin(p.sizePhase) + 1) * 0.5) * 1.5;

      const dotRgb = p.tint === 1 ? mintRgb : baseNodeRgb;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotRgb}, ${opacity.toFixed(3)})`;
      ctx.fill();

      // Mouse hover "grab" mode matching original #00BFFF / #1a73e8 synapse behavior
      if (pointer.active) {
        const dxMouse = pointer.x - p.x;
        const dyMouse = pointer.y - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < pointer.grabDistance) {
          const grabAlpha = (1 - distMouse / pointer.grabDistance) * 0.52;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(${linkRgb}, ${grabAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.15;
          ctx.stroke();
        }
      }

      // Inter-particle neural links + spontaneous synaptic pulse firing
      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE) {
          const linkAlpha = (1 - dist / LINK_DISTANCE) * 0.24;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${linkRgb}, ${linkAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Periodic ambient neural firing + smooth synaptic signal propagation
    if (!prefersReduced) {
      if (now - lastAutoPulse > 1400 && pulses.length < 10 && particles.length > 2) {
        lastAutoPulse = now;
        const originIdx = Math.floor(Math.random() * particles.length);
        const origin = particles[originIdx];
        for (let k = 0; k < particles.length; k += 1) {
          if (k === originIdx) continue;
          const target = particles[k];
          if (Math.hypot(origin.x - target.x, origin.y - target.y) < LINK_DISTANCE * 0.92) {
            pulses.push({ from: origin, to: target, t: 0, speed: 0.018 + Math.random() * 0.01 });
            break;
          }
        }
      }

      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx -= 1) {
        const pulse = pulses[pIdx];
        pulse.t += pulse.speed * dtScale;
        if (pulse.t >= 1) {
          pulses.splice(pIdx, 1);
          continue;
        }
        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.t;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.t;
        const pulseAlpha = Math.sin(pulse.t * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${mintRgb}, ${pulseAlpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    if (!prefersReduced) {
      rafId = requestAnimationFrame(drawFrame);
    }
  };

  resize();
  drawFrame();

  const onCanvasPing = (event) => {
    if (prefersReduced) return;
    if (event.target && event.target.closest('a, button, input, textarea, summary, .chatbot-panel')) {
      return;
    }
    const cx = event.clientX;
    const cy = event.clientY;
    ripples.push({ x: cx, y: cy, radius: 10, alpha: 0.34 });

    // Fire synaptic cascade along nearby connected neuron pairs
    for (let i = 0; i < particles.length && pulses.length < 22; i += 1) {
      const a = particles[i];
      if (Math.hypot(a.x - cx, a.y - cy) > 190) continue;
      for (let j = i + 1; j < particles.length && pulses.length < 22; j += 1) {
        const b = particles[j];
        if (Math.hypot(a.x - b.x, a.y - b.y) < LINK_DISTANCE) {
          pulses.push({ from: a, to: b, t: 0, speed: 0.022 });
          break;
        }
      }
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('pointermove', onMouseMove, { passive: true });
  window.addEventListener('click', onCanvasPing, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('mouseleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);

  window.addEventListener('resize', () => {
    resize();
    if (prefersReduced) drawFrame();
  });

  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
}

/* ==========================================================================
   Typing Role Animation (Accessible & Reduced-Motion Aware)
   ========================================================================== */
function initTypingAnimation() {
  const target = document.getElementById('typing-role');
  if (!target) return;

  const roles = [
    'Generative AI Engineer | LLM & Agentic AI Developer',
    'LLM & RAG Application Developer',
    'Agentic AI & Python Automation Engineer',
    'Python & Django Backend Developer',
  ];

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    target.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  const tick = () => {
    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 28);
    } else {
      charIndex += 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        isDeleting = true;
        setTimeout(tick, 2600);
        return;
      }
      setTimeout(tick, 52);
    }
  };

  setTimeout(tick, 2800);
}

/* ==========================================================================
   3D Perspective Project Carousel (Zero Filter Buttons)
   ========================================================================== */
function initProjectCarousel3D() {
  const roots = document.querySelectorAll('[data-carousel-root]');
  if (!roots.length) return;

  roots.forEach((root) => {
    const track = root.querySelector('.projects-carousel-track');
    const cards = Array.from(root.querySelectorAll('.project-card'));
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dots = Array.from(root.querySelectorAll('[data-carousel-dot]'));
    const readoutEl = root.querySelector('[data-carousel-readout]');

    if (!cards.length) return;

    let activeIndex = 0;
    const AUTO_INTERVAL_MS = 4000;
    let autoTimer = null;
    let isPaused = false;
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stopAuto = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    const startAuto = () => {
      stopAuto();
      if (prefersReduced || isPaused) return;
      autoTimer = setInterval(() => {
        goTo(activeIndex + 1);
      }, AUTO_INTERVAL_MS);
    };

    const resetAuto = () => {
      stopAuto();
      startAuto();
    };

    const getCardTitle = (card) => {
      const h = card.querySelector('.project-title');
      return h ? h.textContent.trim() : 'Project';
    };

    const render = () => {
      const isCompact = window.innerWidth <= 760;
      const total = cards.length;

      cards.forEach((card, idx) => {
        const state = computeCarouselCardState(idx, activeIndex, total, isCompact);
        card.style.transform = `translate3d(${state.txPercent}%, 0, ${state.tzPx}px) rotateY(${state.rotateYDeg}deg) scale(${state.scale})`;
        card.style.opacity = String(state.opacity);
        card.style.zIndex = String(state.zIndex);
        card.style.pointerEvents = state.isVisible ? 'auto' : 'none';
        card.classList.toggle('is-carousel-active', state.isActive);
        card.setAttribute('aria-hidden', String(!state.isVisible));
      });

      dots.forEach((dot, idx) => {
        const isCurrent = idx === activeIndex;
        dot.classList.toggle('is-active', isCurrent);
        dot.setAttribute('aria-selected', String(isCurrent));
      });

      if (readoutEl) {
        const numStr = String(activeIndex + 1).padStart(2, '0');
        const totalStr = String(total).padStart(2, '0');
        readoutEl.textContent = `${numStr} / ${totalStr} · ${getCardTitle(cards[activeIndex])}`;
      }
    };

    const goTo = (nextIdx, isUserAction = false) => {
      activeIndex = wrapCarouselIndex(nextIdx, cards.length);
      render();
      if (isUserAction) {
        resetAuto();
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goTo(activeIndex - 1, true));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goTo(activeIndex + 1, true));
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goTo(idx, true));
    });

    cards.forEach((card, idx) => {
      card.addEventListener('click', (event) => {
        if (idx === activeIndex) return;
        if (event.target.closest('a, button')) return;
        goTo(idx, true);
      });
    });

    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(activeIndex - 1, true);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(activeIndex + 1, true);
      }
    });

    root.addEventListener('pointerenter', () => {
      isPaused = true;
      stopAuto();
    });

    root.addEventListener('pointerleave', () => {
      isPaused = false;
      startAuto();
    });

    root.addEventListener('focusin', () => {
      isPaused = true;
      stopAuto();
    });

    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) {
        isPaused = false;
        startAuto();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAuto();
      } else if (!isPaused) {
        startAuto();
      }
    });

    if (track) {
      let dragStartX = null;
      let isDragging = false;

      track.addEventListener('pointerdown', (event) => {
        if (event.target.closest('a, button')) return;
        dragStartX = event.clientX;
        isDragging = true;
        stopAuto();
        track.classList.add('is-dragging');
      });

      const finishDrag = (event) => {
        if (!isDragging || dragStartX === null) return;
        const deltaX = event.clientX - dragStartX;
        isDragging = false;
        dragStartX = null;
        track.classList.remove('is-dragging');
        if (Math.abs(deltaX) > 45) {
          goTo(deltaX < 0 ? activeIndex + 1 : activeIndex - 1, true);
        } else {
          startAuto();
        }
      };

      track.addEventListener('pointerup', finishDrag);
      track.addEventListener('pointercancel', finishDrag);
      track.addEventListener('pointerleave', (event) => {
        if (isDragging) finishDrag(event);
      });
    }

    window.addEventListener('resize', render, { passive: true });
    render();
    startAuto();
  });
}

/* ==========================================================================
   Floating Skills Constellation (Depth Parallax & Interactive Inspector)
   ========================================================================== */
function initFloatingSkills() {
  const roots = document.querySelectorAll('[data-floating-skills-root]');
  if (!roots.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer =
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  roots.forEach((root) => {
    const nodes = Array.from(root.querySelectorAll('[data-skill-node]'));
    const domainEl = root.querySelector('[data-skill-domain-label]');
    const nameEl = root.querySelector('[data-skill-name-label]');
    const usageEl = root.querySelector('[data-skill-usage-label]');
    const stage = root.querySelector('.skills-float-stage');

    if (!nodes.length) return;

    let synapseCanvas = stage ? stage.querySelector('.skills-synapse-canvas') : null;
    if (stage && !synapseCanvas) {
      synapseCanvas = document.createElement('canvas');
      synapseCanvas.className = 'skills-synapse-canvas';
      synapseCanvas.setAttribute('aria-hidden', 'true');
      stage.prepend(synapseCanvas);
    }

    let activeHoverSkill = null;

    const clearSynapses = () => {
      activeHoverSkill = null;
      nodes.forEach((node) => {
        node.classList.remove('is-hovered', 'is-connected');
      });
      if (synapseCanvas && synapseCanvas.getContext) {
        const ctx = synapseCanvas.getContext('2d');
        ctx.clearRect(0, 0, synapseCanvas.width, synapseCanvas.height);
      }
      if (domainEl) domainEl.textContent = 'Neural Skill Graph';
      if (nameEl) nameEl.textContent = '54 Verified Capabilities';
      if (usageEl) {
        usageEl.textContent =
          'Hover over any floating node to trace its connected skills and verified usage.';
      }
    };

    const drawSynapses = (focalSkill) => {
      if (!stage || !synapseCanvas || !synapseCanvas.getContext) return;
      if (!focalSkill) {
        const ctx = synapseCanvas.getContext('2d');
        ctx.clearRect(0, 0, synapseCanvas.width, synapseCanvas.height);
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width < 10 || stageRect.height < 10) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stageRect.width;
      const h = stageRect.height;
      if (synapseCanvas.width !== Math.floor(w * dpr) || synapseCanvas.height !== Math.floor(h * dpr)) {
        synapseCanvas.width = Math.floor(w * dpr);
        synapseCanvas.height = Math.floor(h * dpr);
      }

      const ctx = synapseCanvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const focalEl = nodes.find((n) => n.getAttribute('data-skill-node') === focalSkill);
      if (!focalEl) return;

      const neighbors = getConnectedSkills(focalSkill);
      const neighborSet = new Set(neighbors);
      const focalRect = focalEl.getBoundingClientRect();
      const fx = focalRect.left - stageRect.left + focalRect.width / 2;
      const fy = focalRect.top - stageRect.top + focalRect.height / 2;

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const strokeRgba = isLight ? 'rgba(14, 116, 144, 0.36)' : 'rgba(86, 207, 225, 0.42)';
      const nodeGlowRgba = isLight ? 'rgba(15, 118, 110, 0.6)' : 'rgba(184, 242, 230, 0.78)';

      nodes.forEach((node) => {
        const sName = node.getAttribute('data-skill-node') || '';
        const isFocal = sName === focalSkill;
        const isConn = neighborSet.has(sName);
        node.classList.toggle('is-hovered', isFocal);
        node.classList.toggle('is-connected', isConn);
        if (!isConn) return;

        const r = node.getBoundingClientRect();
        const tx = r.left - stageRect.left + r.width / 2;
        const ty = r.top - stageRect.top + r.height / 2;
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - Math.min(28, Math.abs(tx - fx) * 0.08 + 10);

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = strokeRgba;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tx, ty, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlowRgba;
        ctx.fill();
      });
    };

    const showHoverSkill = (skillName) => {
      activeHoverSkill = skillName;
      const ctx = getSkillContext(skillName);
      if (domainEl) domainEl.textContent = ctx.domain;
      if (nameEl) nameEl.textContent = ctx.name;
      if (usageEl) usageEl.textContent = ctx.usage;
      drawSynapses(skillName);
    };

    nodes.forEach((node) => {
      const skillName = node.getAttribute('data-skill-node') || node.textContent.trim();
      node.addEventListener('mouseenter', () => showHoverSkill(skillName));
      node.addEventListener('mouseleave', () => {
        if (activeHoverSkill === skillName) {
          clearSynapses();
        }
      });
      node.addEventListener('focus', () => showHoverSkill(skillName));
      node.addEventListener('blur', () => {
        if (activeHoverSkill === skillName) {
          clearSynapses();
        }
      });
    });

    if (stage) {
      stage.addEventListener('mouseleave', clearSynapses);

      if (!prefersReduced && finePointer) {
        let rafPending = false;
        let nextPx = 0;
        let nextPy = 0;

        stage.addEventListener('pointermove', (event) => {
          const rect = stage.getBoundingClientRect();
          const normX = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
          const normY = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
          nextPx = normX * 14;
          nextPy = normY * 10;

          if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
              root.style.setProperty('--px', `${nextPx.toFixed(1)}px`);
              root.style.setProperty('--py', `${nextPy.toFixed(1)}px`);
              if (activeHoverSkill) {
                drawSynapses(activeHoverSkill);
              }
              rafPending = false;
            });
          }
        });

        stage.addEventListener('pointerleave', () => {
          root.style.setProperty('--px', '0px');
          root.style.setProperty('--py', '0px');
          clearSynapses();
        });
      }
    }

    window.addEventListener('resize', () => {
      if (activeHoverSkill) drawSynapses(activeHoverSkill);
    }, { passive: true });

    clearSynapses();
  });
}

/* ==========================================================================
   Experience Role Switcher (experience.html)
   ========================================================================== */
function initSubpageFilters() {
  const roleBtns = document.querySelectorAll('[data-role-filter]');
  const roleItems = document.querySelectorAll('[data-role-id]');

  if (roleBtns.length && roleItems.length) {
    roleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetRole = btn.getAttribute('data-role-filter') || 'all';
        roleBtns.forEach((b) => {
          const isAct = b === btn;
          b.classList.toggle('is-active', isAct);
          b.setAttribute('aria-pressed', String(isAct));
        });
        roleItems.forEach((item) => {
          const match = targetRole === 'all' || item.getAttribute('data-role-id') === targetRole;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  }
}

/* ==========================================================================
   Scroll Reveal
   ========================================================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Contact Form Validation, Subject Presets & Mailto Flow
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const presetBtns = document.querySelectorAll('[data-subject-preset]');

  if (presetBtns.length) {
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const subjectInput = document.getElementById('contact-subject');
        const value = btn.getAttribute('data-subject-preset') || '';
        presetBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        if (subjectInput && value) {
          subjectInput.value = value;
          subjectInput.focus();
        }
      });
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(RECIPIENT_EMAIL);
        copyEmailBtn.textContent = 'Copied';
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy email';
        }, 2000);
      } catch {
        copyEmailBtn.textContent = RECIPIENT_EMAIL;
      }
    });
  }

  if (!form || !feedback) return;

  const fieldNames = ['name', 'email', 'subject', 'message'];

  const clearFieldErrors = () => {
    fieldNames.forEach((name) => {
      const input = form.elements.namedItem(name);
      const errEl = document.getElementById(`error-${name}`);
      if (input && typeof input.setAttribute === 'function') {
        input.removeAttribute('aria-invalid');
      }
      if (errEl) errEl.textContent = '';
    });
    feedback.hidden = true;
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFieldErrors();

    const values = {
      name: form.elements.namedItem('name')?.value || '',
      email: form.elements.namedItem('email')?.value || '',
      subject: form.elements.namedItem('subject')?.value || '',
      message: form.elements.namedItem('message')?.value || '',
    };

    const result = validateContactForm(values);

    if (!result.valid) {
      let firstInvalid = null;
      fieldNames.forEach((name) => {
        if (result.errors[name]) {
          const input = form.elements.namedItem(name);
          const errEl = document.getElementById(`error-${name}`);
          if (input && typeof input.setAttribute === 'function') {
            input.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = input;
          }
          if (errEl) errEl.textContent = result.errors[name];
        }
      });
      feedback.hidden = false;
      feedback.className = 'form-feedback is-error';
      feedback.textContent = 'Please fix the highlighted fields before continuing.';
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const mailtoHref = buildMailtoHref(RECIPIENT_EMAIL, result.sanitized);

    feedback.hidden = false;
    feedback.className = 'form-feedback is-success';
    feedback.textContent =
      `Opening your email client to send "${result.sanitized.subject}" to ${RECIPIENT_EMAIL}. If it does not open automatically, please email directly using the address on the left.`;

    window.location.href = mailtoHref;
  });
}

/* ==========================================================================
   Footer Year & Back to Top
   ========================================================================== */
function initFooterUtilities() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   Spectral Scroll Progress Indicator (All Pages)
   ========================================================================== */
function initScrollProgress() {
  const header = document.querySelector('.site-header');
  if (!header || document.getElementById('scroll-progress')) return;

  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.className = 'scroll-progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  header.insertAdjacentElement('afterend', bar);

  const updateProgress = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
}

/* ==========================================================================
   Interactive Pointer Glass Spotlight on Cards
   ========================================================================== */
function initGlassSpotlight() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer =
    window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const cards = document.querySelectorAll(
    '.project-card, .skill-card, .spotlight-card, .metric-cell, .credential-card, .explore-card, .about-card'
  );
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add('spotlight-glass');
    if (prefersReduced || !finePointer) return;

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      card.style.setProperty('--mx', `${x.toFixed(1)}%`);
      card.style.setProperty('--my', `${y.toFixed(1)}%`);
    });
  });
}

/* ==========================================================================
   Creative AI Architecture Blueprint Explorer (projects.html)
   ========================================================================== */
function initArchitectureBlueprint() {
  const container = document.getElementById('architecture-blueprint');
  if (!container) return;

  const systemTabs = container.querySelectorAll('[data-blueprint-system]');
  const contextLabelEl = document.getElementById('blueprint-context');
  const summaryEl = document.getElementById('blueprint-summary');
  const stageBtns = container.querySelectorAll('[data-blueprint-stage]');
  const detailTitleEl = document.getElementById('blueprint-detail-title');
  const detailDescEl = document.getElementById('blueprint-detail-desc');
  const detailStackEl = document.getElementById('blueprint-detail-stack');
  const detailVerifyEl = document.getElementById('blueprint-detail-verify');

  let activeSystemId = 'rag-assistant';
  let activeStageStep = '01';

  const render = () => {
    const sys = getBlueprintSystem(activeSystemId);
    const { stage } = getBlueprintStage(sys.id, activeStageStep);

    systemTabs.forEach((tab) => {
      const active = tab.getAttribute('data-blueprint-system') === sys.id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', String(active));
    });

    if (contextLabelEl) contextLabelEl.textContent = sys.context;
    if (summaryEl) summaryEl.textContent = sys.summary;

    stageBtns.forEach((btn, idx) => {
      const st = sys.stages[idx];
      if (!st) return;
      const isSelected = st.step === stage.step;
      btn.setAttribute('data-blueprint-stage', st.step);
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));

      const numEl = btn.querySelector('.stage-step-num');
      const nameEl = btn.querySelector('.stage-step-name');
      const roleEl = btn.querySelector('.stage-step-role');
      if (numEl) numEl.textContent = `Stage ${st.step}`;
      if (nameEl) nameEl.textContent = st.name;
      if (roleEl) roleEl.textContent = st.role;
    });

    if (detailTitleEl) {
      detailTitleEl.textContent = `Stage ${stage.step}: ${stage.name} — ${stage.role}`;
    }
    if (detailDescEl) {
      detailDescEl.textContent = stage.detail;
    }
    if (detailVerifyEl) {
      detailVerifyEl.textContent = `Verification Check: ${stage.verification}`;
    }
    if (detailStackEl) {
      detailStackEl.replaceChildren();
      stage.stack.forEach((tech) => {
        const chip = document.createElement('span');
        chip.className = 'project-tag';
        chip.textContent = tech;
        detailStackEl.appendChild(chip);
      });
    }
  };

  systemTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeSystemId = tab.getAttribute('data-blueprint-system') || 'rag-assistant';
      activeStageStep = '01';
      render();
    });
  });

  stageBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeStageStep = btn.getAttribute('data-blueprint-stage') || '01';
      render();
    });
  });

  render();
}

/* ==========================================================================
   Whole-Image Matrix Portrait Loop (Borderless Visible Portrait + Matrix Code)
   ========================================================================== */
function initHeroMatrixRain() {
  const canvas = document.getElementById('hero-matrix-canvas');
  const wrapper = document.querySelector('.hero-portrait-wrap');
  const sourceImg = wrapper ? wrapper.querySelector('.hero-portrait') : null;
  if (!canvas || !canvas.getContext || !wrapper) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  const CELL_W = 5.5;
  const CELL_H = 7;
  const LOOP_MS = 9000;
  const startPerf = performance.now();

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let dpr = 1;
  let lumGrid = new Float32Array(0);
  let edgeGrid = new Float32Array(0);
  let glyphEdgeGrid = new Float32Array(0);
  let thresholdGrid = new Float32Array(0);
  let baseChars = [];
  let streams = [];
  let featheredPhotoCanvas = null;
  let maskCanvas = null;
  let maskCtx = null;
  let maskImgData = null;
  let scratchCanvas = null;
  let scratchCtx = null;
  let rafId = null;
  let isVisible = true;
  let lastTime = performance.now();
  let frameTick = 0;
  const hoverPointer = { active: false, x: -999, y: -999 };

  const randomDensityGlyph = () =>
    MATRIX_DENSITY_GLYPHS[
    Math.min(
      MATRIX_DENSITY_GLYPHS.length - 1,
      Math.floor(4 + Math.random() * (MATRIX_DENSITY_GLYPHS.length - 4))
    )
    ];

  const computeCoverCrop = (iw, ih, bw, bh) => {
    const imgAspect = iw / ih;
    const boxAspect = bw / Math.max(bh, 1);
    let sx = 0;
    let sy = 0;
    let sw = iw;
    let sh = ih;
    if (imgAspect > boxAspect) {
      sw = ih * boxAspect;
      sx = (iw - sw) * 0.36;
    } else {
      sh = iw / boxAspect;
      sy = (ih - sh) * 0.24;
    }
    return { sx, sy, sw, sh };
  };

  const buildFeatheredPhotoLayer = (crop) => {
    if (!sourceImg || !sourceImg.complete || sourceImg.naturalWidth === 0) {
      featheredPhotoCanvas = null;
      return;
    }
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const octx = off.getContext('2d');
    if (!octx) return;

    octx.drawImage(
      sourceImg,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      0,
      0,
      width,
      height
    );

    try {
      const imgData = octx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const denomX = Math.max(1, width - 1);
      const denomY = Math.max(1, height - 1);
      for (let y = 0; y < height; y += 1) {
        const v = y / denomY;
        for (let x = 0; x < width; x += 1) {
          const u = x / denomX;
          const p = (y * width + x) * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];

          if (isLight) {
            // Positive, natural color fidelity for light mode with zero inversion/negative look
            data[p] = Math.min(255, Math.round(r * 1.02));
            data[p + 1] = Math.min(255, Math.round(g * 1.02));
            data[p + 2] = Math.min(255, Math.round(b * 1.02));
          } else {
            // Atmospheric dark mode grading matching portfolio mint/cyan accents
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const boosted = Math.min(255, Math.max(0, (lum - 0.08) * 1.16 * 255));
            data[p] = Math.round(r * 0.68 + boosted * 0.22);
            data[p + 1] = Math.round(g * 0.72 + boosted * 0.30);
            data[p + 2] = Math.round(b * 0.74 + boosted * 0.28);
          }

          // Smooth elliptical + edge alpha feather down to 0 so portrait merges seamlessly with page background
          const edgeAlpha = computeEdgeVignette(u, v);
          data[p + 3] = Math.round(255 * edgeAlpha);
        }
      }
      octx.putImageData(imgData, 0, 0);
      featheredPhotoCanvas = off;
    } catch {
      featheredPhotoCanvas = null;
    }
  };

  const sampleImageLuminance = () => {
    const count = cols * rows;
    lumGrid = new Float32Array(count);
    edgeGrid = new Float32Array(count);
    glyphEdgeGrid = new Float32Array(count);
    thresholdGrid = new Float32Array(count);
    baseChars = new Array(count);

    const hasImage = Boolean(sourceImg && sourceImg.complete && sourceImg.naturalWidth > 0);
    let imgPixels = null;

    if (hasImage) {
      const crop = computeCoverCrop(
        sourceImg.naturalWidth,
        sourceImg.naturalHeight,
        width,
        height
      );
      buildFeatheredPhotoLayer(crop);

      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (octx) {
        octx.drawImage(sourceImg, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, cols, rows);
        try {
          imgPixels = octx.getImageData(0, 0, cols, rows).data;
        } catch {
          imgPixels = null;
        }
      }
    }

    const denomCols = Math.max(1, cols - 1);
    const denomRows = Math.max(1, rows - 1);

    for (let r = 0; r < rows; r += 1) {
      const v = rows > 1 ? r / denomRows : 0.5;
      for (let c = 0; c < cols; c += 1) {
        const u = cols > 1 ? c / denomCols : 0.5;
        const idx = r * cols + c;
        let lum;
        if (imgPixels) {
          const p = idx * 4;
          const raw = (0.299 * imgPixels[p] + 0.587 * imgPixels[p + 1] + 0.114 * imgPixels[p + 2]) / 255;
          lum = enhanceMatrixLuminance(raw);
        } else {
          const fallbackWave = 0.28 + 0.36 * Math.sin(c * 0.14 + r * 0.08);
          lum = enhanceMatrixLuminance(fallbackWave);
        }
        lumGrid[idx] = lum;
        const edge = computeEdgeVignette(u, v);
        edgeGrid[idx] = edge;
        // Matrix glyphs extend slightly softer beyond the photo fade so portrait blends into background
        glyphEdgeGrid[idx] = Math.pow(edge, 0.55);

        const hashRaw = Math.sin(u * 127.1 + v * 311.7) * 43758.5453;
        const cellHash = hashRaw - Math.floor(hashRaw);
        const colRaw = Math.sin(u * 73.9) * 1931.7;
        const colHash = colRaw - Math.floor(colRaw);
        thresholdGrid[idx] = Math.max(
          0.04,
          Math.min(0.94, 0.50 * cellHash + 0.26 * colHash + 0.24 * (1 - lum))
        );

        const jitter = ((c * 37 + r * 17) % 19) / 19;
        baseChars[idx] = selectMatrixGlyph(lum, jitter, MATRIX_DENSITY_GLYPHS);
      }
    }
  };

  const buildStreams = () => {
    streams = Array.from({ length: cols }, (_, c) => ({
      y: Math.random() * (rows + 22) - 10,
      speed: 0.19 + Math.random() * 0.24,
      trail: 12 + (c % 10),
      y2: (Math.random() * (rows + 20) + rows * 0.5) % (rows + 18),
      speed2: 0.14 + Math.random() * 0.20,
      trail2: 9 + ((c * 3) % 8),
    }));
  };

  const resize = () => {
    const rect = wrapper.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(260, Math.round(rect.width));
    height = Math.max(200, Math.round(rect.height));
    cols = Math.max(44, Math.ceil(width / CELL_W));
    rows = Math.max(30, Math.ceil(height / CELL_H));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!maskCanvas) maskCanvas = document.createElement('canvas');
    maskCanvas.width = cols;
    maskCanvas.height = rows;
    maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskImgData = maskCtx.createImageData(cols, rows);
      for (let i = 0; i < cols * rows; i += 1) {
        const p = i * 4;
        maskImgData.data[p] = 255;
        maskImgData.data[p + 1] = 255;
        maskImgData.data[p + 2] = 255;
        maskImgData.data[p + 3] = 255;
      }
    }

    if (!scratchCanvas) scratchCanvas = document.createElement('canvas');
    scratchCanvas.width = width;
    scratchCanvas.height = height;
    scratchCtx = scratchCanvas.getContext('2d');

    sampleImageLuminance();
    buildStreams();
  };

  const drawFormedPortraitLayer = (isLight, globalForm) => {
    if (!featheredPhotoCanvas || globalForm <= 0.004) return;
    const baseAlpha = isLight ? 0.86 : 0.92;

    if (globalForm >= 0.996 || !maskCtx || !maskImgData || !scratchCtx) {
      ctx.save();
      ctx.globalAlpha = baseAlpha * globalForm;
      ctx.drawImage(featheredPhotoCanvas, 0, 0, width, height);
      ctx.restore();
      return;
    }

    maskCtx.putImageData(maskImgData, 0, 0);
    scratchCtx.clearRect(0, 0, width, height);
    scratchCtx.globalCompositeOperation = 'source-over';
    scratchCtx.imageSmoothingEnabled = true;
    scratchCtx.drawImage(maskCanvas, 0, 0, width, height);
    scratchCtx.globalCompositeOperation = 'source-in';
    scratchCtx.drawImage(featheredPhotoCanvas, 0, 0, width, height);
    scratchCtx.globalCompositeOperation = 'source-over';

    ctx.save();
    ctx.globalAlpha = baseAlpha;
    ctx.drawImage(scratchCanvas, 0, 0, width, height);
    ctx.restore();
  };

  const renderFrame = (now = performance.now()) => {
    if (!isVisible && !prefersReduced) {
      lastTime = now;
      rafId = null;
      return;
    }

    const dtMs = Math.max(4, now - lastTime);
    lastTime = now;
    const dtScale = Math.min(dtMs / 16.6667, 2.5);
    frameTick += dtScale;

    if (!prefersReduced) {
      for (let c = 0; c < cols; c += 1) {
        const s = streams[c];
        s.y += s.speed * dtScale;
        if (s.y - s.trail > rows) {
          s.y = -2 - Math.random() * 10;
        }
        s.y2 += s.speed2 * dtScale;
        if (s.y2 - s.trail2 > rows) {
          s.y2 = -4 - Math.random() * 12;
        }
      }
    }

    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    // Start at phase 0.28 so initial render actively finishes forming into crisp visibility
    const loopPhase = prefersReduced
      ? 0.55
      : (((now - startPerf) / LOOP_MS + 0.28) % 1 + 1) % 1;
    const globalForm = computeMatrixLoopProgress(loopPhase);

    canvas.dataset.formProgress = globalForm.toFixed(2);
    if (globalForm <= 0.01) {
      canvas.dataset.loopState = 'matrix-rain';
    } else if (globalForm >= 0.99) {
      canvas.dataset.loopState = 'formed';
    } else if (loopPhase < 0.5) {
      canvas.dataset.loopState = 'forming';
    } else {
      canvas.dataset.loopState = 'dissolving';
    }

    const span = 0.24;
    const isTransitioning = globalForm > 0.004 && globalForm < 0.996;
    const maskData = maskImgData ? maskImgData.data : null;

    // Update organic per-cell mask before compositing portrait layer
    if (isTransitioning && maskData) {
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const idx = r * cols + c;
          const threshold = thresholdGrid[idx];
          const cellT = Math.max(
            0,
            Math.min(1, (globalForm * (1 + span) - threshold) / span)
          );
          const photoAlpha = cellT * cellT * (3 - 2 * cellT);
          maskData[idx * 4 + 3] = Math.round(photoAlpha * 255);
        }
      }
    }

    // 1. Feathered professional action portrait layer emerging organically from Matrix cells
    drawFormedPortraitLayer(isLight, globalForm);

    // 2. Dense falling & sculpting Matrix digital rain forming/dissolving the portrait
    ctx.font = '700 8px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textBaseline = 'top';

    const shouldMutate = Math.floor(frameTick) % 4 === 0;
    // Matrix glyph presence is strongest when forming/dissolving or in pure-Matrix phase,
    // and stays subtle & crisp over the portrait during full hold.
    const matrixPresence = 1 - globalForm * 0.42;

    for (let r = 0; r < rows; r += 1) {
      const py = r * CELL_H;
      for (let c = 0; c < cols; c += 1) {
        const px = c * CELL_W;
        const idx = r * cols + c;
        const glyphEdge = glyphEdgeGrid[idx];
        if (glyphEdge <= 0.025) continue;

        const lum = lumGrid[idx] || 0.08;
        const st = streams[c];

        let rainEnergy = 0;
        let isHead = false;

        if (st) {
          const d1 = st.y - r;
          if (d1 >= 0 && d1 < st.trail) {
            if (d1 < 1.2) isHead = true;
            rainEnergy = Math.max(rainEnergy, 1 - d1 / st.trail);
          }
          const d2 = st.y2 - r;
          if (d2 >= 0 && d2 < st.trail2) {
            if (d2 < 1.1) isHead = true;
            rainEnergy = Math.max(rainEnergy, (1 - d2 / st.trail2) * 0.78);
          }
        }

        let transitionPulse = 0;
        if (isTransitioning) {
          const threshold = thresholdGrid[idx];
          const cellT = Math.max(
            0,
            Math.min(1, (globalForm * (1 + span) - threshold) / span)
          );
          transitionPulse = 4 * cellT * (1 - cellT);
        }

        let hoverBoost = 0;
        if (hoverPointer.active) {
          const dist = Math.hypot(hoverPointer.x - px, hoverPointer.y - py);
          if (dist < 88) {
            hoverBoost = (1 - dist / 88) * 0.36;
          }
        }

        if (
          !prefersReduced &&
          shouldMutate &&
          (isHead || transitionPulse > 0.35 || (rainEnergy > 0.45 && Math.random() < 0.11))
        ) {
          baseChars[idx] = randomDensityGlyph();
        }

        const glyph = baseChars[idx];
        const sculptedLum = Math.pow(lum, 0.85);
        // Sculpt the portrait continuously with Matrix glyphs during rain/formation,
        // and let falling streams remain crisp & readable while portrait holds.
        const silhouetteSignal = sculptedLum * (0.58 * matrixPresence + transitionPulse * 0.56);
        const streamSignal = rainEnergy * (0.22 + sculptedLum * 0.58);
        const rawIntensity = Math.min(
          1,
          silhouetteSignal + streamSignal + transitionPulse * (0.24 + sculptedLum * 0.34) + hoverBoost
        );
        const alpha = rawIntensity * glyphEdge;

        if (alpha < 0.08) continue;

        if (isLight) {
          if (isHead || transitionPulse > 0.52) {
            ctx.fillStyle = `rgba(6, 78, 59, ${Math.min(0.94, alpha + 0.16).toFixed(2)})`;
          } else if (lum > 0.54 || hoverBoost > 0.18 || transitionPulse > 0.2) {
            ctx.fillStyle = `rgba(15, 118, 110, ${Math.min(0.86, alpha * 0.84).toFixed(2)})`;
          } else if (lum > 0.26 || rainEnergy > 0.32) {
            ctx.fillStyle = `rgba(14, 116, 144, ${Math.min(0.78, alpha * 0.78).toFixed(2)})`;
          } else {
            ctx.fillStyle = `rgba(30, 41, 59, ${(alpha * 0.46).toFixed(2)})`;
          }
        } else {
          if (isHead || transitionPulse > 0.52) {
            ctx.fillStyle = `rgba(244, 255, 252, ${Math.min(0.96, alpha + 0.16).toFixed(2)})`;
          } else if (lum > 0.54 || hoverBoost > 0.18 || transitionPulse > 0.2) {
            ctx.fillStyle = `rgba(184, 242, 230, ${Math.min(0.88, alpha * 0.85).toFixed(2)})`;
          } else if (lum > 0.26 || rainEnergy > 0.32) {
            ctx.fillStyle = `rgba(86, 207, 225, ${Math.min(0.80, alpha * 0.78).toFixed(2)})`;
          } else {
            ctx.fillStyle = `rgba(42, 136, 152, ${(alpha * 0.54).toFixed(2)})`;
          }
        }

        ctx.fillText(glyph, px, py);
      }
    }

    if (!prefersReduced && isVisible) {
      rafId = requestAnimationFrame(renderFrame);
    }
  };

  if (sourceImg && !sourceImg.complete) {
    sourceImg.addEventListener('load', () => {
      sampleImageLuminance();
      if (prefersReduced) renderFrame();
    });
  }

  resize();
  renderFrame();

  wrapper.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    hoverPointer.x = event.clientX - rect.left;
    hoverPointer.y = event.clientY - rect.top;
    hoverPointer.active = true;
  });

  wrapper.addEventListener('pointerleave', () => {
    hoverPointer.active = false;
  });

  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(renderFrame);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(wrapper);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (!prefersReduced && isVisible && !rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(renderFrame);
    }
  });

  window.addEventListener('resize', () => {
    resize();
    if (prefersReduced) renderFrame();
  });

  window.addEventListener('themechange', () => {
    sampleImageLuminance();
    if (prefersReduced) renderFrame();
  });
}

/* ==========================================================================
   About Portrait Interactive Split/Displace/Rotate 3D Cubes on Hover
   ========================================================================== */
function initAboutBlockHover() {
  const frames = document.querySelectorAll('.about-media-frame');
  if (!frames.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  frames.forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;

    let canvas = frame.querySelector('.about-block-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'about-block-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      img.insertAdjacentElement('afterend', canvas);
    }

    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;

    const CUBE_SIZE = 24;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let croppedCanvas = null;
    let pixelBuffer = null;
    let gridCells = [];
    let isHovered = false;
    let hoverProgress = 0;
    let rafId = null;
    let lastTime = performance.now();
    const pointer = { x: -999, y: -999 };
    const smoothPointer = { x: -999, y: -999 };

    const samplePortraitPixels = () => {
      const rect = frame.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(120, Math.round(rect.width));
      height = Math.max(120, Math.round(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!img.complete || img.naturalWidth === 0) return;

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      if (!octx) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const imgAspect = iw / ih;
      const boxAspect = width / Math.max(height, 1);

      let sx = 0;
      let sy = 0;
      let sw = iw;
      let sh = ih;
      if (imgAspect > boxAspect) {
        sw = ih * boxAspect;
        sx = (iw - sw) * 0.5;
      } else {
        sh = iw / boxAspect;
        sy = (ih - sh) * 0.5;
      }

      octx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      croppedCanvas = off;
      try {
        pixelBuffer = octx.getImageData(0, 0, width, height).data;
      } catch {
        pixelBuffer = null;
      }

      gridCells = [];
      for (let y = 0, r = 0; y < height; y += CUBE_SIZE, r += 1) {
        for (let x = 0, c = 0; x < width; x += CUBE_SIZE, c += 1) {
          const swCell = Math.min(CUBE_SIZE, width - x);
          const shCell = Math.min(CUBE_SIZE, height - y);
          const seed = (((c * 37 + r * 73) % 97) + 1) / 98;
          let sideDark = 'rgb(22, 34, 40)';
          let sideMid = 'rgb(36, 54, 62)';
          if (pixelBuffer) {
            const cx = Math.min(width - 1, Math.floor(x + swCell * 0.5));
            const cy = Math.min(height - 1, Math.floor(y + shCell * 0.5));
            const p = (cy * width + cx) * 4;
            const pr = pixelBuffer[p];
            const pg = pixelBuffer[p + 1];
            const pb = pixelBuffer[p + 2];
            sideDark = `rgb(${Math.round(pr * 0.42)}, ${Math.round(pg * 0.48)}, ${Math.round(pb * 0.52)})`;
            sideMid = `rgb(${Math.round(pr * 0.62)}, ${Math.round(pg * 0.68)}, ${Math.round(pb * 0.72)})`;
          }
          gridCells.push({
            x,
            y,
            sw: swCell,
            sh: shCell,
            cx: x + swCell * 0.5,
            cy: y + shCell * 0.5,
            seed,
            sideDark,
            sideMid,
          });
        }
      }
    };

    const drawCubes = () => {
      ctx.clearRect(0, 0, width, height);
      if (hoverProgress <= 0.01 || !croppedCanvas || !gridCells.length) return;

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const bevelStroke = isLight
        ? 'rgba(15, 118, 110, 0.35)'
        : 'rgba(184, 242, 230, 0.42)';

      for (let i = 0; i < gridCells.length; i += 1) {
        const cell = gridCells[i];
        const t = computeAboutCubeTransform(
          cell.cx - smoothPointer.x,
          cell.cy - smoothPointer.y,
          hoverProgress,
          cell.seed,
          CUBE_SIZE,
          175
        );

        const drawW = Math.max(6, cell.sw - t.gapPx);
        const drawH = Math.max(6, cell.sh - t.gapPx);
        const hw = drawW * 0.5;
        const hh = drawH * 0.5;
        const depthX = t.depthPx * 0.65;
        const depthY = t.depthPx * 0.78;

        ctx.save();
        ctx.translate(cell.cx + t.displaceX, cell.cy + t.displaceY);
        ctx.rotate(t.angleRad);
        if (t.scale !== 1) {
          ctx.scale(t.scale, t.scale);
        }

        // Soft ambient shadow beneath displaced cube
        if (t.depthPx > 1.2 && t.proximity > 0.08) {
          ctx.fillStyle = `rgba(0, 0, 0, ${(0.16 + t.proximity * 0.24).toFixed(2)})`;
          ctx.fillRect(
            -hw + depthX * 1.15,
            -hh + depthY * 1.15,
            drawW,
            drawH
          );
        }

        // Right extruded 3D cube face
        if (depthX > 0.5) {
          ctx.fillStyle = cell.sideMid;
          ctx.beginPath();
          ctx.moveTo(hw, -hh);
          ctx.lineTo(hw + depthX, -hh + depthY);
          ctx.lineTo(hw + depthX, hh + depthY);
          ctx.lineTo(hw, hh);
          ctx.closePath();
          ctx.fill();

          // Bottom extruded 3D cube face
          ctx.fillStyle = cell.sideDark;
          ctx.beginPath();
          ctx.moveTo(-hw, hh);
          ctx.lineTo(hw, hh);
          ctx.lineTo(hw + depthX, hh + depthY);
          ctx.lineTo(-hw + depthX, hh + depthY);
          ctx.closePath();
          ctx.fill();
        }

        // Front textured portrait slice
        ctx.drawImage(
          croppedCanvas,
          cell.x,
          cell.y,
          cell.sw,
          cell.sh,
          -hw,
          -hh,
          drawW,
          drawH
        );

        // Crisp bevel hairline on separated cubes
        ctx.strokeStyle = bevelStroke;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-hw, -hh, drawW, drawH);

        ctx.restore();
      }
    };

    const tick = (now = performance.now()) => {
      const dtMs = Math.max(4, now - lastTime);
      lastTime = now;
      const target = isHovered ? 1 : 0;

      if (prefersReduced) {
        hoverProgress = target;
        smoothPointer.x = pointer.x;
        smoothPointer.y = pointer.y;
      } else {
        const rate = Math.min(1, dtMs / 150);
        hoverProgress += (target - hoverProgress) * rate;
        if (Math.abs(target - hoverProgress) < 0.012) {
          hoverProgress = target;
        }
        if (smoothPointer.x < -500 && pointer.x > -500) {
          smoothPointer.x = pointer.x;
          smoothPointer.y = pointer.y;
        } else if (pointer.x > -500) {
          const pRate = Math.min(1, dtMs / 90);
          smoothPointer.x += (pointer.x - smoothPointer.x) * pRate;
          smoothPointer.y += (pointer.y - smoothPointer.y) * pRate;
        }
      }

      const active = hoverProgress > 0.015;
      frame.classList.toggle('is-block-active', active);
      frame.dataset.blockState = active ? 'hovered' : 'idle';
      frame.dataset.blockProgress = hoverProgress.toFixed(2);

      const dossier = frame.querySelector('.about-identity-dossier');
      if (dossier) {
        dossier.style.opacity = Math.min(1, hoverProgress * 1.35).toFixed(3);
      }
      if (img) {
        img.style.opacity = Math.max(0, 1 - hoverProgress * 2.8).toFixed(3);
      }
      const caption = frame.querySelector('.about-media-caption');
      if (caption) {
        caption.style.opacity = Math.max(0, 1 - hoverProgress * 2.8).toFixed(3);
      }

      drawCubes();

      if (!prefersReduced && (isHovered || hoverProgress > 0.015)) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        if (!isHovered) {
          smoothPointer.x = -999;
          smoothPointer.y = -999;
        }
      }
    };

    const startLoop = () => {
      if (prefersReduced) {
        tick(performance.now());
        return;
      }
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    if (!img.complete) {
      img.addEventListener('load', () => {
        samplePortraitPixels();
        if (isHovered) drawCubes();
      });
    }
    samplePortraitPixels();

    frame.addEventListener('pointerenter', (event) => {
      if (!croppedCanvas) samplePortraitPixels();
      const rect = frame.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      smoothPointer.x = pointer.x;
      smoothPointer.y = pointer.y;
      isHovered = true;
      startLoop();
    });

    frame.addEventListener('pointermove', (event) => {
      const rect = frame.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      if (!isHovered) {
        isHovered = true;
        startLoop();
      } else if (prefersReduced) {
        drawCubes();
      }
    });

    frame.addEventListener('pointerleave', () => {
      isHovered = false;
      startLoop();
    });

    frame.addEventListener('focus', () => {
      if (!croppedCanvas) samplePortraitPixels();
      pointer.x = width * 0.5;
      pointer.y = height * 0.42;
      smoothPointer.x = pointer.x;
      smoothPointer.y = pointer.y;
      isHovered = true;
      startLoop();
    });

    frame.addEventListener('blur', () => {
      isHovered = false;
      startLoop();
    });

    window.addEventListener('resize', () => {
      samplePortraitPixels();
      if (hoverProgress > 0.01) drawCubes();
    }, { passive: true });
  });
}

/* ==========================================================================
   Matrix Text Decode Micro-Reveal (Short Monospace Kickers Only)
   ========================================================================== */
function initMatrixTextDecode() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.orbit-lane-label, .blueprint-eyebrow, .credential-kicker, .hero-media-caption-accent'
  );
  if (!targets.length) return;

  const runDecode = (el) => {
    if (el.dataset.decoded === '1') return;
    el.dataset.decoded = '1';
    const finalStr = el.textContent || '';
    if (!finalStr.trim()) return;
    const durationMs = 420;
    const startTime = performance.now();

    const tick = (now) => {
      const ratio = Math.min(1, (now - startTime) / durationMs);
      el.textContent = stepMatrixDecodeFrame(finalStr, ratio);
      if (ratio < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = finalStr;
      }
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runDecode(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  targets.forEach((el) => obs.observe(el));
}

/* ==========================================================================
   Subtle Matrix Rain for Navbar (.site-header) & Footer (.site-footer)
   ========================================================================== */
function initChromeMatrixRain() {
  const bands = document.querySelectorAll('.site-header, .site-footer');
  if (!bands.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = '01λΣΔ{}<>/+*';

  bands.forEach((band) => {
    let canvas = band.querySelector('.chrome-matrix-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'chrome-matrix-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      band.prepend(canvas);
    }
    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;

    const COL_PITCH = 22;
    const ROW_HEIGHT = 13;
    let width = 0;
    let height = 0;
    let cols = [];
    let rafId = null;
    let isVisible = true;
    let lastTime = performance.now();

    const setupCols = () => {
      const rect = band.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, Math.round(rect.width));
      height = Math.max(64, Math.round(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.ceil(width / COL_PITCH);
      cols = Array.from({ length: count }, (_, idx) => ({
        x: idx * COL_PITCH + 6,
        y: (idx * 17) % (height + 40),
        speed: 0.36 + (idx % 5) * 0.11,
        trail: 3 + (idx % 4),
        charOffset: idx * 3,
      }));
    };

    const draw = (now = performance.now()) => {
      if (!isVisible && !prefersReduced) {
        lastTime = now;
        rafId = null;
        return;
      }

      const dtMs = Math.max(4, now - lastTime);
      lastTime = now;
      const dtScale = Math.min(dtMs / 16.6667, 2.5);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const mintRgb = isLight ? '15, 118, 110' : '184, 242, 230';
      const cyanRgb = isLight ? '14, 116, 144' : '86, 207, 225';

      ctx.clearRect(0, 0, width, height);
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'top';

      const tickBucket = Math.floor(now / 240);

      for (let i = 0; i < cols.length; i += 1) {
        const col = cols[i];
        if (!prefersReduced) {
          col.y += col.speed * dtScale;
          if (col.y - col.trail * ROW_HEIGHT > height + 10) {
            col.y = -ROW_HEIGHT;
          }
        }

        for (let t = 0; t < col.trail; t += 1) {
          const gy = col.y - t * ROW_HEIGHT;
          if (gy < -ROW_HEIGHT || gy > height) continue;
          const alpha = (1 - t / col.trail) * (t === 0 ? 0.65 : 0.34);
          const glyph = GLYPHS[(col.charOffset + t + tickBucket) % GLYPHS.length];
          ctx.fillStyle = `rgba(${t === 0 ? mintRgb : cyanRgb}, ${alpha.toFixed(2)})`;
          ctx.fillText(glyph, col.x, gy);
        }
      }

      if (!prefersReduced && isVisible) {
        rafId = requestAnimationFrame(draw);
      }
    };

    setupCols();
    draw();

    if ('IntersectionObserver' in window && !prefersReduced) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafId) {
              lastTime = performance.now();
              rafId = requestAnimationFrame(draw);
            }
          });
        },
        { threshold: 0.01 }
      );
      obs.observe(band);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !prefersReduced && isVisible && !rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', () => {
      setupCols();
      if (prefersReduced) draw();
    }, { passive: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initConstellationCanvas();
  initChromeMatrixRain();
  initHeroMatrixRain();
  initAboutBlockHover();
  initMatrixTextDecode();
  initTheme();
  initNavigation();
  initActivePageHighlight();
  initScrollProgress();
  initGlassSpotlight();
  initTypingAnimation();
  initProjectCarousel3D();
  initFloatingSkills();
  initSubpageFilters();
  initArchitectureBlueprint();
  initScrollReveal();
  initContactForm();
  initFooterUtilities();
});




