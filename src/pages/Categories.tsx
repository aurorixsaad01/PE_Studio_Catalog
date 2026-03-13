import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store';

export default function Categories() {
  const products = useStore(state => state.products);
  const eventCategories = useStore(state => state.eventCategories);

  return (
    <div className="px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl mb-2 text-pe-text">Shop by Event</h1>
        <p className="text-pe-text-muted text-sm font-light">Curated collections for every celebration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                to={`/?event=${encodeURIComponent(event.name)}`} 
                className="block group relative h-48 md:h-64 rounded-[16px] overflow-hidden bg-pe-dark"
              >
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-pe-surface transition-transform duration-700 ease-in-out group-hover:scale-105" />
                )}
                <div className="absolute inset-0 transition-colors duration-300" style={{ background: 'rgba(0,0,0,0.55)' }} />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h2 className="text-white font-serif text-2xl md:text-3xl mb-1">{event.title}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-[#C6A45B] text-xs tracking-widest uppercase">{event.subtitle}</p>
                    <span className="text-pe-text-muted text-xs bg-pe-surface/80 px-2 py-1 rounded-full backdrop-blur-sm border border-pe-divider">
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
