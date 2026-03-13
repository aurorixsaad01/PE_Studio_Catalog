import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayRemove, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

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
        <h1 className="font-serif text-3xl md:text-4xl text-pe-text">Saved Outfits</h1>
      </div>

      {isLoadingSaved ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-pe-gold" size={40} />
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="text-center py-20 bg-pe-surface rounded-3xl border border-dashed border-pe-divider">
          <Heart size={48} className="mx-auto text-pe-text-muted mb-4" strokeWidth={1} />
          <p className="font-serif text-xl text-pe-text mb-2">No items saved yet</p>
          <p className="text-sm text-pe-text-muted">Browse the catalog and tap the heart icon to save items here.</p>
          <Link to="/" className="inline-block mt-6 px-6 py-2 border border-pe-gold text-pe-gold rounded-full text-sm uppercase tracking-widest font-medium hover:bg-pe-gold hover:text-pe-dark transition-colors">
            Discover
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {savedProducts.map(product => (
            <div key={product.id} className="group relative rounded-2xl overflow-hidden bg-pe-surface aspect-[3/4] border border-transparent hover:border-pe-gold transition-colors">
              <img 
                src={product.images?.[0]} 
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="font-medium text-white text-sm truncate">{product.name}</p>
                <p className="text-pe-gold text-xs mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mt-3">
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex-1 bg-pe-gold text-pe-dark py-2 rounded-full text-xs uppercase tracking-widest font-medium text-center hover:bg-pe-gold-light transition-colors"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleRemoveSaved(product.id)}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={16} />
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
