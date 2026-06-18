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

function getRateLabel(type, rates) {
  const formatRate = (rateStr) => rateStr ? rateStr.replace("₹", "").trim() : "";
  const labels = {
    gold22: `GOLD 22 KT/1g - Rs. ${formatRate(rates.gold22)}`,
    gold18: `GOLD 18 KT/1g - Rs. ${formatRate(rates.gold18)}`,
    platinum: `PLATINUM 1g - Rs. ${formatRate(rates.platinum)}`,
    silver: `SILVER 1g - Rs. ${formatRate(rates.silver)}`,
  };

  return labels[type] || "";
}

function updateDesktopRateDropdown(rates) {
  const toggleLabel = document.querySelector(".rate-toggle [data-rate-type]");

  if (toggleLabel) {
    toggleLabel.textContent = getRateLabel(toggleLabel.dataset.rateType, rates);
  }

  document.querySelectorAll(".rate-row[data-rate-type]").forEach((row) => {
    const type = row.dataset.rateType;
    const label = getRateLabel(type, rates);
    const labelSpan = row.querySelector("[data-rate-label]");

    if (labelSpan) {
      labelSpan.textContent = label;
    }

    row.dataset.label = label;
  });
}

function updateMobileRateStrip(rates) {
  const message =
    `Today’s Rate (Updated on: ${getFormattedDateTime()}) ; ` +
    `GOLD 22 KT - Rs. ${rates.gold22 ? rates.gold22.replace("₹", "").trim() : ""} ; ` +
    `GOLD 18 KT - Rs. ${rates.gold18 ? rates.gold18.replace("₹", "").trim() : ""} ; ` +
    `PLATINUM 1g - Rs. ${rates.platinum ? rates.platinum.replace("₹", "").trim() : ""} ; ` +
    `SILVER 1g - Rs. ${rates.silver ? rates.silver.replace("₹", "").trim() : ""}`;

  document.querySelectorAll("[data-mobile-rate]").forEach((el) => {
    el.textContent = message;
  });
}

async function updateRates() {
  try {
    const response = await fetch("/data/rates.json");

    if (!response.ok) {
      throw new Error(`Could not load rates.json: ${response.status}`);
    }

    const rates = await response.json();

    updateDesktopRateDropdown(rates);
    updateMobileRateStrip(rates);
  } catch (error) {
    console.error("Rate update failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", updateRates);
document.addEventListener("kerala:header-loaded", updateRates);
window.addEventListener("load", updateRates);

window.updateRates = updateRates;