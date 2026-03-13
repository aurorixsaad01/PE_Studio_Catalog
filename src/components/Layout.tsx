import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, Settings, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product/');

  return (
    <div className="flex flex-col min-h-screen bg-pe-dark text-pe-text">
      {/* Top Navigation for Desktop / Header for Mobile */}
      <header className="sticky top-0 z-40 bg-pe-dark/90 backdrop-blur-md border-b border-pe-divider transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-pe-surface flex items-center justify-center border border-pe-gold/20 group-hover:border-pe-gold transition-colors">
              <span className="text-pe-gold font-serif font-bold text-sm">PE</span>
            </div>
            <span className="font-serif font-semibold text-lg tracking-widest uppercase text-pe-text group-hover:text-pe-gold transition-colors">Pune Ethnic</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => cn("text-sm uppercase tracking-widest transition-colors hover:text-pe-gold", isActive ? "text-pe-gold font-medium" : "text-pe-text-muted")}>Discover</NavLink>
            <NavLink to="/categories" className={({isActive}) => cn("text-sm uppercase tracking-widest transition-colors hover:text-pe-gold", isActive ? "text-pe-gold font-medium" : "text-pe-text-muted")}>Categories</NavLink>
            <NavLink to="/gallery" className={({isActive}) => cn("text-sm uppercase tracking-widest transition-colors hover:text-pe-gold", isActive ? "text-pe-gold font-medium" : "text-pe-text-muted")}>Gallery</NavLink>
            <NavLink to="/collections" className={({isActive}) => cn("text-sm uppercase tracking-widest transition-colors hover:text-pe-gold", isActive ? "text-pe-gold font-medium" : "text-pe-text-muted")}>Saved</NavLink>
            <NavLink to="/profile" className={({isActive}) => cn("text-sm uppercase tracking-widest transition-colors hover:text-pe-gold", isActive ? "text-pe-gold font-medium" : "text-pe-text-muted")}>Profile</NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 w-full max-w-7xl mx-auto", !isProductDetail && "pb-20 md:pb-8")}>
        <Outlet />
      </main>

      {/* Bottom Tab Bar for Mobile */}
      {!isProductDetail && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-pe-dark/95 backdrop-blur-xl border-t border-pe-divider z-40 pb-safe">
          <div className="flex justify-around items-center h-16 px-2">
            <NavLink to="/" className={({isActive}) => cn("flex flex-col items-center gap-1 p-2 transition-colors", isActive ? "text-pe-gold" : "text-pe-text-muted hover:text-pe-text")}>
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
          </div>
        </nav>
      )}
    </div>
  );
}
