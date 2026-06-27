/**
 * HUMACH member CV detail system
 * Adds CV/detail links to team cards and renders member-details.html#member-name from JSON data.
 */
(function () {
  "use strict";

  var PATHS = {
    team: "data/team.json",
    memberCv: "data/member-cv.json",
    projects: "data/projects.json",
    publications: "data/publications.json"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function slugify(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "member";
  }

  function getMemberUrlKey() {
    var hash = window.location.hash ? decodeURIComponent(window.location.hash.replace(/^#/, "")) : "";
    return hash || getQueryParam("member") || getQueryParam("id") || "";
  }

  function ensureNameBasedHash(memberSlug) {
    if (!memberSlug || !window.history || typeof window.history.replaceState !== "function") return;
    if (window.location.hash.replace(/^#/, "") === memberSlug) return;
    window.history.replaceState(null, "", window.location.pathname + "#" + encodeURIComponent(memberSlug));
  }

  function loadJson(path) {
    if (window.HUMACHData && typeof window.HUMACHData.loadJson === "function") {
      return window.HUMACHData.loadJson(path);
    }

    return fetch(path, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error("Could not load " + path);
      return response.json();
    });
  }

  function loadCvData() {
    return Promise.all([
      loadJson(PATHS.team),
      loadJson(PATHS.memberCv),
      loadJson(PATHS.projects),
      loadJson(PATHS.publications)
    ]).then(function (results) {
      return {
        team: results[0],
        memberCv: results[1],
        projects: results[2],
        publications: results[3]
      };
    });
  }

  function itemById(items, id) {
    if (!Array.isArray(items)) return null;
    return items.find(function (item) { return item && item.id === id; }) || null;
  }

  function memberByKey(items, key) {
    if (!Array.isArray(items)) return null;
    var normalised = slugify(key);
    return items.find(function (item) {
      if (!item) return false;
      return item.id === key ||
        item.slug === key ||
        slugify(item.name) === normalised ||
        slugify(item.id) === normalised ||
        slugify(item.slug) === normalised;
    }) || null;
  }

  function cvByMember(items, member, key) {
    if (!Array.isArray(items) || !member) return null;
    var normalised = slugify(key || member.slug || member.name || member.id);
    return items.find(function (item) {
      if (!item) return false;
      return item.memberId === member.id ||
        item.slug === member.slug ||
        slugify(item.slug) === normalised ||
        slugify(item.memberId) === normalised;
    }) || null;
  }

  function renderTags(tags, className) {
    if (!Array.isArray(tags) || !tags.length) return "";
    return '<div class="' + (className || "project-meta") + '">' + tags.map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join("") + '</div>';
  }

  function renderLinks(links) {
    if (!Array.isArray(links) || !links.length) return "";
    return '<div class="publication-link-row cv-link-row">' + links.map(function (link) {
      var label = link && link.label ? link.label : "Link";
      var url = link && link.url ? link.url : "#";
      var external = /^https?:\/\//i.test(url);
      return '<a href="' + escapeHtml(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(label) + ' <i class="bi bi-arrow-up-right"></i></a>';
    }).join("") + '</div>';
  }

  function formatAffiliation(group, organization) {
    var parts = [];
    if (group) parts.push(group);
    if (organization) parts.push(organization);
    if (!parts.length) parts.push("HUMACH Research");
    return parts.join(", ");
  }

  function renderEntryList(entries, emptyText) {
    if (!Array.isArray(entries) || !entries.length) {
      return '<article class="cv-entry"><p>' + escapeHtml(emptyText || "No entries have been added yet.") + '</p></article>';
    }
    return entries.map(function (entry) {
      return [
        '<article class="cv-entry">',
        '  <div class="cv-entry-head">',
        '    <h3>' + escapeHtml(entry.title || "Entry") + '</h3>',
        '    <span>' + escapeHtml(entry.period || entry.year || "") + '</span>',
        '  </div>',
        entry.institution || entry.organization || entry.provider ? '  <strong>' + escapeHtml(entry.institution || entry.organization || entry.provider) + '</strong>' : '',
        '  <p>' + escapeHtml(entry.details || entry.summary || "") + '</p>',
        renderTags(entry.tags, "project-meta"),
        renderLinks(entry.links),
        '</article>'
      ].join("");
    }).join("");
  }

  function renderProjectCards(projects, ids) {
    var selected = Array.isArray(ids) ? ids.map(function (id) {
      return itemById(projects, id);
    }).filter(Boolean) : [];
    if (!selected.length) {
      return '<article class="cv-entry"><p>No linked project records have been added yet.</p></article>';
    }
    return selected.map(function (project) {
      return [
        '<article class="cv-linked-card">',
        '  <div class="project-status ' + escapeHtml(project.statusClass || "active") + '">' + escapeHtml(project.status || "Project") + '</div>',
        '  <div class="project-type-line">' + escapeHtml(project.category || "Project") + ' · ' + escapeHtml(project.type || "") + '</div>',
        '  <h3>' + escapeHtml(project.title || "Project") + '</h3>',
        '  <p>' + escapeHtml(project.summary || "") + '</p>',
        renderTags(project.tags, "project-meta"),
        Array.isArray(project.outputs) && project.outputs.length ? '<div class="team-list-block"><span>Outputs</span><ul>' + project.outputs.map(function (output) { return '<li>' + escapeHtml(output) + '</li>'; }).join("") + '</ul></div>' : '',
        renderLinks(project.links),
        '</article>'
      ].join("");
    }).join("");
  }

  function renderPublicationCards(publications, ids) {
    var selected = Array.isArray(ids) ? ids.map(function (id) {
      return itemById(publications, id);
    }).filter(Boolean) : [];
    if (!selected.length) {
      return '<article class="cv-entry"><p>No linked publication records have been added yet.</p></article>';
    }
    return selected.map(function (publication) {
      var authors = Array.isArray(publication.authors) ? publication.authors.join(", ") : "";
      return [
        '<article class="cv-linked-card publication-cv-card">',
        '  <div class="project-status ' + escapeHtml(publication.statusClass || "planned") + '">' + escapeHtml(publication.status || publication.type || "Publication") + '</div>',
        '  <div class="project-type-line">' + escapeHtml(publication.type || "Output") + ' · ' + escapeHtml(publication.year || "Year") + '</div>',
        '  <h3>' + escapeHtml(publication.title || "Publication") + '</h3>',
        authors ? '  <p class="publication-authors">' + escapeHtml(authors) + '</p>' : '',
        '  <p>' + escapeHtml(publication.summary || "") + '</p>',
        publication.venue ? '  <div class="cv-mini-line"><strong>Venue:</strong> ' + escapeHtml(publication.venue) + '</div>' : '',
        renderTags(publication.tags, "project-meta"),
        renderLinks(publication.links),
        '</article>'
      ].join("");
    }).join("");
  }

  function renderCurrentRole(member) {
    return [
      '<article class="cv-entry current-role-entry">',
      '  <div class="cv-entry-head">',
      '    <h3>' + escapeHtml(member.role || "Current Role") + '</h3>',
      '    <span>' + escapeHtml(member.status || "Current") + '</span>',
      '  </div>',
      '  <strong>' + escapeHtml(formatAffiliation(member.group, member.organization || "HUMACH Research")) + '</strong>',
      '  <p>' + escapeHtml(member.summary || "") + '</p>',
      renderTags(member.interests, "project-meta"),
      '</article>'
    ].join("");
  }

  function renderCvNotes(notes) {
    if (!Array.isArray(notes) || !notes.length) return "";
    return '<aside class="cv-note-box"><h2>CV Data Notes</h2><ul>' + notes.map(function (note) {
      return '<li>' + escapeHtml(note) + '</li>';
    }).join("") + '</ul></aside>';
  }

  function renderMemberCv(data) {
    var root = document.querySelector('[data-humach-render="member-cv"]');
    if (!root) return;

    var teamItems = data.team && Array.isArray(data.team.items) ? data.team.items : [];
    var cvItems = data.memberCv && Array.isArray(data.memberCv.items) ? data.memberCv.items : [];
    var requestedKey = getMemberUrlKey();
    var member = memberByKey(teamItems, requestedKey) || teamItems[0];
    var memberSlug = slugify((member && (member.slug || member.name || member.id)) || requestedKey);
    var cv = cvByMember(cvItems, member, requestedKey || memberSlug) || {};
    ensureNameBasedHash(memberSlug);

    if (!member) {
      root.innerHTML = [
        '<section class="section member-cv-shell">',
        '  <div class="container">',
        '    <div class="cv-not-found">',
        '      <h1>Member profile not found</h1>',
        '      <p>The requested member profile could not be found.</p>',
        '      <a class="btn-humach btn-humach-primary" href="team.html">Back to Team</a>',
        '    </div>',
        '  </div>',
        '</section>'
      ].join("");
      return;
    }

    var imageBlock = member.image
      ? '<img src="' + escapeHtml(member.image) + '" alt="' + escapeHtml(member.name) + '">'
      : '<i class="bi bi-person-badge"></i>';
    var currentRole = renderCurrentRole(member);
    var extraExperience = renderEntryList(cv.professionalExperience, "No additional professional experience records have been added yet.");
    var title = member.name ? member.name + " | HUMACH Member CV" : "HUMACH Member CV";
    document.title = title;

    root.innerHTML = [
      '<section class="member-cv-hero dark-background">',
      '  <div aria-hidden="true" class="hero-grid"></div>',
      '  <div class="container">',
      '    <nav aria-label="Breadcrumb" class="humach-breadcrumb cv-no-print"><ol><li><a href="index.html#hero">Home</a></li><li><a href="team.html">Team</a></li><li>' + escapeHtml(member.name) + '</li></ol></nav>',
      '    <div class="member-cv-head">',
      '      <div class="member-cv-photo ' + (member.image ? '' : 'placeholder-profile') + '">' + imageBlock + '</div>',
      '      <div class="member-cv-title-block">',
      '        <span class="section-kicker">Printable Member CV</span>',
      '        <h1>' + escapeHtml(member.name) + '</h1>',
      '        <strong>' + escapeHtml(member.role || '') + '</strong>',
      '        <p>' + escapeHtml(cv.headline || member.summary || '') + '</p>',
      '        ' + renderTags(member.interests, "project-meta") + '',
      '      </div>',
      '      <div class="member-cv-actions cv-no-print">',
      '        <button class="btn-humach btn-humach-primary" type="button" data-member-print><i class="bi bi-printer"></i> Print CV</button>',
      '        <a class="btn-humach btn-humach-outline" href="team.html#' + escapeHtml(memberSlug) + '"><i class="bi bi-arrow-left"></i> Back to Team</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      '<section class="section member-cv-shell">',
      '  <div class="container">',
      '    <div class="cv-print-header">',
      '      <h1>' + escapeHtml(member.name) + '</h1>',
      '      <p>' + escapeHtml(member.role || '') + ' · HUMACH Research</p>',
      '    </div>',
      '    <div class="cv-section-grid">',
      '      <aside class="cv-sidebar">',
      '        <div class="cv-side-card">',
      '          <h2>Profile Summary</h2>',
      '          <p>' + escapeHtml(member.summary || '') + '</p>',
      '          <div class="cv-mini-line"><strong>Group:</strong> ' + escapeHtml(formatAffiliation(member.group, member.organization || 'HUMACH Research')) + '</div>',
      '          <div class="cv-mini-line"><strong>Status:</strong> ' + escapeHtml(member.status || '') + '</div>',
      '          <div class="cv-mini-line"><strong>Profile:</strong> #' + escapeHtml(memberSlug || '') + '</div>',
      '        </div>',
      '        <div class="cv-side-card">',
      '          <h2>Focus Areas</h2>',
      '          ' + renderTags(member.interests, "project-meta cv-stacked-tags") + '',
      '        </div>',
      '        ',
      '      </aside>',
      '      <div class="cv-main">',
      '        <section class="cv-section" id="academic-info"><h2><i class="bi bi-mortarboard"></i> Academic Info</h2>' + renderEntryList(cv.academicInfo, "Academic information has not been added yet.") + '</section>',
      '        <section class="cv-section" id="professional-experience"><h2><i class="bi bi-briefcase"></i> Professional Experience</h2>' + currentRole + extraExperience + '</section>',
      '        <section class="cv-section" id="awards-achievements"><h2><i class="bi bi-trophy"></i> Awards and Achievements</h2>' + renderEntryList(cv.awardsAchievements, "No award or achievement records have been added yet.") + '</section>',
      '        <section class="cv-section" id="member-projects"><h2><i class="bi bi-kanban"></i> Projects</h2>' + renderProjectCards(data.projects && data.projects.items, cv.projectIds) + '</section>',
      '        <section class="cv-section" id="member-publications"><h2><i class="bi bi-journal-text"></i> Publications</h2>' + renderPublicationCards(data.publications && data.publications.items, cv.publicationIds) + '</section>',
      '        <section class="cv-section" id="certificates-courses"><h2><i class="bi bi-award"></i> Certificates and Courses</h2>' + renderEntryList(cv.certificatesCourses, "No certificate or course records have been added yet.") + '</section>',
      '        <section class="cv-section" id="extracurricular"><h2><i class="bi bi-stars"></i> Extracurricular Activity</h2>' + renderEntryList(cv.extracurricularActivities, "No extracurricular activity records have been added yet.") + '</section>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join("");

    var printButton = root.querySelector('[data-member-print]');
    if (printButton) {
      printButton.addEventListener("click", function () { window.print(); });
    }
    if (window.AOS && typeof window.AOS.refresh === "function") window.AOS.refresh();
  }

  function addDetailsLinksToCards() {
    var cards = document.querySelectorAll('.team-detail-card[data-content-id], .team-preview-card[data-content-id]');
    cards.forEach(function (card) {
      if (card.querySelector('.member-cv-link')) return;
      var id = card.getAttribute('data-content-id');
      if (!id) return;
      var link = document.createElement('a');
      link.className = 'member-cv-link';
      link.href = 'member-details.html#' + encodeURIComponent(id);
      link.innerHTML = '<i class="bi bi-file-earmark-person"></i> Details / CV';
      card.appendChild(link);
    });
  }

  function observeTeamCards() {
    if (!document.querySelector('[data-humach-render="team-page-grid"], [data-humach-render="team-preview"]')) return;
    addDetailsLinksToCards();
    var observer = new MutationObserver(addDetailsLinksToCards);
    document.querySelectorAll('[data-humach-render="team-page-grid"], [data-humach-render="team-preview"]').forEach(function (target) {
      observer.observe(target, { childList: true, subtree: true });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    observeTeamCards();
    if (document.querySelector('[data-humach-render="member-cv"]')) {
      loadCvData()
        .then(renderMemberCv)
        .catch(function (error) {
          console.warn("HUMACH member CV fallback:", error);
          var root = document.querySelector('[data-humach-render="member-cv"]');
          if (root) {
            root.innerHTML = '<section class="section member-cv-shell"><div class="container"><div class="cv-not-found"><h1>CV data could not be loaded</h1><p>Please try again later or contact HUMACH Research for assistance.</p></div></div></section>';
          }
        });
    }
  });
})();
