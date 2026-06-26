/**
 * HUMACH Research UI helpers
 * Step 13: global navigation, mobile responsiveness, and accessibility behavior.
 */
(function () {
  "use strict";

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (item) {
      item.textContent = new Date().getFullYear();
    });
  }

  function normaliseFileName(pathname) {
    var file = pathname.split("/").pop();
    return file || "index.html";
  }

  function markActiveNavigation() {
    var currentFile = normaliseFileName(window.location.pathname);
    var currentHash = window.location.hash;
    var navLinks = document.querySelectorAll(".humach-navmenu a[href]");

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      var linkUrl = new URL(link.getAttribute("href"), window.location.href);
      var linkFile = normaliseFileName(linkUrl.pathname);
      var sameFile = linkFile === currentFile || (currentFile === "" && linkFile === "index.html");
      var sameHash = linkUrl.hash && currentHash && linkUrl.hash === currentHash;

      if (sameFile && sameHash) {
        link.classList.add("active");
      }

      if (!currentHash && sameFile && linkUrl.hash === "#hero") {
        link.classList.add("active");
      }

      if (sameFile && !linkUrl.hash && linkFile !== "index.html") {
        link.classList.add("active");
      }
    });

    document.querySelectorAll(".humach-navmenu .dropdown").forEach(function (dropdown) {
      var parent = dropdown.querySelector(":scope > a");
      if (!parent) return;
      parent.classList.toggle("active", Boolean(dropdown.querySelector("ul a.active")));
    });
  }

  function syncMobileToggleState() {
    var toggle = document.querySelector(".mobile-nav-toggle");
    if (!toggle) return;
    var isOpen = document.body.classList.contains("mobile-nav-active");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close mobile navigation" : "Open mobile navigation");
  }

  function enhanceMobileNavigation() {
    var toggle = document.querySelector(".mobile-nav-toggle");
    var navMenu = document.querySelector("#navmenu");

    if (toggle) {
      toggle.setAttribute("type", "button");
      toggle.setAttribute("aria-controls", "navmenu");
      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle.click();
        }
      });

      toggle.addEventListener("click", function () {
        window.setTimeout(syncMobileToggleState, 0);
      });
    }

    if (navMenu) {
      navMenu.querySelectorAll(".dropdown > a").forEach(function (link) {
        link.setAttribute("aria-haspopup", "true");
        link.setAttribute("aria-expanded", "false");
      });

      navMenu.querySelectorAll(".toggle-dropdown").forEach(function (icon) {
        icon.addEventListener("click", function () {
          window.setTimeout(syncDropdownAria, 0);
        });
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!document.body.classList.contains("mobile-nav-active")) return;
      if (toggle) toggle.click();
      if (toggle) toggle.focus({ preventScroll: true });
    });

    var observer = new MutationObserver(syncMobileToggleState);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    syncMobileToggleState();
  }

  function syncDropdownAria() {
    document.querySelectorAll(".humach-navmenu .dropdown").forEach(function (dropdown) {
      var link = dropdown.querySelector(":scope > a");
      var submenu = dropdown.querySelector(":scope > ul");
      if (!link || !submenu) return;
      var isOpen = link.classList.contains("active") || submenu.classList.contains("dropdown-active") || dropdown.matches(":focus-within");
      link.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function enhanceFilterButtons() {
    var selectors = [
      "[data-development-filter]",
      "[data-project-filter]",
      "[data-opportunity-filter]",
      "[data-publication-filter]",
      "[data-team-filter]",
      "[data-news-filter]"
    ];

    function syncGroup(container) {
      var buttons = container.querySelectorAll("button");
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
      });
    }

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (button) {
        var container = button.parentElement;
        if (!container) return;
        container.setAttribute("role", "group");
        if (!container.getAttribute("aria-label")) {
          container.setAttribute("aria-label", "Filter content");
        }
        button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
        button.addEventListener("click", function () {
          window.setTimeout(function () { syncGroup(container); }, 0);
        });
      });
    });
  }

  function enhanceDynamicRegions() {
    document.querySelectorAll("[data-humach-render]").forEach(function (region) {
      if (!region.getAttribute("aria-live")) {
        region.setAttribute("aria-live", "polite");
      }
    });
  }

  function enhanceImages() {
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.hasAttribute("loading") && !img.closest(".humach-hero")) {
        img.setAttribute("loading", "lazy");
      }
      if (!img.hasAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
    });
  }

  function respectReducedMotion() {
    if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reduced-motion");
    document.querySelectorAll("[data-aos]").forEach(function (item) {
      item.removeAttribute("data-aos");
      item.removeAttribute("data-aos-delay");
      item.removeAttribute("data-aos-duration");
    });
  }

  function watchDynamicContent() {
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        enhanceFilterButtons();
        enhanceDynamicRegions();
        enhanceImages();
        syncDropdownAria();
        scheduled = false;
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initialise() {
    setCurrentYear();
    markActiveNavigation();
    enhanceMobileNavigation();
    syncDropdownAria();
    enhanceFilterButtons();
    enhanceDynamicRegions();
    enhanceImages();
    respectReducedMotion();
    watchDynamicContent();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise);
  } else {
    initialise();
  }

  window.addEventListener("load", function () {
    setCurrentYear();
    markActiveNavigation();
    syncMobileToggleState();
    syncDropdownAria();
    enhanceFilterButtons();
    enhanceDynamicRegions();
    enhanceImages();
  });

  window.addEventListener("hashchange", markActiveNavigation);
})();
