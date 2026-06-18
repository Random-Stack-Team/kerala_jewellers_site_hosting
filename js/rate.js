async function updateRates() {
  try {
    const response = await fetch("data/rates.json");
    const rates = await response.json();

    document.querySelectorAll("[data-rate='gold22']").forEach((el) => {
      el.textContent = rates.gold22;
    });

    document.querySelectorAll("[data-rate='gold24']").forEach((el) => {
      el.textContent = rates.gold24;
    });

    document.querySelectorAll("[data-rate='silver']").forEach((el) => {
      el.textContent = rates.silver;
    });

    document.querySelectorAll("[data-rate='platinum']").forEach((el) => {
      el.textContent = rates.platinum;
    });
  } catch (error) {
    console.error("Rate update failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", updateRates);