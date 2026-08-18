/* Gloam — a new shop. Not LDES. One lamp, dropshipped. */

window.GLOAM = {
  currency: "EUR",
  usdPerEur: 1.16,
  contactEmail: "khourypaul19@gmail.com",
  tiktok: "",
  instagram: "",

  /**
   * Paste the Gumroad physical-product URL here once it exists.
   * Until then, checkout emails a fulfillment ticket to you.
   */
  checkoutUrl: "",

  product: {
    id: "gloam-lamp",
    sku: "GLOAM-LAMP-01",
    name: "The Lamp",
    price: 39,
    badge: "USB-C · ships to the door",
    tagline: "A circle of dusk on the wall.",
    description:
      "A small projector lamp. Plug it in, tilt the head, put a sunset on the wall. That is the whole product.",
    shippingNote: "Free in the EU · 7–14 days typical",
    shipsFrom: "EU warehouse when the supplier has stock; otherwise from the factory (longer).",
    includes: [
      "1 × sunset projector lamp, matte black",
      "USB-C cable",
      "Ships in a plain carton — we do not warehouse this",
    ],
    specs: [
      { label: "Power", value: "USB-C, 5V" },
      { label: "Head", value: "Tilts 180°" },
      { label: "Finish", value: "Matte black" },
      { label: "Use", value: "Indoor, a quiet wall" },
    ],
    images: [
      {
        src: "assets/gloam-hero.jpg",
        alt: "The lamp on a side table, projecting a gold circle on the wall",
      },
      {
        src: "assets/gloam-product.jpg",
        alt: "Studio shot of the matte black lamp and USB-C cable",
      },
      {
        src: "assets/gloam-wall.jpg",
        alt: "Close view of the dusk circle on a bedroom wall",
      },
      {
        src: "assets/gloam-contents.jpg",
        alt: "Lamp, cable, and a plain kraft mailer on a table",
      },
    ],
  },

  countries: [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ],
};
