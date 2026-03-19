import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Upload, ChevronLeft, ChevronRight, Loader2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Category, EventType, Product, GalleryPost } from '../types';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '../services/uploadService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductImage from '../components/ProductImage';

const CATEGORIES: Category[] = ['Sherwani', 'Jodhpuri Suit', 'Indo-Western', 'Tuxedo', 'Kurta', 'Accessories'];
const EVENTS: EventType[] = ['Wedding Ceremony', 'Reception', 'Engagement', 'Haldi', 'Sangeet Ceremony', 'Festival Wear'];

export default function Admin() {
  const { userProfile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'gallery' | 'hero'>('products');
  
  const products = useStore(state => state.products);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);
  
  const eventCategories = useStore(state => state.eventCategories);
  const updateEventCategory = useStore(state => state.updateEventCategory);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deletedProduct, setDeletedProduct] = useState<Product | null>(null);
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && (!userProfile || userProfile.role !== 'admin')) {
      navigate('/discover');
    }
  }, [userProfile, loading, navigate]);

  if (loading || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pe-gold" size={32} />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/discover');
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentProduct({
      id: Date.now().toString(),
      name: '',
      category: 'Sherwani',
      events: [],
      price: 0,
      sizes: [],
      fabric: '',
      colors: [],
      description: '',
      images: [],
      createdAt: Date.now(),
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (!currentProduct.images || currentProduct.images.length < 3) {
      alert('Please upload at least 3 images for the product.');
      return;
    }

    try {
      await setDoc(doc(db, 'products', currentProduct.id!), currentProduct);
      setIsEditing(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteDoc(doc(db, 'products', productToDelete));
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const undoDelete = () => {
    // Undo delete is complex with Firestore, skipping for now
  };

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length || !currentProduct) return;

    const currentImages = currentProduct.images || [];
    if (currentImages.length + files.length > 6) {
      alert('Maximum 6 images allowed per product.');
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(files.map(f => uploadImageToCloudinary(f)));
      setCurrentProduct({
        ...currentProduct,
        images: [...currentImages, ...uploadedUrls]
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentProduct) return;

    if (file.type !== 'video/mp4') {
      alert('Only MP4 video format is supported.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('Video must be less than 50MB.');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const uploadedUrl = await uploadVideoToCloudinary(file);
      setCurrentProduct({
        ...currentProduct,
        video: uploadedUrl
      });
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  const removeVideo = () => {
    if (!currentProduct) return;
    setCurrentProduct({ ...currentProduct, video: undefined });
  };

  const removeImage = (index: number) => {
    if (!currentProduct) return;
    const newImages = [...(currentProduct.images || [])];
    newImages.splice(index, 1);
    setCurrentProduct({ ...currentProduct, images: newImages });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (!currentProduct) return;
    const newImages = [...(currentProduct.images || [])];
    if (direction === 'left' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'right' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setCurrentProduct({ ...currentProduct, images: newImages });
  };

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventName: EventType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      const updatedCategories = eventCategories.map(e => e.name === eventName ? { ...e, image: uploadedUrl } : e);
      
      // Update Firestore
      await setDoc(doc(db, 'settings', 'global'), { 
        eventCategories: updatedCategories 
      }, { merge: true });
      
      updateEventCategory(eventName, uploadedUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="px-4 py-6 md:py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-pe-text">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-pe-surface text-pe-text text-sm uppercase tracking-widest font-medium hover:bg-black/20 border border-pe-divider transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
          {activeTab === 'products' && (
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-pe-gold text-pe-dark text-sm uppercase tracking-widest font-medium hover:bg-pe-gold-light transition-colors"
            >
              <Plus size={16} />
              <span className="hidden md:inline">Add Product</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-pe-divider mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === 'products' ? 'border-pe-gold text-pe-gold' : 'border-transparent text-pe-text-muted hover:text-pe-text'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === 'events' ? 'border-pe-gold text-pe-gold' : 'border-transparent text-pe-text-muted hover:text-pe-text'
          }`}
        >
          Event Images
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === 'gallery' ? 'border-pe-gold text-pe-gold' : 'border-transparent text-pe-text-muted hover:text-pe-text'
          }`}
        >
          Gallery Moderation
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 ${
            activeTab === 'hero' ? 'border-pe-gold text-pe-gold' : 'border-transparent text-pe-text-muted hover:text-pe-text'
          }`}
        >
          Hero Video
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Product List */}
      <div className="bg-pe-surface rounded-2xl shadow-sm border border-pe-divider overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pe-surface/50 border-b border-pe-divider">
                <th className="p-4 text-xs uppercase tracking-widest text-pe-text-muted font-medium">Product</th>
                <th className="p-4 text-xs uppercase tracking-widest text-pe-text-muted font-medium">Category</th>
                <th className="p-4 text-xs uppercase tracking-widest text-pe-text-muted font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-pe-divider hover:bg-pe-surface/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pe-surface overflow-hidden flex-shrink-0">
                        <ProductImage src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-pe-text">{product.name}</p>
                        <p className="text-xs text-pe-text-muted">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-pe-text-muted">{product.category}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-pe-text-muted hover:text-pe-gold transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-pe-text-muted hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-pe-surface border border-pe-divider rounded-2xl p-6 max-w-sm w-full shadow-2xl pointer-events-auto">
                <h3 className="font-serif text-2xl text-pe-text mb-2">Delete Product</h3>
                <p className="text-pe-text-muted text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setProductToDelete(null)}
                    className="flex-1 py-2.5 bg-pe-surface border border-pe-divider text-pe-text rounded-xl text-sm font-medium hover:border-pe-gold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-medium hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {deletedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-pe-surface border border-pe-divider shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50"
          >
            <span className="text-sm text-pe-text">Product deleted</span>
            <div className="w-px h-4 bg-pe-divider" />
            <button
              onClick={undoDelete}
              className="text-sm font-medium text-pe-gold hover:text-pe-gold-light uppercase tracking-widest transition-colors"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && currentProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-pe-surface shadow-2xl z-50 flex flex-col border-l border-pe-divider"
            >
              <div className="flex items-center justify-between p-6 border-b border-pe-divider">
                <h2 className="font-serif text-2xl text-pe-text">{currentProduct.id ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 text-pe-text-muted hover:text-pe-text">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <form id="product-form" onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={currentProduct.name || ''}
                      onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Category</label>
                      <select
                        value={currentProduct.category || 'Sherwani'}
                        onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value as Category })}
                        className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm appearance-none text-pe-text"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setCurrentProduct({ ...currentProduct, featured: !currentProduct.featured })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${currentProduct.featured ? 'bg-pe-gold' : 'bg-pe-divider'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-pe-dark absolute top-1 transition-transform ${currentProduct.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                    <label className="text-sm font-medium text-pe-text cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, featured: !currentProduct.featured })}>
                      Set as Featured Product
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Events</label>
                    <div className="flex flex-wrap gap-2">
                      {EVENTS.map(event => (
                        <button
                          key={event}
                          type="button"
                          onClick={() => {
                            const events = currentProduct.events || [];
                            if (events.includes(event)) {
                              setCurrentProduct({ ...currentProduct, events: events.filter(e => e !== event) });
                            } else {
                              setCurrentProduct({ ...currentProduct, events: [...events, event] });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                            currentProduct.events?.includes(event)
                              ? 'bg-pe-gold text-pe-dark border-pe-gold'
                              : 'bg-pe-surface text-pe-text-muted border-pe-divider hover:border-pe-gold/50'
                          }`}
                        >
                          {event}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={currentProduct.description || ''}
                      onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                      className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm resize-none text-pe-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Fabric</label>
                      <input
                        type="text"
                        required
                        value={currentProduct.fabric || ''}
                        onChange={e => setCurrentProduct({ ...currentProduct, fabric: e.target.value })}
                        className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Sizes (comma separated)</label>
                      <input
                        type="text"
                        required
                        value={currentProduct.sizes?.join(', ') || ''}
                        onChange={e => setCurrentProduct({ ...currentProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text placeholder:text-pe-text-muted/50"
                        placeholder="38, 40, 42"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Colors (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={currentProduct.colors?.join(', ') || ''}
                      onChange={e => setCurrentProduct({ ...currentProduct, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text placeholder:text-pe-text-muted/50"
                      placeholder="Ivory, Gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Product Images (Min 3, Max 6)</label>
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      {(currentProduct.images || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-pe-surface group border border-pe-divider">
                          <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-pe-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-between">
                              <button type="button" onClick={() => moveImage(idx, 'left')} disabled={idx === 0} className="p-1 text-pe-text disabled:opacity-30 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft size={16}/></button>
                              <button type="button" onClick={() => moveImage(idx, 'right')} disabled={idx === (currentProduct.images?.length || 0) - 1} className="p-1 text-pe-text disabled:opacity-30 hover:bg-white/20 rounded-full transition-colors"><ChevronRight size={16}/></button>
                            </div>
                            <button type="button" onClick={() => removeImage(idx)} className="p-1.5 text-white self-center bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                      {(currentProduct.images || []).length < 6 && (
                        <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-pe-divider flex flex-col items-center justify-center text-pe-text-muted hover:border-pe-gold hover:text-pe-gold transition-colors cursor-pointer bg-pe-surface/50">
                          {isUploading ? (
                            <Loader2 className="animate-spin mb-2" size={24} />
                          ) : (
                            <>
                              <Upload size={24} className="mb-2" />
                              <span className="text-xs font-medium uppercase tracking-wider text-center px-2">Upload</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            multiple 
                            accept="image/jpeg, image/png, image/webp" 
                            className="hidden" 
                            onChange={handleImageUpload} 
                            disabled={isUploading} 
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-pe-text-muted">JPEG, PNG, WEBP. Max 2MB per image. Auto-resized to 1080px.</p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Product Video (Optional)</label>
                    {currentProduct.video ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-pe-surface border border-pe-divider group">
                        <video src={currentProduct.video} className="w-full h-full object-cover" controls playsInline />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={removeVideo} className="p-2 text-white bg-red-500/80 rounded-full hover:bg-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-video rounded-xl border-2 border-dashed border-pe-divider flex flex-col items-center justify-center text-pe-text-muted hover:border-pe-gold hover:text-pe-gold transition-colors cursor-pointer bg-pe-surface/50">
                        {isUploadingVideo ? (
                          <Loader2 className="animate-spin mb-2" size={24} />
                        ) : (
                          <>
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs font-medium uppercase tracking-wider text-center px-2">Upload Video</span>
                            <span className="text-[10px] text-center px-2 mt-1 opacity-70">MP4, max 50MB. 5-15s recommended.</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="video/mp4" 
                          className="hidden" 
                          onChange={handleVideoUpload} 
                          disabled={isUploadingVideo} 
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Shop the Look (Suggested Accessories)</label>
                    <div className="max-h-48 overflow-y-auto border border-pe-divider rounded-xl p-2 bg-pe-surface space-y-1 no-scrollbar">
                      {products.filter(p => p.id !== currentProduct.id).map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-pe-surface rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={currentProduct.suggestedAccessories?.includes(p.id) || false}
                            onChange={(e) => {
                              const current = currentProduct.suggestedAccessories || [];
                              if (e.target.checked) {
                                setCurrentProduct({ ...currentProduct, suggestedAccessories: [...current, p.id] });
                              } else {
                                setCurrentProduct({ ...currentProduct, suggestedAccessories: current.filter(id => id !== p.id) });
                              }
                            }}
                            className="rounded border-pe-divider bg-pe-surface text-pe-gold focus:ring-pe-gold focus:ring-offset-pe-surface w-4 h-4"
                          />
                          <div className="flex items-center gap-3">
                            <ProductImage src={p.images?.[0]} alt="" className="w-10 h-10 rounded-md object-cover bg-pe-surface" />
                            <div>
                              <span className="text-sm font-medium block text-pe-text">{p.name}</span>
                              <span className="text-xs text-pe-text-muted">{p.category}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                      {products.length <= 1 && (
                        <p className="text-sm text-pe-text-muted p-2">No other products available to suggest.</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-pe-divider bg-pe-surface">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-pe-surface border border-pe-divider text-pe-text rounded-xl text-sm font-medium hover:border-pe-gold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={isUploading || isUploadingVideo}
                    className="flex-1 py-3 bg-pe-gold text-pe-dark rounded-xl text-sm font-medium hover:bg-pe-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading || isUploadingVideo ? 'Uploading...' : 'Save Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </>
      ) : activeTab === 'events' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map(event => (
            <div key={event.name} className="bg-pe-surface border border-pe-divider rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-pe-surface relative group">
                {event.image ? (
                  <ProductImage src={event.image} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                    <ImageIcon size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-pe-gold text-pe-dark rounded-full text-sm font-medium uppercase tracking-widest hover:bg-pe-gold-light transition-colors">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      onChange={(e) => handleEventImageUpload(e, event.name)}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-xl text-pe-text mb-1">{event.name}</h3>
                <p className="text-sm text-pe-gold uppercase tracking-widest">{event.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'gallery' ? (
        <GalleryModeration />
      ) : (
        <HeroVideoManager />
      )}
    </div>
  );
}

function HeroVideoManager() {
  const heroVideo = useStore(state => state.heroVideo);
  const updateHeroVideo = useStore(state => state.updateHeroVideo);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(heroVideo);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'video/mp4') {
      alert('Only MP4 video format is supported.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('Video must be less than 50MB.');
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadVideoToCloudinary(file);
      setVideoUrl(uploadedUrl);
      
      // Update Firestore
      await setDoc(doc(db, 'settings', 'global'), { 
        heroVideo: uploadedUrl 
      }, { merge: true });
      
      updateHeroVideo(uploadedUrl);
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlSave = async () => {
    if (videoUrl) {
      try {
        // Update Firestore
        await setDoc(doc(db, 'settings', 'global'), { 
          heroVideo: videoUrl 
        }, { merge: true });
        
        updateHeroVideo(videoUrl);
        alert('Hero video updated successfully!');
      } catch (error) {
        console.error('Error saving video URL:', error);
        alert('Failed to save video URL.');
      }
    }
  };

  return (
    <div className="bg-pe-surface rounded-2xl shadow-sm border border-pe-divider overflow-hidden p-6 max-w-2xl mx-auto">
      <h2 className="font-serif text-2xl text-pe-text mb-6">Hero Video Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-pe-text-muted uppercase tracking-widest mb-2">
            Current Video Preview
          </label>
          <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
            {heroVideo ? (
              <video 
                src={heroVideo} 
                className="w-full h-full object-cover opacity-80"
                autoPlay 
                muted 
                loop 
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-pe-text-muted">
                No video set
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="animate-spin text-pe-gold" size={32} />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pe-text-muted uppercase tracking-widest mb-2">
            Upload New Video (MP4, Max 50MB)
          </label>
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-pe-surface border-2 border-pe-divider border-dashed rounded-xl appearance-none cursor-pointer hover:border-pe-gold focus:outline-none">
            <span className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-pe-text-muted" />
              <span className="font-medium text-pe-text-muted">
                {isUploading ? 'Uploading...' : 'Drop video to upload, or click to select'}
              </span>
            </span>
            <input 
              type="file" 
              name="file_upload" 
              className="hidden" 
              accept="video/mp4"
              onChange={handleVideoUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-pe-divider"></div>
          <span className="text-sm text-pe-text-muted uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-pe-divider"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pe-text-muted uppercase tracking-widest mb-2">
            Video URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="flex-1 px-4 py-2 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-pe-text"
            />
            <button
              onClick={handleUrlSave}
              className="px-6 py-2 bg-pe-gold text-pe-dark rounded-xl font-medium uppercase tracking-widest hover:bg-pe-gold-light transition-colors"
            >
              Save URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryModeration() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const setupListener = async () => {
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      const q = query(
        collection(db, 'gallery_posts'),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryPost[];
        setPosts(fetchedPosts);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching gallery posts:", error);
        setErrorMsg("Failed to load gallery posts.");
        setLoading(false);
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    setErrorMsg('');
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    try {
      await updateDoc(doc(db, 'gallery_posts', id), { approved });
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMsg("Failed to update post.");
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg('');
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    try {
      await deleteDoc(doc(db, 'gallery_posts', id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorMsg("Failed to delete post.");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-pe-gold" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {errorMsg && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">{errorMsg}</div>}
      
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-pe-surface border border-pe-divider rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-serif text-pe-text mb-4">Delete Post?</h3>
            <p className="text-pe-text-muted mb-6">Are you sure you want to delete this gallery post? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-pe-surface text-pe-text border border-pe-divider hover:border-pe-gold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-pe-divider rounded-2xl bg-pe-surface/30">
          <p className="text-pe-text-muted">No gallery posts found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="bg-pe-surface border border-pe-divider rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-[4/5] bg-pe-surface relative">
                <ProductImage src={post.images[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${post.approved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {post.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-serif text-lg text-pe-text">{post.groomName}</h3>
                  <p className="text-xs text-pe-text-muted uppercase tracking-wider mb-2">{post.outfitCategory} • {new Date(post.weddingDate).toLocaleDateString()}</p>
                  <p className="text-sm text-pe-text line-clamp-3">{post.caption}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-pe-divider flex gap-2">
                  <button
                    onClick={() => handleApprove(post.id, !post.approved)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      post.approved 
                        ? 'bg-pe-surface text-pe-text border border-pe-divider hover:border-pe-gold' 
                        : 'bg-pe-gold text-pe-dark hover:bg-pe-gold-light'
                    }`}
                  >
                    {post.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(post.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={20} />
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
