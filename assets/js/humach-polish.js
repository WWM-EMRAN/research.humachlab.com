/**
 * HUMACH Research visual polish helpers
 * Step 14: lightweight reveal, card glow, cursor ambience, and non-essential UI polish.
 */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObserver = null;
  var enhancedCards = new WeakSet();
  var revealed = new WeakSet();

  var cardSelectors = [
    ".snapshot-card",
    ".research-card",
    ".research-detail-card",
    ".development-card",
    ".development-detail-card",
    ".project-card",
    ".project-detail-card",
    ".opportunity-card",
    ".opportunity-detail-card",
    ".publication-card",
    ".publication-detail-card",
    ".team-profile-card",
    ".team-detail-card",
    ".news-card",
    ".news-mini-card",
    ".news-detail-card",
    ".contact-inquiry-card",
    ".contact-method-card",
    ".humach-page-summary-card",
    ".page-hero-card",
    ".hero-dashboard-card"
  ].join(",");

  var revealSelectors = [
    ".section-title",
    ".section-kicker",
    ".snapshot-card",
    ".research-card",
    ".research-detail-card",
    ".development-card",
    ".development-detail-card",
    ".project-card",
    ".project-detail-card",
    ".opportunity-card",
    ".opportunity-detail-card",
    ".publication-card",
    ".publication-detail-card",
    ".team-preview-card",
    ".team-detail-card",
    ".news-mini-card",
    ".news-detail-card",
    ".contact-inquiry-card",
    ".contact-method-card",
    ".contact-form-info-card",
    ".humach-contact-form",
    ".research-pathway-grid article",
    ".project-workflow article",
    ".publication-workflow article",
    ".news-workflow article",
    ".contact-process article",
    ".opportunity-process article",
    ".humach-page-summary-card"
  ].join(",");

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function markReady() {
    document.body.classList.add("humach-polish-ready");
  }

  function updateCursorAmbience(event) {
    if (reducedMotion) return;
    var x = clamp((event.clientX / window.innerWidth) * 100, 0, 100).toFixed(2) + "%";
    var y = clamp((event.clientY / window.innerHeight) * 100, 0, 100).toFixed(2) + "%";
    document.documentElement.style.setProperty("--humach-cursor-x", x);
    document.documentElement.style.setProperty("--humach-cursor-y", y);
  }

  function decorateCard(card) {
    if (enhancedCards.has(card)) return;
    enhancedCards.add(card);
    card.classList.add("humach-polish-card");

    if (reducedMotion) return;

    card.addEventListener("pointermove", function (event) {
      var rect = card.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--card-x", clamp(x, 0, 100).toFixed(2) + "%");
      card.style.setProperty("--card-y", clamp(y, 0, 100).toFixed(2) + "%");
    }, { passive: true });
  }

  function enhanceCards(root) {
    var scope = root || document;
    scope.querySelectorAll(cardSelectors).forEach(decorateCard);
  }

  function revealElement(element) {
    if (revealed.has(element)) return;
    revealed.add(element);
    element.classList.add("is-visible");
  }

  function prepareReveals(root) {
    var scope = root || document;
    var targets = Array.prototype.slice.call(scope.querySelectorAll(revealSelectors));

    targets.forEach(function (target, index) {
      if (target.closest(".humach-hero") && !target.classList.contains("hero-dashboard-card")) return;
      if (!target.classList.contains("humach-reveal")) {
        target.classList.add("humach-reveal");
      }
      target.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 55 + "ms");

      if (reducedMotion || !revealObserver) {
        target.classList.add("reveal-now");
      } else {
        revealObserver.observe(target);
      }
    });
  }

  function initRevealObserver() {
    if (reducedMotion || !("IntersectionObserver" in window)) return null;

    return new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });
  }

  function enhanceMetricLabels(root) {
    var scope = root || document;
    scope.querySelectorAll(".research-summary-metrics b").forEach(function (metric) {
      if (metric.dataset.polished === "true") return;
      metric.dataset.polished = "true";
      metric.setAttribute("aria-label", metric.textContent.trim());
    });
  }

  function addFloatingNote() {
    if (document.querySelector(".humach-floating-action-note")) return;
    var note = document.createElement("div");
    note.className = "humach-floating-action-note";
    note.setAttribute("aria-hidden", "true");
    note.innerHTML = "<strong>HUMACH system ready</strong><span>Research · development · internship pathways are now connected.</span>";
    document.body.appendChild(note);

    window.setTimeout(function () {
      note.classList.add("is-visible");
    }, 900);

    window.setTimeout(function () {
      note.classList.remove("is-visible");
    }, 5200);
  }

  function enhanceRenderedContent(root) {
    enhanceCards(root);
    prepareReveals(root);
    enhanceMetricLabels(root);
  }

  function observeDynamicContent() {
    var scheduled = false;
    var observer = new MutationObserver(function (mutations) {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (!node || node.nodeType !== 1) return;
            enhanceRenderedContent(node);
            if (node.matches && node.matches(cardSelectors + "," + revealSelectors)) {
              enhanceRenderedContent(node.parentElement || document);
            }
          });
        });
        scheduled = false;
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    markReady();
    revealObserver = initRevealObserver();
    enhanceRenderedContent(document);
    observeDynamicContent();
    if (!reducedMotion) {
      document.addEventListener("pointermove", updateCursorAmbience, { passive: true });
      addFloatingNote();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
