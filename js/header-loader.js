(async function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const isSubfolder = window.location.pathname.split("/").length > 2;
  const prefix = isSubfolder ? "../" : "";
  const METAL_RATES = [
    { shortLabel: "GOLD 22 KT/1g - Rs. 13665", icon: "assets/coin/gold coin.png", metal: "gold" },
    { shortLabel: "GOLD 18 KT/1g - Rs. 11610", icon: "assets/coin/gold coin.png", metal: "gold" },
    { shortLabel: "PLATINUM 1g - Rs. 5248", icon: "assets/coin/Platinum Coin.png", metal: "platinum" },
    { shortLabel: "SILVER 1g - Rs. 270", icon: "assets/coin/silver coin.png", metal: "silver" }
  ];
  const getCurrentMetal = () => {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const category = (params.get("metal") || params.get("type") || "").toLowerCase();

    if (path.includes("silver") || category.includes("silver")) return "silver";
    if (path.includes("coming-soon") || path.includes("platinum") || category.includes("platinum")) return "platinum";
    if (path.includes("diamond") || category.includes("diamond")) return "diamond";
    return "gold";
  };
  const getOrderedRates = () => {
    const currentMetal = getCurrentMetal();
    if (currentMetal === "diamond") return [];
    return [
      ...METAL_RATES.filter((rate) => rate.metal === currentMetal),
      ...METAL_RATES.filter((rate) => rate.metal !== currentMetal)
    ];
  };
  const applyInitialRateState = (html) => {
    const currentMetal = getCurrentMetal();
    const shouldHideRate = currentMetal === "diamond";

    document.documentElement.classList.toggle("kj-hide-rate-dropdown", shouldHideRate);
    document.body?.classList.toggle("kj-hide-rate-dropdown", shouldHideRate);

    const template = document.createElement("template");
    template.innerHTML = html;
    const dropdown = template.content.querySelector(".rate-dropdown");
    if (!dropdown) return html;

    if (shouldHideRate) {
      dropdown.hidden = true;
      dropdown.classList.add("kj-rate-hidden");
      return template.innerHTML;
    }

    const orderedRates = getOrderedRates();
    const primaryRate = orderedRates[0] || METAL_RATES[0];
    const triggerText = dropdown.querySelector(".rate-toggle span");
    const triggerImage = dropdown.querySelector(".rate-toggle img");
    const menu = dropdown.querySelector(".rate-menu");

    dropdown.setAttribute("data-kj-rate-order", currentMetal);
    if (triggerText) triggerText.textContent = primaryRate.shortLabel;
    if (triggerImage) triggerImage.setAttribute("src", prefix + primaryRate.icon);
    if (menu) {
      menu.innerHTML = orderedRates.map((rate) => `
        <button class="rate-row" type="button" role="menuitem" tabindex="-1" aria-disabled="true" data-metal="${rate.metal}" data-label="${rate.shortLabel}">
          <img src="${prefix}${rate.icon}" alt="" class="rate-coin" loading="eager" decoding="async" fetchpriority="high">
          <span>${rate.shortLabel}</span>
        </button>
      `).join("");
    }

    return template.innerHTML;
  };

  try {
    const response = await fetch(prefix + "partials/header.html?v=26");
    if (!response.ok) {
      throw new Error("Header fetch failed: " + response.status);
    }

    let html = await response.text();

    if (prefix) {
      html = html.replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)([^"]+)"/g, `$1="${prefix}$2"`);
      html = html.replace(/srcset="([^"]+)"/g, (_, contents) => {
        return 'srcset="' + contents.split(',').map(part => {
          part = part.trim();
          return (part && !part.startsWith('http') && !part.startsWith('/') && !part.startsWith('../')) ? prefix + part : part;
        }).join(', ') + '"';
      });
    }

    html = applyInitialRateState(html);
    mount.innerHTML = html;
    window.dispatchEvent(new CustomEvent("kerala:header-loaded"));
  } catch (error) {
    console.error("Header loader error:", error);
  }
})();
