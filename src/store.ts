import { create } from 'zustand';
import { Product, Category, EventType, EventCategory } from './types';

const INITIAL_EVENTS: EventCategory[] = [
  { name: 'Wedding Ceremony', title: 'Wedding Ceremony', subtitle: 'Regal Sherwanis & Safas', image: null },
  { name: 'Reception', title: 'Reception', subtitle: 'Tuxedos & Jodhpuri Suits', image: null },
  { name: 'Engagement', title: 'Engagement', subtitle: 'Indo-Western & Sharp Suits', image: null },
  { name: 'Haldi', title: 'Haldi', subtitle: 'Vibrant Kurtas & Nehru Jackets', image: null },
  { name: 'Sangeet Ceremony', title: 'Sangeet Ceremony', subtitle: 'Dazzling Outfits & Accessories', image: null },
  { name: 'Festival Wear', title: 'Festival Wear', subtitle: 'Classic Ethnic Ensembles', image: null },
];

interface StoreState {
  products: Product[];
  eventCategories: EventCategory[];
  heroVideo: string;
  setProducts: (products: Product[]) => void;
  setEventCategories: (categories: EventCategory[]) => void;
  setHeroVideo: (url: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateEventCategory: (name: EventType, image: string) => void;
  updateHeroVideo: (url: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  eventCategories: INITIAL_EVENTS,
  heroVideo: "",
  setProducts: (products) => set({ products }),
  setEventCategories: (eventCategories) => set({ eventCategories }),
  setHeroVideo: (heroVideo) => set({ heroVideo }),
  addProduct: (product) => set((state) => {
    const newProducts = product.featured 
      ? state.products.map(p => ({ ...p, featured: false }))
      : state.products;
    return { products: [product, ...newProducts] };
  }),
  updateProduct: (id, updatedFields) => set((state) => {
    const isSettingFeatured = updatedFields.featured === true;
    return {
      products: state.products.map(p => {
        if (p.id === id) {
          return { ...p, ...updatedFields };
        }
        if (isSettingFeatured) {
          return { ...p, featured: false };
        }
        return p;
      })
    };
  }),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  updateEventCategory: (name, image) => set((state) => ({
    eventCategories: state.eventCategories.map(e => e.name === name ? { ...e, image } : e)
  })),
  updateHeroVideo: (url) => set({ heroVideo: url })
}));
