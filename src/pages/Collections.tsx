import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayRemove, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import ProductImage from '../components/ProductImage';

export default function Collections() {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate('/login');
    }
  }, [userProfile, loading, navigate]);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      if (!userProfile?.savedOutfits || userProfile.savedOutfits.length === 0) {
        setSavedProducts([]);
        return;
      }
      setIsLoadingSaved(true);
      try {
        const productsRef = collection(db, 'products');
        const chunks = [];
        for (let i = 0; i < userProfile.savedOutfits.length; i += 10) {
          chunks.push(userProfile.savedOutfits.slice(i, i + 10));
        }
        
        let allProducts: Product[] = [];
        for (const chunk of chunks) {
          const q = query(productsRef, where('__name__', 'in', chunk));
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          allProducts = [...allProducts, ...products];
        }
        setSavedProducts(allProducts);
      } catch (error) {
        console.error("Error fetching saved products:", error);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    if (userProfile) {
      fetchSavedProducts();
    }
  }, [userProfile]);

  const handleRemoveSaved = async (productId: string) => {
    if (!userProfile) return;
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        savedOutfits: arrayRemove(productId)
      });
      setSavedProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error removing saved outfit:", error);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pe-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 max-w-4xl mx-auto min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-pe-text tracking-tight">Saved Outfits</h1>
      </div>

      {isLoadingSaved ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-pe-gold" size={40} />
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="text-center py-20 ios-card border-dashed">
          <Heart size={48} className="mx-auto text-pe-text-muted mb-4" strokeWidth={1.5} />
          <p className="text-lg font-semibold text-pe-text mb-2">No items saved yet</p>
          <p className="text-sm text-pe-text-muted">Browse the catalog and tap the heart icon to save items here.</p>
          <Link to="/discover" className="inline-block mt-6 ios-btn ios-btn-secondary">
            Discover
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {savedProducts.map(product => (
            <div key={product.id} className="group relative ios-card p-0 aspect-[4/5] md:aspect-[3/4] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <ProductImage 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-pe-text-muted text-sm bg-pe-surface">
                  No Image
                </div>
              )}
              <div 
                className="absolute inset-0 flex flex-col justify-end p-3 md:p-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
              >
                <p className="text-white text-sm md:text-base font-semibold truncate">{product.name}</p>
                <p className="text-white/80 font-medium text-xs md:text-sm mt-1 md:mt-2">Visit store for pricing</p>
                <p className="text-white/60 text-[10px] md:text-xs mt-1">Custom fittings available</p>
                <div className="flex gap-2 mt-3 md:mt-4">
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex-1 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs md:text-[13px] font-medium rounded-xl py-2 transition-colors"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleRemoveSaved(product.id)}
                    className="w-8 h-8 md:w-[44px] md:h-[44px] flex items-center justify-center bg-white/20 hover:bg-red-500/80 backdrop-blur-md rounded-xl text-white transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
