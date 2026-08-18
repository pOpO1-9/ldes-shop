# Gloam

Standalone storefront for **one product**: a USB-C sunset lamp (€39, EU shipping included).

This folder is the whole project. It does not share code, styles, or branding with any other site in a parent repository. To run it as its own site, copy **this directory** to the root of a new GitHub repo (or a Vercel/Netlify project) and deploy.

## Local

```bash
cd gloam
python3 -m http.server 4173
```

Open http://127.0.0.1:4173/

## Pages

| File | Role |
| --- | --- |
| `index.html` | Product |
| `checkout.html` | Address + order ticket |
| `shipping.html` | Shipping and returns |
| `js/catalog.js` | Catalog + `paymentUrl` |
| `ops.md` | Supplier, sample, payment |

## Take money

1. Create a physical-product checkout (Gumroad or Stripe Payment Link) at €39 that collects a shipping address.
2. Paste the URL into `js/catalog.js` → `paymentUrl`.
3. Until that URL exists, checkout emails a fulfillment ticket. Do not ship unpaid orders.

## Fulfillment

Dropshipping: you never hold stock. After payment, order the same SKU from the supplier **to the buyer’s address**. Details in `ops.md`.
