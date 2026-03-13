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

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Royal Ivory Sherwani',
    category: 'Sherwani',
    events: ['Wedding Ceremony'],
    price: 45000,
    sizes: ['38', '40', '42', '44'],
    fabric: 'Raw Silk',
    colors: ['Ivory', 'Gold'],
    description: 'A masterpiece of traditional craftsmanship, this ivory sherwani features intricate zardozi embroidery. Perfect for the modern groom who appreciates classic elegance.',
    images: [
      'https://picsum.photos/seed/sherwani1/800/1200',
      'https://picsum.photos/seed/sherwani1_detail/800/1200'
    ],
    suggestedAccessories: ['p6', 'p7', 'p8', 'p9'],
    createdAt: Date.now(),
  },
  {
    id: 'p2',
    name: 'Midnight Blue Jodhpuri',
    category: 'Jodhpuri Suit',
    events: ['Reception', 'Engagement'],
    price: 32000,
    sizes: ['38', '40', '42'],
    fabric: 'Italian Velvet',
    colors: ['Midnight Blue', 'Black'],
    description: 'Exude royal charm in this tailored Jodhpuri suit. The rich velvet fabric and structured silhouette make it an ideal choice for evening receptions.',
    images: [
      'https://picsum.photos/seed/jodhpuri1/800/1200',
      'https://picsum.photos/seed/jodhpuri1_side/800/1200'
    ],
    suggestedAccessories: ['p8'],
    createdAt: Date.now() - 1000,
  },
  {
    id: 'p3',
    name: 'Pastel Mint Indo-Western',
    category: 'Indo-Western',
    events: ['Engagement', 'Festival Wear'],
    price: 28000,
    sizes: ['36', '38', '40', '42'],
    fabric: 'Jacquard Silk',
    colors: ['Mint Green', 'Peach'],
    description: 'A contemporary take on ethnic wear. This asymmetrical Indo-Western set in pastel mint is perfect for daytime events and engagements.',
    images: [
      'https://picsum.photos/seed/indowestern1/800/1200'
    ],
    createdAt: Date.now() - 2000,
  },
  {
    id: 'p4',
    name: 'Classic Black Tuxedo',
    category: 'Tuxedo',
    events: ['Reception'],
    price: 35000,
    sizes: ['38', '40', '42', '44', '46'],
    fabric: 'Premium Wool Blend',
    colors: ['Black'],
    description: 'The quintessential black tuxedo with satin lapels. Tailored to perfection for a sharp, sophisticated look at any formal reception.',
    images: [
      'https://picsum.photos/seed/tuxedo1/800/1200'
    ],
    createdAt: Date.now() - 3000,
  },
  {
    id: 'p5',
    name: 'Mustard Yellow Kurta Set',
    category: 'Kurta',
    events: ['Haldi', 'Festival Wear'],
    price: 12000,
    sizes: ['38', '40', '42'],
    fabric: 'Cotton Silk',
    colors: ['Mustard Yellow'],
    description: 'Bright and festive, this comfortable cotton silk kurta is designed specifically for Haldi ceremonies and vibrant daytime celebrations.',
    images: [
      'https://picsum.photos/seed/kurta1/800/1200'
    ],
    createdAt: Date.now() - 4000,
  },
  {
    id: 'p6',
    name: 'Embroidered Safa',
    category: 'Accessories',
    events: ['Wedding Ceremony'],
    price: 5500,
    sizes: ['Free Size'],
    fabric: 'Chanderi Silk',
    colors: ['Gold', 'Red'],
    description: 'A regal safa (turban) adorned with subtle embroidery, completing the traditional groom look.',
    images: [
      'https://picsum.photos/seed/safa1/800/800'
    ],
    createdAt: Date.now() - 5000,
  },
  {
    id: 'p7',
    name: 'Maroon Velvet Stole',
    category: 'Accessories',
    events: ['Wedding Ceremony', 'Reception'],
    price: 4500,
    sizes: ['Free Size'],
    fabric: 'Velvet',
    colors: ['Maroon', 'Gold'],
    description: 'A rich maroon velvet stole with heavy gold border work. Adds a royal touch to any Sherwani or Jodhpuri suit.',
    images: [
      'https://picsum.photos/seed/stole1/800/1200'
    ],
    createdAt: Date.now() - 6000,
  },
  {
    id: 'p8',
    name: 'Gold Embroidered Mojari',
    category: 'Accessories',
    events: ['Wedding Ceremony', 'Festival Wear'],
    price: 3500,
    sizes: ['8', '9', '10', '11'],
    fabric: 'Leather & Silk',
    colors: ['Gold'],
    description: 'Traditional handcrafted mojaris featuring intricate zari embroidery. Designed for comfort and style.',
    images: [
      'https://picsum.photos/seed/mojari1/800/800'
    ],
    createdAt: Date.now() - 7000,
  },
  {
    id: 'p9',
    name: 'Kundan Pearl Mala',
    category: 'Accessories',
    events: ['Wedding Ceremony'],
    price: 8500,
    sizes: ['Free Size'],
    fabric: 'Semi-precious stones',
    colors: ['Pearl', 'Emerald'],
    description: 'A multi-layered pearl mala with a statement Kundan pendant. The perfect jewelry piece for the groom.',
    images: [
      'https://picsum.photos/seed/mala1/800/800'
    ],
    createdAt: Date.now() - 8000,
  }
];

interface StoreState {
  products: Product[];
  eventCategories: EventCategory[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateEventCategory: (name: EventType, image: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      eventCategories: INITIAL_EVENTS,
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      updateEventCategory: (name, image) => set((state) => ({
        eventCategories: state.eventCategories.map(e => e.name === name ? { ...e, image } : e)
      }))
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
