(function () {
  const config = window.STILL_LOCK;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const lockGrid = document.getElementById("lock-grid");
  const dialog = document.getElementById("checkout-note");
  const lightbox = document.getElementById("lock-lightbox");
  const lightboxClose = document.getElementById("lightbox-close");
  const top = document.querySelector(".top");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  function usdFromEur(n) {
    const rate = Number(config.usdPerEur) || 1.16;
    return Math.round(Number(n) * rate);
  }

  function money(n) {
    return "€" + n;
  }

  function moneyBoth(n) {
    return (
      '<span class="price-eur">' +
      money(n) +
      '</span><span class="price-usd">~$' +
      usdFromEur(n) +
      "</span>"
    );
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

  function productById(id) {
    return (config.products || []).find((p) => p.id === id);
  }

  function isSoon(p) {
    return !p || p.status === "soon" || !hasUrl(p.checkoutUrl);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function includesList(items) {
    if (!items || !items.length) return "";
    return `<ul class="includes">${items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul>`;
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    if (navToggle) navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    siteNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeNav();
    });
  }

  function renderCatalog() {
    if (!catalog) return;
    const list = config.products || [];
    catalog.innerHTML = list
      .map((p, i) => {
        const soon = isSoon(p);
        return `
      <article class="product${soon ? " is-soon" : ""}" style="animation-delay:${Math.min(i * 0.05, 0.25)}s">
        <div class="product-visual">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
          ${
            soon
              ? `<span class="product-badge soon">Coming</span>`
              : p.badge
                ? `<span class="product-badge">${escapeHtml(p.badge)}</span>`
                : ""
          }
        </div>
        <div class="product-body">
          <div class="product-meta">
            <h3>${escapeHtml(p.name)}</h3>
            <span class="price">${moneyBoth(p.price)}</span>
          </div>
          <p class="desc">${escapeHtml(p.description)}</p>
          ${includesList(p.includes)}
          ${
            soon
              ? `<button class="btn ghost small" type="button" disabled>Coming soon</button>`
              : `<button class="btn primary small" type="button" data-checkout="${p.id}">Get kit</button>`
          }
        </div>
      </article>`;
      })
      .join("");
  }

  if (catalog) {
    renderCatalog();
    catalog.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-checkout]");
      if (!btn) return;
      const product = productById(btn.dataset.checkout);
      if (!product || isSoon(product)) return;
      buy(product.checkoutUrl);
    });
  }

  function phoneMarkup(lock, compact) {
    return `
      <figure class="phone">
        <img src="${lock.image}" alt="${escapeHtml(lock.title)}" ${compact ? 'loading="lazy"' : ""} />
        <figcaption class="lock-ui">
          <span class="lock-time">${escapeHtml(lock.time || "9:41")}</span>
          <span class="lock-date">${escapeHtml(lock.date || "")}</span>
        </figcaption>
        <span class="lock-tools"></span>
      </figure>`;
  }

  function renderLocks() {
    if (!lockGrid) return;
    const list = config.locks || [];
    lockGrid.innerHTML = list
      .map(
        (lock) => `
      <button type="button" class="lock-card" data-lock="${lock.id}">
        ${phoneMarkup(lock, true)}
        <span class="lock-name">${escapeHtml(lock.title)}</span>
      </button>`
      )
      .join("");
  }

  function openLock(id) {
    const lock = (config.locks || []).find((x) => x.id === id);
    if (!lock || !lightbox) return;

    const img = document.getElementById("lightbox-image");
    const title = document.getElementById("lightbox-title");
    const time = document.getElementById("lightbox-time");
    const date = document.getElementById("lightbox-date");
    const actions = document.getElementById("lightbox-actions");
    const pack = productById(lock.kitId);

    if (img) {
      img.src = lock.image;
      img.alt = lock.title;
    }
    if (title) title.textContent = lock.title;
    if (time) time.textContent = lock.time || "9:41";
    if (date) date.textContent = lock.date || "";

    if (actions && pack) {
      actions.innerHTML = isSoon(pack)
        ? `<button class="btn ghost" type="button" disabled>Kit coming soon</button>`
        : `<button class="btn primary" type="button" data-buy-kit="${pack.id}">Get Kit 01 · ${money(pack.price)}</button>`;
    }

    if (typeof lightbox.showModal === "function") lightbox.showModal();
  }

  if (lockGrid) {
    renderLocks();
    lockGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-lock]");
      if (!card) return;
      openLock(card.dataset.lock);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.close();
        return;
      }
      const buyBtn = e.target.closest("[data-buy-kit]");
      if (buyBtn) {
        const pack = productById(buyBtn.dataset.buyKit);
        if (pack) buy(pack.checkoutUrl);
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightbox) lightbox.close();
    });
  }

  if (top) {
    const onScroll = () => {
      top.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
})();
