import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, Settings, Image as ImageIcon, Briefcase } from 'lucide-react';
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
      <header className="sticky top-0 z-40 ipad-nav transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <img src="https://res.cloudinary.com/dqxlc84z6/image/upload/v1773854426/Gemini_Generated_Image_hfx07ahfx07ahfx0_bnzxnh.png" alt="Pune Ethnic Logo" className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity rounded-md" />
            <span className="font-serif font-semibold text-lg tracking-[0.05em] uppercase text-pe-text group-hover:text-pe-gold transition-colors">Pune Ethnic</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/discover" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Discover</NavLink>
            <NavLink to="/categories" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Categories</NavLink>
            <NavLink to="/gallery" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Gallery</NavLink>
            <NavLink to="/collections" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Saved</NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Profile</NavLink>
            {userProfile?.role === 'admin' && (
              <NavLink to="/manage-products" className={({isActive}) => cn("text-[15px] font-medium transition-colors hover:text-pe-gold", isActive ? "text-pe-gold" : "text-pe-text-muted")}>Manage Products</NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8", !isProductDetail && "pb-20 md:pb-8")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar for Mobile */}
      {!isProductDetail && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 ipad-nav z-40 pb-safe">
          <div className="flex justify-around items-center h-16 px-2">
            <NavLink to="/discover" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
              {({isActive}) => (
                <>
                  <Home size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Discover</span>
                </>
              )}
            </NavLink>
            <NavLink to="/categories" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
              {({isActive}) => (
                <>
                  <Grid size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Browse</span>
                </>
              )}
            </NavLink>
            <NavLink to="/gallery" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
              {({isActive}) => (
                <>
                  <ImageIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Gallery</span>
                </>
              )}
            </NavLink>
            <NavLink to="/collections" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
              {({isActive}) => (
                <>
                  <Heart size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Saved</span>
                </>
              )}
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
              {({isActive}) => (
                <>
                  <Settings size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Profile</span>
                </>
              )}
            </NavLink>
            {userProfile?.role === 'admin' && (
              <NavLink to="/manage-products" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
                {({isActive}) => (
                  <>
                    <Briefcase size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Admin</span>
                  </>
                )}
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
