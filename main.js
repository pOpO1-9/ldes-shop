(function () {
  const config = window.LDES_CONFIG;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const dialog = document.getElementById("checkout-note");
  const customForm = document.getElementById("custom-form");
  const customReady = document.getElementById("custom-ready");
  const customSummary = document.getElementById("custom-summary");
  const customOpenCheckout = document.getElementById("custom-open-checkout");
  const customPrice = document.querySelector("[data-custom-price]");
  const top = document.querySelector(".top");

  let pendingCheckoutUrl = "";

  function money(n) {
    return config.currencySymbol + n;
  }

  function hasUrl(url) {
    return !!(url && /^https?:\/\//i.test(url));
  }

  function buy(url) {
    if (hasUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert("Checkout link unavailable");
    }
  }

  function includesList(items) {
    if (!items || !items.length) return "";
    return `<ul class="includes">${items
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  }

  function buildCustomNote(prompt, format, email) {
    return [
      "LDES Custom Dream request",
      "",
      "Prompt:",
      prompt.trim(),
      "",
      "Format: " + format,
      "Email: " + email.trim(),
    ].join("\n");
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  if (catalog) {
    catalog.innerHTML = config.products
      .map(
        (p) => `
      <article class="product">
        <div class="product-visual">
          <img src="${p.image}" alt="" loading="lazy" />
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        </div>
        <div class="product-body">
          <div class="product-meta">
            <h3>${p.name}</h3>
            <span class="price">${money(p.price)}</span>
          </div>
          <p class="desc">${p.description}</p>
          ${includesList(p.includes)}
          <button class="btn primary small" type="button" data-checkout="${p.id}">
            Get pack
          </button>
        </div>
      </article>`
      )
      .join("");

    catalog.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-checkout]");
      if (!btn) return;
      const product = config.products.find((p) => p.id === btn.dataset.checkout);
      buy(product && product.checkoutUrl);
    });
  }

  if (customPrice) {
    customPrice.textContent = money(config.custom.price);
  }

  if (customForm) {
    customForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const promptEl = document.getElementById("custom-prompt");
      const emailEl = document.getElementById("custom-email");
      const formatEl = customForm.querySelector('input[name="format"]:checked');

      const prompt = (promptEl && promptEl.value) || "";
      const email = (emailEl && emailEl.value) || "";
      const format = (formatEl && formatEl.value) || "vertical clip";

      if (!prompt.trim()) {
        promptEl.focus();
        promptEl.reportValidity();
        return;
      }
      if (!email.trim() || !emailEl.checkValidity()) {
        emailEl.focus();
        emailEl.reportValidity();
        return;
      }

      const note = buildCustomNote(prompt, format, email);
      pendingCheckoutUrl = config.custom.checkoutUrl || "";

      if (customSummary) customSummary.textContent = note;

      copyText(note).finally(function () {
        if (customReady && typeof customReady.showModal === "function") {
          customReady.showModal();
        } else {
          buy(pendingCheckoutUrl);
        }
      });
    });
  }

  if (customOpenCheckout) {
    customOpenCheckout.addEventListener("click", () => {
      buy(pendingCheckoutUrl);
    });
  }

  if (top) {
    const onScroll = () => {
      top.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
