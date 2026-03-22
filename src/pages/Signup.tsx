import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || 'Failed to create account.');
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
      <div className="max-w-md w-full ios-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-pe-text tracking-tight">Create Account</h1>
          <p className="text-[15px] text-pe-text-muted mt-2">Join Pune Ethnic to save outfits and share your moments.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="ios-input-group">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ios-input"
              placeholder="Full Name"
            />
            <label>Full Name</label>
          </div>

          <div className="ios-input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ios-input"
              placeholder="Email Address"
            />
            <label>Email Address</label>
          </div>

          <div className="ios-input-group">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ios-input"
              placeholder="Password"
            />
            <label>Password</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full ios-btn ios-btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-pe-divider flex-1"></div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-pe-text-muted">Or continue with</span>
          <div className="h-px bg-pe-divider flex-1"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="mt-6 w-full ios-btn bg-white text-black flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>

        <p className="mt-8 text-center text-[13px] text-pe-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-pe-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
