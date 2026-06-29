(function () {
  const RATE_VERSION = "kj-rates-20260627";
  const RATE_SOURCE = "data/rates.json";
  let ratesCache = null;

  function getAssetPrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    return /\/(goldproducts|silverproducts|diamondproducts|post)\//.test(path) ? "../" : "";
  }

  function getFormattedDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}.${minutes} ${ampm}`;
  }

  function normalizeRate(value) {
    return String(value || "").replace(/[^\d.,-]/g, "").trim();
  }

  function getRateNumber(value) {
    const parsed = parseFloat(normalizeRate(value).replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function getRateLabel(type, rates) {
    const labels = {
      gold22: `GOLD 22 KT/1g - ₹${normalizeRate(rates.gold22)}`,
      gold18: `GOLD 18 KT/1g - ₹${normalizeRate(rates.gold18)}`,
      platinum: `PLATINUM 1g - ₹${normalizeRate(rates.platinum)}`,
      silver: `SILVER 1g - ₹${normalizeRate(rates.silver)}`,
      diamond: rates.diamond ? `DIAMOND - ₹${normalizeRate(rates.diamond)}` : "",
    };
    return labels[type] || "";
  }

  function updateDesktopRateDropdown(rates) {
    // New selectors
    document.querySelectorAll(".kj-header__rate-row[data-kj-rate-type]").forEach((row) => {
      const label = getRateLabel(row.dataset.kjRateType, rates);
      const spans = row.querySelectorAll("[data-kj-rate-label]");
      spans.forEach((s) => { s.textContent = label; });
      row.dataset.label = label;
    });

    document.querySelectorAll(".kj-header__rate-label[data-kj-rate-type]").forEach((el) => {
      el.textContent = getRateLabel(el.dataset.kjRateType, rates);
    });

    // Legacy fallback selectors
    document.querySelectorAll(".rate-option[data-rate-type], .rate-row[data-rate-type]").forEach((row) => {
      const label = getRateLabel(row.dataset.rateType, rates);
      row.querySelectorAll("[data-rate-label]").forEach((s) => { s.textContent = label; });
      row.dataset.label = label;
    });

    document.querySelectorAll(".rate-btn [data-rate-type], .rate-toggle [data-rate-type]").forEach((el) => {
      el.textContent = getRateLabel(el.dataset.rateType, rates);
    });
  }

  function updateMobileRateStrip(rates) {
    const parts = [
      `Today's Rate (Updated on: ${getFormattedDateTime()})`,
      `GOLD 22 KT - ₹${normalizeRate(rates.gold22)}`,
      `GOLD 18 KT - ₹${normalizeRate(rates.gold18)}`,
      `PLATINUM 1g - ₹${normalizeRate(rates.platinum)}`,
      `SILVER 1g - ₹${normalizeRate(rates.silver)}`,
    ];
    if (rates.diamond) parts.push(`DIAMOND - ₹${normalizeRate(rates.diamond)}`);

    // New selector
    document.querySelectorAll("[data-kj-rate]").forEach((el) => {
      el.textContent = parts.join(" ; ");
    });

    // Legacy fallback
    document.querySelectorAll("[data-mobile-rate]").forEach((el) => {
      el.textContent = parts.join(" ; ");
    });
  }

  function calculateJewelleryPrice(weight, rate) {
    return Math.round(weight * rate * 1.18 * 1.03).toLocaleString("en-IN");
  }

  function updateCalculatedPriceElements(selector, rate) {
    const rateNumber = getRateNumber(rate);
    if (!rateNumber) return;
    document.querySelectorAll(selector).forEach((el) => {
      const raw = el.dataset.kjRateWeight || el.textContent;
      const weight = parseFloat(String(raw).replace(/,/g, ""));
      if (!Number.isFinite(weight)) return;
      el.dataset.kjRateWeight = String(weight);
      el.textContent = calculateJewelleryPrice(weight, rateNumber);
      el.dataset.kjCalculated = "true";
    });
  }

  function hideDiamondPricesWithoutRate(rates) {
    if (rates.diamond) return;
    document.querySelectorAll("#diamondprices").forEach((el) => {
      const wrap = el.closest(".product-card-price, .product-card__action, .divdimonds");
      if (wrap) wrap.hidden = true;
    });
  }

  function updateProductPrices(rates) {
    updateCalculatedPriceElements("#goldprice, #goldprices", rates.gold22);
    updateCalculatedPriceElements("#silverpricesssproduct", rates.silver);
    hideDiamondPricesWithoutRate(rates);
  }

  async function loadRates() {
    if (ratesCache) return ratesCache;
    const source = `${getAssetPrefix()}${RATE_SOURCE}?v=${RATE_VERSION}`;
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${RATE_SOURCE}: ${response.status}`);
    ratesCache = await response.json();
    return ratesCache;
  }

  async function updateRates() {
    try {
      const rates = await loadRates();
      updateDesktopRateDropdown(rates);
      updateMobileRateStrip(rates);
      updateProductPrices(rates);
    } catch (error) {
      console.error("Rate update failed:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", updateRates);
  window.addEventListener("kerala:header-loaded", updateRates);
  window.addEventListener("load", updateRates);

  window.updateRates = updateRates;
})();
