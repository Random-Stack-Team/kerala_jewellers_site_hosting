/* ===================================================
   KERALA JEWELLERS — NAVBAR.JS
   Self-contained navbar: injection, toggle, rates
   =================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------
     CONFIGURATION
     -------------------------------------------------- */
  var NAVBAR_HTML_PATH = "components/navbar/navbar.html";
  var NAVBAR_VERSION = "v=2";

  /* --------------------------------------------------
     HELPERS
     -------------------------------------------------- */
  function getAssetPrefix() {
    var path = window.location.pathname.replace(/\\/g, "/");
    return /\/(goldproducts|silverproducts|diamondproducts|post)\//.test(path)
      ? "../"
      : "";
  }

  function getCurrentMetal() {
    var path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    var params = new URLSearchParams(window.location.search);
    var category = (params.get("metal") || params.get("type") || "").toLowerCase();

    if (path.includes("silver") || category.includes("silver")) return "silver";
    if (
      path.includes("coming-soon") ||
      path.includes("platinum") ||
      category.includes("platinum")
    )
      return "platinum";
    if (path.includes("diamond") || category.includes("diamond")) return "diamond";
    return "gold";
  }

  /* --------------------------------------------------
     RATE STATE — hide on diamond, reorder for metal
     -------------------------------------------------- */
  function applyInitialRateState(html) {
    var currentMetal = getCurrentMetal();
    var shouldHideRate = currentMetal === "diamond";

    document.documentElement.classList.toggle(
      "kj-hide-rate-dropdown",
      shouldHideRate
    );
    document.body &&
      document.body.classList.toggle("kj-hide-rate-dropdown", shouldHideRate);

    var template = document.createElement("template");
    template.innerHTML = html;

    var dropdown = template.content.querySelector(".rate-dropdown");
    if (!dropdown) return template.innerHTML;

    if (shouldHideRate) {
      dropdown.hidden = true;
      dropdown.classList.add("kj-rate-hidden");
      return template.innerHTML;
    }

    var menu = dropdown.querySelector(".rate-menu");
    if (menu) {
      var rows = Array.prototype.slice.call(menu.querySelectorAll(".rate-row"));
      if (rows.length > 0) {
        var primaryRow = null;
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].dataset.metal === currentMetal) {
            primaryRow = rows[i];
            break;
          }
        }
        if (!primaryRow) {
          for (var j = 0; j < rows.length; j++) {
            if (rows[j].dataset.metal === "gold") {
              primaryRow = rows[j];
              break;
            }
          }
          if (!primaryRow) primaryRow = rows[0];
        }

        var prefix = getAssetPrefix();
        var triggerText = dropdown.querySelector(".rate-toggle span");
        var triggerImage = dropdown.querySelector(".rate-toggle img");

        dropdown.setAttribute("data-kj-rate-order", currentMetal);

        if (triggerText) {
          var primaryLabelSpan = primaryRow.querySelector("[data-rate-label]");
          triggerText.textContent = primaryLabelSpan
            ? primaryLabelSpan.textContent
            : "";
          triggerText.setAttribute("data-rate-type", primaryRow.dataset.rateType);
        }

        if (triggerImage) {
          var primaryImg = primaryRow.querySelector("img");
          if (primaryImg) {
            triggerImage.setAttribute(
              "src",
              prefix + primaryImg.getAttribute("src")
            );
          }
        }

        // Reorder rows so current metal is first
        if (currentMetal !== "diamond") {
          var otherRows = rows.filter(function (r) {
            return r !== primaryRow;
          });
          menu.innerHTML = "";
          menu.appendChild(primaryRow);
          otherRows.forEach(function (r) {
            menu.appendChild(r);
          });
        }
      }
    }

    return template.innerHTML;
  }

  /* --------------------------------------------------
     RATE SELECTION — click handler
     -------------------------------------------------- */
  var _rateWired = false;

  function wireRateSelection() {
    if (_rateWired) return;
    _rateWired = true;

    document.addEventListener(
      "click",
      function (event) {
        var item = event.target.closest(".rate-row, .rate-item");
        if (!item) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true
    );
  }

  /* --------------------------------------------------
     MOBILE MENU TOGGLE
     -------------------------------------------------- */
  function wireMobileToggle() {
    document.addEventListener(
      "click",
      function (event) {
        var button = event.target.closest(
          ".mobile-menu-toggle.mobile-menu-button"
        );
        if (!button) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        var header = button.closest(".mobile-header");
        var panel = header
          ? header.querySelector(".mobile-nav.site-nav__panel")
          : document.querySelector(".mobile-nav.site-nav__panel");

        if (!panel) return;

        if (panel.classList.contains("is-open")) {
          panel.classList.remove("is-open");
          button.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
        } else {
          panel.classList.add("is-open");
          button.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      },
      true
    );
  }

  /* --------------------------------------------------
     RATE DROPDOWN TOGGLE (click on mobile)
     -------------------------------------------------- */
  function wireRateDropdown() {
    document.addEventListener(
      "click",
      function (event) {
        var toggle = event.target.closest(".rate-toggle");
        if (!toggle) return;

        var dropdown = toggle.closest(".rate-dropdown");
        if (!dropdown) return;

        event.stopPropagation();

        var isOpen = dropdown.classList.contains("is-open");
        dropdown.classList.toggle("is-open", !isOpen);
      },
      true
    );

    // Close rate dropdown on outside click
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".rate-dropdown")) {
        document
          .querySelectorAll(".rate-dropdown.is-open")
          .forEach(function (dd) {
            dd.classList.remove("is-open");
          });
      }
    });
  }

  /* --------------------------------------------------
     RESET MOBILE MENU ON DESKTOP RESIZE
     -------------------------------------------------- */
  function resetMobileMenuOnDesktop() {
    if (window.innerWidth >= 992) {
      document
        .querySelectorAll(".mobile-nav.site-nav__panel.is-open")
        .forEach(function (panel) {
          panel.classList.remove("is-open");
        });

      document
        .querySelectorAll(".mobile-menu-toggle.mobile-menu-button.is-open")
        .forEach(function (button) {
          button.classList.remove("is-open");
          button.setAttribute("aria-expanded", "false");
        });
    }
  }

  /* --------------------------------------------------
     INITIALIZE
     -------------------------------------------------- */
  function initNavbar() {
    wireMobileToggle();
    wireRateSelection();
    wireRateDropdown();
    resetMobileMenuOnDesktop();
    window.addEventListener("resize", resetMobileMenuOnDesktop);
  }

  /* --------------------------------------------------
     LOAD & INJECT NAVBAR
     -------------------------------------------------- */
  async function loadNavbar() {
    var mount = document.getElementById("site-header");
    if (!mount) return;

    var prefix = getAssetPrefix();

    try {
      var response = await fetch(
        prefix + NAVBAR_HTML_PATH + "?" + NAVBAR_VERSION
      );
      if (!response.ok) throw new Error("Navbar fetch failed: " + response.status);

      var html = await response.text();

      // Rewrite paths for subfolder pages
      if (prefix) {
        html = html.replace(
          /(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)([^"]+)"/g,
          '$1="' + prefix + '$2"'
        );
        html = html.replace(/srcset="([^"]+)"/g, function (_, contents) {
          return (
            'srcset="' +
            contents
              .split(",")
              .map(function (part) {
                part = part.trim();
                return part &&
                  !part.startsWith("http") &&
                  !part.startsWith("/") &&
                  !part.startsWith("../")
                  ? prefix + part
                  : part;
              })
              .join(", ") +
            '"'
          );
        });
      }

      html = applyInitialRateState(html);
      mount.innerHTML = html;

      // Initialize navbar interactions
      initNavbar();

      // Dispatch event for other scripts (app.js, rates.js)
      window.dispatchEvent(new CustomEvent("kerala:header-loaded"));
    } catch (error) {
      console.error("Navbar loader error:", error);
    }
  }

  /* --------------------------------------------------
     BOOT
     -------------------------------------------------- */
  if (!window.__kjNavbarBound) {
    window.__kjNavbarBound = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadNavbar);
    } else {
      loadNavbar();
    }
  }
})();
