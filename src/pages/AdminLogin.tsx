import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && userProfile) {
      if (userProfile.role === 'admin') {
        navigate('/manage-products');
      } else {
        navigate('/discover');
      }
    }
  }, [userProfile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirect once userProfile is updated
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError('Invalid admin credentials.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pe-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full ios-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-pe-surface flex items-center justify-center border border-pe-gold/20 mx-auto mb-4">
            <span className="text-pe-gold font-serif font-bold text-xl">PE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-pe-text tracking-tight">Admin Control Panel</h1>
          <p className="text-[15px] text-pe-text-muted mt-2">Sign in to manage the application.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-pe-gold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-[15px] text-pe-text"
              placeholder="admin@puneethnic.com"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-pe-gold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-pe-surface border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-[15px] text-pe-text"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full ios-btn ios-btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
