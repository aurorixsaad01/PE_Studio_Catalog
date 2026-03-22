import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Filter, X, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Category, EventType, GalleryPost } from '../types';
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
  
  // Gallery Posts State
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'gallery_posts'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryPost[];
      setGalleryPosts(posts);
      setGalleryLoading(false);
    }, (error) => {
      console.error("Error fetching gallery posts:", error);
      setGalleryLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && EVENTS.includes(eventParam as EventType)) {
      setSelectedEvent(eventParam as EventType);
    }
  }, [searchParams]);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

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
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[100dvh] -mt-16 mb-16 overflow-hidden bg-black"
      >
        {heroVideo ? (
          <motion.video 
            style={{ scale: heroScale }}
            autoPlay 
            muted 
            loop 
            playsInline
            preload="none"
            poster="https://res.cloudinary.com/dqxlc84z6/image/upload/v1773854426/Gemini_Generated_Image_hfx07ahfx07ahfx0_bnzxnh.png"
            className="w-full h-full object-cover object-center opacity-90"
            src={heroVideo}
          />
        ) : (
          <motion.div style={{ scale: heroScale }} className="w-full h-full bg-pe-dark opacity-90" />
        )}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-black/40 via-black/20 to-black/80"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-auto pb-24 md:pb-32"
          >
            <p className="text-pe-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-medium drop-shadow-md">
              Crafted for the Modern Groom
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 drop-shadow-lg">
              Where Tradition <br/> Meets Power
            </h1>
            <button 
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
              className="ios-btn ios-btn-primary px-8 py-4 text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(197,160,89,0.4)]"
            >
              Explore Collection
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 md:px-0">
        {/* Header & Filter Toggle */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-pe-text">Curated Selection</h2>
          <button 
            onClick={() => setShowFilters(true)}
            className="ios-btn ios-btn-secondary flex items-center gap-2"
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
              className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-pe-surface shadow-2xl z-50 flex flex-col border-l border-pe-divider"
            >
              <div className="flex items-center justify-between p-6 border-b border-pe-divider">
                <h2 className="text-lg font-semibold text-pe-text">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 text-pe-text-muted hover:text-pe-text transition-colors">
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
                  className="flex-1 ios-btn ios-btn-secondary"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 ios-btn ios-btn-primary"
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
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row ios-card overflow-hidden group">
              <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:h-[500px] overflow-hidden bg-pe-surface border-r border-pe-divider">
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
              <div className="w-full md:w-1/2 p-5 md:p-10 flex flex-col justify-center">
                <p className="text-pe-gold text-xs font-medium uppercase tracking-wider mb-2 md:mb-3">Featured Masterpiece</p>
                <h2 className="text-pe-text text-2xl md:text-3xl font-semibold leading-tight mb-2 md:mb-3">
                  {featuredProduct.name}
                </h2>
                <p className="text-pe-text-muted text-sm md:text-base mb-3 md:mb-4">Visit store for pricing</p>
                <p className="text-pe-text-muted text-sm leading-relaxed mb-6 md:mb-8 line-clamp-3">
                  {featuredProduct.description}
                </p>
                <Link 
                  to={`/product/${featuredProduct.id}`}
                  className="ios-btn ios-btn-primary w-fit inline-flex items-center"
                >
                  View Product <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/product/${product.id}`} className="block group relative overflow-hidden ios-card p-0">
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
                className="absolute inset-0 flex flex-col justify-end p-3 md:p-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
              >
                <p className="text-white font-semibold text-base md:text-lg leading-tight mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{product.name}</p>
                <p className="text-white/80 text-xs transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">Visit store for pricing</p>
              </div>
              {product.suggestedAccessories && product.suggestedAccessories.length > 0 && (
                <div 
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full z-10 ios-glass animate-shine"
                >
                  <p className="text-[10px] font-medium text-white uppercase tracking-wider">Shop the Look</p>
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
        className="mb-12 ios-card p-6 md:p-10 text-center overflow-hidden relative"
      >
        <div className="relative z-10">
          <p className="text-pe-gold text-xs font-medium uppercase tracking-wider mb-2 md:mb-3">Social Proof</p>
          <h2 className="text-pe-text text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Real Grooms Gallery</h2>
          <p className="text-pe-text-muted text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-10">
            Discover how real grooms styled their Pune Ethnic outfits for their special day. Get inspired by our community.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {galleryLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-pe-surface border border-pe-divider animate-shimmer ${i % 2 === 0 ? 'md:translate-y-4' : 'md:-translate-y-4'}`} />
              ))
            ) : galleryPosts.length > 0 ? (
              galleryPosts.map((post, i) => (
                <div key={post.id} className={`relative rounded-xl overflow-hidden aspect-[3/4] bg-pe-surface border border-pe-divider group ${i % 2 === 0 ? 'md:translate-y-4' : 'md:-translate-y-4'}`}>
                  {post.images?.[0] ? (
                    <ProductImage 
                      src={post.images[0]} 
                      alt={post.groomName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pe-text-muted text-sm">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <p className="text-white font-semibold text-lg leading-tight mb-1">{post.groomName}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-[10px] uppercase tracking-wider font-medium">{post.outfitCategory}</p>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 py-12 text-center text-pe-text-muted">
                <p className="text-lg font-medium">Be the first groom to be featured ✨</p>
              </div>
            )}
          </div>

          <Link 
            to="/gallery"
            className="ios-btn ios-btn-secondary inline-flex"
          >
            View Full Gallery
          </Link>
        </div>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-pe-text-muted">
          <p className="text-lg font-medium text-pe-text">No products found.</p>
          <button onClick={clearFilters} className="mt-4 ios-btn ios-btn-secondary">
            Clear Filters
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
