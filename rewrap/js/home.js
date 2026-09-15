(function () {
  const product = window.REWRAP && window.REWRAP.products[0];
  if (!product) return;
  const ui = window.RewrapUI;

  const stage = document.getElementById("stage");
  const thumbs = document.getElementById("thumbs");
  const qty = document.getElementById("qty");

  document.getElementById("name").textContent = product.name;
  document.getElementById("price").textContent = ui.money(product.price);
  document.getElementById("blurb").textContent = product.blurb;
  document.getElementById("includes").innerHTML = product.includes
    .map(function (x) {
      return "<li>" + ui.escapeHtml(x) + "</li>";
    })
    .join("");
  document.getElementById("specs").innerHTML = product.specs
    .map(function (row) {
      return (
        "<div><dt>" +
        ui.escapeHtml(row[0]) +
        "</dt><dd>" +
        ui.escapeHtml(row[1]) +
        "</dd></div>"
      );
    })
    .join("");

  thumbs.innerHTML = product.images
    .map(function (img, i) {
      return (
        '<button type="button"' +
        (i === 0 ? ' class="on"' : "") +
        ' data-src="' +
        ui.escapeHtml(img.src) +
        '" data-alt="' +
        ui.escapeHtml(img.alt) +
        '"><img src="' +
        ui.escapeHtml(img.src) +
        '" alt=""></button>'
      );
    })
    .join("");

  thumbs.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-src]");
    if (!btn) return;
    thumbs.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("on", b === btn);
    });
    stage.src = btn.getAttribute("data-src");
    stage.alt = btn.getAttribute("data-alt");
  });

  stage.src = product.images[0].src;
  stage.alt = product.images[0].alt;

  function n() {
    const v = Number(qty.value);
    if (!Number.isFinite(v) || v < 1) return 1;
    return Math.min(5, Math.floor(v));
  }

  document.querySelectorAll("[data-step]").forEach(function (b) {
    b.addEventListener("click", function () {
      qty.value = String(Math.max(1, Math.min(5, n() + Number(b.getAttribute("data-step")))));
    });
  });

  document.getElementById("add").addEventListener("click", function () {
    window.RewrapBag.add(product.id, n());
    window.RewrapUI.openDrawer();
  });
})();
