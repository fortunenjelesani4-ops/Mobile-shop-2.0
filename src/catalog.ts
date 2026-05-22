import { Product } from './types';

export const products: Product[] = [
  {
    id: "drip-001",
    name: "AURA Velvet Gold-Trim Bomber",
    description: "Tailored luxury bomber jacket crafted from custom high-density crushed black velvet. Detailed with hand-stitched pristine French gold-wire embroidery and industrial dual-zip hardware.",
    price: 320,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Obsidian Black", "Imperial Gold"],
    brand: "AURUM COUTURE",
    stock: 12,
    isTrending: true,
    isFlashSale: true,
    discountRate: 28
  },
  {
    id: "drip-002",
    name: "NOIR Signature Heavy-Knit Hoodie",
    description: "Premium heavy-cotton knit oversized hoodie with 500GSM fleece back loop structure. Complete with pristine matte silicon print hood lettering and luxury tactile gold aglets.",
    price: 150,
    rating: 4.8,
    reviewsCount: 389,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Streetwear",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Core Black", "Prestige White", "Vapor Sand"],
    brand: "DRIPLY STUDIOS",
    stock: 45,
    isTrending: true,
    isNew: true
  },
  {
    id: "drip-003",
    name: "PRESTIGE Silk Monogram Lounge Shirt",
    description: "Relaxed-fit lounge shirt made of organic Mulberry silk with an engineered monogram jacquard weave. High-contrast premium gold silk detailing along the lapel and cuffs.",
    price: 240,
    originalPrice: 240,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Classic Black", "Champagne Gold"],
    brand: "DRIPLY LUXE",
    stock: 18,
    isNew: true
  },
  {
    id: "drip-004",
    name: "PHANTOM Chrome-Plated Cargo Pants",
    description: "Architectural utility cargo trousers with customized chrome chains and brushed-metal zip compartments. Constructed from water-resistant military-grade satin twill.",
    price: 190,
    originalPrice: 280,
    rating: 4.9,
    reviewsCount: 201,
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Midnight Black", "Sage Gray"],
    brand: "PHANTOM TOKYO",
    stock: 8,
    isTrending: true,
    isFlashSale: true,
    discountRate: 32
  },
  {
    id: "drip-005",
    name: "APEX Tech-Combat High-Top Boots",
    description: "High-top tech combat boots featuring genuine full-grain leather, high-wear nylon panels, side-zip entry, and full gold-plated speed lacing. Grounded by a heavy rubber sole.",
    price: 280,
    rating: 4.9,
    reviewsCount: 164,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Footwear",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Triple Obsidian", "Glacier Sand"],
    brand: "APEX LABS",
    stock: 14,
    isTrending: true
  },
  {
    id: "drip-006",
    name: "SIREN liquid Gold Evening Gown",
    description: "Seductive backless evening gown woven with liquid-sheen gold lurex fibers. Body-sculpting silhouette that drapes elegantly with a high-action leg split.",
    price: 450,
    originalPrice: 600,
    rating: 5.0,
    reviewsCount: 74,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Outerwear",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Liquid Gold", "Onyx Satin"],
    brand: "AURUM COUTURE",
    stock: 5,
    isTrending: true,
    isNew: true
  },
  {
    id: "drip-007",
    name: "DRIPLY Gold Link Monogram Chain",
    description: "Heavy solid jeweler's brass base micro-plated in pure 18K yellow gold. Detailed with the bespoke signature DRIPLY structural monogram pattern along the primary clasp.",
    price: 110,
    rating: 4.6,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1611085583191-a3b1a1a27d81?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Streetwear",
    sizes: ["One Size"],
    colors: ["18K Gold"],
    brand: "DRIPLY LUXE",
    stock: 30,
    isTrending: true
  },
  {
    id: "drip-008",
    name: "VORTEX Matte Black Mesh Runners",
    description: "Futuristic active runner engineered with highly breathable double-layer spacer mesh. Encased in a responsive gold-accented TPU skeleton and premium gel carbon pods.",
    price: 210,
    rating: 4.8,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600"
    ],
    category: "Footwear",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Matte Obsidian/Gold", "Triple All-White"],
    brand: "DRIPLY SPORT",
    stock: 22,
    isFlashSale: true,
    discountRate: 15
  }
];
