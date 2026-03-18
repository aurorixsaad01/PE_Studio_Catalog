import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Filter, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Category, EventType } from '../types';
import ProductImage from '../components/ProductImage';

const CATEGORIES: Category[] = ['Sherwani', 'Jodhpuri Suit', 'Indo-Western', 'Tuxedo', 'Kurta', 'Accessories'];
const EVENTS: EventType[] = ['Wedding Ceremony', 'Reception', 'Engagement', 'Haldi', 'Festival Wear'];
const COLORS = ['Ivory', 'Gold', 'Black', 'Midnight Blue', 'Mint Green', 'Peach', 'Mustard Yellow', 'Maroon', 'Red', 'Pearl', 'Emerald'];

export default function Home() {
  const products = useStore(state => state.products);
  const heroVideo = useStore(state => state.heroVideo);
  const featuredProduct = useMemo(() => products.find(p => p.featured), [products]);
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedEvent, setSelectedEvent] = useState<EventType | 'All'>('All');
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');

  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && EVENTS.includes(eventParam as EventType)) {
      setSelectedEvent(eventParam as EventType);
    }
  }, [searchParams]);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.id === featuredProduct?.id) return false;
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchEvent = selectedEvent === 'All' || p.events.includes(selectedEvent);
      const matchColor = selectedColor === 'All' || p.colors.includes(selectedColor);
      return matchCategory && matchEvent && matchColor;
    }).slice(0, 8); // Max 8 items initially
  }, [products, selectedCategory, selectedEvent, selectedColor, featuredProduct]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedEvent('All');
    setSelectedColor('All');
  };

  return (
    <div className="pb-12">
      {/* Hero Video Section */}
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[80vh] -mt-6 md:-mt-8 mb-16 overflow-hidden bg-black"
      >
        {heroVideo ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-80"
            src={heroVideo}
          />
        ) : (
          <div className="w-full h-full bg-pe-dark opacity-80" />
        )}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-auto pb-20"
          >
            <p className="text-pe-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-medium">
              Crafted for the Modern Groom
            </p>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8">
              Where Tradition <br/> Meets Power
            </h1>
            <button 
              onClick={() => {
                window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-[#d4af37] text-black rounded-full font-medium uppercase tracking-widest text-sm hover:scale-95 hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Explore Collection
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 md:px-0">
        {/* Header & Filter Toggle */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-pe-text">Curated Selection</h2>
          <button 
            onClick={() => setShowFilters(true)}
            className="ipad-button bg-pe-surface border border-pe-divider text-[13px] font-medium text-pe-text hover:scale-95 transition-transform"
          >
            <Filter size={16} className="mr-2" />
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
              className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-pe-surface shadow-2xl z-50 flex flex-col border-l border-pe-divider"
            >
              <div className="flex items-center justify-between p-6 border-b border-pe-divider">
                <h2 className="ipad-section-title text-pe-text">Filters</h2>
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
              </div>

              <div className="p-6 border-t border-pe-divider bg-pe-surface flex gap-4">
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

      {/* Featured Product Section (Split Layout) */}
      <AnimatePresence>
        {featuredProduct && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="flex flex-col md:flex-row bg-pe-surface rounded-[24px] overflow-hidden border border-pe-divider shadow-lg group">
              <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden bg-pe-surface border-r border-pe-divider">
                {featuredProduct.images && featuredProduct.images.length > 0 ? (
                  <ProductImage 
                    src={featuredProduct.images[0]} 
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-pe-gold text-xs uppercase tracking-[0.2em] mb-4 font-medium">Featured Masterpiece</p>
                <h2 className="text-pe-text text-3xl md:text-4xl font-serif leading-tight mb-4">
                  {featuredProduct.name}
                </h2>
                <p className="text-[#d4af37] font-medium text-lg tracking-[0.02em] mb-6">Visit store for pricing</p>
                <p className="text-pe-text-muted text-base leading-relaxed mb-8 font-light">
                  {featuredProduct.description}
                </p>
                <Link 
                  to={`/product/${featuredProduct.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-pe-text text-pe-surface rounded-full font-medium uppercase tracking-widest text-sm hover:scale-95 transition-all duration-300 w-fit"
                >
                  View Product <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[24px] mb-20">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/product/${product.id}`} className="block group relative overflow-hidden bg-pe-surface rounded-[16px] shadow-sm hover:shadow-xl transition-shadow duration-500">
              <div className="aspect-[3/4] w-full overflow-hidden bg-pe-surface">
                {product.images && product.images.length > 0 ? (
                  <ProductImage 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                    No Image
                  </div>
                )}
              </div>
              <div 
                className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
              >
                <p className="text-white font-serif text-xl leading-tight mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{product.name}</p>
                <p className="text-[#d4af37] font-medium text-[13px] tracking-[0.05em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">Visit store for pricing</p>
                <p className="text-white/60 text-[11px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 uppercase tracking-wider">Custom fittings available</p>
              </div>
              {product.suggestedAccessories && product.suggestedAccessories.length > 0 && (
                <div 
                  className="absolute top-[16px] left-[16px] px-[12px] py-[6px] rounded-full z-10 transition-all duration-300 hover:brightness-125 hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212,175,55,0.5)'
                  }}
                >
                  <p className="text-[11px] font-medium text-[#d4af37] uppercase tracking-wider">Shop the Look</p>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Real Grooms Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 bg-pe-surface rounded-[24px] p-8 md:p-12 border border-pe-divider text-center overflow-hidden relative"
      >
        <div className="relative z-10">
          <p className="text-pe-gold text-xs uppercase tracking-[0.2em] mb-4 font-medium">Social Proof</p>
          <h2 className="text-pe-text text-3xl md:text-4xl font-serif mb-6">Real Grooms Gallery</h2>
          <p className="text-pe-text-muted max-w-2xl mx-auto mb-12 font-light">
            Discover how real grooms styled their Pune Ethnic outfits for their special day. Get inspired by our community.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              "",
              "",
              "",
              ""
            ].map((img, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-pe-surface border border-pe-divider ${i % 2 === 0 ? 'md:translate-y-4' : 'md:-translate-y-4'}`}>
                {img ? (
                  <ProductImage src={img} alt="Real Groom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pe-text-muted text-sm">
                    Coming Soon
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500" />
              </div>
            ))}
          </div>

          <Link 
            to="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 border border-pe-gold text-pe-gold rounded-full font-medium uppercase tracking-widest text-sm hover:bg-pe-gold hover:text-pe-dark hover:scale-95 transition-all duration-300"
          >
            View Full Gallery
          </Link>
        </div>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-pe-text-muted">
          <p className="ipad-section-title">No products found.</p>
          <button onClick={clearFilters} className="mt-4 ipad-button border border-pe-divider hover:bg-pe-surface hover:scale-95 transition-transform">
            Clear Filters
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
