(function () {
  const store = window.REWRAP;
  const form = document.getElementById("form");
  const country = document.getElementById("country");
  const empty = document.getElementById("empty");
  const pane = document.getElementById("pane");
  const linesEl = document.getElementById("lines");
  const totalEl = document.getElementById("total");
  const dialog = document.getElementById("done");
  const ticketEl = document.getElementById("ticket");
  const send = document.getElementById("send");
  let mail = "";
  let pay = "";

  function url(u) {
    return !!(u && /^https?:\/\//i.test(u));
  }

  function paint() {
    const lines = window.RewrapBag.lines();
    const has = lines.length > 0;
    empty.hidden = has;
    pane.hidden = !has;
    linesEl.innerHTML = lines
      .map(function (l) {
        return (
          "<li><span>" +
          window.RewrapUI.escapeHtml(l.product.name) +
          " × " +
          l.qty +
          "</span><span>" +
          window.RewrapUI.money(l.lineTotal) +
          "</span></li>"
        );
      })
      .join("");
    totalEl.textContent = window.RewrapUI.money(window.RewrapBag.subtotal());
  }

  store.countries.forEach(function (c) {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    country.appendChild(o);
  });

  function ticket() {
    const items = window.RewrapBag.lines()
      .map(function (l) {
        return l.product.sku + "  " + l.product.name + " × " + l.qty;
      })
      .join("\n");
    return [
      "REWRAP ORDER",
      items,
      "Total " + window.RewrapUI.money(window.RewrapBag.subtotal()) + " · EU shipping included",
      "",
      "Ship to:",
      (document.getElementById("full-name").value || "").trim(),
      (document.getElementById("line1").value || "").trim(),
      (document.getElementById("line2").value || "").trim(),
      (
        (document.getElementById("postcode").value || "") +
        " " +
        (document.getElementById("city").value || "")
      ).trim(),
      country.value,
      "",
      "Email: " + (document.getElementById("email").value || "").trim(),
      "Phone: " + (document.getElementById("phone").value || "").trim(),
      "",
      "Fulfill from the supplier to this address.",
    ].join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!window.RewrapBag.lines().length) return;
    if (!form.reportValidity()) return;
    const note = ticket();
    mail =
      "mailto:" +
      encodeURIComponent(store.email) +
      "?subject=" +
      encodeURIComponent("Rewrap order") +
      "&body=" +
      encodeURIComponent(note);
    pay = store.paymentUrl || "";
    ticketEl.textContent = note;
    send.textContent = url(pay) ? "Open payment" : "Email this order";
    window.RewrapUI.copyText(note).finally(function () {
      if (dialog && dialog.showModal) dialog.showModal();
      else if (url(pay)) window.open(pay, "_blank", "noopener,noreferrer");
      else window.location.href = mail;
    });
  });

  send.addEventListener("click", function () {
    if (url(pay)) window.open(pay, "_blank", "noopener,noreferrer");
    else if (mail) window.location.href = mail;
  });

  window.RewrapBag.onChange(paint);
  paint();
})();
