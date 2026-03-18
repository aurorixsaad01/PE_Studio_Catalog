import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateEventCategory: (name: EventType, image: string) => void;
  updateHeroVideo: (url: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: [],
      eventCategories: INITIAL_EVENTS,
      heroVideo: "",
      setProducts: (products) => set({ products }),
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
    }),
    {
      name: 'pe-studio-storage',
      merge: (persistedState: any, currentState: StoreState) => {
        const mergedEventCategories = [...INITIAL_EVENTS];
        if (persistedState.eventCategories) {
          mergedEventCategories.forEach((event, index) => {
            const persistedEvent = persistedState.eventCategories.find((e: any) => e.name === event.name);
            if (persistedEvent) {
              mergedEventCategories[index] = persistedEvent;
            }
          });
        }
        return {
          ...currentState,
          ...persistedState,
          eventCategories: mergedEventCategories,
        };
      }
    }
  )
);
