/* ===================================================
   KERALA JEWELLERS — NAVBAR.JS
   Self-contained: injection, toggle, rates, lifecycle.
   No legacy selectors.
   =================================================== */
(function () {
  "use strict";

  var NAVBAR_HTML = "components/navbar/navbar.html";
  var CACHE_BUST = "v=3";

  /* --------------------------------------------------
     HELPERS
     -------------------------------------------------- */
  function getPrefix() {
    var p = window.location.pathname.replace(/\\/g, "/");
    return /\/(goldproducts|silverproducts|diamondproducts|post)\//.test(p) ? "../" : "";
  }

  function getMetal() {
    var p = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    var q = new URLSearchParams(window.location.search);
    var m = (q.get("metal") || q.get("type") || "").toLowerCase();
    if (p.includes("silver") || m.includes("silver")) return "silver";
    if (p.includes("coming-soon") || p.includes("platinum") || m.includes("platinum")) return "platinum";
    if (p.includes("diamond") || m.includes("diamond")) return "diamond";
    return "gold";
  }

  /* --------------------------------------------------
     RATE STATE — hide on diamond, reorder for metal
     -------------------------------------------------- */
  function applyRateState(html) {
    var metal = getMetal();
    var hideRate = metal === "diamond";

    document.documentElement.classList.toggle("kj-header--hide-rate", hideRate);
    document.body && document.body.classList.toggle("kj-header--hide-rate", hideRate);

    var t = document.createElement("template");
    t.innerHTML = html;

    var dd = t.content.querySelector("[data-kj-rate-dropdown]");
    if (!dd) return t.innerHTML;

    if (hideRate) {
      dd.hidden = true;
      return t.innerHTML;
    }

    var menu = dd.querySelector("[data-kj-rate-menu]");
    if (!menu) return t.innerHTML;

    var rows = Array.prototype.slice.call(menu.querySelectorAll(".kj-header__rate-row"));
    if (!rows.length) return t.innerHTML;

    var primary = rows.find(function (r) { return r.dataset.kjMetal === metal; }) || rows[0];
    var prefix = getPrefix();

    // Update trigger
    var label = dd.querySelector(".kj-header__rate-label");
    var coin = dd.querySelector(".kj-header__rate-btn .kj-header__coin");
    var srcLabel = primary.querySelector("[data-kj-rate-label]");

    if (label && srcLabel) {
      label.textContent = srcLabel.textContent;
      label.dataset.kjRateType = primary.dataset.kjRateType;
    }
    if (coin) {
      var srcCoin = primary.querySelector(".kj-header__coin");
      if (srcCoin) coin.setAttribute("src", prefix + srcCoin.getAttribute("src"));
    }

    // Reorder rows — primary first
    var others = rows.filter(function (r) { return r !== primary; });
    menu.innerHTML = "";
    menu.appendChild(primary);
    others.forEach(function (r) { menu.appendChild(r); });

    return t.innerHTML;
  }

  /* --------------------------------------------------
     MOBILE HAMBURGER
     -------------------------------------------------- */
  function wireHamburger() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".kj-header__hamburger");
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      var header = btn.closest(".kj-header__mobile");
      var menu = header && header.querySelector("[data-kj-mobile-menu]");
      if (!menu) return;

      var open = menu.classList.contains("is-open");
      menu.classList.toggle("is-open", !open);
      btn.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    }, true);
  }

  /* --------------------------------------------------
     RATE DROPDOWN TOGGLE
     -------------------------------------------------- */
  function wireRateDropdown() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".kj-header__rate-btn");
      if (!btn) return;
      e.stopPropagation();

      var item = btn.closest(".kj-header__item--rate");
      if (!item) return;
      item.classList.toggle("is-open");
    }, true);

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".kj-header__item--rate")) {
        document.querySelectorAll(".kj-header__item--rate.is-open").forEach(function (el) {
          el.classList.remove("is-open");
        });
      }
    });
  }

  /* --------------------------------------------------
     RESET MOBILE ON DESKTOP RESIZE
     -------------------------------------------------- */
  function wireResize() {
    var handler = function () {
      if (window.innerWidth >= 992) {
        document.querySelectorAll(".kj-header__mobile-menu.is-open").forEach(function (m) {
          m.classList.remove("is-open");
        });
        document.querySelectorAll(".kj-header__hamburger.is-open").forEach(function (b) {
          b.classList.remove("is-open");
          b.setAttribute("aria-expanded", "false");
        });
      }
    };
    window.addEventListener("resize", handler);
  }

  /* --------------------------------------------------
     RATE CLICK INTERCEPT
     -------------------------------------------------- */
  function wireRateClick() {
    document.addEventListener("click", function (e) {
      if (e.target.closest(".kj-header__rate-row")) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  }

  /* --------------------------------------------------
     INIT
     -------------------------------------------------- */
  function init() {
    wireHamburger();
    wireRateDropdown();
    wireRateClick();
    wireResize();
  }

  /* --------------------------------------------------
     LOAD + INJECT
     -------------------------------------------------- */
  async function load() {
    var mount = document.getElementById("kj-header");
    if (!mount) return;

    var prefix = getPrefix();

    try {
      var res = await fetch(prefix + NAVBAR_HTML + "?" + CACHE_BUST);
      if (!res.ok) throw new Error("Fetch failed: " + res.status);

      var html = await res.text();

      // Rewrite paths for subfolders
      if (prefix) {
        html = html.replace(
          /(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)([^"]+)"/g,
          '$1="' + prefix + '$2"'
        );
        html = html.replace(/srcset="([^"]+)"/g, function (_, c) {
          return 'srcset="' + c.split(",").map(function (p) {
            p = p.trim();
            return p && !p.startsWith("http") && !p.startsWith("/") && !p.startsWith("../")
              ? prefix + p : p;
          }).join(", ") + '"';
        });
      }

      html = applyRateState(html);
      mount.innerHTML = html;

      init();

      // Signal to other scripts
      window.dispatchEvent(new CustomEvent("kerala:header-loaded"));
    } catch (err) {
      console.error("Navbar error:", err);
    }
  }

  /* --------------------------------------------------
     BOOT
     -------------------------------------------------- */
  if (!window.__kjNavInit) {
    window.__kjNavInit = true;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", load);
    } else {
      load();
    }
  }
})();
