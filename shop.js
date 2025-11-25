const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
  cherry: { name: "Cherries", emoji: "🍒" }
};

const BUNDLES = {
  healthy_mix: {
    name: "Healthy Mix",
    products: ["apple", "banana"],
    emoji: "🍏🍌"
  },
  citrus_lovers: {
    name: "Citrus Lovers",
    products: ["lemon", "apple"],
    emoji: "🍋🍏"
  },
  tropical_party: {
    name: "Tropical Party",
    products: ["banana", "lemon"],
    emoji: "🍌🍋"
  },
  fruit_feast: {
    name: "Fruit Feast",
    products: ["apple", "banana", "lemon"],
    emoji: "🍏🍌🍋"
  },
  orchard_bliss: {
    name: "Orchard Bliss",
    products: ["apple", "cherry"],
    emoji: "🍏🍒"
  },
  citrus_spark: {
    name: "Citrus Spark",
    products: ["lemon", "cherry"],
    emoji: "🍋🍒"
  }
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : [];
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function addBundle(bundleId) {
  const bundle = BUNDLES[bundleId];
  if (bundle) {
    const basket = getBasket();
    basket.push(`bundle_${bundleId}`);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketIndicator();
  }
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((item) => {
    if (item.startsWith("bundle_")) {
      const bundleId = item.replace("bundle_", "");
      const bundle = BUNDLES[bundleId];
      if (bundle) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${bundle.emoji}</span> <span>${bundle.name} Bundle</span>`;
        basketList.appendChild(li);
      }
    } else {
      const product = PRODUCTS[item];
      if (product) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${product.emoji}</span> <span>${product.name}</span>`;
        basketList.appendChild(li);
      }
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};

(function initThemeToggle() {
  const STORAGE_KEY = "fruit-shop-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const initialTheme = savedTheme || (prefersDark.matches ? "dark" : "light");

  applyTheme(initialTheme);

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggle(theme);
  }

  function updateToggle(theme) {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const icon = toggle.querySelector(".theme-toggle__icon");
    const label = toggle.querySelector(".theme-toggle__label");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "🌞";
    if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    toggle.setAttribute("aria-pressed", theme === "dark");
  }

  function createToggle() {
    const header = document.querySelector("header");
    if (!header || header.querySelector(".theme-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.setAttribute("aria-label", "Toggle color theme");
    button.innerHTML = `
      <span class="theme-toggle__icon"></span>
      <span class="theme-toggle__label"></span>
    `;
    button.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
    header.appendChild(button);
    updateToggle(root.getAttribute("data-theme") || initialTheme);
  }

  const initToggle = () => createToggle();

  if (document.readyState !== "loading") {
    initToggle();
  } else {
    document.addEventListener("DOMContentLoaded", initToggle);
  }

  prefersDark.addEventListener("change", (event) => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    applyTheme(event.matches ? "dark" : "light");
  });
})();
