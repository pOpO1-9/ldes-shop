(function () {
  const config = window.GLOAM;
  if (!config) return;

  const product = config.product;
  const qtyInput = document.getElementById("qty");
  const form = document.getElementById("order-form");
  const ready = document.getElementById("order-ready");
  const ticketEl = document.getElementById("order-ticket");
  const nextBtn = document.getElementById("order-next");
  const country = document.getElementById("country");
  const thumbs = document.getElementById("gallery-thumbs");
  const mainImg = document.getElementById("gallery-main");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const top = document.querySelector(".top");
  const payHint = document.getElementById("pay-hint");
  const checkoutLede = document.getElementById("checkout-lede");
  const placeBtn = document.getElementById("place-order");

  let pendingMailto = "";
  let pendingPayUrl = "";

  function usdFromEur(n) {
    const rate = Number(config.usdPerEur) || 1.16;
    return Math.round(Number(n) * rate);
  }

  function money(n) {
    return "€" + n;
  }

  function hasUrl(url) {
    return !!(url && /^https?:\/\//i.test(url));
  }

  function qty() {
    const n = Number(qtyInput && qtyInput.value);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(5, Math.floor(n));
  }

  function total() {
    return product.price * qty();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  }

  document.querySelectorAll("[data-price]").forEach(function (el) {
    el.textContent = money(product.price);
  });

  const usdEl = document.querySelector("[data-usd]");
  if (usdEl) usdEl.textContent = "~$" + usdFromEur(product.price);

  const nameEl = document.getElementById("product-name");
  if (nameEl) nameEl.textContent = product.name;

  const descEl = document.getElementById("product-desc");
  if (descEl) descEl.textContent = product.description;

  const shipEl = document.getElementById("ship-note");
  if (shipEl) shipEl.textContent = product.shippingNote || "";

  const includes = document.getElementById("includes");
  if (includes) {
    includes.innerHTML = (product.includes || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  const specs = document.getElementById("specs");
  if (specs) {
    specs.innerHTML = (product.specs || [])
      .map(function (row) {
        return (
          "<div><dt>" +
          escapeHtml(row.label) +
          "</dt><dd>" +
          escapeHtml(row.value) +
          "</dd></div>"
        );
      })
      .join("");
  }

  if (country) {
    (config.countries || []).forEach(function (c) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      country.appendChild(opt);
    });
  }

  function renderThumbs() {
    if (!thumbs) return;
    const images = product.images || [];
    thumbs.innerHTML = images
      .map(function (img, i) {
        return (
          '<button type="button" data-src="' +
          escapeHtml(img.src) +
          '" data-alt="' +
          escapeHtml(img.alt) +
          '"' +
          (i === 0 ? ' class="is-active"' : "") +
          "><img src=\"" +
          escapeHtml(img.src) +
          '" alt=""></button>'
        );
      })
      .join("");
    if (mainImg && images[0]) {
      mainImg.src = images[0].src;
      mainImg.alt = images[0].alt;
    }
  }

  renderThumbs();

  if (thumbs) {
    thumbs.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-src]");
      if (!btn) return;
      thumbs.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      if (mainImg) {
        mainImg.src = btn.dataset.src;
        mainImg.alt = btn.dataset.alt || "";
      }
    });
  }

  function updateTotals() {
    const q = qty();
    const sum = document.getElementById("order-summary");
    const tot = document.getElementById("order-total");
    if (sum) sum.textContent = product.name + " × " + q;
    if (tot) tot.textContent = money(total());
  }

  if (qtyInput) {
    qtyInput.addEventListener("input", updateTotals);
    updateTotals();
  }

  const paid = hasUrl(config.checkoutUrl);
  if (paid) {
    if (placeBtn) placeBtn.textContent = "Continue to payment";
    if (nextBtn) nextBtn.textContent = "Open payment";
    if (payHint) {
      payHint.textContent =
        "Next page is Gumroad. Use the same address there so the warehouse ships to you, not to us.";
    }
    if (checkoutLede) {
      checkoutLede.textContent =
        "EU addresses. Shipping is included. Payment is on Gumroad — paste the same address there.";
    }
  }

  const qtyForm = document.getElementById("qty-form");
  if (qtyForm) {
    qtyForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  function ticketFromForm() {
    const q = qty();
    const name = (document.getElementById("name") || {}).value || "";
    const email = (document.getElementById("email") || {}).value || "";
    const phone = (document.getElementById("phone") || {}).value || "";
    const line1 = (document.getElementById("line1") || {}).value || "";
    const line2 = (document.getElementById("line2") || {}).value || "";
    const city = (document.getElementById("city") || {}).value || "";
    const postcode = (document.getElementById("postcode") || {}).value || "";
    const ctry = (document.getElementById("country") || {}).value || "";

    return [
      "GLOAM ORDER",
      "SKU " + product.sku,
      "",
      product.name + " × " + q,
      "Total " + money(total()) + " (shipping included, EU)",
      "",
      "Ship to:",
      name.trim(),
      line1.trim(),
      line2.trim(),
      (postcode + " " + city).trim(),
      ctry,
      "",
      "Email: " + email.trim(),
      "Phone: " + phone.trim(),
      "",
      "Fulfill: order this from the supplier to the address above.",
      "Do not ship from home. Do not send to the Gloam inbox.",
    ]
      .filter(function (line, i, arr) {
        if (line !== "") return true;
        return arr[i - 1] !== "";
      })
      .join("\n");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const note = ticketFromForm();
      pendingMailto =
        "mailto:" +
        encodeURIComponent(config.contactEmail) +
        "?subject=" +
        encodeURIComponent("Gloam order — " + product.sku) +
        "&body=" +
        encodeURIComponent(note);
      pendingPayUrl = config.checkoutUrl || "";

      if (ticketEl) ticketEl.textContent = note;

      copyText(note).finally(function () {
        if (ready && typeof ready.showModal === "function") {
          ready.showModal();
        } else if (hasUrl(pendingPayUrl)) {
          window.open(pendingPayUrl, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = pendingMailto;
        }
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (hasUrl(pendingPayUrl)) {
        window.open(pendingPayUrl, "_blank", "noopener,noreferrer");
        return;
      }
      if (pendingMailto) window.location.href = pendingMailto;
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    siteNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  if (top) {
    const onScroll = function () {
      top.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
})();
