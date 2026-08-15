(function () {
  const config = window.LDES_CONFIG;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const galleryEl = document.getElementById("gallery");
  const galleryFilters = document.getElementById("gallery-filters");
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

  let pendingCheckoutUrl = "";
  let galleryFilter = "all";

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

  /* ——— Packs ——— */
  if (catalog) {
    catalog.innerHTML = config.products
      .map((p, i) => {
        const soon = isSoon(p);
        const delay = Math.min(i * 0.05, 0.25);
        return `
      <article class="product${soon ? " is-soon" : ""}" style="animation-delay:${delay}s">
        <div class="product-visual">
          <img src="${p.image}" alt="" loading="lazy" />
          ${
            soon
              ? `<span class="product-badge soon">soon</span>`
              : p.badge
                ? `<span class="product-badge">${p.badge}</span>`
                : ""
          }
        </div>
        <div class="product-body">
          <div class="product-meta">
            <h3>${escapeHtml(p.name)}</h3>
            <span class="price">${money(p.price)}</span>
          </div>
          <p class="desc">${escapeHtml(p.description)}</p>
          ${includesList(p.includes)}
          ${
            soon
              ? `<button class="btn ghost small" type="button" disabled>Coming soon</button>`
              : `<button class="btn primary small" type="button" data-checkout="${p.id}">Get pack</button>`
          }
        </div>
      </article>`;
      })
      .join("");

    catalog.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-checkout]");
      if (!btn) return;
      const product = productById(btn.dataset.checkout);
      if (!product || isSoon(product)) return;
      buy(product.checkoutUrl);
    });
  }

  /* ——— Gallery ——— */
  if (nftBanner && config.nft) {
    nftBanner.textContent = config.nft.enabled
      ? "NFT minting is live on " + (config.nft.chainLabel || "chain") + "."
      : config.nft.comingCopy || "";
  }

  function filteredGallery() {
    const list = config.gallery || [];
    if (galleryFilter === "all") return list;
    return list.filter((g) => g.status === galleryFilter);
  }

  function renderGallery() {
    if (!galleryEl) return;
    const list = filteredGallery();
    if (!list.length) {
      galleryEl.innerHTML =
        '<p class="gallery-empty">No pieces in this filter yet.</p>';
      return;
    }
    galleryEl.innerHTML = list
      .map((g, i) => {
        const soon = g.status === "soon";
        return `
      <button type="button" class="gallery-card${soon ? " is-soon" : ""}" data-piece="${g.id}" style="animation-delay:${Math.min(i * 0.04, 0.28)}s">
        <span class="gallery-frame">
          <img src="${g.image}" alt="${escapeHtml(g.title)}" loading="lazy" />
        </span>
        <span class="gallery-cap">
          <span class="gallery-title">${escapeHtml(g.title)}</span>
          <span class="gallery-sub">${escapeHtml(g.edition)}</span>
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
    const canMint = config.nft && config.nft.enabled && hasUrl(g.mintUrl);

    let html = "";
    if (canBuyFile) {
      html += `<button type="button" class="btn primary" data-buy-file="${pack.id}">Buy file · ${money(g.priceFile || pack.price)}</button>`;
    } else {
      html += `<button type="button" class="btn ghost" disabled>File · coming soon</button>`;
    }

    if (canMint) {
      html += `<button type="button" class="btn ghost" data-mint="${g.id}">Mint NFT</button>`;
    } else {
      html += `<button type="button" class="btn ghost" disabled>Mint NFT · soon</button>`;
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
      galleryFilter = btn.dataset.filter;
      galleryFilters.querySelectorAll(".filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });
      renderGallery();
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
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
