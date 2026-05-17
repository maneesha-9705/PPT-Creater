import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronRight, Loader2, RefreshCw, Eye, EyeOff, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import useAutoSave from '../hooks/useAutoSave';
import HintButton from './HintButton';
import SlidePreview from './SlidePreview';
import QualityScore from './QualityScore';
import SLIDES from '../utils/slideConfig';

export default function QuestionCard({ projectId, slideIndex, project }) {
  const { saveAnswers, generateSlide } = useProject();
  const slideConfig = SLIDES[slideIndex];
  const slideData   = project?.slides?.[slideIndex];

  // Build initial answers array
  const initAnswers = useCallback(() =>
    slideConfig.questions.map(q => {
      const saved = slideData?.answers?.find(a => a.questionId === q.id);
      return { questionId: q.id, question: q.text, answer: saved?.answer || '' };
    }), [slideConfig, slideData]);

  const [answers,    setAnswers]    = useState(initAnswers);
  const [generating, setGenerating] = useState(false);
  const [showPreview,setShowPreview]= useState(!!slideData?.aiGeneratedContent);
  const [score,      setScore]      = useState(slideData?.qualityScore || 0);
  const [suggestions,setSuggestions]= useState(slideData?.qualitySuggestions || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(slideData?.previewImageUrl || '');

  // Slides that support image uploads
  const IMAGE_SLIDES = [2, 3, 4, 5];
  const supportsImage = IMAGE_SLIDES.includes(slideIndex);

  useEffect(() => { setAnswers(initAnswers()); setShowPreview(!!slideData?.aiGeneratedContent); setScore(slideData?.qualityScore||0); setSuggestions(slideData?.qualitySuggestions||[]); }, [slideIndex]);

  useAutoSave(projectId, slideIndex, answers);

  const allAnswered = answers.every(a => a.answer.trim().length > 0);
  const progress    = answers.filter(a => a.answer.trim()).length;

  const updateAnswer = (idx, value) => {
    setAnswers(prev => prev.map((a, i) => i === idx ? { ...a, answer: value } : a));
  };

  const handleGenerate = async () => {
    if (!allAnswered) { toast.error('Please answer all questions first'); return; }
    setGenerating(true);
    try {
      await saveAnswers(projectId, slideIndex, answers);
      const result = await generateSlide(projectId, slideIndex);
      setScore(result.score || 0);
      setSuggestions(result.suggestions || []);
      setShowPreview(true);
      toast.success('Slide generated! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Upload to Cloudinary
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_BASE = isLocalhost ? 'http://localhost:5000/api' : 'https://ppt-creater-2.onrender.com/api';
      
      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('pitchcraft_token')}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

      // 2. Save URL to slide
      const saveRes = await fetch(`${API_BASE}/projects/${projectId}/slides/${slideIndex}/image`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('pitchcraft_token')}`
        },
        body: JSON.stringify({ imageUrl: uploadData.imageUrl })
      });
      
      if (!saveRes.ok) throw new Error('Failed to save image to slide');

      setUploadedImageUrl(uploadData.imageUrl);
      toast.success('Image added to slide! 🖼️');
      
      // Update local state by forcing a refresh or just rely on SlidePreview to pick it up?
      // Since project is passed down, we might need to trigger a project fetch. We can just use the local state for now.
      if (project && project.slides) {
        project.slides[slideIndex].previewImageUrl = uploadData.imageUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Slide header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{slideConfig.icon}</span>
        <div>
          <div className="text-white/40 text-xs font-body uppercase tracking-widest mb-0.5">
            Slide {slideIndex + 1} of 12
          </div>
          <h2 className="text-xl font-display font-bold text-white">{slideConfig.title}</h2>
          <p className="text-white/50 text-sm font-body mt-0.5">{slideConfig.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-white/40 mb-1.5 font-body">
          <span>{progress}/{answers.length} answered</span>
          {allAnswered && <span className="text-green-400">✓ Ready to generate</span>}
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(progress / answers.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-crimson to-amber rounded-full"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        <AnimatePresence mode="sync">
          {slideConfig.questions.map((q, i) => {
            const wordCount = (answers[i]?.answer || '').trim().split(/\s+/).filter(Boolean).length;
            const MAX_WORDS = 80;
            const isOver    = wordCount > MAX_WORDS;
            const isWarning = wordCount > 60;
            return (
              <motion.div
                key={`${slideIndex}-${q.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass p-4"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <label className="block text-white/80 text-sm font-body leading-snug">
                    <span className="text-crimson font-semibold mr-1.5">Q{i + 1}.</span>{q.text}
                  </label>
                  {/* Word counter badge */}
                  <span className={`flex-shrink-0 text-xs font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    isOver    ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                    isWarning ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                                'bg-white/5 border-white/10 text-white/30'
                  }`}>
                    {wordCount}/{MAX_WORDS}w
                  </span>
                </div>

                {q.type === 'textarea' ? (
                  <textarea
                    value={answers[i]?.answer || ''}
                    onChange={e => updateAnswer(i, e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                    className="input-field resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={answers[i]?.answer || ''}
                    onChange={e => updateAnswer(i, e.target.value)}
                    placeholder={q.placeholder}
                    className="input-field"
                  />
                )}

                {isOver && (
                  <p className="text-amber-400/80 text-xs mt-1 font-body">
                    ⚠️ Over {MAX_WORDS} words — only the first {MAX_WORDS} words will appear on the slide.
                  </p>
                )}

                <HintButton questionId={q.id} question={q.text} slideTitle={slideConfig.title} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Image Upload for specific slides */}
      {supportsImage && (
        <div className="glass p-4">
          <label className="block text-white/80 text-sm font-body leading-snug mb-3">
            <span className="text-crimson font-semibold mr-1.5">Optional.</span> Upload a custom visual
          </label>
          <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploadingImage}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
            />
            {uploadingImage ? (
              <div className="flex flex-col items-center gap-2 text-amber-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Uploading to cloud...</span>
              </div>
            ) : uploadedImageUrl ? (
              <div className="flex flex-col items-center gap-2 text-green-400">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm font-medium text-white/80">Image attached. Click to replace.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                <UploadCloud className="w-8 h-8" />
                <span className="text-sm font-medium">Click or drag image to upload</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organise & Save button */}
      <motion.button
        onClick={handleGenerate}
        disabled={!allAnswered || generating}
        whileHover={allAnswered && !generating ? { scale: 1.02 } : {}}
        whileTap={allAnswered && !generating ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2.5 transition-all
          ${allAnswered && !generating
            ? 'bg-gradient-to-r from-crimson to-amber text-white shadow-lg shadow-crimson/30 animate-pulse-slow'
            : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
      >
        {generating ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Organising your content…</>
        ) : (
          <><ChevronRight className="w-5 h-5" /> Build Slide from My Answers</>
        )}
      </motion.button>

      {/* Preview toggle + quality */}
      <AnimatePresence>
        {slideData?.aiGeneratedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-display font-semibold text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber" /> Slide Preview
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setShowPreview(v => !v)} className="btn-ghost text-xs flex items-center gap-1">
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPreview ? 'Hide' : 'Show'}
                </button>
                <button onClick={handleGenerate} disabled={generating} className="btn-ghost text-xs flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPreview && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <SlidePreview slideConfig={slideConfig} slideData={slideData} project={project} />
                  <QualityScore score={score} suggestions={suggestions} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
