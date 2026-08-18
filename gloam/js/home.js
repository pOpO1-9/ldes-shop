(function () {
  const store = window.GLOAM_STORE;
  const product = store && store.products && store.products[0];
  if (!product) return;

  const main = document.getElementById("stage");
  const thumbs = document.getElementById("thumbs");
  const qtyEl = document.getElementById("qty");
  const addBtn = document.getElementById("add");
  const nameEl = document.getElementById("product-name");
  const priceEl = document.getElementById("product-price");
  const blurbEl = document.getElementById("product-blurb");
  const includesEl = document.getElementById("includes");
  const specsEl = document.getElementById("specs");
  const toast = document.getElementById("toast");

  function show(src, alt) {
    if (!main) return;
    main.src = src;
    main.alt = alt || "";
  }

  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = window.GloamUI.money(product.price);
  if (blurbEl) blurbEl.textContent = product.blurb;

  if (includesEl) {
    includesEl.innerHTML = product.includes
      .map(function (item) {
        return "<li>" + window.GloamUI.escapeHtml(item) + "</li>";
      })
      .join("");
  }

  if (specsEl) {
    specsEl.innerHTML = product.specs
      .map(function (row) {
        return (
          "<div><dt>" +
          window.GloamUI.escapeHtml(row[0]) +
          "</dt><dd>" +
          window.GloamUI.escapeHtml(row[1]) +
          "</dd></div>"
        );
      })
      .join("");
  }

  if (thumbs) {
    thumbs.innerHTML = product.images
      .map(function (img, i) {
        return (
          '<button type="button"' +
          (i === 0 ? ' class="is-on"' : "") +
          ' data-src="' +
          window.GloamUI.escapeHtml(img.src) +
          '" data-alt="' +
          window.GloamUI.escapeHtml(img.alt) +
          '"><img src="' +
          window.GloamUI.escapeHtml(img.src) +
          '" alt=""></button>'
        );
      })
      .join("");

    thumbs.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-src]");
      if (!btn) return;
      thumbs.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
      });
      show(btn.getAttribute("data-src"), btn.getAttribute("data-alt"));
    });
  }

  if (product.images[0]) show(product.images[0].src, product.images[0].alt);

  function qty() {
    const n = Number(qtyEl && qtyEl.value);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(5, Math.floor(n));
  }

  document.querySelectorAll("[data-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!qtyEl) return;
      qtyEl.value = String(
        Math.max(1, Math.min(5, qty() + Number(btn.getAttribute("data-step"))))
      );
    });
  });

  if (addBtn) {
    addBtn.addEventListener("click", function () {
      window.GloamCart.add(product.id, qty());
      window.GloamUI.openBag();
      if (toast) {
        toast.textContent = "In your bag.";
        toast.hidden = false;
        window.setTimeout(function () {
          toast.hidden = true;
        }, 1600);
      }
    });
  }
})();
