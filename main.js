(function () {
  const config = window.LDES_CONFIG;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const dialog = document.getElementById("checkout-note");
  const customBuy = document.getElementById("custom-buy");
  const customPrice = document.querySelector("[data-custom-price]");
  const top = document.querySelector(".top");

  function money(n) {
    return config.currencySymbol + n;
  }

  function hasUrl(url) {
    return !!(url && /^https?:\/\//i.test(url));
  }

  function buy(url, fallbackMailto) {
    if (hasUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    if (fallbackMailto && config.contactEmail) {
      window.location.href = fallbackMailto;
      return;
    }
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert("Add your checkout link in config.js");
    }
  }

  function includesList(items) {
    if (!items || !items.length) return "";
    return `<ul class="includes">${items
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
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
            ${hasUrl(p.checkoutUrl) ? "Get pack" : "Get pack"}
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

  if (customBuy) {
    customBuy.addEventListener("click", (e) => {
      e.preventDefault();
      const subject = encodeURIComponent("LDES custom dream request");
      const body = encodeURIComponent(
        "Prompt / idea:\n\nFormat (clip or wallpaper):\n\n"
      );
      const mailto = config.contactEmail
        ? `mailto:${config.contactEmail}?subject=${subject}&body=${body}`
        : "";
      buy(config.custom.checkoutUrl, mailto);
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
