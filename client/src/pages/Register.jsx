import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Users, Building2, Rocket } from 'lucide-react';

export default function Register() {
  const location = useLocation();
  const [form, setForm] = useState({ 
    name: '', 
    email: location.state?.email || '', 
    password: '', 
    teamName: '', 
    collegeName: 'SRKR Engineering College (A)' 
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.teamName, form.collegeName);
      toast.success('Account created! Let\'s build your pitch 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-crimson/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-crimson" />
            <span className="text-2xl font-display font-bold text-white">PitchCraft</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/60 font-body">Start building your investor-ready pitch deck</p>
        </div>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { icon: User,     label: 'Your Name',     key: 'name',       type: 'text',     ph: 'Arjun Kumar' },
              { icon: Mail,     label: 'Email',         key: 'email',      type: 'email',    ph: 'you@example.com' },
              { icon: Lock,     label: 'Password',      key: 'password',   type: 'password', ph: '••••••••' },
              { icon: Users,    label: 'Team Name',     key: 'teamName',   type: 'text',     ph: 'Team Ignite' },
              { icon: Building2,label: 'College Name',  key: 'collegeName',type: 'text',     ph: 'SRKR Engineering College (A)' },
            ].map(({ icon: Icon, label, key, type, ph }) => (
              <div key={key}>
                <label className="block text-white/80 text-sm font-body mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={type} value={form[key]} onChange={set(key)}
                    placeholder={ph} required={key !== 'teamName'}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account & Start Building'}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-5 font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-amber hover:text-amber-light font-semibold transition-colors">
              Sign in →
            </Link>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6 font-body">
          Biz Vision Demo Day · SRKR Engineering College (A) · Powered by IIC & MoE Innovation Cell
        </p>
      </motion.div>
    </div>
  );
}
