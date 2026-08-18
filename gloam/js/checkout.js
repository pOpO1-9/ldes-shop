(function () {
  const store = window.GLOAM_STORE;
  const form = document.getElementById("checkout-form");
  const country = document.getElementById("country");
  const summary = document.getElementById("summary-lines");
  const empty = document.getElementById("checkout-empty");
  const pane = document.getElementById("checkout-pane");
  const totalEl = document.getElementById("pay-total");
  const dialog = document.getElementById("done");
  const ticketEl = document.getElementById("ticket");
  const nextBtn = document.getElementById("send-order");

  let pendingMailto = "";
  let pendingPay = "";

  function hasUrl(url) {
    return !!(url && /^https?:\/\//i.test(url));
  }

  function paintSummary() {
    const lines = window.GloamCart.lines();
    const hasItems = lines.length > 0;
    if (empty) empty.hidden = hasItems;
    if (pane) pane.hidden = !hasItems;
    if (!summary) return;
    summary.innerHTML = lines
      .map(function (line) {
        return (
          "<li><span>" +
          window.GloamUI.escapeHtml(line.product.name) +
          " × " +
          line.qty +
          "</span><span>" +
          window.GloamUI.money(line.lineTotal) +
          "</span></li>"
        );
      })
      .join("");
    if (totalEl) totalEl.textContent = window.GloamUI.money(window.GloamCart.subtotal());
  }

  if (country && store) {
    store.countries.forEach(function (name) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      country.appendChild(opt);
    });
  }

  function ticket() {
    const lines = window.GloamCart.lines();
    const name = (document.getElementById("name") || {}).value || "";
    const email = (document.getElementById("email") || {}).value || "";
    const phone = (document.getElementById("phone") || {}).value || "";
    const line1 = (document.getElementById("line1") || {}).value || "";
    const line2 = (document.getElementById("line2") || {}).value || "";
    const city = (document.getElementById("city") || {}).value || "";
    const postcode = (document.getElementById("postcode") || {}).value || "";
    const ctry = (document.getElementById("country") || {}).value || "";

    const items = lines
      .map(function (line) {
        return line.product.sku + "  " + line.product.name + " × " + line.qty;
      })
      .join("\n");

    return [
      "GLOAM ORDER",
      items,
      "Total " + window.GloamUI.money(window.GloamCart.subtotal()) + " · EU shipping included",
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
      "Fulfill from the supplier to this address. Do not ship from home.",
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
      if (!window.GloamCart.lines().length) return;
      if (!form.reportValidity()) return;

      const note = ticket();
      pendingMailto =
        "mailto:" +
        encodeURIComponent(store.email) +
        "?subject=" +
        encodeURIComponent("Gloam order") +
        "&body=" +
        encodeURIComponent(note);
      pendingPay = store.paymentUrl || "";

      if (ticketEl) ticketEl.textContent = note;
      if (nextBtn) {
        nextBtn.textContent = hasUrl(pendingPay) ? "Open payment" : "Email this order";
      }

      window.GloamUI.copyText(note).finally(function () {
        if (dialog && typeof dialog.showModal === "function") {
          dialog.showModal();
        } else if (hasUrl(pendingPay)) {
          window.open(pendingPay, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = pendingMailto;
        }
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (hasUrl(pendingPay)) {
        window.open(pendingPay, "_blank", "noopener,noreferrer");
        return;
      }
      if (pendingMailto) window.location.href = pendingMailto;
    });
  }

  window.GloamCart.onChange(paintSummary);
  paintSummary();
})();
