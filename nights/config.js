/* Most Nights — a new shop. Not LDES. */

window.MOST_NIGHTS = {
  currency: "EUR",
  usdPerEur: 1.16,
  contactEmail: "khourypaul19@gmail.com",
  tiktok: "",
  instagram: "",

  week: {
    id: "week-01",
    label: "Week 01",
    dates: "18–24 August",
    feeds: "2 people · leftovers used on purpose",
    time: "25–40 min a night",
    previewUrl: "weeks/01.html",
    dinners: [
      { day: "Mon", name: "Tray chicken", note: "thighs, potatoes, carrots — one pan" },
      { day: "Tue", name: "Tuna tomato pasta", note: "peas in at the end" },
      { day: "Wed", name: "Chicken fried rice", note: "Monday’s leftover meat, plus eggs" },
      { day: "Thu", name: "Red lentil soup", note: "bread, yogurt, lemon" },
      { day: "Fri", name: "Omelette night", note: "salad and whatever roast veg is left" },
    ],
  },

  products: [
    {
      id: "week-now",
      name: "This week",
      price: 5,
      badge: "5 dinners · 1 list",
      description:
        "The card for this week: five dinners, one grocery list, times and quantities for two. Print it. Put it on the fridge.",
      includes: [
        "5 weeknight dinners",
        "One grocery list, by section",
        "What to cook first so leftovers work",
      ],
      checkoutUrl: "",
      previewUrl: "weeks/01.html",
      cta: "Read Week 01",
    },
    {
      id: "month",
      name: "Four weeks",
      price: 16,
      badge: "save €4",
      description:
        "A month of nights. New card each week. This is the product that becomes a habit — and a sale that repeats.",
      includes: [
        "4 weekly cards",
        "Same pantry, rotating dinners",
        "Sent as a pack (Gumroad)",
      ],
      checkoutUrl: "",
      status: "soon",
    },
    {
      id: "pantry",
      name: "The 15 staples",
      price: 6,
      badge: "once",
      description:
        "The small pantry that makes every list shorter. Buy this once. The weekly card assumes you have it.",
      includes: [
        "Oil, salt, paprika, chilli",
        "Pasta, rice, lentils",
        "The rest is the weekly bag",
      ],
      checkoutUrl: "",
      status: "soon",
    },
  ],
};
