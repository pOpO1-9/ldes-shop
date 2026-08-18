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

  function paintCount() {
    const n = global.RewrapBag.count();
    document.querySelectorAll("[data-bag-count]").forEach(function (el) {
      el.textContent = String(n);
    });
  }

  function lineHtml(line) {
    return (
      '<li data-id="' +
      escapeHtml(line.id) +
      '"><img src="' +
      escapeHtml(line.product.images[0].src) +
      '" alt=""><div><strong>' +
      escapeHtml(line.product.name) +
      "</strong><span>" +
      money(line.product.price) +
      ' · ' +
      line.qty +
      ' sleeve' +
      (line.qty > 1 ? "s" : "") +
      '</span><div class="qty-mini">' +
      '<button type="button" data-d="-1">−</button><em>' +
      line.qty +
      '</em><button type="button" data-d="1">+</button>' +
      '<button type="button" class="link" data-remove>Remove</button></div></div><b>' +
      money(line.lineTotal) +
      "</b></li>"
    );
  }

  function paintDrawer() {
    const list = document.getElementById("drawer-list");
    const empty = document.getElementById("drawer-empty");
    const foot = document.getElementById("drawer-foot");
    const total = document.getElementById("drawer-total");
    if (!list) return;
    const lines = global.RewrapBag.lines();
    list.innerHTML = lines.map(lineHtml).join("");
    list.hidden = lines.length === 0;
    if (empty) empty.hidden = lines.length > 0;
    if (foot) foot.hidden = lines.length === 0;
    if (total) total.textContent = money(global.RewrapBag.subtotal());
  }

  function openDrawer() {
    const d = document.getElementById("drawer");
    const v = document.querySelector(".veil");
    if (d) {
      d.classList.add("open");
      d.setAttribute("aria-hidden", "false");
    }
    if (v) v.hidden = false;
    document.body.classList.add("lock");
  }

  function closeDrawer() {
    const d = document.getElementById("drawer");
    const v = document.querySelector(".veil");
    if (d) {
      d.classList.remove("open");
      d.setAttribute("aria-hidden", "true");
    }
    if (v) v.hidden = true;
    document.body.classList.remove("lock");
  }

  function mount() {
    if (document.getElementById("drawer")) return;
    const box = document.createElement("div");
    box.innerHTML =
      '<div class="veil" data-close hidden></div>' +
      '<aside id="drawer" aria-hidden="true" aria-label="Bag">' +
      '<header><h2>Bag</h2><button type="button" class="x" data-close aria-label="Close">×</button></header>' +
      '<p id="drawer-empty">Empty. Add a sleeve if the handle is dead.</p>' +
      '<ul id="drawer-list" hidden></ul>' +
      '<footer id="drawer-foot" hidden><p>Total <strong id="drawer-total">€0</strong></p>' +
      '<p class="fine">EU postage in the price</p>' +
      '<a class="btn" href="checkout.html">Checkout</a></footer></aside>';
    while (box.firstChild) document.body.appendChild(box.firstChild);
  }

  function bind() {
    mount();
    document.querySelectorAll("[data-open-bag]").forEach(function (b) {
      b.addEventListener("click", openDrawer);
    });
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", closeDrawer);
    });
    const list = document.getElementById("drawer-list");
    if (list) {
      list.addEventListener("click", function (e) {
        const row = e.target.closest("[data-id]");
        if (!row) return;
        const id = row.getAttribute("data-id");
        if (e.target.closest("[data-remove]")) {
          global.RewrapBag.remove(id);
          return;
        }
        const d = e.target.closest("[data-d]");
        if (d) {
          const line = global.RewrapBag.lines().find(function (l) {
            return l.id === id;
          });
          global.RewrapBag.setQty(id, (line ? line.qty : 1) + Number(d.getAttribute("data-d")));
        }
      });
    }
  }

  global.RewrapBag.onChange(function () {
    paintCount();
    paintDrawer();
  });

  global.RewrapUI = {
    money: money,
    escapeHtml: escapeHtml,
    copyText: copyText,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
  };

  document.addEventListener("DOMContentLoaded", function () {
    bind();
    paintCount();
    paintDrawer();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });
})(window);
