import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && userProfile) {
      navigate('/profile');
    }
  }, [userProfile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google login error:", err);
      setError('Failed to sign in with Google.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pe-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-pe-surface border border-pe-divider rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-pe-text">Welcome Back</h1>
          <p className="text-pe-text-muted mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-pe-dark border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-pe-gold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-pe-dark border border-pe-divider rounded-xl focus:outline-none focus:border-pe-gold text-sm text-pe-text"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-pe-gold text-pe-dark rounded-xl font-medium hover:bg-pe-gold-light transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-pe-divider flex-1"></div>
          <span className="text-xs uppercase tracking-widest text-pe-text-muted">Or continue with</span>
          <div className="h-px bg-pe-divider flex-1"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="mt-6 w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>

        <p className="mt-8 text-center text-sm text-pe-text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pe-gold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
