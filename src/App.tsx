/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { useStore } from './store';
import { Product } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Collections from './pages/Collections';
import Admin from './pages/Admin';
import GroomsGallery from './pages/GroomsGallery';

import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <motion.div 
      className="fixed inset-0 bg-pe-dark flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <video 
        autoPlay 
        muted 
        playsInline 
        className="w-full h-full object-cover"
        onEnded={onComplete}
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => {
          console.log("Video failed to load, skipping splash");
          setTimeout(onComplete, 1000);
        }}
      >
        <source src="https://res.cloudinary.com/dqxlc84z6/video/upload/v1773768444/Minimal_Logo_Intro_Video_Generation_vst2yg.mov" />
      </video>
      
      <button 
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-[11px] font-medium uppercase tracking-widest rounded-full border border-white/20 hover:bg-black/70 transition-colors z-10"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const setProducts = useStore(state => state.setProducts);

  useEffect(() => {
    console.log("App mounted, attempting to load products from Firestore");
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Products loaded:", snapshot.docs.length);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products:", error);
    });

    return () => unsubscribe();
  }, [setProducts]);

  // Fallback timer in case video fails to load or play
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Splash screen timeout reached, showing main content");
      setShowSplash(false);
    }, 8000); // Max 8 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>
        
        {!showSplash && (
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/discover" replace />} />
              <Route path="discover" element={<Home />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="categories" element={<Categories />} />
              <Route path="collections" element={<Collections />} />
              <Route path="gallery" element={<GroomsGallery />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile" element={<Profile />} />
              <Route path="manage-products" element={<Admin />} />
              <Route path="pe-control" element={<AdminLogin />} />
              <Route path="pe-control/dashboard" element={<Navigate to="/manage-products" replace />} />
              <Route path="*" element={<Navigate to="/discover" replace />} />
            </Route>
          </Routes>
        )}
      </Router>
    </AuthProvider>
  );
}

