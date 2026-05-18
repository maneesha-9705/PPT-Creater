import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ChevronRight, ChevronLeft, Rocket, Download, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import SlideSidebar from '../components/SlideSidebar';
import QuestionCard from '../components/QuestionCard';
import SlidePreview from '../components/SlidePreview';
import SLIDES from '../utils/slideConfig';
import { exportProjectToPdf } from '../utils/exportToPptx';

export default function Builder() {
  const { id } = useParams();
  const { project, fetchProject, loading } = useProject();

  // ── All hooks before any early return ─────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress,  setDlProgress]  = useState({ cur: 0, total: 12 });

  useEffect(() => {
    fetchProject(id).then(p => { if (p) setActiveSlide(p.currentSlide || 0); });
  }, [id]);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    setDlProgress({ cur: 0, total: 12 });
    const toastId = toast.loading('📄 Building PDF — slide 1 of 12…', { duration: 99999 });
    try {
      await exportProjectToPdf(
        project?.projectTitle || 'PitchDeck',
        (cur, total) => {
          setDlProgress({ cur, total });
          toast.loading(`📄 Capturing slide ${cur} of ${total}…`, { id: toastId });
        }
        // No onSelectSlide needed — off-screen process
      );
      toast.success('🎉 PDF downloaded! Looks exactly like the preview.', { id: toastId, duration: 4000 });
    } catch (err) {
      console.error(err);
      toast.error('Export failed. Please try again.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  }, [downloading, project]);
  // ──────────────────────────────────────────────────────────────────────────

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-crimson/30 border-t-crimson rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 font-body">Loading your project…</p>
        </div>
      </div>
    );
  }

  const completedCount = project?.slides?.filter(s => s.questionsAnswered).length || 0;
  const isComplete     = completedCount === 12;
  const pct            = Math.round((dlProgress.cur / dlProgress.total) * 100);

  const goNext = () => { if (activeSlide < 11) setActiveSlide(s => s + 1); };
  const goPrev = () => { if (activeSlide > 0)  setActiveSlide(s => s - 1); };

  return (
    <div className="min-h-screen bg-ink flex flex-col">

      {/* ── HIDDEN OFF-SCREEN EXPORT CONTAINER ──────────────────────────────
          All 12 slides are pre-rendered here at 1280×720.
          Invisible to the user but available for html2canvas to capture.
      ─────────────────────────────────────────────────────────────────── */}
      {project && (
        <div
          aria-hidden="true"
          style={{
            position:      'fixed',
            left:          '-99999px',
            top:           0,
            width:         1280,
            pointerEvents: 'none',
            zIndex:        -9999,
            opacity:       1,   // must be 1 for html2canvas to capture content
          }}
        >
          {SLIDES.map((slideConfig, i) => (
            <div
              key={i}
              data-slide-export={i}
              style={{ width: 1280, height: 720, overflow: 'hidden', flexShrink: 0 }}
            >
              <SlidePreview
                slideConfig={slideConfig}
                slideData={project.slides?.[i]}
                project={project}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b border-white/10 bg-ink-light/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="text-white/40 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Rocket className="w-5 h-5 text-crimson" />
              <span className="font-display font-bold text-white text-sm hidden sm:block">PitchCraft</span>
            </div>
            <span className="text-white/20 hidden sm:block">|</span>
            <h1 className="font-display font-semibold text-white text-sm truncate">{project?.projectTitle || '…'}</h1>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/40 text-xs font-body">{completedCount}/12</span>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(completedCount / 12) * 100}%` }}
                  className="h-full bg-gradient-to-r from-crimson to-amber rounded-full"
                />
              </div>
            </div>

            <motion.button
              onClick={handleDownload}
              disabled={downloading}
              whileHover={!downloading ? { scale: 1.05 } : {}}
              whileTap={!downloading ? { scale: 0.95 } : {}}
              className={`relative flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-display font-bold overflow-hidden transition-all
                ${isComplete
                  ? 'bg-gradient-to-r from-crimson to-amber text-white shadow-lg shadow-crimson/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                } ${downloading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {downloading && (
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: pct / 100 }}
                  style={{ transformOrigin: 'left' }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {downloading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {pct}%</>
                  : <><Download className="w-3.5 h-3.5" /> Download PDF</>
                }
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Export progress banner ── */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-amber/10 border-b border-amber/20 px-4 py-2 text-center"
          >
            <p className="text-amber text-xs font-body">
              📄 Building PDF in background — slide {dlProgress.cur} of {dlProgress.total}… please wait
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        <SlideSidebar currentSlide={activeSlide} slides={project?.slides} onSelect={setActiveSlide} />

        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {project && (
                <QuestionCard
                  projectId={id}
                  slideIndex={activeSlide}
                  project={project}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={goPrev}
              disabled={activeSlide === 0}
              className="btn-ghost flex items-center gap-2 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-white/30 text-xs font-body">
              {SLIDES[activeSlide]?.icon} Slide {activeSlide + 1} — {SLIDES[activeSlide]?.title}
            </span>

            {activeSlide < 11 ? (
              <button onClick={goNext} className="btn-secondary flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                onClick={handleDownload}
                disabled={downloading}
                whileHover={!downloading ? { scale: 1.04 } : {}}
                whileTap={!downloading ? { scale: 0.96 } : {}}
                className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Building PDF {pct}%…</>
                  : <><Download className="w-4 h-4" /> Finish &amp; Download PDF</>
                }
              </motion.button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
