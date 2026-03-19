import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Ruler, Info, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { useStore } from '../store';
import { cn } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useStore(state => state.products);
  
  const { userProfile } = useAuth();
  
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [showTryModal, setShowTryModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tryOnForm, setTryOnForm] = useState({ name: '', phone: '', date: '' });
  const [tryOnSubmitted, setTryOnSubmitted] = useState(false);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setActiveImage(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="font-serif text-2xl">Product not found</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#D4AF37] uppercase tracking-widest text-sm">Go Back</button>
      </div>
    );
  }

  const isSaved = userProfile?.savedOutfits?.includes(product.id) || false;
  
  const suggestedProducts = product.suggestedAccessories
    ? products.filter(p => product.suggestedAccessories!.includes(p.id))
    : [];

  const handleSave = async () => {
    if (!userProfile) {
      navigate('/login');
      return;
    }
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      if (isSaved) {
        await updateDoc(userRef, {
          savedOutfits: arrayRemove(product.id)
        });
      } else {
        await updateDoc(userRef, {
          savedOutfits: arrayUnion(product.id)
        });
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSizeGuideTable = () => {
    switch (product.category) {
      case 'Sherwani':
      case 'Indo-Western':
        return (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-pe-divider">
                <th className="py-3 text-pe-gold font-medium">Size</th>
                <th className="py-3 text-pe-gold font-medium">Chest</th>
                <th className="py-3 text-pe-gold font-medium">Shoulder</th>
                <th className="py-3 text-pe-gold font-medium">Length</th>
                <th className="py-3 text-pe-gold font-medium">Sleeve</th>
              </tr>
            </thead>
            <tbody className="text-pe-text-muted">
              {[
                { size: '36', chest: '40', shoulder: '17', length: '38', sleeve: '24' },
                { size: '38', chest: '42', shoulder: '17.5', length: '39', sleeve: '24.5' },
                { size: '40', chest: '44', shoulder: '18', length: '40', sleeve: '25' },
                { size: '42', chest: '46', shoulder: '18.5', length: '41', sleeve: '25.5' },
                { size: '44', chest: '48', shoulder: '19', length: '42', sleeve: '26' },
                { size: '46', chest: '50', shoulder: '19.5', length: '43', sleeve: '26.5' },
                { size: 'Customizable', chest: 'Custom', shoulder: 'Custom', length: 'Custom', sleeve: 'Custom' },
              ].map(row => (
                <tr key={row.size} className="border-b border-pe-divider/50">
                  <td className="py-3 text-pe-text">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.shoulder}</td>
                  <td className="py-3">{row.length}</td>
                  <td className="py-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Jodhpuri Suit':
        return (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-pe-divider">
                <th className="py-3 text-pe-gold font-medium">Size</th>
                <th className="py-3 text-pe-gold font-medium">Chest</th>
                <th className="py-3 text-pe-gold font-medium">Waist</th>
                <th className="py-3 text-pe-gold font-medium">Shoulder</th>
                <th className="py-3 text-pe-gold font-medium">Sleeve</th>
              </tr>
            </thead>
            <tbody className="text-pe-text-muted">
              {[
                { size: '36', chest: '40', waist: '34', shoulder: '17', sleeve: '24' },
                { size: '38', chest: '42', waist: '36', shoulder: '17.5', sleeve: '24.5' },
                { size: '40', chest: '44', waist: '38', shoulder: '18', sleeve: '25' },
                { size: '42', chest: '46', waist: '40', shoulder: '18.5', sleeve: '25.5' },
                { size: '44', chest: '48', waist: '42', shoulder: '19', sleeve: '26' },
                { size: '46', chest: '50', waist: '44', shoulder: '19.5', sleeve: '26.5' },
              ].map(row => (
                <tr key={row.size} className="border-b border-pe-divider/50">
                  <td className="py-3 text-pe-text">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.waist}</td>
                  <td className="py-3">{row.shoulder}</td>
                  <td className="py-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Tuxedo':
        return (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-pe-divider">
                <th className="py-3 text-pe-gold font-medium">Size</th>
                <th className="py-3 text-pe-gold font-medium">Chest</th>
                <th className="py-3 text-pe-gold font-medium">Waist</th>
                <th className="py-3 text-pe-gold font-medium">Jacket Length</th>
                <th className="py-3 text-pe-gold font-medium">Sleeve</th>
              </tr>
            </thead>
            <tbody className="text-pe-text-muted">
              {[
                { size: '36', chest: '40', waist: '34', length: '29', sleeve: '24' },
                { size: '38', chest: '42', waist: '36', length: '30', sleeve: '24.5' },
                { size: '40', chest: '44', waist: '38', length: '31', sleeve: '25' },
                { size: '42', chest: '46', waist: '40', length: '32', sleeve: '25.5' },
                { size: '44', chest: '48', waist: '42', length: '33', sleeve: '26' },
                { size: '46', chest: '50', waist: '44', length: '34', sleeve: '26.5' },
              ].map(row => (
                <tr key={row.size} className="border-b border-pe-divider/50">
                  <td className="py-3 text-pe-text">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.waist}</td>
                  <td className="py-3">{row.length}</td>
                  <td className="py-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Kurta':
        return (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-pe-divider">
                <th className="py-3 text-pe-gold font-medium">Size</th>
                <th className="py-3 text-pe-gold font-medium">Chest</th>
                <th className="py-3 text-pe-gold font-medium">Length</th>
                <th className="py-3 text-pe-gold font-medium">Shoulder</th>
                <th className="py-3 text-pe-gold font-medium">Sleeve</th>
              </tr>
            </thead>
            <tbody className="text-pe-text-muted">
              {[
                { size: 'S', chest: '38', length: '40', shoulder: '17', sleeve: '24' },
                { size: 'M', chest: '40', length: '41', shoulder: '17.5', sleeve: '24.5' },
                { size: 'L', chest: '42', length: '42', shoulder: '18', sleeve: '25' },
                { size: 'XL', chest: '44', length: '43', shoulder: '18.5', sleeve: '25.5' },
                { size: 'XXL', chest: '46', length: '44', shoulder: '19', sleeve: '26' },
              ].map(row => (
                <tr key={row.size} className="border-b border-pe-divider/50">
                  <td className="py-3 text-pe-text">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.length}</td>
                  <td className="py-3">{row.shoulder}</td>
                  <td className="py-3">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <p className="text-pe-text-muted text-sm">Size guide not available for this category.</p>;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 ios-glass-heavy px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-pe-text">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-4">
          <button className="p-2 text-pe-text">
            <Share2 size={20} strokeWidth={1.5} />
          </button>
          <button onClick={handleSave} disabled={isSaving} className="p-2 -mr-2 text-pe-text disabled:opacity-50">
            <Heart size={20} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-pe-gold" : ""} />
          </button>
        </div>
      </header>

      <div className="md:max-w-7xl md:mx-auto md:px-4 md:py-8 md:grid md:grid-cols-2 md:gap-12">
        
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[65vh] md:h-[70vh] bg-pe-surface md:rounded-2xl overflow-hidden">
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {product.video && (
                  <div className="flex-[0_0_100%] min-w-0 h-full relative">
                    <video 
                      src={product.video} 
                      className="w-full h-full object-cover" 
                      controls 
                      playsInline 
                      autoPlay 
                      muted 
                      loop
                    />
                  </div>
                )}
                {(!product.video && (!product.images || product.images.length === 0)) && (
                  <div className="flex-[0_0_100%] min-w-0 h-full relative flex items-center justify-center bg-pe-surface border border-pe-divider">
                    <ProductImage className="w-full h-full object-cover" />
                  </div>
                )}
                {product.images?.map((img, idx) => (
                  <div className="flex-[0_0_100%] min-w-0 h-full relative" key={idx}>
                    <ProductImage 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Image Indicators */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
              {product.video && (
                <button
                  onClick={() => emblaApi?.scrollTo(0)}
                  className={cn("w-2 h-2 rounded-full transition-all", activeImage === 0 ? "bg-pe-gold w-6" : "bg-white/50")}
                />
              )}
              {product.images?.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(product.video ? idx + 1 : idx)}
                  className={cn("w-2 h-2 rounded-full transition-all", activeImage === (product.video ? idx + 1 : idx) ? "bg-pe-gold w-6" : "bg-white/50")}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden md:flex gap-4 overflow-x-auto no-scrollbar">
            {product.video && (
              <button
                onClick={() => emblaApi?.scrollTo(0)}
                className={cn(
                  "w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors relative",
                  activeImage === 0 ? "border-pe-gold" : "border-transparent hover:border-pe-gold/50"
                )}
              >
                <video src={product.video} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1" />
                  </div>
                </div>
              </button>
            )}
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(product.video ? idx + 1 : idx)}
                className={cn(
                  "w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors",
                  activeImage === (product.video ? idx + 1 : idx) ? "border-pe-gold" : "border-transparent hover:border-pe-gold/50"
                )}
              >
                <ProductImage src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-8 md:px-0 md:py-4 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-pe-gold text-xs uppercase tracking-[0.2em] font-medium mb-2">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-pe-text tracking-tight leading-tight">{product.name}</h1>
            </div>
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-pe-text hover:bg-pe-surface rounded-full transition-colors">
                <Share2 size={20} strokeWidth={1.5} />
              </button>
              <button onClick={handleSave} className="p-2 text-pe-text hover:bg-pe-surface rounded-full transition-colors">
                <Heart size={20} strokeWidth={1.5} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-pe-gold" : ""} />
              </button>
            </div>
          </div>
          
          <div className="mb-6 mt-2">
            <p className="text-pe-gold font-medium text-sm tracking-[0.02em]">Visit store for pricing</p>
            <p className="text-white/70 text-xs mt-1">Custom fittings available</p>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-pe-text-muted text-sm leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 py-5 border-y border-pe-divider">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-pe-gold mb-1">Fabric</p>
                <p className="font-medium text-[13px] text-pe-text">{product.fabric}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-pe-gold mb-1">Colors</p>
                <div className="flex items-center gap-2">
                  {product.colors.map(color => (
                    <span key={color} className="font-medium text-[13px] text-pe-text">{color}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] uppercase tracking-widest text-pe-gold mb-2">Events</p>
                <div className="flex flex-wrap gap-2">
                  {product.events.map(event => (
                    <span key={event} className="px-3 py-1 bg-pe-surface border border-pe-divider rounded-full text-[11px] font-medium text-pe-text-muted">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-widest font-medium text-pe-gold">Available Sizes</p>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-[11px] text-pe-text-muted hover:text-pe-text uppercase tracking-wider"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <div key={size} className="w-10 h-10 rounded-full border border-pe-divider flex items-center justify-center text-xs font-medium text-pe-text hover:border-pe-gold transition-colors cursor-pointer">
                    {size}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shop the Look */}
            {suggestedProducts.length > 0 && (
              <div className="pt-8 border-t border-pe-divider">
                <h2 className="text-lg font-semibold text-pe-gold mb-6">Shop the Look</h2>
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4">
                  {suggestedProducts.map(accessory => (
                    <Link key={accessory.id} to={`/product/${accessory.id}`} className="flex-shrink-0 w-36 group">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-pe-surface mb-3 border border-transparent group-hover:border-pe-gold transition-colors">
                        {accessory.images && accessory.images.length > 0 ? (
                          <ProductImage 
                            src={accessory.images[0]} 
                            alt={accessory.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pe-text-muted text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm truncate text-pe-text">{accessory.name}</p>
                      <p className="text-pe-gold text-xs mt-1">Visit store for pricing</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-8 md:mt-auto pt-6">
            <button 
              onClick={() => {
                setTryOnSubmitted(false);
                setTryOnForm({ name: '', phone: '', date: '' });
                setShowTryModal(true);
              }}
              className="ios-btn ios-btn-primary w-full h-11"
            >
              Request Try-On In Store
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-pe-surface border border-pe-divider rounded-3xl z-50 p-6 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-pe-text">Size Guide</h3>
                  <p className="text-pe-gold text-xs uppercase tracking-widest mt-1">{product.category}</p>
                </div>
                <button onClick={() => setShowSizeGuide(false)} className="p-2 text-pe-text-muted hover:text-pe-text">
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto no-scrollbar flex-1">
                {renderSizeGuideTable()}
                <p className="text-xs text-pe-text-muted mt-6 italic">
                  * All measurements are in inches. For customizable sizes, please contact our store directly.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Try In Store Modal */}
      <AnimatePresence>
        {showTryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTryModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-pe-surface border border-pe-divider rounded-3xl z-50 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-pe-text">Request Try-On In Store</h3>
                <button onClick={() => setShowTryModal(false)} className="p-2 text-pe-text-muted hover:text-pe-text">
                  <X size={20} />
                </button>
              </div>
              
              {tryOnSubmitted ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-pe-gold/20 flex items-center justify-center mb-6">
                    <Check size={32} className="text-pe-gold" />
                  </div>
                  <h4 className="text-xl font-medium text-pe-text mb-2">Request Received</h4>
                  <p className="text-pe-text-muted">Our team will contact you shortly to arrange your visit.</p>
                  <button 
                    onClick={() => setShowTryModal(false)}
                    className="mt-8 w-full ios-btn ios-btn-primary"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setTryOnSubmitted(true);
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="bg-pe-dark/50 p-4 rounded-xl flex gap-4 items-center mb-2">
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-pe-surface border border-pe-divider">
                      {product.images && product.images.length > 0 ? (
                        <ProductImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-pe-text-muted text-[10px]">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-pe-gold uppercase tracking-widest mb-1">Selected Product</p>
                      <p className="text-pe-text font-medium">{product.name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pe-text-muted mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={tryOnForm.name}
                      onChange={e => setTryOnForm({...tryOnForm, name: e.target.value})}
                      className="w-full bg-pe-dark border border-pe-divider rounded-xl px-4 py-3 text-pe-text focus:outline-none focus:border-pe-gold transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pe-text-muted mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={tryOnForm.phone}
                      onChange={e => setTryOnForm({...tryOnForm, phone: e.target.value})}
                      className="w-full bg-pe-dark border border-pe-divider rounded-xl px-4 py-3 text-pe-text focus:outline-none focus:border-pe-gold transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-pe-text-muted mb-1">Preferred Visit Date</label>
                    <input 
                      type="date" 
                      required
                      value={tryOnForm.date}
                      onChange={e => setTryOnForm({...tryOnForm, date: e.target.value})}
                      className="w-full bg-pe-dark border border-pe-divider rounded-xl px-4 py-3 text-pe-text focus:outline-none focus:border-pe-gold transition-colors"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="ios-btn ios-btn-primary w-full mt-4 h-12"
                  >
                    Confirm Visit Request
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
