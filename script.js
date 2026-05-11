(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initSmartHeader();
    initNavToggle();
    initRevealOnScroll();
    initSmoothAnchors();
    initFaqSingleOpen();
    initApplicationForm();
  });

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initSmartHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      var state = window.scrollY > 12 ? "scrolled" : "top";
      header.setAttribute("data-state", state);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
    var onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function initRevealOnScroll() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = this.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", hash);
      });
    });
  }

  function initFaqSingleOpen() {
    var items = document.querySelectorAll(".faq details");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  function initApplicationForm() {
    var form = document.getElementById("applicationForm");
    if (!form) return;
    var message = document.getElementById("formMessage");
    var submitBtn = form.querySelector('button[type="submit"]');

    var setMessage = function (text, type) {
      if (!message) return;
      message.textContent = text || "";
      message.className = "form-message" + (type ? " " + type : "");
    };

    var formToPayload = function () {
      var data = new FormData(form);
      var get = function (k) { return String(data.get(k) || "").trim(); };
      return {
        first_name: get("firstName"),
        last_name: get("lastName"),
        email: get("workEmail"),
        phone: get("phone"),
        company: get("company"),
        website: get("companyWebsite"),
        role: get("role"),
        company_size: get("companySize"),
        industry: get("industry"),
        business_challenge: get("businessChallenge"),
        private_preview_interest: data.get("privatePreviewInterest") === "on",
        vip_skybox_interest: data.get("vipSkyboxInterest") === "on",
        description: get("message"),
        consent: data.get("consent") === "on"
      };
    };

    var validate = function (p) {
      var required = ["first_name", "last_name", "email", "company", "role"];
      for (var i = 0; i < required.length; i++) {
        if (!p[required[i]]) return "Please complete all required fields.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        return "Please enter a valid work email.";
      }
      if (!p.consent) {
        return "Please confirm consent before submitting.";
      }
      return null;
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var payload = formToPayload();
      var error = validate(payload);

      if (error) {
        setMessage(error, "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalLabel = submitBtn.dataset.originalLabel || submitBtn.textContent;
        submitBtn.textContent = "Submitting…";
      }
      setMessage("Submitting your request…");

      fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            return { ok: response.ok, status: response.status, body: body };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error((result.body && result.body.error) || "Submission failed.");
          }
          form.reset();
          setMessage(
            "Thank you. Your request has been received. The YouHodler team will review your application and contact you by email.",
            "success"
          );
        })
        .catch(function (err) {
          setMessage(err.message || "Something went wrong. Please try again.", "error");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalLabel || "Request an invitation";
          }
        });
    });
  }
})();
