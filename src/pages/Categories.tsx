import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store';
import ProductImage from '../components/ProductImage';

export default function Categories() {
  const products = useStore(state => state.products);
  const eventCategories = useStore(state => state.eventCategories);

  return (
    <div className="px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-pe-text tracking-tight mb-2">Shop by Event</h1>
        <p className="text-[15px] text-pe-text-muted font-light">Curated collections for every celebration.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {eventCategories.map((event, index) => {
          const eventProducts = products.filter(p => p.events.includes(event.name));
          const count = eventProducts.length;
          
          return (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link 
                to={`/discover?event=${encodeURIComponent(event.name)}`} 
                className="block group relative aspect-[4/5] md:aspect-square bg-pe-surface ios-card p-0 overflow-hidden"
              >
                {event.image ? (
                  <ProductImage 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-pe-surface transition-transform duration-700 ease-in-out group-hover:scale-105" />
                )}
                <div className="absolute inset-0 transition-colors duration-300" style={{ background: 'rgba(0,0,0,0.55)' }} />
                
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <h2 className="text-white text-lg md:text-xl font-semibold mb-1">{event.title}</h2>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <p className="text-pe-gold text-[11px] md:text-xs font-medium">{event.subtitle}</p>
                    <span className="text-pe-text-muted text-[10px] md:text-xs bg-pe-surface/80 px-2 py-1 rounded-full backdrop-blur-sm border border-pe-divider w-fit">
                      {count} Items
                    </span>
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
