/* LDES shop — edit products & checkout links here */

window.LDES_CONFIG = {
  currencySymbol: "$",
  tiktok: "https://www.tiktok.com/@ldes.ai",
  // Used when custom.checkoutUrl is empty
  contactEmail: "",

  products: [
    {
      id: "dream-clips-01",
      name: "Dream Clip Pack 01",
      price: 29,
      badge: "5 clips · 9:16",
      image: "assets/pack-clips.jpg",
      description:
        "Five vertical loops from the lab — mist temples, pocket worlds, quiet surreal rooms. Post-ready.",
      includes: [
        "5 × MP4 vertical clips (~15s)",
        "1080×1920, ready to post",
        "Commercial use for your socials",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES",
    },
    {
      id: "wallpaper-01",
      name: "Wallpaper Pack 01",
      price: 12,
      badge: "8 stills",
      image: "assets/pack-walls.jpg",
      description:
        "Eight stills for phone and desktop. Soft glow, deep quiet — same worlds as @ldes.ai.",
      includes: [
        "8 × high-res stills",
        "Phone + desktop sizes",
        "Personal use on your devices",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_W",
    },
  ],

  custom: {
    price: 79,
    image: "assets/pack-custom.jpg",
    checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_Custom",
  },
};
