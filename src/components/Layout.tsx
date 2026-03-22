import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, Image as ImageIcon, Briefcase, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const { userProfile } = useAuth();
  const isProductDetail = location.pathname.startsWith('/product/');

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-pe-text">
      {/* Top Navigation for Desktop / Header for Mobile */}
      <header className="sticky top-0 z-40 ios-glass-heavy transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <img src="https://res.cloudinary.com/dqxlc84z6/image/upload/v1773854426/Gemini_Generated_Image_hfx07ahfx07ahfx0_bnzxnh.png" alt="Pune Ethnic Logo" className="h-7 md:h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity rounded-md" />
            <span className="font-serif font-semibold text-base md:text-lg tracking-[0.05em] uppercase text-pe-text group-hover:text-pe-gold transition-colors">Pune Ethnic</span>
          </div>

          <NavLink to="/reach-us" className={({isActive}) => cn("md:hidden p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted")}>
            <MapPin size={20} />
          </NavLink>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/discover" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Discover</NavLink>
            <NavLink to="/categories" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Categories</NavLink>
            <NavLink to="/gallery" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Gallery</NavLink>
            <NavLink to="/reach-us" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Reach Us</NavLink>
            <NavLink to="/collections" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Saved</NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Profile</NavLink>
            {userProfile?.role === 'admin' && (
              <NavLink to="/manage-products" className={({isActive}) => cn("text-sm font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Admin</NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8", !isProductDetail && "pb-24 md:pb-8")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar for Mobile */}
      {!isProductDetail && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 ios-glass-heavy z-40 pb-safe">
          <div className="flex justify-around items-center h-14 px-2">
            <NavLink to="/discover" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-text" : "text-pe-text-muted")}>
              {({isActive}) => (
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Home size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              )}
            </NavLink>
            <NavLink to="/categories" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-text" : "text-pe-text-muted")}>
              {({isActive}) => (
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Search size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              )}
            </NavLink>
            <NavLink to="/gallery" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-text" : "text-pe-text-muted")}>
              {({isActive}) => (
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <ImageIcon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              )}
            </NavLink>
            <NavLink to="/collections" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-text" : "text-pe-text-muted")}>
              {({isActive}) => (
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Heart size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              )}
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-text" : "text-pe-text-muted")}>
              {({isActive}) => (
                <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <User size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              )}
            </NavLink>
            {userProfile?.role === 'admin' && (
              <NavLink to="/manage-products" className={({isActive}) => cn("flex items-center justify-center w-full h-full transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted")}>
                {({isActive}) => (
                  <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <Briefcase size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                )}
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
