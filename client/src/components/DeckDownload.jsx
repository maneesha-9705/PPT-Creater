import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Download, Loader2, X, Trophy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : 'https://ppt-creater-2.onrender.com/api');

export default function DeckDownload({ projectId, project, onClose }) {
  const { generateDeck } = useProject();
  const [generating, setGenerating] = useState(false);
  const [pptxUrl,    setPptxUrl]    = useState(project?.pptxUrl || '');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateDeck(projectId);
      setPptxUrl(result.pptxUrl);
      toast.success('🎉 Your pitch deck is ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const downloadUrl = pptxUrl
    ? `${API_BASE.replace('/api', '')}${pptxUrl}`
    : null;

  const completedCount = project?.slides?.filter(s => s.questionsAnswered).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        className="bg-ink-light border border-white/10 rounded-2xl p-8 w-full max-w-md text-center relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-crimson to-amber flex items-center justify-center mx-auto mb-5">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-display font-bold text-white mb-2">Generate Pitch Deck</h2>
        <p className="text-white/50 font-body text-sm mb-6">
          {completedCount}/12 slides completed. Your deck will be exported as a professional PPTX file.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Slides', value: '12' },
            { label: 'Completed', value: `${completedCount}` },
            { label: 'Theme', value: project?.selectedTheme?.split('-')[0] || 'Biz' },
          ].map(({ label, value }) => (
            <div key={label} className="glass p-3 rounded-xl">
              <div className="text-xl font-display font-bold text-amber">{value}</div>
              <div className="text-white/40 text-xs font-body">{label}</div>
            </div>
          ))}
        </div>

        {pptxUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-green-400 font-body text-sm mb-4">
              <CheckCircle2 className="w-5 h-5" />
              Deck generated successfully!
            </div>
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PPTX
            </a>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
            >
              Regenerate Deck
            </button>
            {project?.shareToken && (
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${project.shareToken}`); toast.success('Share link copied!'); }}
                className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Copy Share Link
              </button>
            )}
          </div>
        ) : (
          <motion.button
            onClick={handleGenerate}
            disabled={generating}
            whileHover={!generating ? { scale: 1.03 } : {}}
            whileTap={!generating ? { scale: 0.97 } : {}}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
          >
            {generating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Building your deck…</>
            ) : (
              <><Trophy className="w-5 h-5" /> Generate Full Pitch Deck</>
            )}
          </motion.button>
        )}

        <p className="text-white/20 text-xs font-body mt-4">
          Biz Vision Demo Day · SRKR Engineering College (A)
        </p>
      </motion.div>
    </motion.div>
  );
}
