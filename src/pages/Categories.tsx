import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store';
import ProductImage from '../components/ProductImage';

export default function Categories() {
  const products = useStore(state => state.products);
  const eventCategories = useStore(state => state.eventCategories);

  return (
    <div className="px-6 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4">Shop by Event</h1>
        <p className="text-base md:text-lg text-pe-text-muted font-light max-w-2xl">
          Curated collections for every celebration, designed to make your special moments unforgettable.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
        {eventCategories.map((event, index) => {
          const eventProducts = products.filter(p => p.events.includes(event.name));
          const count = eventProducts.length;
          
          // Staggered masonry effect
          const isTall = index % 3 === 0 || index % 4 === 1;
          const aspectClass = isTall ? 'aspect-[3/4]' : 'aspect-square';
          
          return (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="break-inside-avoid"
            >
              <Link 
                to={`/discover?event=${encodeURIComponent(event.name)}`} 
                className={`block group relative ${aspectClass} bg-pe-surface overflow-hidden rounded-[20px] border border-[#D4AF37]/20 shadow-xl`}
              >
                {event.image ? (
                  <ProductImage 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-pe-surface transition-transform duration-1000 ease-in-out group-hover:scale-105" />
                )}
                
                {/* Glassmorphism gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="transform transition-transform duration-700 group-hover:-translate-y-2">
                    <h2 className="text-[#FFFFFF] font-serif text-lg md:text-xl font-medium mb-2 leading-snug drop-shadow-md pr-4">
                      {event.title}
                    </h2>
                    <div className="flex flex-col gap-4">
                      <p className="text-[#D4AF37] text-[11px] md:text-xs font-medium tracking-widest uppercase drop-shadow-sm">
                        {event.subtitle}
                      </p>
                      <span className="text-white/70 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit backdrop-blur-md bg-black/30">
                        {count} Items
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
