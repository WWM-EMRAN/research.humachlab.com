/**
 * HUMACH Research data loader
 * Current: data-driven rendering, resilient filters, and 30-minute JSON caching.
 *
 * The loader is intentionally progressive-enhancement friendly:
 * - if JSON files load successfully, matching homepage sections are rendered from data;
 * - if loading fails (for example when opening index.html directly via file://),
 *   the existing static fallback content remains visible.
 */
(function () {
  "use strict";

  var DATA_PATHS = {
    research: "data/research.json",
    development: "data/development.json",
    projects: "data/projects.json",
    opportunities: "data/opportunities.json",
    publications: "data/publications.json",
    team: "data/team.json",
    news: "data/news.json",
    contact: "data/contact.json"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderTags(tags, wrapperClass) {
    if (!Array.isArray(tags) || !tags.length) return "";
    return '<div class="' + (wrapperClass || "tag-row") + '">' + tags.map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("") + "</div>";
  }

  function setSectionTitle(sectionKey, data) {
    if (!data || !data.section) return;
    var section = document.querySelector('[data-humach-section-title="' + sectionKey + '"]');
    if (!section) return;

    var title = section.querySelector("h2");
    var subtitle = section.querySelector("p");
    if (title && data.section.title) title.textContent = data.section.title;
    if (subtitle && data.section.subtitle) subtitle.textContent = data.section.subtitle;
  }

  function renderResearch(data) {
    var target = document.querySelector('[data-humach-render="research-areas"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + index * 80;
      return [
        '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + delay + '">',
        '  <div class="service-item research-card position-relative" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="icon"><i class="' + escapeHtml(item.icon || "bi bi-cpu") + '"></i></div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "tag-row"),
        '  </div>',
        '</div>'
      ].join("");
    }).join("");
  }



  function renderResearchPageGrid(data) {
    var target = document.querySelector('[data-humach-render="research-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + index * 80;
      var topics = Array.isArray(item.topics) ? item.topics.map(function (topic) {
        return "<li>" + escapeHtml(topic) + "</li>";
      }).join("") : "";
      var statusClass = String(item.status || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return [
        '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + delay + '">',
        '  <article class="research-detail-card" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="research-detail-icon"><i class="' + escapeHtml(item.icon || "bi bi-cpu") + '"></i></div>',
        '    <span class="research-status ' + escapeHtml(statusClass) + '">' + escapeHtml(item.status || "Research") + '</span>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "tag-row"),
        '    <ul>' + topics + '</ul>',
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderResearchTopicMap(data) {
    var target = document.querySelector('[data-humach-render="research-topic-map"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item) {
      return [
        '<article data-content-id="' + escapeHtml(item.id) + '">',
        '  <h4><i class="' + escapeHtml(item.icon || "bi bi-cpu") + '"></i> ' + escapeHtml(item.title) + '</h4>',
           renderTags(item.topics, "tag-row topic-tags"),
        '</article>'
      ].join("");
    }).join("");
  }

  function renderResearchPageSummary(data) {
    var target = document.querySelector('[data-humach-render="research-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var activeCount = data.items.filter(function (item) {
      return String(item.status || "").toLowerCase() === "active";
    }).length;
    var tagCount = {};
    data.items.forEach(function (item) {
      (item.tags || []).forEach(function (tag) {
        tagCount[tag] = true;
      });
    });
    target.innerHTML = [
      '<span>Research Scope</span>',
      '<strong>' + data.items.length + ' core areas · ' + activeCount + ' active themes</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || "Research areas that connect computing, health, and human-centered innovation.") + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Areas</small></div>',
      '  <div><b>' + Object.keys(tagCount).length + '</b><small>Tags</small></div>',
      '  <div><b>' + activeCount + '</b><small>Active</small></div>',
      '</div>'
    ].join("");
  }

  function renderDevelopment(data) {
    var target = document.querySelector('[data-humach-render="development-items"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.slice(0, 4).map(function (item) {
      return [
        '<div data-content-id="' + escapeHtml(item.id) + '">',
        '  <i class="' + escapeHtml(item.icon || "bi bi-code-square") + '"></i>',
        '  <h4>' + escapeHtml(item.title) + '</h4>',
        '  <p>' + escapeHtml(item.summary) + '</p>',
        '</div>'
      ].join("");
    }).join("");
  }

  function getDevelopmentFilterTokens(item) {
    var tokens = [
      item.category,
      item.type,
      item.status,
      item.statusClass
    ];
    if (Array.isArray(item.tags)) tokens = tokens.concat(item.tags);
    if (Array.isArray(item.tools)) tokens = tokens.concat(item.tools);
    return tokens.map(normaliseFilterValue).filter(Boolean);
  }

  function renderDevelopmentPageSummary(data) {
    var target = document.querySelector('[data-humach-render="development-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var recruiting = data.items.filter(function (item) {
      return getDevelopmentFilterTokens(item).indexOf("recruiting") !== -1;
    }).length;
    var categories = {};
    var tools = {};
    data.items.forEach(function (item) {
      if (item.category) categories[item.category] = true;
      (item.tools || []).forEach(function (tool) { tools[tool] = true; });
    });
    target.innerHTML = [
      '<span>Development Portfolio</span>',
      '<strong>' + data.items.length + ' directions · ' + Object.keys(tools).length + ' tool families</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || "Development directions for research tools, prototypes, dashboards, and applied systems.") + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Directions</small></div>',
      '  <div><b>' + Object.keys(categories).length + '</b><small>Categories</small></div>',
      '  <div><b>' + recruiting + '</b><small>Recruiting</small></div>',
      '</div>'
    ].join("");
  }

  function renderDevelopmentFilters(data) {
    var target = document.querySelector('[data-humach-render="development-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [{ label: "All", value: "all" }];
    var seen = { all: true };
    data.items.forEach(function (item) {
      [item.category, item.type, item.statusClass].concat(item.tags || []).forEach(function (value) {
        var token = normaliseFilterValue(value);
        if (!token || seen[token]) return;
        seen[token] = true;
        filters.push({ label: value, value: token });
      });
    });
    target.innerHTML = filters.slice(0, 14).map(function (filter, index) {
      return '<button class="' + (index === 0 ? "active" : "") + '" type="button" data-development-filter="' + escapeHtml(filter.value) + '">' + escapeHtml(filter.label) + '</button>';
    }).join("");
  }

  function renderDevelopmentPageGrid(data) {
    var target = document.querySelector('[data-humach-render="development-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 70;
      var tokens = getDevelopmentFilterTokens(item).join(" ");
      var tools = Array.isArray(item.tools) && item.tools.length
        ? '<div class="development-tool-list"><span>Tools / Methods</span><p>' + item.tools.map(escapeHtml).join(" · ") + '</p></div>'
        : "";
      var outputs = Array.isArray(item.outputs) && item.outputs.length
        ? '<ul class="project-output-list">' + item.outputs.map(function (output) { return '<li>' + escapeHtml(output) + '</li>'; }).join("") + '</ul>'
        : "";
      return [
        '<div class="col-lg-4 col-md-6 development-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-development-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="development-detail-card" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="development-icon"><i class="' + escapeHtml(item.icon || "bi bi-code-square") + '"></i></div>',
        '    <div class="project-status ' + escapeHtml(item.statusClass || "active") + '">' + escapeHtml(item.status || "Development") + '</div>',
        '    <div class="project-type-line">' + escapeHtml(item.category || "Development") + ' · ' + escapeHtml(item.type || "System") + '</div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "project-meta"),
        '    <div class="development-detail-copy">' + escapeHtml(item.details || "") + '</div>',
             tools,
             outputs,
        '    <div class="project-card-footer"><span>Opportunity</span><strong>' + escapeHtml(item.opportunity || "Development contribution") + '</strong></div>',
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderDevelopmentStack(data) {
    var target = document.querySelector('[data-humach-render="development-stack"]');
    if (!target || !data || !Array.isArray(data.stack)) return;
    target.innerHTML = data.stack.map(function (group, index) {
      var items = Array.isArray(group.items) ? group.items.map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join("") : "";
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <h3>' + escapeHtml(group.name) + '</h3>',
        '  <ul>' + items + '</ul>',
        '</article>'
      ].join("");
    }).join("");
  }

  function initDevelopmentFilters() {
    var filterBar = document.querySelector('[data-humach-render="development-filters"]');
    var grid = document.querySelector('[data-humach-render="development-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-development-filter]');
    var items = grid.querySelectorAll('[data-development-tokens]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-development-filter") || "all";
        buttons.forEach(function (btn) { btn.classList.remove("active"); });
        button.classList.add("active");
        items.forEach(function (item) {
          var tokens = item.getAttribute("data-development-tokens") || "";
          var show = filter === "all" || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        refreshAos();
      });
    });
  }

  function renderProjects(data) {
    var target = document.querySelector('[data-humach-render="projects-preview"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.slice(0, 6).map(function (item, index) {
      var delay = 100 + index * 80;
      return [
        '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + delay + '">',
        '  <article class="project-card" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="project-status ' + escapeHtml(item.statusClass || "active") + '">' + escapeHtml(item.status || "Project") + '</div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "project-meta"),
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }


  function slugifyMemberUrl(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "member";
  }

  function normaliseFilterValue(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function tokeniseFilterValue(value) {
    var text = String(value || "").toLowerCase();
    var tokens = [];
    var normalised = normaliseFilterValue(text);
    if (normalised) tokens.push(normalised);
    text.split(/[^a-z0-9]+/).forEach(function (part) {
      var token = normaliseFilterValue(part);
      if (token) tokens.push(token);
    });
    return tokens;
  }

  function uniqueTokens(values) {
    var seen = {};
    var tokens = [];
    values.forEach(function (value) {
      tokeniseFilterValue(value).forEach(function (token) {
        if (!seen[token]) {
          seen[token] = true;
          tokens.push(token);
        }
      });
    });
    return tokens;
  }

  function formatAffiliation(group, organization) {
    var groupText = String(group || "").trim();
    var orgText = String(organization || "").trim();
    if (groupText && orgText) return groupText + ", " + orgText;
    return groupText || orgText || "HUMACH Research";
  }

  function initFilteredGrid(filterSelector, gridSelector, tokenAttribute) {
    var filterBar = document.querySelector(filterSelector);
    var grid = document.querySelector(gridSelector);
    if (!filterBar || !grid) return;

    var buttons = filterBar.querySelectorAll('button');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      if (button.dataset.humachFilterReady === "true") return;
      button.dataset.humachFilterReady = "true";
      button.addEventListener("click", function () {
        var filter = button.getAttribute(tokenAttribute.replace("tokens", "filter")) || button.getAttribute("data-team-filter") || button.getAttribute("data-project-filter") || button.getAttribute("data-development-filter") || button.getAttribute("data-opportunity-filter") || button.getAttribute("data-publication-filter") || button.getAttribute("data-news-filter") || "all";
        var items = grid.querySelectorAll("[" + tokenAttribute + "]");
        buttons.forEach(function (btn) {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        items.forEach(function (item) {
          var tokens = (item.getAttribute(tokenAttribute) || "").split(/\s+/);
          var show = filter === "all" || tokens.indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        refreshAos();
      });
    });
  }

  function getProjectFilterTokens(item) {
    var tokens = [
      item.category,
      item.type,
      item.status,
      item.statusClass
    ];
    if (Array.isArray(item.tags)) tokens = tokens.concat(item.tags);
    return tokens.map(normaliseFilterValue).filter(Boolean);
  }

  function renderProjectsPageSummary(data) {
    var target = document.querySelector('[data-humach-render="projects-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var recruiting = data.items.filter(function (item) {
      return getProjectFilterTokens(item).indexOf("recruiting") !== -1;
    }).length;
    var categories = {};
    var types = {};
    data.items.forEach(function (item) {
      if (item.category) categories[item.category] = true;
      if (item.type) types[item.type] = true;
    });
    target.innerHTML = [
      '<span>Project Portfolio</span>',
      '<strong>' + data.items.length + ' projects · ' + recruiting + ' recruiting</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || "Projects connecting research questions, practical development, and publishable outputs.") + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Projects</small></div>',
      '  <div><b>' + Object.keys(categories).length + '</b><small>Areas</small></div>',
      '  <div><b>' + Object.keys(types).length + '</b><small>Types</small></div>',
      '</div>'
    ].join("");
  }

  function renderProjectFilters(data) {
    var target = document.querySelector('[data-humach-render="project-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [{ label: "All", value: "all" }];
    var seen = { all: true };
    data.items.forEach(function (item) {
      [item.category, item.type, item.statusClass].concat(item.tags || []).forEach(function (value) {
        var token = normaliseFilterValue(value);
        if (!token || seen[token]) return;
        seen[token] = true;
        filters.push({ label: value, value: token });
      });
    });
    target.innerHTML = filters.slice(0, 14).map(function (filter, index) {
      return '<button class="' + (index === 0 ? "active" : "") + '" type="button" data-project-filter="' + escapeHtml(filter.value) + '">' + escapeHtml(filter.label) + '</button>';
    }).join("");
  }

  function renderProjectsPageGrid(data) {
    var target = document.querySelector('[data-humach-render="projects-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 70;
      var tokens = getProjectFilterTokens(item).join(" ");
      var related = Array.isArray(item.relatedResearch) && item.relatedResearch.length
        ? '<div class="project-related"><span>Related research</span><p>' + item.relatedResearch.map(escapeHtml).join(" · ") + '</p></div>'
        : "";
      var outputs = Array.isArray(item.outputs) && item.outputs.length
        ? '<ul class="project-output-list">' + item.outputs.map(function (output) { return '<li>' + escapeHtml(output) + '</li>'; }).join("") + '</ul>'
        : "";
      return [
        '<div class="col-lg-4 col-md-6 project-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-project-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="project-detail-card" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="project-status ' + escapeHtml(item.statusClass || "active") + '">' + escapeHtml(item.status || "Project") + '</div>',
        '    <div class="project-type-line">' + escapeHtml(item.category || "Project") + ' · ' + escapeHtml(item.type || "Work") + '</div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "project-meta"),
             related,
             outputs,
        '    <div class="project-card-footer"><span>Opportunity</span><strong>' + escapeHtml(item.opportunity || "Contact HUMACH") + '</strong></div>',
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }

  function initProjectFilters() {
    var filterBar = document.querySelector('[data-humach-render="project-filters"]');
    var grid = document.querySelector('[data-humach-render="projects-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-project-filter]');
    var items = grid.querySelectorAll('[data-project-tokens]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-project-filter") || "all";
        buttons.forEach(function (btn) { btn.classList.remove("active"); });
        button.classList.add("active");
        items.forEach(function (item) {
          var tokens = item.getAttribute("data-project-tokens") || "";
          var show = filter === "all" || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        refreshAos();
      });
    });
  }

  function renderOpportunities(data) {
    var target = document.querySelector('[data-humach-render="opportunities-preview"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + index * 100;
      var highlights = Array.isArray(item.highlights) ? item.highlights.map(function (point) {
        return "<li>" + escapeHtml(point) + "</li>";
      }).join("") : "";
      return [
        '<div class="col-lg-4" data-aos="fade-up" data-aos-delay="' + delay + '">',
        '  <div class="opportunity-card' + (item.featured ? " highlighted" : "") + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <i class="' + escapeHtml(item.icon || "bi bi-person-plus") + '"></i>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
        '    <ul>' + highlights + '</ul>',
        '  </div>',
        '</div>'
      ].join("");
    }).join("");
  }


  function getOpportunityFilterTokens(item) {
    var tokens = [
      item.category,
      item.type,
      item.status,
      item.statusClass,
      item.mode,
      item.duration
    ];
    if (Array.isArray(item.tags)) tokens = tokens.concat(item.tags);
    if (Array.isArray(item.skills)) tokens = tokens.concat(item.skills);
    if (Array.isArray(item.topics)) tokens = tokens.concat(item.topics);
    return tokens.map(normaliseFilterValue).filter(Boolean);
  }

  function renderOpportunityPageSummary(data) {
    var target = document.querySelector('[data-humach-render="opportunities-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var openCount = data.items.filter(function (item) {
      return getOpportunityFilterTokens(item).indexOf("open") !== -1;
    }).length;
    var categories = {};
    data.items.forEach(function (item) {
      if (item.category) categories[item.category] = true;
    });
    target.innerHTML = [
      '<span>Opportunity Portfolio</span>',
      '<strong>' + data.items.length + ' pathways · ' + openCount + ' open</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || "Opportunities for students, researchers, developers, and collaborators.") + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Pathways</small></div>',
      '  <div><b>' + Object.keys(categories).length + '</b><small>Tracks</small></div>',
      '  <div><b>' + openCount + '</b><small>Open</small></div>',
      '</div>'
    ].join("");
  }

  function renderOpportunityFilters(data) {
    var target = document.querySelector('[data-humach-render="opportunity-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [{ label: "All", value: "all" }];
    var seen = { all: true };
    data.items.forEach(function (item) {
      [item.category, item.type, item.statusClass, item.mode].concat(item.tags || []).forEach(function (value) {
        var token = normaliseFilterValue(value);
        if (!token || seen[token]) return;
        seen[token] = true;
        filters.push({ label: value, value: token });
      });
    });
    target.innerHTML = filters.slice(0, 16).map(function (filter, index) {
      return '<button class="' + (index === 0 ? "active" : "") + '" type="button" data-opportunity-filter="' + escapeHtml(filter.value) + '">' + escapeHtml(filter.label) + '</button>';
    }).join("");
  }

  function renderOpportunitiesPageGrid(data) {
    var target = document.querySelector('[data-humach-render="opportunities-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 70;
      var tokens = getOpportunityFilterTokens(item).join(" ");
      var highlights = Array.isArray(item.highlights) && item.highlights.length
        ? '<ul class="project-output-list">' + item.highlights.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join("") + '</ul>'
        : "";
      var outcomes = Array.isArray(item.outcomes) && item.outcomes.length
        ? '<div class="opportunity-outcome-list"><span>Expected outputs</span><p>' + item.outcomes.map(escapeHtml).join(" · ") + '</p></div>'
        : "";
      var skills = Array.isArray(item.skills) && item.skills.length
        ? '<div class="development-tool-list"><span>Useful skills</span><p>' + item.skills.map(escapeHtml).join(" · ") + '</p></div>'
        : "";
      return [
        '<div class="col-lg-6 opportunity-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-opportunity-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="opportunity-detail-card' + (item.featured ? " highlighted" : "") + '" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="opportunity-detail-top">',
        '      <div class="opportunity-icon"><i class="' + escapeHtml(item.icon || "bi bi-person-plus") + '"></i></div>',
        '      <div class="project-status ' + escapeHtml(item.statusClass || "open") + '">' + escapeHtml(item.status || "Opportunity") + '</div>',
        '    </div>',
        '    <div class="project-type-line">' + escapeHtml(item.category || "Opportunity") + ' · ' + escapeHtml(item.type || "Pathway") + '</div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
             renderTags(item.tags, "project-meta"),
        '    <div class="opportunity-detail-copy">' + escapeHtml(item.details || "") + '</div>',
             highlights,
        '    <div class="opportunity-info-grid">',
        '      <div><span>Mode</span><strong>' + escapeHtml(item.mode || "Flexible") + '</strong></div>',
        '      <div><span>Duration</span><strong>' + escapeHtml(item.duration || "Flexible") + '</strong></div>',
        '      <div><span>Commitment</span><strong>' + escapeHtml(item.commitment || "Milestone-based") + '</strong></div>',
        '      <div><span>Ideal for</span><strong>' + escapeHtml(item.idealFor || "Students and collaborators") + '</strong></div>',
        '    </div>',
             skills,
             outcomes,
        '    <div class="project-card-footer"><span>Application note</span><strong>' + escapeHtml(item.applicationNote || "Share your background, interest, and availability.") + '</strong></div>',
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderOpportunityProcess(data) {
    var target = document.querySelector('[data-humach-render="opportunity-process"]');
    if (!target || !data || !Array.isArray(data.process)) return;
    target.innerHTML = data.process.map(function (step, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <span>' + escapeHtml(step.step || String(index + 1).padStart(2, "0")) + '</span>',
        '  <i class="' + escapeHtml(step.icon || "bi bi-check2-circle") + '"></i>',
        '  <h3>' + escapeHtml(step.title) + '</h3>',
        '  <p>' + escapeHtml(step.description) + '</p>',
        '</article>'
      ].join("");
    }).join("");
  }

  function renderOpportunitySkillMatrix(data) {
    var target = document.querySelector('[data-humach-render="opportunity-skill-matrix"]');
    if (!target || !data || !Array.isArray(data.skillGroups)) return;
    target.innerHTML = data.skillGroups.map(function (group, index) {
      var items = Array.isArray(group.items) ? group.items.map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join("") : "";
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <h3>' + escapeHtml(group.name) + '</h3>',
        '  <ul>' + items + '</ul>',
        '</article>'
      ].join("");
    }).join("");
  }

  function initOpportunityFilters() {
    var filterBar = document.querySelector('[data-humach-render="opportunity-filters"]');
    var grid = document.querySelector('[data-humach-render="opportunities-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-opportunity-filter]');
    var items = grid.querySelectorAll('[data-opportunity-tokens]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-opportunity-filter") || "all";
        buttons.forEach(function (btn) { btn.classList.remove("active"); });
        button.classList.add("active");
        items.forEach(function (item) {
          var tokens = item.getAttribute("data-opportunity-tokens") || "";
          var show = filter === "all" || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        refreshAos();
      });
    });
  }

  function renderPublications(data) {
    var target = document.querySelector('[data-humach-render="publications-preview"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.slice(0, 5).map(function (item) {
      return [
        '<article class="publication-item" data-content-id="' + escapeHtml(item.id) + '">',
        '  <div class="pub-year">' + escapeHtml(item.year) + '</div>',
        '  <div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary || (Array.isArray(item.authors) ? item.authors.join(", ") : "")) + '</p>',
        '  </div>',
        '  <span class="pub-type">' + escapeHtml(item.type || "Output") + '</span>',
        '</article>'
      ].join("");
    }).join("");
  }


  function getPublicationFilterTokens(item) {
    var tokens = [
      item.type,
      item.year,
      item.status,
      item.statusClass,
      item.venue
    ];
    if (Array.isArray(item.tags)) tokens = tokens.concat(item.tags);
    if (Array.isArray(item.relatedProjects)) tokens = tokens.concat(item.relatedProjects);
    return tokens.map(normaliseFilterValue).filter(Boolean);
  }

  function renderPublicationsPageSummary(data) {
    var target = document.querySelector('[data-humach-render="publications-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var types = {};
    var years = {};
    data.items.forEach(function (item) {
      if (item.type) types[item.type] = true;
      if (item.year) years[item.year] = true;
    });
    target.innerHTML = [
      '<span>Publication Directory</span>',
      '<strong>' + data.items.length + ' output records · ' + Object.keys(types).length + ' output types</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || "Research outputs, papers, reports, software, and knowledge resources.") + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Records</small></div>',
      '  <div><b>' + Object.keys(types).length + '</b><small>Types</small></div>',
      '  <div><b>' + Object.keys(years).length + '</b><small>Years</small></div>',
      '</div>'
    ].join("");
  }

  function renderPublicationFilters(data) {
    var target = document.querySelector('[data-humach-render="publication-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [{ label: "All", value: "all" }];
    var seen = { all: true };
    data.items.forEach(function (item) {
      [item.type, item.year, item.statusClass].concat(item.tags || []).forEach(function (value) {
        var token = normaliseFilterValue(value);
        if (!token || seen[token]) return;
        seen[token] = true;
        filters.push({ label: value, value: token });
      });
    });
    target.innerHTML = filters.slice(0, 18).map(function (filter, index) {
      return '<button class="' + (index === 0 ? "active" : "") + '" type="button" data-publication-filter="' + escapeHtml(filter.value) + '">' + escapeHtml(filter.label) + '</button>';
    }).join("");
  }

  function renderPublicationLinks(links) {
    if (!Array.isArray(links) || !links.length) return "";
    return '<div class="publication-link-row">' + links.map(function (link) {
      var label = link && link.label ? link.label : "Link";
      var url = link && link.url ? link.url : "#";
      var external = /^https?:\/\//i.test(url);
      return '<a href="' + escapeHtml(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(label) + ' <i class="bi bi-arrow-up-right"></i></a>';
    }).join("") + '</div>';
  }

  function renderPublicationsPageGrid(data) {
    var target = document.querySelector('[data-humach-render="publications-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 70;
      var tokens = getPublicationFilterTokens(item).join(" ");
      var authors = Array.isArray(item.authors) && item.authors.length
        ? '<p class="publication-authors">' + item.authors.map(escapeHtml).join(", ") + '</p>'
        : "";
      var related = Array.isArray(item.relatedProjects) && item.relatedProjects.length
        ? '<div class="project-related publication-related"><span>Related projects</span><p>' + item.relatedProjects.map(escapeHtml).join(" · ") + '</p></div>'
        : "";
      return [
        '<div class="col-lg-6 publication-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-publication-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="publication-detail-card" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="publication-card-head">',
        '      <div class="pub-year publication-year-large">' + escapeHtml(item.year || "Year") + '</div>',
        '      <div>',
        '        <div class="project-status ' + escapeHtml(item.statusClass || "planned") + '">' + escapeHtml(item.status || item.type || "Publication") + '</div>',
        '        <div class="project-type-line">' + escapeHtml(item.type || "Output") + ' · ' + escapeHtml(item.venue || "Venue to be confirmed") + '</div>',
        '      </div>',
        '    </div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
             authors,
        '    <p>' + escapeHtml(item.summary || "") + '</p>',
        '    <div class="publication-abstract">' + escapeHtml(item.abstract || "Publication metadata, paper links, and code links will be added as outputs are released.") + '</div>',
             renderTags(item.tags, "project-meta"),
             related,
             renderPublicationLinks(item.links),
        '  </article>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderPublicationTypes(data) {
    var target = document.querySelector('[data-humach-render="publication-types"]');
    if (!target || !data || !Array.isArray(data.types)) return;
    target.innerHTML = data.types.map(function (type, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <i class="' + escapeHtml(type.icon || "bi bi-journal-text") + '"></i>',
        '  <h3>' + escapeHtml(type.name) + '</h3>',
        '  <p>' + escapeHtml(type.summary || "") + '</p>',
        '</article>'
      ].join("");
    }).join("");
  }

  function renderPublicationWorkflow(data) {
    var target = document.querySelector('[data-humach-render="publication-workflow"]');
    if (!target || !data || !Array.isArray(data.workflow)) return;
    target.innerHTML = data.workflow.map(function (step, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <span>' + escapeHtml(step.step || (index + 1)) + '</span>',
        '  <h3>' + escapeHtml(step.title || "Step") + '</h3>',
        '  <p>' + escapeHtml(step.summary || "") + '</p>',
        '</article>'
      ].join("");
    }).join("");
  }

  function initPublicationFilters() {
    var filterBar = document.querySelector('[data-humach-render="publication-filters"]');
    var grid = document.querySelector('[data-humach-render="publications-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-publication-filter]');
    var items = grid.querySelectorAll('[data-publication-tokens]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-publication-filter") || "all";
        buttons.forEach(function (btn) { btn.classList.remove("active"); });
        button.classList.add("active");
        items.forEach(function (item) {
          var tokens = item.getAttribute("data-publication-tokens") || "";
          var show = filter === "all" || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
        refreshAos();
      });
    });
  }

  function renderTeam(data) {
    var target = document.querySelector('[data-humach-render="team-preview"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.slice(0, 6).map(function (item, index) {
      var delay = 100 + index * 80;
      var memberSlug = item.slug || slugifyMemberUrl(item.name || item.id);
      var imageBlock = item.image
        ? '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">'
        : '<i class="bi bi-person-plus"></i>';
      return [
        '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + delay + '">',
        '  <div class="team-preview-card' + (item.image ? "" : " empty-profile") + '" data-content-id="' + escapeHtml(memberSlug) + '" data-member-id="' + escapeHtml(item.id) + '">',
             imageBlock,
        '    <h3>' + escapeHtml(item.name) + '</h3>',
        '    <p>' + escapeHtml(item.summary) + '</p>',
        '  </div>',
        '</div>'
      ].join("");
    }).join("");
  }


  function renderTeamPageSummary(data) {
    var target = document.querySelector('[data-humach-render="team-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var items = data.items;
    var groups = Array.isArray(data.groups) ? data.groups : [];
    var openCount = items.filter(function (item) {
      return String(item.status || "").toLowerCase().indexOf("open") !== -1 || String(item.status || "").toLowerCase().indexOf("recruiting") !== -1;
    }).length;
    target.innerHTML = [
      '<span>Team Structure</span>',
      '<strong>' + escapeHtml(items.length) + ' profile entries · ' + escapeHtml(groups.length) + ' contributor groups</strong>',
      '<p>' + escapeHtml(data.section && data.section.description ? data.section.description : 'HUMACH Research brings together contributors across research, development, training, and collaboration.') + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + escapeHtml(items.length) + '</b><small>Profiles</small></div>',
      '  <div><b>' + escapeHtml(groups.length) + '</b><small>Groups</small></div>',
      '  <div><b>' + escapeHtml(openCount || 'Open') + '</b><small>Join</small></div>',
      '</div>'
    ].join('');
  }

  function renderTeamFilters(data) {
    var target = document.querySelector('[data-humach-render="team-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [
      { key: 'all', label: 'All' },
      { key: 'leadership', label: 'Leadership' },
      { key: 'research', label: 'Research' },
      { key: 'development', label: 'Development' },
      { key: 'internship', label: 'Interns' },
      { key: 'alumni', label: 'Alumni' }
    ];
    target.innerHTML = filters.map(function (filter, index) {
      return '<button class="' + (index === 0 ? 'active' : '') + '" type="button" data-team-filter="' + escapeHtml(filter.key) + '">' + escapeHtml(filter.label) + '</button>';
    }).join('');
  }

  function getTeamFilterTokens(item) {
    var tokens = uniqueTokens([item.id, item.name, item.category, item.group, item.status, item.statusClass, item.role]);
    var joined = tokens.join(' ');
    if (joined.indexOf('students-interns') !== -1 || joined.indexOf('interns') !== -1 || joined.indexOf('internship') !== -1) tokens.push('internship');
    if (joined.indexOf('development') !== -1 || joined.indexOf('developer') !== -1 || joined.indexOf('software') !== -1) tokens.push('development');
    if (joined.indexOf('research') !== -1 || joined.indexOf('researcher') !== -1) tokens.push('research');
    if (joined.indexOf('leadership') !== -1 || joined.indexOf('lead') !== -1 || joined.indexOf('founder') !== -1) tokens.push('leadership');
    if (joined.indexOf('alumni') !== -1) tokens.push('alumni');
    return Array.from(new Set(tokens));
  }

  function renderTeamPageGrid(data) {
    var target = document.querySelector('[data-humach-render="team-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 80;
      var memberSlug = item.slug || slugifyMemberUrl(item.name || item.id);
      var tokens = getTeamFilterTokens(item).join(' ');
      var imageBlock = item.image
        ? '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">'
        : '<i class="bi bi-person-plus"></i>';
      var projects = Array.isArray(item.projects) && item.projects.length
        ? '<div class="team-list-block"><span>Connected Work</span><ul>' + item.projects.map(function (project) { return '<li>' + escapeHtml(project) + '</li>'; }).join('') + '</ul></div>'
        : '';
      var outputs = Array.isArray(item.outputs) && item.outputs.length
        ? '<div class="team-list-block"><span>Possible Outputs</span><ul>' + item.outputs.map(function (output) { return '<li>' + escapeHtml(output) + '</li>'; }).join('') + '</ul></div>'
        : '';
      return [
        '<div class="col-lg-4 col-md-6 team-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-team-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="team-detail-card' + (item.image ? '' : ' placeholder-profile') + '" id="' + escapeHtml(memberSlug) + '" data-content-id="' + escapeHtml(memberSlug) + '" data-member-id="' + escapeHtml(item.id) + '">',
        '    <div class="team-photo">' + imageBlock + '</div>',
        '    <div class="project-status ' + escapeHtml(item.statusClass || 'active') + '">' + escapeHtml(item.status || 'Active') + '</div>',
        '    <span>' + escapeHtml(formatAffiliation(item.group || item.category || 'Team', item.organization || 'HUMACH Research')) + '</span>',
        '    <h3>' + escapeHtml(item.name) + '</h3>',
        '    <strong class="team-role">' + escapeHtml(item.role || '') + '</strong>',
        '    <p>' + escapeHtml(item.summary || '') + '</p>',
             renderTags(item.interests, 'project-meta'),
             projects,
             outputs,
        '  </article>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderTeamGroups(data) {
    var target = document.querySelector('[data-humach-render="team-groups"]');
    if (!target || !data || !Array.isArray(data.groups)) return;
    target.innerHTML = data.groups.map(function (group, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <i class="' + escapeHtml(group.icon || 'bi bi-people') + '"></i>',
        '  <h3>' + escapeHtml(group.name) + '</h3>',
        '  <p>' + escapeHtml(group.summary || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function initTeamFilters() {
    var filterBar = document.querySelector('[data-humach-render="team-filters"]');
    var grid = document.querySelector('[data-humach-render="team-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-team-filter]');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      if (button.dataset.humachFilterReady === 'true') return;
      button.dataset.humachFilterReady = 'true';
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-team-filter') || 'all';
        var items = grid.querySelectorAll('[data-team-tokens]');
        buttons.forEach(function (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        items.forEach(function (item) {
          var tokens = item.getAttribute('data-team-tokens') || '';
          var show = filter === 'all' || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle('is-hidden', !show);
        });
        refreshAos();
      });
    });
  }

  function renderNews(data) {
    var target = document.querySelector('[data-humach-render="news-preview"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.slice(0, 3).map(function (item) {
      return [
        '<article class="news-mini-card" data-content-id="' + escapeHtml(item.id) + '">',
        '  <span>' + escapeHtml(item.type || "Update") + '</span>',
        '  <h3>' + escapeHtml(item.title) + '</h3>',
        '  <p>' + escapeHtml(item.summary) + '</p>',
        '  <time datetime="' + escapeHtml(item.date || "") + '">' + escapeHtml(item.date || "") + '</time>',
        '</article>'
      ].join("");
    }).join("");
  }


  function getNewsFilterTokens(item) {
    var tokens = [
      item.type,
      item.category,
      item.status,
      item.statusClass,
      item.audience
    ];
    if (item.date) tokens.push(String(item.date).slice(0, 4));
    if (Array.isArray(item.tags)) tokens = tokens.concat(item.tags);
    return tokens.map(normaliseFilterValue).filter(Boolean);
  }

  function renderNewsPageSummary(data) {
    var target = document.querySelector('[data-humach-render="news-page-summary"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var types = {};
    var openCount = 0;
    data.items.forEach(function (item) {
      if (item.type) types[item.type] = true;
      if (String(item.status || '').toLowerCase().indexOf('open') !== -1 || String(item.statusClass || '').toLowerCase().indexOf('recruiting') !== -1) openCount += 1;
    });
    target.innerHTML = [
      '<span>Update Stream</span>',
      '<strong>' + data.items.length + ' updates · ' + Object.keys(types).length + ' update types</strong>',
      '<p>' + escapeHtml((data.section && data.section.description) || 'Latest updates from HUMACH research, projects, opportunities, and outputs.') + '</p>',
      '<div class="research-summary-metrics">',
      '  <div><b>' + data.items.length + '</b><small>Updates</small></div>',
      '  <div><b>' + Object.keys(types).length + '</b><small>Types</small></div>',
      '  <div><b>' + openCount + '</b><small>Open</small></div>',
      '</div>'
    ].join('');
  }

  function renderNewsFilters(data) {
    var target = document.querySelector('[data-humach-render="news-filters"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    var filters = [{ label: 'All', value: 'all' }];
    var seen = { all: true };
    data.items.forEach(function (item) {
      [item.type, item.category, item.statusClass, item.status].concat(item.tags || []).forEach(function (value) {
        var token = normaliseFilterValue(value);
        if (!token || seen[token]) return;
        seen[token] = true;
        filters.push({ label: value, value: token });
      });
    });
    target.innerHTML = filters.slice(0, 18).map(function (filter, index) {
      return '<button class="' + (index === 0 ? 'active' : '') + '" type="button" data-news-filter="' + escapeHtml(filter.value) + '">' + escapeHtml(filter.label) + '</button>';
    }).join('');
  }

  function renderNewsLinks(links) {
    if (!Array.isArray(links) || !links.length) return '';
    return '<div class="publication-link-row news-link-row">' + links.map(function (link) {
      var label = link && link.label ? link.label : 'Link';
      var url = link && link.url ? link.url : '#';
      var external = /^https?:\/\//i.test(url);
      return '<a href="' + escapeHtml(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(label) + ' <i class="bi bi-arrow-up-right"></i></a>';
    }).join('') + '</div>';
  }

  function renderNewsPageGrid(data) {
    var target = document.querySelector('[data-humach-render="news-page-grid"]');
    if (!target || !data || !Array.isArray(data.items)) return;
    target.innerHTML = data.items.map(function (item, index) {
      var delay = 100 + (index % 6) * 70;
      var tokens = getNewsFilterTokens(item).join(' ');
      return [
        '<div class="col-lg-6 news-grid-item" data-aos="fade-up" data-aos-delay="' + delay + '" data-news-tokens="' + escapeHtml(tokens) + '">',
        '  <article class="news-detail-card' + (item.featured ? ' featured' : '') + '" id="' + escapeHtml(item.id) + '" data-content-id="' + escapeHtml(item.id) + '">',
        '    <div class="news-card-head">',
        '      <time datetime="' + escapeHtml(item.date || '') + '">' + escapeHtml(item.date || 'Date') + '</time>',
        '      <span>' + escapeHtml(item.type || 'Update') + '</span>',
        '    </div>',
        '    <div class="project-status ' + escapeHtml(item.statusClass || 'active') + '">' + escapeHtml(item.status || item.category || 'Update') + '</div>',
        '    <div class="project-type-line">' + escapeHtml(item.category || 'News') + (item.audience ? ' · ' + escapeHtml(item.audience) : '') + '</div>',
        '    <h3>' + escapeHtml(item.title) + '</h3>',
        '    <p>' + escapeHtml(item.summary || '') + '</p>',
        '    <div class="news-detail-copy">' + escapeHtml(item.details || 'More details will be added as the update develops.') + '</div>',
             renderTags(item.tags, 'project-meta'),
             renderNewsLinks(item.links),
        '  </article>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderNewsChannels(data) {
    var target = document.querySelector('[data-humach-render="news-channels"]');
    if (!target || !data || !Array.isArray(data.channels)) return;
    target.innerHTML = data.channels.map(function (channel, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <i class="' + escapeHtml(channel.icon || 'bi bi-megaphone') + '"></i>',
        '  <h3>' + escapeHtml(channel.name || 'Update Channel') + '</h3>',
        '  <p>' + escapeHtml(channel.summary || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderNewsWorkflow(data) {
    var target = document.querySelector('[data-humach-render="news-workflow"]');
    if (!target || !data || !Array.isArray(data.workflow)) return;
    target.innerHTML = data.workflow.map(function (step, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <span>' + escapeHtml(step.step || (index + 1)) + '</span>',
        '  <h3>' + escapeHtml(step.title || 'Step') + '</h3>',
        '  <p>' + escapeHtml(step.summary || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function initNewsFilters() {
    var filterBar = document.querySelector('[data-humach-render="news-filters"]');
    var grid = document.querySelector('[data-humach-render="news-page-grid"]');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('[data-news-filter]');
    var items = grid.querySelectorAll('[data-news-tokens]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-news-filter') || 'all';
        buttons.forEach(function (btn) { btn.classList.remove('active'); });
        button.classList.add('active');
        items.forEach(function (item) {
          var tokens = item.getAttribute('data-news-tokens') || '';
          var show = filter === 'all' || tokens.split(/\s+/).indexOf(filter) !== -1;
          item.classList.toggle('is-hidden', !show);
        });
        refreshAos();
      });
    });
  }


  function renderContactPageSummary(data) {
    var target = document.querySelector('[data-humach-render="contact-page-summary"]');
    if (!target || !data || !data.summary) return;
    var summary = data.summary;
    var metrics = Array.isArray(summary.metrics) ? summary.metrics : [];
    target.innerHTML = [
      '<span>' + escapeHtml(summary.label || 'Gateway') + '</span>',
      '<strong>' + escapeHtml(summary.headline || 'Research · Development · Internship · Collaboration') + '</strong>',
      '<p>' + escapeHtml(summary.description || '') + '</p>',
      '<div class="research-summary-metrics">' + metrics.map(function (metric) {
        return '<div><b>' + escapeHtml(metric.value || '') + '</b><small>' + escapeHtml(metric.label || '') + '</small></div>';
      }).join('') + '</div>'
    ].join('');
  }

  function renderContactLinks(links) {
    if (!Array.isArray(links) || !links.length) return '';
    return '<div class="publication-link-row">' + links.map(function (link) {
      var target = /^https?:\/\//.test(link.url || '') ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + escapeHtml(link.url || '#') + '"' + target + '>' + escapeHtml(link.label || 'Open') + ' <i class="bi bi-arrow-up-right"></i></a>';
    }).join('') + '</div>';
  }

  function renderContactInquiryGrid(data) {
    var target = document.querySelector('[data-humach-render="contact-inquiry-grid"]');
    if (!target || !data || !Array.isArray(data.inquiries)) return;
    target.innerHTML = data.inquiries.map(function (item, index) {
      var include = Array.isArray(item.include) ? item.include : [];
      return [
        '<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="' + (100 + index * 70) + '">',
        '  <article class="contact-inquiry-card' + (item.featured ? ' featured' : '') + '">',
        '    <div class="contact-card-icon"><i class="' + escapeHtml(item.icon || 'bi bi-chat-dots') + '"></i></div>',
        '    <span>' + escapeHtml(item.type || 'Inquiry') + '</span>',
        '    <h3>' + escapeHtml(item.title || 'Contact Pathway') + '</h3>',
        '    <p>' + escapeHtml(item.summary || '') + '</p>',
        include.length ? '<ul>' + include.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join('') + '</ul>' : '',
             renderContactLinks(item.links),
        '  </article>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderContactMethods(data) {
    var target = document.querySelector('[data-humach-render="contact-methods"]');
    if (!target || !data || !Array.isArray(data.methods)) return;
    target.innerHTML = data.methods.map(function (method, index) {
      var external = /^https?:\/\//.test(method.url || '') ? ' target="_blank" rel="noopener"' : '';
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <i class="' + escapeHtml(method.icon || 'bi bi-envelope') + '"></i>',
        '  <h3>' + escapeHtml(method.title || 'Contact Method') + '</h3>',
        '  <p>' + escapeHtml(method.summary || '') + '</p>',
        '  <a href="' + escapeHtml(method.url || '#') + '"' + external + '>' + escapeHtml(method.label || 'Open') + '</a>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderContactChecklist(data) {
    var target = document.querySelector('[data-humach-render="contact-checklist"]');
    if (!target || !data || !Array.isArray(data.checklist)) return;
    target.innerHTML = data.checklist.map(function (item) {
      return '<span><i class="bi bi-check2-circle"></i> ' + escapeHtml(item) + '</span>';
    }).join('');
  }

  function renderContactRoutes(data) {
    var target = document.querySelector('[data-humach-render="contact-routes"]');
    if (!target || !data || !Array.isArray(data.routes)) return;
    target.innerHTML = data.routes.map(function (route, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <span>' + escapeHtml(route.step || (index + 1)) + '</span>',
        '  <h3>' + escapeHtml(route.title || 'Route') + '</h3>',
        '  <p>' + escapeHtml(route.summary || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderContactProcess(data) {
    var target = document.querySelector('[data-humach-render="contact-process"]');
    if (!target || !data || !Array.isArray(data.process)) return;
    target.innerHTML = data.process.map(function (step, index) {
      return [
        '<article data-aos="fade-up" data-aos-delay="' + (100 + index * 80) + '">',
        '  <span>' + escapeHtml(step.step || (index + 1)) + '</span>',
        '  <h3>' + escapeHtml(step.title || 'Step') + '</h3>',
        '  <p>' + escapeHtml(step.summary || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function refreshAos() {
    if (window.AOS && typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  }

  var DATA_CACHE_PREFIX = "humach-data-cache:";
  var DATA_CACHE_VERSION = "2026-06-cv-awards-name-url-v1";
  var DATA_CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes

  function getCacheKey(path) {
    return DATA_CACHE_PREFIX + DATA_CACHE_VERSION + ":" + path;
  }

  function storageAvailable() {
    try {
      var key = DATA_CACHE_PREFIX + "test";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  var canUseStorage = storageAvailable();

  function readCachedJson(path, allowExpired) {
    if (!canUseStorage) return null;
    try {
      var raw = window.localStorage.getItem(getCacheKey(path));
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (!cached || !cached.timestamp || !cached.data) return null;
      var age = Date.now() - cached.timestamp;
      if (!allowExpired && age > DATA_CACHE_MAX_AGE) return null;
      return cached.data;
    } catch (error) {
      return null;
    }
  }

  function writeCachedJson(path, data) {
    if (!canUseStorage) return;
    try {
      window.localStorage.setItem(getCacheKey(path), JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (error) {
      // Cache storage can fail in private mode or when storage is full.
    }
  }

  function fetchJson(path) {
    return fetch(path, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error("Could not load " + path);
      return response.json();
    }).then(function (data) {
      writeCachedJson(path, data);
      return data;
    });
  }

  function loadJson(path) {
    var freshCached = readCachedJson(path, false);
    if (freshCached) {
      return Promise.resolve(freshCached);
    }

    return fetchJson(path).catch(function (error) {
      var staleCached = readCachedJson(path, true);
      if (staleCached) {
        console.warn("Using cached HUMACH data for", path, error);
        return staleCached;
      }
      throw error;
    });
  }

  function loadAllData() {
    var keys = Object.keys(DATA_PATHS);
    return Promise.all(keys.map(function (key) {
      return loadJson(DATA_PATHS[key]).then(function (data) {
        return [key, data];
      }).catch(function (error) {
        console.warn("HUMACH data file unavailable:", DATA_PATHS[key], error);
        return [key, null];
      });
    })).then(function (entries) {
      var data = {};
      entries.forEach(function (entry) {
        data[entry[0]] = entry[1];
      });
      return data;
    });
  }

  function safeRender(label, callback) {
    try {
      callback();
    } catch (error) {
      console.warn("HUMACH render skipped:", label, error);
    }
  }

  function initFallbackInteractions() {
    initDevelopmentFilters();
    initProjectFilters();
    initOpportunityFilters();
    initPublicationFilters();
    initTeamFilters();
    initNewsFilters();
  }

  function renderAll(data) {
    data = data || {};

    safeRender("section titles", function () {
      setSectionTitle("research", data.research);
      setSectionTitle("development", data.development);
      setSectionTitle("projects", data.projects);
      setSectionTitle("opportunities", data.opportunities);
      setSectionTitle("publications", data.publications);
      setSectionTitle("team", data.team);
      setSectionTitle("news", data.news);
      setSectionTitle("contact", data.contact);
    });

    safeRender("research", function () {
      renderResearch(data.research);
      renderResearchPageGrid(data.research);
      renderResearchTopicMap(data.research);
      renderResearchPageSummary(data.research);
    });

    safeRender("development", function () {
      renderDevelopment(data.development);
      renderDevelopmentPageSummary(data.development);
      renderDevelopmentFilters(data.development);
      renderDevelopmentPageGrid(data.development);
      renderDevelopmentStack(data.development);
      initDevelopmentFilters();
    });

    safeRender("projects", function () {
      renderProjects(data.projects);
      renderProjectsPageSummary(data.projects);
      renderProjectFilters(data.projects);
      renderProjectsPageGrid(data.projects);
      initProjectFilters();
    });

    safeRender("opportunities", function () {
      renderOpportunities(data.opportunities);
      renderOpportunityPageSummary(data.opportunities);
      renderOpportunityFilters(data.opportunities);
      renderOpportunitiesPageGrid(data.opportunities);
      renderOpportunityProcess(data.opportunities);
      renderOpportunitySkillMatrix(data.opportunities);
      initOpportunityFilters();
    });

    safeRender("publications", function () {
      renderPublications(data.publications);
      renderPublicationsPageSummary(data.publications);
      renderPublicationFilters(data.publications);
      renderPublicationsPageGrid(data.publications);
      renderPublicationTypes(data.publications);
      renderPublicationWorkflow(data.publications);
      initPublicationFilters();
    });

    safeRender("team", function () {
      renderTeam(data.team);
      renderTeamPageSummary(data.team);
      renderTeamFilters(data.team);
      renderTeamPageGrid(data.team);
      renderTeamGroups(data.team);
      initTeamFilters();
    });

    safeRender("news", function () {
      renderNews(data.news);
      renderNewsPageSummary(data.news);
      renderNewsFilters(data.news);
      renderNewsPageGrid(data.news);
      renderNewsChannels(data.news);
      renderNewsWorkflow(data.news);
      initNewsFilters();
    });

    safeRender("contact", function () {
      renderContactPageSummary(data.contact);
      renderContactInquiryGrid(data.contact);
      renderContactMethods(data.contact);
      renderContactChecklist(data.contact);
      renderContactRoutes(data.contact);
      renderContactProcess(data.contact);
    });

    initFallbackInteractions();
    document.body.classList.add("humach-data-loaded");
    refreshAos();
  }

  function showDataStatus(message, isError) {
    var status = document.querySelector('[data-humach-data-status]');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", !!isError);
  }

  window.HUMACHData = {
    paths: DATA_PATHS,
    load: loadAllData,
    loadJson: loadJson,
    render: renderAll,
    cache: {
      maxAgeMs: DATA_CACHE_MAX_AGE,
      version: DATA_CACHE_VERSION
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector("[data-humach-render]")) return;
    loadAllData()
      .then(function (data) {
        renderAll(data);
        showDataStatus("HUMACH content is ready.", false);
      })
      .catch(function (error) {
        console.warn("HUMACH data layer fallback:", error);
        initFallbackInteractions();
        showDataStatus("Some content could not be refreshed right now. Please try again later.", true);
      });
  });
})();
