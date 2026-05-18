import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Rocket, UserPlus, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back! 🚀');
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.code === 'ACCOUNT_NOT_FOUND') {
        setShowNoAccountDialog(true);
      } else {
        toast.error(err.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-crimson/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-crimson" />
            <span className="text-2xl font-display font-bold text-white">PitchCraft</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/60 font-body">Sign in to continue building your pitch deck</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 text-sm font-body mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-body mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber hover:text-amber-light font-semibold transition-colors">
              Create one →
            </Link>
          </p>
        </div>

        {/* Branding footer */}
        <p className="text-center text-white/30 text-xs mt-6 font-body">
          Biz Vision Demo Day · SRKR Engineering College (A) · Powered by IIC & MoE Innovation Cell
        </p>
      </motion.div>

      {/* No Account Dialog */}
      <AnimatePresence>
        {showNoAccountDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNoAccountDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass p-6 overflow-hidden"
            >
              <button 
                onClick={() => setShowNoAccountDialog(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-amber" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Account Not Found</h3>
                <p className="text-white/70 font-body text-sm mb-6">
                  You don't have an account with <strong className="text-white">{email}</strong> yet. Please create one to sign in.
                </p>
                <button
                  onClick={() => {
                    setShowNoAccountDialog(false);
                    navigate('/register', { state: { email } });
                  }}
                  className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-amber to-orange-500 text-white shadow-lg shadow-amber/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Account Now
                </button>
                <button
                  onClick={() => setShowNoAccountDialog(false)}
                  className="w-full mt-3 py-2 text-white/50 hover:text-white text-sm font-body transition-colors"
                >
                  Try another email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
