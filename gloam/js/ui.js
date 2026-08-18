(function (global) {
  function money(n) {
    return "€" + n;
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

  function paintCounts() {
    const n = global.GloamCart.count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
    });
  }

  function lineHtml(line) {
    return (
      '<li class="bag-line" data-id="' +
      escapeHtml(line.id) +
      '">' +
      '<img src="' +
      escapeHtml(line.product.images[0].src) +
      '" alt="">' +
      '<div class="bag-line-body">' +
      "<strong>" +
      escapeHtml(line.product.name) +
      "</strong>" +
      "<span>" +
      money(line.product.price) +
      " · qty " +
      line.qty +
      "</span>" +
      '<div class="bag-line-actions">' +
      '<button type="button" data-qty-delta="-1">−</button>' +
      "<em>" +
      line.qty +
      "</em>" +
      '<button type="button" data-qty-delta="1">+</button>' +
      '<button type="button" class="text" data-remove>Remove</button>' +
      "</div></div>" +
      "<b>" +
      money(line.lineTotal) +
      "</b></li>"
    );
  }

  function paintBag() {
    const list = document.getElementById("bag-list");
    const empty = document.getElementById("bag-empty");
    const footer = document.getElementById("bag-footer");
    const total = document.getElementById("bag-total");
    if (!list) return;

    const lines = global.GloamCart.lines();
    list.innerHTML = lines.map(lineHtml).join("");
    if (empty) empty.hidden = lines.length > 0;
    if (footer) footer.hidden = lines.length === 0;
    if (total) total.textContent = money(global.GloamCart.subtotal());
    list.hidden = lines.length === 0;
  }

  function openBag() {
    const bag = document.getElementById("bag");
    const toggle = document.querySelector("[data-open-bag]");
    if (!bag) return;
    bag.classList.add("is-open");
    bag.setAttribute("aria-hidden", "false");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("bag-open");
    const veil = document.querySelector(".bag-veil");
    if (veil) veil.hidden = false;
  }

  function closeBag() {
    const bag = document.getElementById("bag");
    const toggle = document.querySelector("[data-open-bag]");
    if (!bag) return;
    bag.classList.remove("is-open");
    bag.setAttribute("aria-hidden", "true");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("bag-open");
    const veil = document.querySelector(".bag-veil");
    if (veil) veil.hidden = true;
  }

  function mountBag() {
    if (document.getElementById("bag")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="bag-veil" data-close-bag hidden></div>' +
      '<aside id="bag" class="bag" aria-hidden="true" aria-label="Bag">' +
      '<div class="bag-head"><h2>Bag</h2>' +
      '<button type="button" class="icon-btn" data-close-bag aria-label="Close bag">×</button></div>' +
      '<p id="bag-empty" class="bag-empty">Nothing in here yet.</p>' +
      '<ul id="bag-list" class="bag-list" hidden></ul>' +
      '<div id="bag-footer" class="bag-foot" hidden>' +
      '<p class="bag-total">Total <strong id="bag-total">€0</strong></p>' +
      '<p class="bag-ship">EU shipping included</p>' +
      '<a class="btn solid" href="checkout.html">Checkout</a>' +
      "</div></aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  function bindBag() {
    mountBag();
    const bag = document.getElementById("bag");
    if (!bag) return;

    document.querySelectorAll("[data-open-bag]").forEach(function (btn) {
      btn.addEventListener("click", openBag);
    });
    document.querySelectorAll("[data-close-bag]").forEach(function (btn) {
      btn.addEventListener("click", closeBag);
    });

    bag.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close-bag")) closeBag();
      const line = e.target.closest("[data-id]");
      if (!line) return;
      const id = line.getAttribute("data-id");
      if (e.target.closest("[data-remove]")) {
        global.GloamCart.remove(id);
        return;
      }
      const deltaBtn = e.target.closest("[data-qty-delta]");
      if (deltaBtn) {
        const current = global.GloamCart.lines().find(function (row) {
          return row.id === id;
        });
        const next = (current ? current.qty : 1) + Number(deltaBtn.getAttribute("data-qty-delta"));
        global.GloamCart.setQty(id, next);
      }
    });
  }

  global.GloamCart.onChange(function () {
    paintCounts();
    paintBag();
  });

  global.GloamUI = {
    money: money,
    escapeHtml: escapeHtml,
    copyText: copyText,
    paintCounts: paintCounts,
    paintBag: paintBag,
    openBag: openBag,
    closeBag: closeBag,
    bindBag: bindBag,
  };

  document.addEventListener("DOMContentLoaded", function () {
    bindBag();
    paintCounts();
    paintBag();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeBag();
  });
})(window);
