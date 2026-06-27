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
    document.querySelectorAll(".rate-option[data-rate-type], .rate-row[data-rate-type]").forEach((row) => {
      const label = getRateLabel(row.dataset.rateType, rates);
      const labelSpans = row.querySelectorAll("[data-rate-label]");

      labelSpans.forEach((labelSpan) => {
        labelSpan.textContent = label;
      });

      row.dataset.label = label;
    });

    document.querySelectorAll(".rate-btn [data-rate-type], .rate-toggle [data-rate-type]").forEach((toggleLabel) => {
      toggleLabel.textContent = getRateLabel(toggleLabel.dataset.rateType, rates);
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

    if (rates.diamond) {
      parts.push(`DIAMOND - ₹${normalizeRate(rates.diamond)}`);
    }

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

    document.querySelectorAll(selector).forEach((priceElement) => {
      const rawWeight = priceElement.dataset.kjRateWeight || priceElement.textContent;
      const weight = parseFloat(String(rawWeight).replace(/,/g, ""));

      if (!Number.isFinite(weight)) return;

      priceElement.dataset.kjRateWeight = String(weight);
      priceElement.textContent = calculateJewelleryPrice(weight, rateNumber);
      priceElement.dataset.kjCalculated = "true";
    });
  }

  function hideDiamondPricesWithoutRate(rates) {
    if (rates.diamond) return;

    document.querySelectorAll("#diamondprices").forEach((priceElement) => {
      const priceWrap = priceElement.closest(".product-card-price, .product-card__action, .divdimonds");
      if (priceWrap) {
        priceWrap.hidden = true;
      }
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

    if (!response.ok) {
      throw new Error(`Could not load ${RATE_SOURCE}: ${response.status}`);
    }

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
