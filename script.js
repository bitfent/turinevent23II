(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initSmartHeader();
    initNavToggle();
    initRevealOnScroll();
    initSmoothAnchors();
    initFaqSingleOpen();
    initTrustDiagram();
    initMobileCta();
    initSandboxForm();
  });

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initNavToggle() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    var header = document.querySelector(".site-header");
    if (!btn || !nav) return;

    var close = function () {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
      if (header) header.removeAttribute("data-menu-open");
    };
    var open = function () {
      nav.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      if (header) {
        header.setAttribute("data-menu-open", "true");
        header.dataset.state = "scrolled";
      }
    };

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) close();
      else open();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    var mq = window.matchMedia("(min-width: 881px)");
    var onChange = function (e) {
      if (e.matches) close();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function initRevealOnScroll() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerOffset = 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: "smooth" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  function initSmartHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var lastY = window.pageYOffset || 0;
    var ticking = false;

    var update = function () {
      var y = window.pageYOffset || 0;
      // While the mobile menu is open, never auto-hide the header.
      if (header.getAttribute("data-menu-open") === "true") {
        ticking = false;
        lastY = y;
        return;
      }
      if (y < 24) {
        header.dataset.state = "top";
      } else if (y > lastY + 4) {
        header.dataset.state = "hidden";
      } else if (y < lastY - 4) {
        header.dataset.state = "scrolled";
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  function initFaqSingleOpen() {
    var items = document.querySelectorAll(".faq__item");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  }

  function initTrustDiagram() {
    var diagram = document.querySelector(".trust-diagram");
    if (!diagram) return;
    var svg = diagram.querySelector(".trust-diagram__wires");
    if (!svg) return;

    var SVG_NS = "http://www.w3.org/2000/svg";
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Each side pill connects to a specific hub pill. Pulses arriving at the
    // hub end of a wire light up the corresponding hub pill — that's what
    // creates the rotating "Identity / Guardrails / Audit" highlight as an
    // emergent effect, not a discrete timer.
    var connections = [
      { from: "left-1", to: "hub-1", side: "left" },
      { from: "left-2", to: "hub-2", side: "left" },
      { from: "left-3", to: "hub-2", side: "left" },
      { from: "left-4", to: "hub-3", side: "left" },
      { from: "right-1", to: "hub-1", side: "right" },
      { from: "right-2", to: "hub-2", side: "right" },
      { from: "right-3", to: "hub-2", side: "right" },
      { from: "right-4", to: "hub-3", side: "right" }
    ];

    // Tunable feel knobs. Period = ms for one comet to traverse a wire.
    var BASE_PERIOD = 2400;
    var PERIOD_VARIANCE = 600;
    var STAGGER = 260;
    var COMET_LEN = 78;

    // Build one base path + one pulse path per connection. The base sits at
    // low opacity always; the pulse uses a dasharray "comet" that we slide
    // along the path each frame.
    var wires = connections.map(function (c, i) {
      var base = document.createElementNS(SVG_NS, "path");
      base.setAttribute("class", "wire-base");
      base.setAttribute("data-from", c.from);
      base.setAttribute("data-to", c.to);
      base.setAttribute("data-side", c.side);
      svg.appendChild(base);

      var pulse = document.createElementNS(SVG_NS, "path");
      pulse.setAttribute("class", "wire-pulse");
      svg.appendChild(pulse);

      return {
        from: c.from,
        to: c.to,
        side: c.side,
        base: base,
        pulse: pulse,
        length: 0,
        // Slight per-wire variance so wires breathe out of sync.
        period: BASE_PERIOD + (Math.random() - 0.5) * PERIOD_VARIANCE,
        // Phase offset spreads the comets along the timeline so they don't
        // all fire in unison. Negative so the first wire is mid-flight on
        // first frame instead of starting empty.
        phase: -i * STAGGER
      };
    });

    // Map hub-id -> pill element for the per-frame intensity write.
    var hubPills = {};
    diagram.querySelectorAll(".trust-hub__pill").forEach(function (p) {
      hubPills[p.dataset.node] = p;
    });

    var rafId = null;
    var startedAt = 0;
    var isRunning = false;

    // Smoothed pill intensity state. The raw `pillIntensity` (computed each
    // frame from incoming pulses) is the *target*; this is the displayed
    // value, low-pass-filtered + ease-shaped for a creamy response.
    var pillSmoothed = { "hub-1": 0, "hub-2": 0, "hub-3": 0 };
    var lastFrameTime = 0;
    var ATTACK_TAU_MS = 90;   // fast brighten — the "ping" feel
    var RELEASE_TAU_MS = 380; // slow fade — afterglow lingers

    function isSvgVisible() {
      return svg.getClientRects().length > 0;
    }

    function buildPaths() {
      if (!isSvgVisible()) return;
      var diagRect = diagram.getBoundingClientRect();
      svg.setAttribute("viewBox", "0 0 " + diagRect.width + " " + diagRect.height);

      wires.forEach(function (w) {
        var fromEl = diagram.querySelector('[data-node="' + w.from + '"]');
        var toEl = diagram.querySelector('[data-node="' + w.to + '"]');
        if (!fromEl || !toEl) return;
        var fromRect = fromEl.getBoundingClientRect();
        var toRect = toEl.getBoundingClientRect();
        var x1, x2, y1, y2;
        if (w.side === "left") {
          x1 = fromRect.right - diagRect.left;
          y1 = fromRect.top + fromRect.height / 2 - diagRect.top;
          x2 = toRect.left - diagRect.left;
          y2 = toRect.top + toRect.height / 2 - diagRect.top;
        } else {
          x1 = toRect.right - diagRect.left;
          y1 = toRect.top + toRect.height / 2 - diagRect.top;
          x2 = fromRect.left - diagRect.left;
          y2 = fromRect.top + fromRect.height / 2 - diagRect.top;
        }
        var dx = Math.max(40, (x2 - x1) * 0.5);
        var d =
          "M " + x1 + " " + y1 +
          " C " + (x1 + dx) + " " + y1 + ", " +
                  (x2 - dx) + " " + y2 + ", " +
                   x2 + " " + y2;
        w.base.setAttribute("d", d);
        w.pulse.setAttribute("d", d);
        var len = w.base.getTotalLength();
        w.length = len;
        // Comet = visible segment of length COMET_LEN, gap = the entire path
        // so only one comet exists on the wire at any time.
        w.pulse.style.strokeDasharray = COMET_LEN + " " + (len + COMET_LEN);
      });
    }

    // Expo-out: fast leap, gentle settle. Reads as "logarithmic velocity".
    function easeExpoOut(t) {
      return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    // Smootherstep — Perlin's C² continuous version. Zero first AND second
    // derivatives at both endpoints, so the bell has no visible "kink" where
    // it ramps in or out.
    function smootherstep(edge0, edge1, x) {
      var t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Final shaping ease applied to the smoothed pill value before write.
    // Same smootherstep curve in [0..1] — low values stay dark, ramps fast
    // through the middle, plateaus near full glow.
    function shapeIntensity(x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return x * x * x * (x * (x * 6 - 15) + 10);
    }

    var hubOrder = ["hub-1", "hub-2", "hub-3"];

    function tick(now) {
      if (!isRunning) return;
      var elapsed = now - startedAt;

      // Per-pill accumulator: how much intensity arrives this frame.
      var pillIntensity = { "hub-1": 0, "hub-2": 0, "hub-3": 0 };

      // Mobile path: SVG wires are hidden by CSS, so the per-wire comet loop
      // would no-op (length = 0). Drive a synthetic phase cycle into the
      // same accumulator instead — the LPF + shape pipeline below smooths it
      // into the same buttery rotating glow as desktop.
      var mobileLayout = !isSvgVisible();
      if (mobileLayout) {
        var cycleMs = 1800;
        var ct = ((elapsed % cycleMs) + cycleMs) % cycleMs / cycleMs;
        for (var hi = 0; hi < hubOrder.length; hi++) {
          var phase = hi / hubOrder.length;
          var local = ((ct - phase) % 1 + 1) % 1;
          var bell = 0;
          if (local < 0.18) {
            bell = smootherstep(0, 0.18, local);
          } else if (local < 0.36) {
            bell = 1 - smootherstep(0.18, 0.36, local);
          }
          pillIntensity[hubOrder[hi]] = bell;
        }
      }

      for (var i = 0; i < wires.length; i++) {
        var w = wires[i];
        if (!w.length) continue;

        // t in [0..1] — phase-offset + period gives a continuous loop.
        var raw = ((elapsed + w.phase) % w.period + w.period) % w.period;
        var t = raw / w.period;
        var eased = easeExpoOut(t);

        // Slide the comet so it enters from before the start and exits past the end.
        // dashoffset = COMET_LEN  -> comet just before start (invisible)
        // dashoffset = -length     -> comet has just exited past end (invisible)
        var totalTravel = w.length + COMET_LEN * 2;
        var offset = COMET_LEN - eased * totalTravel;
        w.pulse.style.strokeDashoffset = offset;

        // Comet head position along the path, normalized 0..1+.
        // headX = 0 when leading edge is at path start, 1 when at end.
        var headPos = (eased * totalTravel - COMET_LEN) / w.length;

        // Bell-shaped arrival intensity: rises as head enters the last 40% of
        // path, peaks at the destination, decays as the trail exits. Wider
        // window than before so adjacent comets overlap on the bell, which
        // the LPF then integrates into a continuous glow.
        var arrival = 0;
        if (headPos > 0.6 && headPos < 1.0) {
          arrival = smootherstep(0.6, 1.0, headPos);
        } else if (headPos >= 1.0 && headPos < 1.4) {
          arrival = 1 - smootherstep(1.0, 1.4, headPos);
        }
        pillIntensity[w.to] = Math.min(1, pillIntensity[w.to] + arrival);
      }

      // Frame-rate-independent low-pass filter with asymmetric attack/release,
      // then a final smootherstep shaping pass. Result: hub pills respond
      // quickly to incoming pulses but linger on the way down, and the visible
      // brightness curve is C² continuous with no perceptible jitter.
      var dt = lastFrameTime ? Math.min(64, now - lastFrameTime) : 16;
      lastFrameTime = now;

      for (var hubId in pillIntensity) {
        var target = pillIntensity[hubId];
        var current = pillSmoothed[hubId];
        var tau = target > current ? ATTACK_TAU_MS : RELEASE_TAU_MS;
        var alpha = 1 - Math.exp(-dt / tau);
        pillSmoothed[hubId] = current + (target - current) * alpha;

        var pill = hubPills[hubId];
        if (pill) {
          var displayed = shapeIntensity(pillSmoothed[hubId]);
          pill.style.setProperty("--pulse-intensity", displayed.toFixed(3));
        }
      }

      // Publish each pill's NEXT neighbor's intensity as --next-intensity so
      // the mobile-only accent bar between pills (the bright underline in
      // Ralio's screenshots) can brighten as the next pill is about to peak.
      for (var ni = 0; ni < hubOrder.length - 1; ni++) {
        var thisPill = hubPills[hubOrder[ni]];
        if (thisPill) {
          var nextDisplayed = shapeIntensity(pillSmoothed[hubOrder[ni + 1]]);
          thisPill.style.setProperty("--next-intensity", nextDisplayed.toFixed(3));
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      startedAt = performance.now();
      // Reset lastFrameTime so the first tick after a pause/resume uses the
      // default dt instead of a giant elapsed value.
      lastFrameTime = 0;
      svg.classList.add("is-lit");
      rafId = requestAnimationFrame(tick);
    }

    function stop() {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    function applyReducedMotionState() {
      svg.classList.add("is-lit");
      // Light up hub-2 as the resting state, no animation.
      Object.keys(hubPills).forEach(function (id) {
        hubPills[id].style.setProperty("--pulse-intensity", id === "hub-2" ? "1" : "0");
      });
      // Hide the comets entirely; only the base wires remain.
      wires.forEach(function (w) {
        w.pulse.style.display = "none";
      });
    }

    buildPaths();

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () {
        buildPaths();
      });
      ro.observe(diagram);
    } else {
      window.addEventListener("resize", buildPaths);
    }

    if (prefersReducedMotion) {
      applyReducedMotionState();
      return;
    }

    if ("IntersectionObserver" in window) {
      // Pause the rAF loop when the diagram is offscreen — both for perf and
      // so the comets don't drift out of phase while the user can't see them.
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              start();
            } else {
              stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      io.observe(diagram);
    } else {
      start();
    }
  }

  // Sticky "Get sandbox access" bar on mobile. Appears once the user has
  // scrolled past the hero (so it doesn't compete with the hero CTAs) and
  // hides when the sandbox section enters the viewport (so it doesn't
  // compete with the form itself). Desktop never sees it (CSS-gated at 880px).
  function initMobileCta() {
    var bar = document.getElementById("mobile-cta");
    if (!bar) return;

    var sandbox = document.getElementById("sandbox");
    var hero = document.querySelector(".hero");
    var mq = window.matchMedia("(max-width: 880px)");

    var sandboxInView = false;
    var ticking = false;

    document.body.classList.add("has-mobile-cta");

    if (sandbox && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            sandboxInView = entry.isIntersecting;
            update();
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );
      io.observe(sandbox);
    }

    function update() {
      if (!mq.matches) {
        bar.classList.remove("is-visible");
        return;
      }
      var threshold = hero ? hero.offsetHeight * 0.6 : 320;
      var pastHero = window.scrollY > threshold;
      var shouldShow = pastHero && !sandboxInView;
      bar.classList.toggle("is-visible", shouldShow);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
    } else if (mq.addListener) {
      mq.addListener(update);
    }
    update();
  }

  function initSandboxForm() {
    var form = document.getElementById('sandbox-form');
    if (!form) return;

    var submitBtn = document.getElementById('form-submit');
    var formErrorEl = document.getElementById('form-error');
    var originalBtnText = submitBtn ? submitBtn.textContent : 'Get sandbox access';

    var BLOCKED_DOMAINS = [
      'gmail.com', 'googlemail.com',
      'yahoo.com', 'yahoo.co.uk',
      'yandex.ru', 'yandex.com',
      'outlook.com', 'hotmail.com', 'live.com', 'msn.com'
    ];

    // ---- field-level error helpers ----

    function getFieldWrap(el) {
      if (el.type === 'checkbox') return el.closest('label');
      return el.closest('.field');
    }

    function setFieldError(el, msg) {
      var wrap = getFieldWrap(el);
      if (!wrap) return;
      wrap.classList.add('field--error');
      var existing = wrap.querySelector('.field__error-msg');
      if (existing) {
        existing.textContent = msg;
      } else {
        var span = document.createElement('span');
        span.className = 'field__error-msg';
        span.setAttribute('role', 'alert');
        span.textContent = msg;
        wrap.appendChild(span);
      }
    }

    function clearFieldError(el) {
      var wrap = getFieldWrap(el);
      if (!wrap) return;
      wrap.classList.remove('field--error');
      var existing = wrap.querySelector('.field__error-msg');
      if (existing) existing.remove();
    }

    function attachClearOnEdit(el) {
      var evt = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(evt, function () { clearFieldError(el); }, { once: false });
    }

    // ---- validation rules ----
    function validate(el) {
      if (el.type === 'checkbox') {
        return el.checked ? '' : 'You must agree to continue.';
      }

      var v = el.value.trim();
      var required = el.hasAttribute('required');

      if (required && !v) {
        var wrap = getFieldWrap(el);
        var label = wrap ? wrap.querySelector('label') : null;
        var name = label ? label.childNodes[0].textContent.trim().replace(/\s+$/, '') : 'This field';
        return name + ' is required.';
      }

      if (el.type === 'email' && v) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
        var domain = (v.split('@')[1] || '').toLowerCase();
        if (BLOCKED_DOMAINS.indexOf(domain) !== -1) {
          return 'Please use a corporate email address.';
        }
      }

      if (el.type === 'url' && v) {
        if (!/^https?:\/\/.+/.test(v)) return 'Enter a valid URL starting with https://';
      }

      return '';
    }

    // ---- form-level helpers ----

    function showFormError(msg) {
      if (!formErrorEl) return;
      formErrorEl.textContent = msg;
      formErrorEl.removeAttribute('hidden');
    }

    function hideFormError() {
      if (!formErrorEl) return;
      formErrorEl.textContent = '';
      formErrorEl.setAttribute('hidden', '');
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.textContent = on ? 'Sending\u2026' : originalBtnText;
    }

    // ---- attach clear-on-edit to all fields ----
    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(attachClearOnEdit);

    // ---- submit ----
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allFields = form.querySelectorAll('input, select, textarea');
      var firstInvalid = null;
      var hasErrors = false;

      allFields.forEach(function (el) {
        if (el.type === 'hidden' || el.disabled) return;
        var msg = validate(el);
        if (msg) {
          setFieldError(el, msg);
          if (!firstInvalid) firstInvalid = el;
          hasErrors = true;
        } else {
          clearFieldError(el);
        }
      });

      if (hasErrors) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);

      function val(name) {
        var v = data.get(name);
        return typeof v === 'string' ? v.trim() : '';
      }

      var payload = {
        email: val('email'),
        enterprise_name: val('company'),
        consent: true,
        profile: {
          first_name: val('first_name'),
          last_name: val('last_name'),
          website: val('website'),
          role: val('role'),
          company_size: val('company_size'),
          monthly_volume: val('monthly_volume'),
          use_case: val('use_case'),
          description: val('description') || undefined
        }
      };

      hideFormError();
      setLoading(true);

      fetch('https://b2b-sandbox.youhodler.com/idp/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok) {
            form.innerHTML =
              '<div class="sandbox__success">' +
              '<svg class="sandbox__success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>' +
              '<h3>You\u2019re in!</h3>' +
              '<p>Check your inbox \u2014 sandbox credentials are on their way. Our solutions team will follow up shortly.</p>' +
              '</div>';
            return;
          }
          return res.json().catch(function () { return {}; }).then(function (body) {
            showFormError(body && body.message ? body.message : 'Something went wrong. Please try again or contact us directly.');
            setLoading(false);
          });
        })
        .catch(function () {
          showFormError('Could not reach the server. Check your connection and try again.');
          setLoading(false);
        });
    });
  }
})();
