# Rewrap

Standalone shop. One product: **a sleeve of 12 padel overgrips** (€16, EU postage included).

This folder is the whole project. Copy it to its own repo to deploy separately. It does not share code with any other site in a parent folder.

## Why this exists

Players already buy overgrips. The handle dies. The club sells them one at a time. A twelve-pack in the bag is a month of sessions if you play twice a week. That is a repurchase, not a décor lamp.

## Local

```bash
cd rewrap
python3 -m http.server 4173
```

## Take money

Paste a physical checkout URL into `js/catalog.js` → `paymentUrl`. Until then, checkout emails a ticket. Do not ship unpaid packs.

Supplier and sample steps: `ops.md`.
