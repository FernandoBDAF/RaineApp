export type DropCategory = "NEWBORN" | "TODDLER" | "FEEDING" | "WELLNESS" | "LIFESTYLE" | "GEAR";

export interface Drop {
  id: string;
  title: string;
  subtitle: string;
  category: DropCategory;
  coverColor: string;
  sections: DropSection[];
  createdAt: Date;
  publishedAt: Date;
}

export interface DropSection {
  id: string;
  title: string;
  items: DropItem[];
}

export interface DropItem {
  id: string;
  productName: string;
  description: string;
  photoURL: string;
  shopURL: string;
  priceRange?: string;
  brand?: string;
}

export interface HeartedItem {
  itemId: string;
  dropId: string;
  dropTitle: string;
  sectionId: string;
  productName: string;
  photoURL: string;
  shopURL: string;
  heartedAt: Date;
}
