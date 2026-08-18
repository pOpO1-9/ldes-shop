(function () {
  const config = window.MOST_NIGHTS;
  if (!config) return;

  const catalog = document.getElementById("catalog");
  const dinnerList = document.getElementById("dinner-list");
  const weekLabel = document.getElementById("week-label");
  const weekMeta = document.getElementById("week-meta");
  const dialog = document.getElementById("checkout-note");
  const top = document.querySelector(".top");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  function usdFromEur(n) {
    return Math.round(Number(n) * (Number(config.usdPerEur) || 1.16));
  }

  function moneyBoth(n) {
    return (
      '<span class="price-eur">€' +
      n +
      '</span> <span class="price-usd">~$' +
      usdFromEur(n) +
      "</span>"
    );
  }

  function hasHttp(url) {
    return !!(url && /^https?:\/\//i.test(url));
  }

  function isSoon(p) {
    return !p || p.status === "soon" || !p.checkoutUrl;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buy(product) {
    if (product && hasHttp(product.checkoutUrl)) {
      window.open(product.checkoutUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (product && product.previewUrl) {
      window.location.href = product.previewUrl;
      return;
    }
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
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

  const week = config.week || {};
  if (weekLabel && week.label) weekLabel.textContent = week.label;
  if (weekMeta) {
    weekMeta.textContent = [week.dates, week.feeds, week.time].filter(Boolean).join(" · ");
  }
  if (dinnerList && week.dinners) {
    dinnerList.innerHTML = week.dinners
      .map(
        (d) =>
          `<li><span class="day">${escapeHtml(d.day)}</span><div><strong>${escapeHtml(d.name)}</strong><span>${escapeHtml(d.note)}</span></div></li>`
      )
      .join("");
  }

  function renderCatalog() {
    if (!catalog) return;
    catalog.innerHTML = (config.products || [])
      .map((p) => {
        const soon = isSoon(p) && !p.previewUrl;
        const label = p.previewUrl && isSoon(p) ? p.cta || "Read the card" : soon ? "Coming" : "Get this week";
        return `
      <article class="product${soon ? " is-soon" : ""}">
        <div class="product-meta">
          <h3>${escapeHtml(p.name)}</h3>
          <span class="price">${moneyBoth(p.price)}</span>
        </div>
        <p class="desc">${escapeHtml(p.description)}</p>
        <ul class="includes">${(p.includes || []).map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
        <button class="btn ${soon ? "ghost" : "primary"} small" type="button" data-id="${p.id}" ${soon ? "disabled" : ""}>${escapeHtml(label)}</button>
      </article>`;
      })
      .join("");
  }

  if (catalog) {
    renderCatalog();
    catalog.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-id]");
      if (!btn || btn.disabled) return;
      const product = (config.products || []).find((p) => p.id === btn.dataset.id);
      buy(product);
    });
  }

  if (top) {
    const onScroll = () => top.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
})();
