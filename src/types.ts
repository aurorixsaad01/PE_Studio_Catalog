export type Category = 'Sherwani' | 'Jodhpuri Suit' | 'Indo-Western' | 'Tuxedo' | 'Kurta' | 'Accessories';
export type EventType = 'Wedding Ceremony' | 'Reception' | 'Engagement' | 'Haldi' | 'Sangeet Ceremony' | 'Festival Wear';

export interface EventCategory {
  name: EventType;
  title: string;
  subtitle: string;
  image: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  events: EventType[];
  price: number;
  sizes: string[];
  fabric: string;
  colors: string[];
  description: string;
  images: string[];
  video?: string;
  suggestedAccessories?: string[]; // IDs of other products
  createdAt: number;
}

export interface GalleryPost {
  id: string;
  groomName: string;
  weddingDate: string;
  outfitCategory: string;
  caption: string;
  images: string[];
  createdAt: number;
  approved: boolean;
  authorUid: string;
}
