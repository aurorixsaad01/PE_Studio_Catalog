import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { GalleryPost } from '../types';
import { processAndUploadImage } from '../services/uploadService';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Sherwani', 'Jodhpuri Suit', 'Indo-Western', 'Tuxedo', 'Kurta', 'Sangeet Ceremony'];

export default function GroomsGallery() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'gallery_posts'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryPost[];
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching gallery posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(post => post.outfitCategory === activeFilter);

  return (
    <div className="min-h-screen bg-pe-dark pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-pe-text mb-4">Real Grooms Gallery</h1>
            <p className="text-pe-text-muted max-w-2xl">
              Discover how real grooms styled their Pune Ethnic outfits. Get inspired by their wedding moments and share your own.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pe-gold text-pe-dark rounded-full font-medium uppercase tracking-widest hover:bg-pe-gold-light transition-colors whitespace-nowrap"
          >
            <Upload size={18} />
            Upload Your Moment
          </button>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 mb-10 pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium uppercase tracking-widest whitespace-nowrap transition-colors border ${
                activeFilter === category
                  ? 'bg-pe-gold text-pe-dark border-pe-gold'
                  : 'bg-transparent text-pe-text border-pe-divider hover:border-pe-gold/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-pe-gold" size={40} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-pe-divider rounded-2xl bg-pe-surface/30">
            <ImageIcon className="mx-auto text-pe-text-muted mb-4" size={48} />
            <h3 className="text-xl font-serif text-pe-text mb-2">No posts found</h3>
            <p className="text-pe-text-muted">Be the first to share your wedding moment in this category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden bg-pe-surface border border-pe-divider"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.images[0]} 
                    alt={`${post.groomName}'s wedding`}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-pe-text mb-1">{post.groomName}</h3>
                  <div className="flex items-center justify-between text-xs text-pe-text-muted uppercase tracking-wider">
                    <span>{post.outfitCategory}</span>
                    <span>{new Date(post.weddingDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      
      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'auth' | 'form' | 'success'>('auth');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    groomName: '',
    weddingDate: '',
    outfitCategory: 'Sherwani',
    caption: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      if (userProfile) {
        setStep('form');
      } else {
        setStep('auth');
      }
    } else {
      // Reset state on close
      setTimeout(() => {
        setFormData({ groomName: '', weddingDate: '', outfitCategory: 'Sherwani', caption: '' });
        setImages([]);
        setImagePreviews([]);
        setStep('auth');
      }, 300);
    }
  }, [isOpen, userProfile]);

  const handleLoginRedirect = () => {
    onClose();
    navigate('/login');
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (images.length + files.length > 5) {
      setErrorMsg('Maximum 5 images allowed.');
      return;
    }
    setErrorMsg('');

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (images.length === 0) {
      setErrorMsg('Please upload at least one image.');
      return;
    }
    setErrorMsg('');

    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(images.map(processAndUploadImage));
      
      const newPostRef = doc(collection(db, 'gallery_posts'));
      const postData: GalleryPost = {
        id: newPostRef.id,
        groomName: formData.groomName,
        weddingDate: formData.weddingDate,
        outfitCategory: formData.outfitCategory,
        caption: formData.caption,
        images: uploadedUrls,
        createdAt: Date.now(),
        approved: false,
        authorUid: auth.currentUser.uid
      };

      await setDoc(newPostRef, postData);
      setStep('success');
    } catch (error) {
      console.error("Error submitting post:", error);
      setErrorMsg("Failed to submit post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-pe-dark border border-pe-divider rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-pe-divider">
          <h2 className="font-serif text-2xl text-pe-text">Share Your Moment</h2>
          <button onClick={onClose} className="p-2 text-pe-text-muted hover:text-pe-text transition-colors rounded-full hover:bg-pe-surface">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          {step === 'auth' && (
            <div className="text-center py-12">
              <h3 className="text-xl font-serif text-pe-text mb-4">Sign in to upload</h3>
              <p className="text-pe-text-muted mb-8">Please sign in to your account to share your wedding photos with our community.</p>
              <button
                onClick={handleLoginRedirect}
                className="px-8 py-3 bg-pe-gold text-pe-dark rounded-full font-medium hover:bg-pe-gold-light transition-colors inline-flex items-center gap-3"
              >
                Go to Login
              </button>
            </div>
          )}

          {step === 'form' && (
            <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Groom Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={formData.groomName}
                    onChange={e => setFormData({ ...formData, groomName: e.target.value })}
                    className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Wedding Date</label>
                  <input
                    type="date"
                    required
                    value={formData.weddingDate}
                    onChange={e => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Outfit Category</label>
                <select
                  required
                  value={formData.outfitCategory}
                  onChange={e => setFormData({ ...formData, outfitCategory: e.target.value })}
                  className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text appearance-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Caption / Message</label>
                <textarea
                  required
                  maxLength={1000}
                  rows={3}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text resize-none"
                  placeholder="Tell us about your special day and your Pune Ethnic experience..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Wedding Photos (Max 5)</label>
                {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-pe-surface group border border-pe-divider">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeImage(idx)} className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="aspect-[4/5] rounded-xl border-2 border-dashed border-pe-divider flex flex-col items-center justify-center text-pe-text-muted hover:border-pe-gold hover:text-pe-gold transition-colors cursor-pointer bg-pe-surface/50">
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs font-medium uppercase tracking-wider text-center px-2">Upload</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg, image/png, image/webp" 
                        className="hidden" 
                        onChange={handleImageChange} 
                        disabled={isUploading} 
                      />
                    </label>
                  )}
                </div>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-serif text-pe-text mb-4">Upload Successful!</h3>
              <p className="text-pe-text-muted mb-8">Thank you for sharing your special moment. Your post has been submitted and is pending admin approval. It will appear in the gallery shortly.</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-pe-gold text-pe-dark rounded-full font-medium hover:bg-pe-gold-light transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {step === 'form' && (
          <div className="p-6 border-t border-pe-divider bg-pe-surface flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-3 bg-pe-dark border border-pe-divider text-pe-text rounded-xl text-sm font-medium hover:border-pe-gold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="upload-form"
              disabled={isUploading}
              className="px-8 py-3 bg-pe-gold text-pe-dark rounded-xl text-sm font-medium hover:bg-pe-gold-light transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                'Submit Post'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PostDetailModal({ post, onClose }: { post: GalleryPost; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-pe-dark border border-pe-divider rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black/80 transition-colors rounded-full md:hidden"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center min-h-[40vh] md:min-h-0">
          <img 
            src={post.images[currentImageIndex]} 
            alt="Wedding moment" 
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
          
          {post.images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev > 0 ? prev - 1 : post.images.length - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/80 transition-colors rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev < post.images.length - 1 ? prev + 1 : 0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black/80 transition-colors rounded-full"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 flex flex-col bg-pe-surface border-l border-pe-divider">
          <div className="hidden md:flex justify-end p-4 border-b border-pe-divider">
            <button onClick={onClose} className="p-2 text-pe-text-muted hover:text-pe-text transition-colors rounded-full hover:bg-pe-dark">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            <div className="mb-6">
              <h2 className="font-serif text-3xl text-pe-text mb-2">{post.groomName}</h2>
              <div className="flex items-center gap-4 text-sm text-pe-text-muted uppercase tracking-wider">
                <span className="text-pe-gold">{post.outfitCategory}</span>
                <span>•</span>
                <span>{new Date(post.weddingDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-pe-text leading-relaxed whitespace-pre-wrap">{post.caption}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
