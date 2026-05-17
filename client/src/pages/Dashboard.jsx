import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Rocket, LogOut, ChevronRight, CheckCircle2, Clock, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import api from '../utils/api';

const THEMES = [
  { id: 'biz-vision-blue', label: 'Biz Vision Blue', color: '#0A2463' },
  { id: 'minimal-white',   label: 'Minimal White',   color: '#4361EE' },
  { id: 'bold-dark',       label: 'Bold Dark',        color: '#FF6B35' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { projects, fetchProjects, createProject, loading } = useProject();
  const navigate = useNavigate();

  const [showNew, setShowNew] = useState(false);
  const [form, setForm]       = useState({ projectTitle: '', teamName: user?.teamName || '', collegeName: user?.collegeName || 'SRKR Engineering College (A)', selectedTheme: 'biz-vision-blue' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.projectTitle.trim()) return toast.error('Project title required');
    setCreating(true);
    try {
      const project = await createProject(form);
      toast.success('Project created! Let\'s build 🚀');
      navigate(`/builder/${project._id}`);
    } catch { toast.error('Failed to create project'); }
    finally { setCreating(false); }
  };

  const progress = (p) => {
    const done = p.slides?.filter(s => s.questionsAnswered).length || 0;
    return Math.round((done / 12) * 100);
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Header */}
      <header className="border-b border-white/10 bg-ink-light/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-crimson" />
            <span className="font-display font-bold text-white text-lg">PitchCraft</span>
            <span className="hidden sm:inline text-white/30 text-sm ml-2">| Biz Vision Demo Day</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-body hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="btn-ghost flex items-center gap-1.5 text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white/50 font-body">Your pitch decks for Biz Vision Demo Day</p>
        </motion.div>

        {/* New Project CTA */}
        <motion.button
          onClick={() => setShowNew(true)}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full mb-8 border-2 border-dashed border-crimson/40 rounded-2xl p-6 flex items-center justify-center gap-3 text-crimson hover:bg-crimson/5 transition-all"
        >
          <Plus className="w-6 h-6" />
          <span className="font-display font-semibold text-lg">Create New Pitch Deck</span>
        </motion.button>

        {/* Projects grid */}
        {loading && projects.length === 0 ? (
          <div className="text-center text-white/40 py-20 font-body">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-body">No projects yet. Create your first pitch deck!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => {
              const pct = progress(p);
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/builder/${p._id}`)}
                  className="glass p-5 cursor-pointer hover:border-crimson/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-crimson/20 flex items-center justify-center">
                      {p.isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Clock className="w-5 h-5 text-amber" />}
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-crimson transition-colors mt-1" />
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-1 line-clamp-1">{p.projectTitle}</h3>
                  <p className="text-white/50 text-sm font-body mb-4">{p.teamName || p.collegeName}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-white/40 mb-1 font-body">
                      <span>{pct}% complete</span>
                      <span>{p.slides?.filter(s => s.questionsAnswered).length || 0}/12 slides</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 + 0.2 }}
                        className="h-full bg-gradient-to-r from-crimson to-amber rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-ink-light border border-white/10 rounded-2xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">New Pitch Deck</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm font-body block mb-1.5">Project / Startup Name *</label>
                  <input value={form.projectTitle} onChange={e => setForm(f => ({ ...f, projectTitle: e.target.value }))}
                    placeholder="e.g. EduReach AI" className="input-field" required />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-body block mb-1.5">Team Name</label>
                  <input value={form.teamName} onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))}
                    placeholder="e.g. Team Ignite" className="input-field" />
                </div>
                <div>
                  <label className="text-white/70 text-sm font-body block mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Deck Theme
                  </label>
                  <div className="flex gap-2">
                    {THEMES.map(th => (
                      <button key={th.id} type="button"
                        onClick={() => setForm(f => ({ ...f, selectedTheme: th.id }))}
                        className={`flex-1 py-2 rounded-lg border text-xs font-body transition-all ${form.selectedTheme === th.id ? 'border-amber text-amber' : 'border-white/20 text-white/50 hover:border-white/40'}`}
                      >
                        <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ background: th.color }} />
                        {th.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowNew(false)} className="btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={creating} className="btn-primary flex-1">
                    {creating ? 'Creating…' : 'Start Building →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
