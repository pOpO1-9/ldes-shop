(function () {
  const config = window.LDES_CONFIG;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const galleryEl = document.getElementById("gallery-grid");
  const galleryFilters = document.getElementById("gallery-filters");
  const editionFilters = document.getElementById("edition-filters");
  const nftBanner = document.getElementById("nft-banner");
  const dialog = document.getElementById("checkout-note");
  const lightbox = document.getElementById("piece-lightbox");
  const lightboxClose = document.getElementById("lightbox-close");
  const customForm = document.getElementById("custom-form");
  const customReady = document.getElementById("custom-ready");
  const customSummary = document.getElementById("custom-summary");
  const customOpenCheckout = document.getElementById("custom-open-checkout");
  const customPrice = document.querySelector("[data-custom-price]");
  const top = document.querySelector(".top");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  let pendingCheckoutUrl = "";
  let galleryFilter = "all";
  let editionKind = "all";

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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  /* ——— Editions ——— */
  function filteredProducts() {
    const list = config.products || [];
    if (editionKind === "all") return list;
    return list.filter((p) => p.kind === editionKind);
  }

  function renderCatalog() {
    if (!catalog) return;
    const list = filteredProducts();
    if (!list.length) {
      catalog.innerHTML =
        '<p class="gallery-empty">No editions in this filter yet.</p>';
      return;
    }
    catalog.innerHTML = list
      .map((p, i) => {
        const soon = isSoon(p);
        const delay = Math.min(i * 0.05, 0.25);
        return `
      <article class="product${soon ? " is-soon" : ""}" style="animation-delay:${delay}s">
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
              : `<button class="btn primary small" type="button" data-checkout="${p.id}">Get edition</button>`
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

  if (editionFilters) {
    editionFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-kind]");
      if (!btn) return;
      editionKind = btn.dataset.kind;
      editionFilters.querySelectorAll(".filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });
      renderCatalog();
    });
  }

  /* ——— Gallery ——— */
  function canMint(g) {
    return !!(config.nft && config.nft.enabled && g && hasUrl(g.mintUrl));
  }

  function mintTicker(g) {
    const m = String((g && g.edition) || "").match(/\$[A-Z0-9]+/);
    return m ? m[0] : "";
  }

  function setGalleryFilter(next) {
    galleryFilter = next;
    if (!galleryFilters) return;
    galleryFilters.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.filter === next);
    });
    renderGallery();
  }

  if (nftBanner && config.nft) {
    const liveMints = (config.gallery || []).filter(canMint).length;
    nftBanner.innerHTML = config.nft.enabled
      ? liveMints +
        " live on " +
        (config.nft.chainLabel || "chain") +
        (config.nft.profileUrl
          ? ' · <a href="' +
            config.nft.profileUrl +
            '" target="_blank" rel="noopener noreferrer">Zora profile</a>'
          : "")
      : escapeHtml(config.nft.comingCopy || "");
  }

  function filteredGallery() {
    const list = config.gallery || [];
    if (galleryFilter === "all") return list;
    if (galleryFilter === "mint") return list.filter(canMint);
    return list.filter((g) => g.status === galleryFilter);
  }

  function renderGallery() {
    if (!galleryEl) return;
    const list = filteredGallery();
    galleryEl.classList.toggle("is-mint", galleryFilter === "mint");
    galleryEl.classList.toggle("is-even", galleryFilter !== "all");
    if (!list.length) {
      galleryEl.innerHTML =
        '<p class="gallery-empty">No pieces in this filter yet.</p>';
      return;
    }
    galleryEl.innerHTML = list
      .map((g, i) => {
        const soon = g.status === "soon";
        const mint = canMint(g);
        const ticker = mintTicker(g);
        const sub = mint
          ? "Mint · " + (ticker || "Zora")
          : g.edition || "";
        return `
      <button type="button" class="gallery-card${soon ? " is-soon" : ""}${mint ? " is-mint" : ""}" data-piece="${g.id}" style="animation-delay:${Math.min(i * 0.04, 0.28)}s">
        <span class="gallery-frame">
          <img src="${g.image}" alt="${escapeHtml(g.title)}" loading="lazy" />
          ${mint ? `<span class="mint-pill">Mint</span>` : ""}
        </span>
        <span class="gallery-cap">
          <span class="gallery-title">${escapeHtml(g.title)}</span>
          <span class="gallery-sub">${escapeHtml(sub)}</span>
        </span>
      </button>`;
      })
      .join("");
  }

  function openPiece(id) {
    const g = (config.gallery || []).find((x) => x.id === id);
    if (!g || !lightbox) return;

    const img = document.getElementById("lightbox-image");
    const series = document.getElementById("lightbox-series");
    const title = document.getElementById("lightbox-title");
    const blurb = document.getElementById("lightbox-blurb");
    const meta = document.getElementById("lightbox-meta");
    const actions = document.getElementById("lightbox-actions");

    if (img) {
      img.src = g.image;
      img.alt = g.title;
    }
    if (series) series.textContent = g.series || "";
    if (title) title.textContent = g.title;
    if (blurb) blurb.textContent = g.blurb || "";
    if (meta) {
      meta.textContent = [g.edition, g.supply].filter(Boolean).join(" · ");
    }

    const pack = productById(g.buyPackId);
    const canBuyFile = pack && !isSoon(pack);
    const mintable = canMint(g);

    let html = "";
    if (mintable) {
      const ticker = mintTicker(g);
      html += `<a class="btn primary" href="${g.mintUrl}" target="_blank" rel="noopener noreferrer">Hold on Zora${ticker ? " · " + ticker : ""}</a>`;
    }
    if (canBuyFile) {
      html += `<button type="button" class="btn${mintable ? " ghost" : " primary"}" data-buy-file="${pack.id}">Buy file · ${money(g.priceFile || pack.price)}</button>`;
    } else if (!mintable) {
      html += `<button type="button" class="btn ghost" disabled>File · coming soon</button>`;
    }
    if (!mintable) {
      html += `<button type="button" class="btn ghost" disabled>Mint · soon</button>`;
    }

    if (actions) actions.innerHTML = html;

    if (typeof lightbox.showModal === "function") lightbox.showModal();
  }

  if (galleryEl) {
    renderGallery();
    galleryEl.addEventListener("click", (e) => {
      const card = e.target.closest("[data-piece]");
      if (!card) return;
      openPiece(card.dataset.piece);
    });
  }

  if (galleryFilters) {
    galleryFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      setGalleryFilter(btn.dataset.filter);
    });
  }

  function applyHashFilter() {
    const hash = (location.hash || "").replace("#", "");
    if (hash === "mint") setGalleryFilter("mint");
  }

  window.addEventListener("hashchange", applyHashFilter);
  applyHashFilter();

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.close();
        return;
      }
      const buyBtn = e.target.closest("[data-buy-file]");
      if (buyBtn) {
        const pack = productById(buyBtn.dataset.buyFile);
        if (pack) buy(pack.checkoutUrl);
        return;
      }
      const mintBtn = e.target.closest("[data-mint]");
      if (mintBtn) {
        const g = (config.gallery || []).find((x) => x.id === mintBtn.dataset.mint);
        if (g) buy(g.mintUrl);
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightbox) lightbox.close();
    });
  }

  /* ——— Custom ——— */
  if (customPrice) {
    customPrice.innerHTML = moneyBoth(config.custom.price);
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
})();
