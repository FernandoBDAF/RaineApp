import type { Drop } from "../types/drop";

export const mockDrops: Drop[] = [
  {
    id: "drop-1",
    title: "Bringing Baby Home",
    subtitle: "Everything you need for those magical first weeks",
    category: "NEWBORN",
    coverColor: "#F4B4B0",
    createdAt: new Date("2025-12-01"),
    publishedAt: new Date("2025-12-15"),
    sections: [
      {
        id: "s1-1",
        title: "Nursery Essentials",
        items: [
          {
            id: "item-1-1",
            productName: "Cloud Dream Bassinet",
            description:
              "A breathable, portable bassinet that keeps baby close during those first tender months.",
            photoURL: "https://picsum.photos/200/200?random=1",
            shopURL: "https://example.com/shop/cloud-dream-bassinet",
            brand: "Snoo & Co",
          },
          {
            id: "item-1-2",
            productName: "Organic Swaddle Set",
            description:
              "Ultra-soft organic cotton swaddles in calming neutral tones. Pack of three.",
            photoURL: "https://picsum.photos/200/200?random=2",
            shopURL: "https://example.com/shop/organic-swaddle-set",
            brand: "Little Nest",
          },
          {
            id: "item-1-3",
            productName: "White Noise Sound Machine",
            description:
              "Gentle sound machine with lullabies and nature sounds for restful sleep.",
            photoURL: "https://picsum.photos/200/200?random=3",
            shopURL: "https://example.com/shop/white-noise-sound-machine",
            brand: "Hushh",
          },
        ],
      },
      {
        id: "s1-2",
        title: "Feeding Must-Haves",
        items: [
          {
            id: "item-1-4",
            productName: "Nursing Pillow Luxe",
            description:
              "Ergonomic nursing pillow with washable cover designed for all-day comfort.",
            photoURL: "https://picsum.photos/200/200?random=4",
            shopURL: "https://example.com/shop/nursing-pillow-luxe",
            brand: "Boppy",
          },
          {
            id: "item-1-5",
            productName: "Anti-Colic Bottle Set",
            description:
              "Clinically proven bottles that reduce colic, gas, and fussiness.",
            photoURL: "https://picsum.photos/200/200?random=5",
            shopURL: "https://example.com/shop/anti-colic-bottle-set",
            brand: "Dr. Brown's",
          },
        ],
      },
      {
        id: "s1-3",
        title: "On-the-Go Gear",
        items: [
          {
            id: "item-1-6",
            productName: "Compact Stroller",
            description:
              "Lightweight one-hand fold stroller perfect for city parents on the move.",
            photoURL: "https://picsum.photos/200/200?random=6",
            shopURL: "https://example.com/shop/compact-stroller",
            brand: "Babyzen",
          },
          {
            id: "item-1-7",
            productName: "Diaper Bag Backpack",
            description:
              "Stylish backpack with insulated pockets, changing mat, and stroller straps.",
            photoURL: "https://picsum.photos/200/200?random=7",
            shopURL: "https://example.com/shop/diaper-bag-backpack",
            brand: "Dagne Dover",
          },
          {
            id: "item-1-8",
            productName: "Infant Car Seat",
            description:
              "Top-rated rear-facing car seat with easy-click base installation.",
            photoURL: "https://picsum.photos/200/200?random=8",
            shopURL: "https://example.com/shop/infant-car-seat",
            brand: "Nuna",
          },
        ],
      },
    ],
  },
  {
    id: "drop-2",
    title: "Jet Set Baby",
    subtitle: "Travel-ready picks for adventurous families",
    category: "TODDLER",
    coverColor: "#F0D043",
    createdAt: new Date("2026-01-05"),
    publishedAt: new Date("2026-01-10"),
    sections: [
      {
        id: "s2-1",
        title: "Flight Essentials",
        items: [
          {
            id: "item-2-1",
            productName: "Travel Crib Lite",
            description:
              "Folds down to backpack size and sets up in seconds. FAA approved.",
            photoURL: "https://picsum.photos/200/200?random=9",
            shopURL: "https://example.com/shop/travel-crib-lite",
            brand: "Lotus",
          },
          {
            id: "item-2-2",
            productName: "Noise-Canceling Baby Earmuffs",
            description:
              "Soft padded earmuffs designed for infants to protect tiny ears during flights.",
            photoURL: "https://picsum.photos/200/200?random=10",
            shopURL: "https://example.com/shop/noise-canceling-baby-earmuffs",
            brand: "BanZ",
          },
        ],
      },
      {
        id: "s2-2",
        title: "Beach & Sun",
        items: [
          {
            id: "item-2-3",
            productName: "Baby Sun Suit UPF 50+",
            description:
              "Full-coverage rashguard swimsuit with built-in sun protection.",
            photoURL: "https://picsum.photos/200/200?random=11",
            shopURL: "https://example.com/shop/baby-sun-suit",
            brand: "SwimZip",
          },
          {
            id: "item-2-4",
            productName: "Pop-Up Beach Tent",
            description:
              "Instant shade tent with UV protection — perfect for beach days with littles.",
            photoURL: "https://picsum.photos/200/200?random=12",
            shopURL: "https://example.com/shop/pop-up-beach-tent",
            brand: "Pacific Breeze",
          },
        ],
      },
    ],
  },
  {
    id: "drop-3",
    title: "Tiny Foodie",
    subtitle: "Curated picks to make mealtime fun and easy",
    category: "FEEDING",
    coverColor: "#B0BAC5",
    createdAt: new Date("2026-01-20"),
    publishedAt: new Date("2026-02-01"),
    sections: [
      {
        id: "s3-1",
        title: "First Bites",
        items: [
          {
            id: "item-3-1",
            productName: "Silicone Suction Plate Set",
            description:
              "Non-slip divided plates that stick to any surface. Dishwasher safe.",
            photoURL: "https://picsum.photos/200/200?random=13",
            shopURL: "https://example.com/shop/silicone-suction-plate-set",
            brand: "ezpz",
          },
          {
            id: "item-3-2",
            productName: "Pre-Spoon Training Set",
            description:
              "Textured self-feeding spoons designed for baby-led weaning beginners.",
            photoURL: "https://picsum.photos/200/200?random=14",
            shopURL: "https://example.com/shop/pre-spoon-training-set",
            brand: "NumNum",
          },
        ],
      },
      {
        id: "s3-2",
        title: "Highchair & Bibs",
        items: [
          {
            id: "item-3-3",
            productName: "Modern Wooden Highchair",
            description:
              "Scandinavian-design highchair that grows with your child from 6 months to 12 years.",
            photoURL: "https://picsum.photos/200/200?random=15",
            shopURL: "https://example.com/shop/modern-wooden-highchair",
            brand: "Stokke",
          },
          {
            id: "item-3-4",
            productName: "Coverall Bib with Sleeves",
            description:
              "Waterproof full-coverage bib that keeps clothes spotless during messy meals.",
            photoURL: "https://picsum.photos/200/200?random=16",
            shopURL: "https://example.com/shop/coverall-bib-with-sleeves",
            brand: "BabyBjörn",
          },
        ],
      },
    ],
  },
];
