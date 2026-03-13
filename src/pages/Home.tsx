import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import { Category, EventType } from '../types';

const CATEGORIES: Category[] = ['Sherwani', 'Jodhpuri Suit', 'Indo-Western', 'Tuxedo', 'Kurta', 'Accessories'];
const EVENTS: EventType[] = ['Wedding Ceremony', 'Reception', 'Engagement', 'Haldi', 'Festival Wear'];
const COLORS = ['Ivory', 'Gold', 'Black', 'Midnight Blue', 'Mint Green', 'Peach', 'Mustard Yellow', 'Maroon', 'Red', 'Pearl', 'Emerald'];
const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity }
];

export default function Home() {
  const products = useStore(state => state.products);
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedEvent, setSelectedEvent] = useState<EventType | 'All'>('All');
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');
  const [selectedPrice, setSelectedPrice] = useState<number | 'All'>('All');

  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && EVENTS.includes(eventParam as EventType)) {
      setSelectedEvent(eventParam as EventType);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchEvent = selectedEvent === 'All' || p.events.includes(selectedEvent);
      const matchColor = selectedColor === 'All' || p.colors.includes(selectedColor);
      let matchPrice = true;
      if (selectedPrice !== 'All') {
        const range = PRICE_RANGES[selectedPrice as number];
        matchPrice = p.price >= range.min && p.price <= range.max;
      }
      return matchCategory && matchEvent && matchColor && matchPrice;
    });
  }, [products, selectedCategory, selectedEvent, selectedColor, selectedPrice]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedEvent('All');
    setSelectedColor('All');
    setSelectedPrice('All');
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  return (
    <div className="px-4 py-6 md:py-8">
      {/* Header & Filter Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-pe-text">Discover</h1>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-pe-divider text-sm uppercase tracking-widest font-medium hover:bg-pe-surface transition-colors"
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-pe-dark shadow-2xl z-50 flex flex-col border-l border-pe-divider"
            >
              <div className="flex items-center justify-between p-6 border-b border-pe-divider">
                <h2 className="font-serif text-2xl text-pe-text">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 text-pe-text-muted hover:text-pe-text">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Category */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-pe-gold mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedCategory === 'All' ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                    >
                      All
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedCategory === cat ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-pe-gold mb-3">Event</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedEvent('All')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedEvent === 'All' ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                    >
                      All
                    </button>
                    {EVENTS.map(event => (
                      <button
                        key={event}
                        onClick={() => setSelectedEvent(event)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedEvent === event ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-pe-gold mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedColor('All')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedColor === 'All' ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                    >
                      All
                    </button>
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors ${selectedColor === color ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-pe-gold mb-3">Price Range</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedPrice('All')}
                      className={`px-4 py-3 rounded-xl text-sm transition-colors text-left ${selectedPrice === 'All' ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                    >
                      All Prices
                    </button>
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPrice(idx)}
                        className={`px-4 py-3 rounded-xl text-sm transition-colors text-left ${selectedPrice === idx ? 'bg-pe-gold text-pe-dark font-medium' : 'bg-pe-surface border border-pe-divider text-pe-text-muted hover:border-pe-gold/50'}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-pe-divider bg-pe-dark flex gap-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 bg-pe-surface border border-pe-divider text-pe-text rounded-full text-sm uppercase tracking-widest font-medium hover:bg-pe-divider transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-pe-gold text-pe-dark rounded-full text-sm uppercase tracking-widest font-medium hover:bg-pe-gold-light transition-colors shadow-md"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="mb-4"
          >
            <Link to={`/product/${product.id}`} className="block group relative overflow-hidden rounded-2xl bg-pe-surface shadow-md shadow-black/50 border border-transparent hover:border-pe-gold transition-colors duration-300">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-pe-text font-serif text-lg leading-tight">{product.name}</p>
                <p className="text-pe-gold text-xs uppercase tracking-widest mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              {product.suggestedAccessories && product.suggestedAccessories.length > 0 && (
                <div className="absolute top-3 left-3 bg-pe-dark/90 backdrop-blur-sm px-2.5 py-1 rounded-full z-10 border border-pe-gold/30">
                  <p className="text-[9px] uppercase tracking-widest font-medium text-pe-gold">Shop the Look</p>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </Masonry>
      
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-pe-text-muted">
          <p className="font-serif text-xl">No products found.</p>
          <button onClick={clearFilters} className="mt-4 px-6 py-2 border border-pe-divider rounded-full text-sm uppercase tracking-widest hover:bg-pe-surface transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
