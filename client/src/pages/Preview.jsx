import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import api from '../utils/api';
import SlidePreview from '../components/SlidePreview';
import SLIDES from '../utils/slideConfig';

export default function Preview() {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/projects/share/${token}`);
        setProject(data);
      } catch { /* not found */ }
      finally { setLoading(false); }
    };
    load();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-crimson/30 border-t-crimson rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-white/40 font-body">
      Shared deck not found.
    </div>
  );

  const completedSlides = project.slides?.filter(s => s.aiGeneratedContent) || [];

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/10 bg-ink-light/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-crimson" />
            <span className="font-display font-bold text-white">{project.projectTitle}</span>
          </div>
          <span className="text-white/40 text-xs font-body">Biz Vision Demo Day · SRKR Engineering College (A)</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-display font-bold text-white mb-2">{project.projectTitle}</h1>
        <p className="text-white/50 font-body mb-8">Team: {project.teamName} · {completedSlides.length} slides</p>

        {completedSlides.length === 0 ? (
          <p className="text-white/30 font-body">No slides generated yet.</p>
        ) : (
          <div className="space-y-6">
            {/* Large current preview */}
            <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SlidePreview
                slideConfig={SLIDES[current]}
                slideData={project.slides[current]}
                project={project}
              />
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                className="btn-ghost flex items-center gap-1.5 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-white/40 text-sm font-body">{current + 1} / 12</span>
              <button onClick={() => setCurrent(c => Math.min(11, c + 1))} disabled={current === 11}
                className="btn-ghost flex items-center gap-1.5 disabled:opacity-30">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SLIDES.map((s, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`flex-shrink-0 w-20 text-center rounded-lg py-1.5 text-xs font-body transition-all border
                    ${i === current ? 'border-amber text-amber bg-amber/10' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                  <div className="text-base mb-0.5">{s.icon}</div>
                  <div className="leading-tight truncate px-1">{s.title.split('/')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
