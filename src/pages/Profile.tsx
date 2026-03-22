import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogOut, Heart, Image as ImageIcon, Settings, User } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Product, GalleryPost } from '../types';
import ProductImage from '../components/ProductImage';

export default function Profile() {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'saved' | 'uploads' | 'settings'>('saved');
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [galleryUploads, setGalleryUploads] = useState<GalleryPost[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name || '');
    }
  }, [userProfile]);

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
        // Fetch products by IDs
        const productsRef = collection(db, 'products');
        // Firestore 'in' query supports up to 10 items.
        // For a real app with >10 saved items, chunking or client-side filtering is needed.
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

    const fetchGalleryUploads = async () => {
      if (!userProfile) return;
      setIsLoadingUploads(true);
      try {
        const q = query(
          collection(db, 'gallery_posts'),
          where('authorUid', '==', userProfile.uid)
        );
        const querySnapshot = await getDocs(q);
        const uploads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryPost));
        setGalleryUploads(uploads);
      } catch (error) {
        console.error("Error fetching gallery uploads:", error);
      } finally {
        setIsLoadingUploads(false);
      }
    };

    if (activeTab === 'saved' && userProfile) {
      fetchSavedProducts();
    } else if (activeTab === 'uploads' && userProfile) {
      fetchGalleryUploads();
    }
  }, [activeTab, userProfile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/discover');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;
    setIsSavingProfile(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        name: editName
      });
      setIsEditingProfile(false);
      // userProfile will be updated by the onSnapshot listener in AuthContext
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSavingProfile(false);
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
    <div className="px-4 py-8 md:py-12 max-w-6xl mx-auto min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-pe-surface ios-card p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-pe-surface flex items-center justify-center text-pe-gold text-xl font-medium">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User size={24} />}
              </div>
              <div>
                <h2 className="font-medium text-[15px] text-pe-text">{userProfile.name || 'Customer'}</h2>
                <p className="text-[13px] text-pe-text-muted truncate w-32">{userProfile.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'saved' ? 'bg-pe-gold/10 text-pe-gold' : 'text-pe-text-muted hover:bg-pe-surface hover:text-pe-text'
                }`}
              >
                <Heart size={18} />
                Saved Outfits
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'uploads' ? 'bg-pe-gold/10 text-pe-gold' : 'text-pe-text-muted hover:bg-pe-surface hover:text-pe-text'
                }`}
              >
                <ImageIcon size={18} />
                My Gallery Uploads
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-pe-gold/10 text-pe-gold' : 'text-pe-text-muted hover:bg-pe-surface hover:text-pe-text'
                }`}
              >
                <Settings size={18} />
                Account Settings
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-pe-divider">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'saved' && (
            <div>
              <h2 className="text-2xl font-bold text-pe-text mb-6">Saved Outfits</h2>
              {isLoadingSaved ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-pe-gold" size={32} />
                </div>
              ) : savedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {savedProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group block relative overflow-hidden bg-pe-surface rounded-[16px]">
                      <div className="aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden">
                        {product.images?.[0] ? (
                          <ProductImage
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                            <ImageIcon size={32} />
                          </div>
                        )}
                      </div>
                      <div 
                        className="absolute inset-0 flex flex-col justify-end p-3 md:p-4"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                      >
                        <p className="text-white font-medium text-sm md:text-base leading-tight truncate">{product.name}</p>
                        <p className="text-pe-gold font-medium text-xs md:text-sm tracking-[0.02em] mt-1 md:mt-2">Visit store for pricing</p>
                        <p className="text-white/70 text-[10px] md:text-xs mt-1">Custom fittings available</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-pe-surface ios-card">
                  <Heart size={48} className="mx-auto text-pe-text-muted mb-4" />
                  <h3 className="text-xl font-bold text-pe-text mb-2">No saved outfits yet</h3>
                  <p className="text-[15px] text-pe-text-muted mb-6">Explore our collections and save your favorites.</p>
                  <Link to="/collections" className="inline-block ios-btn ios-btn-primary">
                    Explore Collections
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'uploads' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-pe-text">My Gallery Uploads</h2>
                <Link to="/gallery" className="px-4 py-2 bg-pe-gold text-pe-dark rounded-full text-xs font-medium flex items-center justify-center w-fit">
                  <ImageIcon size={14} className="mr-2" />
                  <span>Upload Photo</span>
                </Link>
              </div>
              {isLoadingUploads ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-pe-gold" size={32} />
                </div>
              ) : galleryUploads.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {galleryUploads.map((post) => (
                    <div key={post.id} className="group block relative">
                      <div className="aspect-[4/5] md:aspect-[3/4] bg-pe-surface mb-2 md:mb-4 relative ios-card overflow-hidden rounded-[12px] md:rounded-[16px]">
                        {post.images?.[0] ? (
                          <ProductImage
                            src={post.images[0]}
                            alt={post.groomName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                            <ImageIcon size={32} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          {post.approved ? (
                            <span className="px-2 py-1 bg-green-500/80 backdrop-blur-md text-white text-[10px] md:text-[11px] font-medium rounded-full">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/80 backdrop-blur-md text-white text-[10px] md:text-[11px] font-medium rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base font-medium text-pe-text truncate">{post.groomName}</h3>
                      <p className="text-pe-text-muted text-[11px] md:text-xs mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-pe-surface ios-card">
                  <ImageIcon size={48} className="mx-auto text-pe-text-muted mb-4" />
                  <h3 className="text-xl font-bold text-pe-text mb-2">Share your special moments</h3>
                  <p className="text-[15px] text-pe-text-muted mb-6">Upload photos of you wearing Pune Ethnic to be featured in our Grooms Gallery.</p>
                  <Link to="/gallery" className="inline-block ios-btn ios-btn-primary">
                    Go to Gallery
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-pe-text mb-6">Account Settings</h2>
              <div className="bg-pe-surface ios-card p-6 md:p-8">
                <div className="space-y-6 max-w-md">
                  <div className="ios-input-group">
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? editName : (userProfile.name || '')}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`ios-input ${!isEditingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                      placeholder="Full Name"
                    />
                    <label>Full Name</label>
                  </div>
                  <div className="ios-input-group">
                    <input
                      type="email"
                      disabled
                      value={userProfile.email || ''}
                      className="ios-input opacity-70 cursor-not-allowed"
                      placeholder="Email Address"
                    />
                    <label>Email Address</label>
                    <p className="text-[13px] text-pe-text-muted mt-2">Email address cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-pe-text-muted mb-2">Account Role</label>
                    <div className="px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl text-[15px] text-pe-text opacity-70">
                      <span className="capitalize">{userProfile.role}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-pe-divider">
                    {isEditingProfile ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setEditName(userProfile.name || '');
                          }}
                          className="flex-1 px-6 py-3 border border-pe-divider text-pe-text rounded-full text-[15px] font-medium hover:bg-pe-surface transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile || !editName.trim()}
                          className="flex-1 ios-btn ios-btn-primary disabled:opacity-50 flex justify-center items-center"
                        >
                          {isSavingProfile ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full ios-btn ios-btn-primary"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
