/* LDES shop — packs, gallery editions, NFT hooks */

window.LDES_CONFIG = {
  currency: "EUR",
  currencySymbol: "€",
  usdPerEur: 1.16,
  tiktok: "https://www.tiktok.com/@ldes.ai",
  contactEmail: "khourypaul19@gmail.com",

  /**
   * NFT / blockchain — Phase 2
   * Keep downloads on Gumroad now. When ready, set enabled:true and paste
   * mint URLs (Thirdweb / Manifold / Zora) per gallery piece.
   * Recommended first chain: Base (cheap) or Solana.
   */
  nft: {
    enabled: true,
    chainLabel: "Base",
    comingCopy:
      "Collect on Zora (Base) — trade the piece on-chain. File packs still download instantly via Buy file.",
    profileUrl: "https://zora.co/@ldes_ai",
  },

  products: [
    {
      id: "dream-clips-01",
      name: "Dream Clip Pack 01",
      kind: "clips",
      price: 29,
      badge: "5 clips · 9:16",
      image: "assets/pack-clips.jpg",
      description:
        "Five vertical loops from the lab — mist temples, pocket worlds, quiet surreal rooms. Post-ready.",
      includes: [
        "5 × MP4 vertical clips (~5s)",
        "1080×1920, ready to post",
        "Commercial use for your socials",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES",
    },
    {
      id: "wallpaper-01",
      name: "Wallpaper Pack 01",
      kind: "stills",
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
    {
      id: "dream-clips-02",
      name: "Dream Clip Pack 02 — Pocket Worlds",
      kind: "clips",
      price: 29,
      badge: "5 clips · Pocket worlds",
      image: "assets/pack-clips-02.jpg",
      description:
        "Teacup villages, glass-bottle oceans, moonlit keyholes. Same LDES calm, new doors.",
      includes: [
        "5 × MP4 vertical clips (~5–6s)",
        "720×1280, ready to post",
        "Commercial use for your socials",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_02",
    },
    {
      id: "dream-clips-03",
      name: "Dream Clip Pack 03 — Night Harbor",
      kind: "clips",
      price: 29,
      badge: "5 clips · Night harbor",
      image: "assets/pack-clips-03.jpg",
      description:
        "Wet docks, fog ferries, cobble rain, breakwater light. Quiet harbor nights from the lab.",
      includes: [
        "5 × MP4 vertical clips (~5s)",
        "720×1280, ready to post",
        "Commercial use for your socials",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_03",
    },
    {
      id: "wallpaper-02",
      name: "Wallpaper Pack 02",
      kind: "stills",
      price: 12,
      badge: "8 stills · Deep quiet",
      image: "assets/pack-walls-02.jpg",
      description:
        "Eight lockscreens from pocket worlds and night harbor — teacup village, bottle ocean, cobble rain.",
      includes: [
        "8 × high-res stills",
        "Phone + desktop sizes",
        "Personal use on your devices",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_W2",
    },
    {
      id: "seamless-loops-01",
      name: "Seamless Loop Pack 01",
      kind: "loops",
      price: 24,
      badge: "4 loops · ambient",
      image: "assets/pack-loops.jpg",
      description:
        "Four seamless ambient loops for Stories, streams, and calm edits.",
      includes: [
        "4 × seamless MP4 loops (~5s)",
        "720×1280 vertical",
        "Social + stream overlay use",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_Loop",
    },
    {
      id: "creator-bundle-01",
      name: "Creator Bundle 01",
      kind: "bundle",
      price: 35,
      badge: "clips + walls · save €6",
      image: "assets/pack-bundle.jpg",
      description:
        "Dream Clip Pack 01 + Wallpaper Pack 01. Best starter set.",
      includes: [
        "All 5 clips from Pack 01",
        "All 8 wallpapers from Pack 01",
        "One download, both packs",
      ],
      checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_Bundle",
    },
  ],

  /**
   * Gallery editions — browse like a museum, buy file now,
   * mint NFT later when nft.enabled + mintUrl are set.
   */
  gallery: [
    {
      id: "ed-mist-harbor",
      title: "Mist Harbor",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_01_Mist_Harbor.jpg",
      blurb: "Boat bow into fog — green portal on the water.",
      edition: "Zora coin · $MIST",
      supply: "0x23a7…04ef",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl:
        "https://zora.co/coin/base:0x23a764686e5950fedf2d4715ea5e00a0d45304ef",
      contract: "0x23a764686e5950fedf2d4715ea5e00a0d45304ef",
      status: "live",
    },
    {
      id: "ed-fog-train",
      title: "Fog Train",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_02_Fog_Train.jpg",
      blurb: "Night rails through pine mist toward a lit house.",
      edition: "Zora coin · $FOG",
      supply: "0x69ff…779d",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl:
        "https://zora.co/coin/base:0x69ffe7e338a303d397ef37e32ffff005ab11779d",
      contract: "0x69ffe7e338a303d397ef37e32ffff005ab11779d",
      status: "live",
    },
    {
      id: "ed-library",
      title: "Library Letters",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_03_Library_Letters.jpg",
      blurb: "Shelves that spell the lab — LDES hidden in the dark.",
      edition: "Zora coin · $LIBRARY",
      supply: "0x214f…35a7",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl:
        "https://zora.co/coin/base:0x214fdad9ae95d97fb49fa02d5a8b03678be335a7",
      contract: "0x214fdad9ae95d97fb49fa02d5a8b03678be335a7",
      status: "live",
    },
    {
      id: "ed-mountain",
      title: "Mountain Keyhole",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_04_Mountain_Keyhole.jpg",
      blurb: "A face in stone. A keyhole under the eye.",
      edition: "Zora coin · $KEYHOLE",
      supply: "0x2763…9e32",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl:
        "https://zora.co/coin/base:0x27631f25b99f077b2ddfd68f9942ea81322b9e32",
      contract: "0x27631f25b99f077b2ddfd68f9942ea81322b9e32",
      status: "live",
    },
    {
      id: "ed-forge",
      title: "Forge Street",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_05_Forge_Street.jpg",
      blurb: "Warm forge light under a cold mountain wall.",
      edition: "Open edition · file",
      supply: "∞ file / NFT TBD",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl: "",
      status: "live",
    },
    {
      id: "ed-courtyard",
      title: "Courtyard Dusk",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_06_Courtyard_Dusk.jpg",
      blurb: "Lanterns, runes, and smoke at the edge of evening.",
      edition: "Open edition · file",
      supply: "∞ file / NFT TBD",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl: "",
      status: "live",
    },
    {
      id: "ed-lighthouse",
      title: "Lighthouse Path",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_07_Lighthouse_Path.jpg",
      blurb: "Stone steps into black water and a single beam.",
      edition: "Open edition · file",
      supply: "∞ file / NFT TBD",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl: "",
      status: "live",
    },
    {
      id: "ed-cabin",
      title: "Cabin Reflection",
      series: "Wallpaper Pack 01",
      image: "assets/gallery/LDES_Wall_08_Cabin_Reflection.jpg",
      blurb: "Empty boat. One window lit across the mist.",
      edition: "Open edition · file",
      supply: "∞ file / NFT TBD",
      priceFile: 12,
      buyPackId: "wallpaper-01",
      mintUrl: "",
      status: "live",
    },
    {
      id: "ed-teacup",
      title: "Teacup Village",
      series: "Dream Clip Pack 02",
      image: "assets/gallery/LDES_Clip_01_Teacup_Village.jpg",
      blurb: "A glowing town sealed in porcelain — Pack 02.",
      edition: "Limited mint soon",
      supply: "NFT 1/25 planned",
      priceFile: 29,
      buyPackId: "dream-clips-02",
      mintUrl: "",
      status: "soon",
    },
    {
      id: "ed-bottle",
      title: "Bottle Ocean",
      series: "Dream Clip Pack 02",
      image: "assets/gallery/LDES_Clip_02_Bottle_Ocean.jpg",
      blurb: "Storm sea corked on a rainy sill.",
      edition: "Limited mint soon",
      supply: "NFT 1/25 planned",
      priceFile: 29,
      buyPackId: "dream-clips-02",
      mintUrl: "",
      status: "soon",
    },
  ],

  custom: {
    price: 79,
    image: "assets/pack-custom.jpg",
    checkoutUrl: "https://paulkinetic25.gumroad.com/l/LDES_Custom",
  },

  /**
   * Productized studio work — not consulting.
   * Create Gumroad LDES_Brand at this price, then paste checkoutUrl.
   */
  brand: {
    price: 249,
    checkoutUrl: "",
    mailto:
      "mailto:khourypaul19@gmail.com?subject=LDES%20brand%20scene&body=What%20should%20appear%20in%20the%20scene%3A%0A%0AWhere%20it%20will%20be%20used%20(TikTok%20%2F%20site%20%2F%20ads)%3A%0A%0ALink%20to%20the%20thing%3A%0A",
  },
};
