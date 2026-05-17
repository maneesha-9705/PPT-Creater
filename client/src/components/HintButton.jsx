import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2 } from 'lucide-react';
import useAI from '../hooks/useAI';
import toast from 'react-hot-toast';

export default function HintButton({ questionId, question, slideTitle }) {
  const { getHint, hints, hintLoading } = useAI();
  const [show, setShow] = useState(false);

  const handleHint = async () => {
    if (hints[questionId]) { setShow(v => !v); return; }
    try {
      await getHint(questionId, question, slideTitle);
      setShow(true);
    } catch {
      toast.error('Could not get hint. Check API key.');
    }
  };

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={handleHint}
        disabled={hintLoading}
        className="inline-flex items-center gap-1.5 text-amber/70 hover:text-amber text-xs font-body transition-colors"
      >
        {hintLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
        {hints[questionId] && show ? 'Hide hint' : 'Get AI hint'}
      </button>

      <AnimatePresence>
        {show && hints[questionId] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-amber/10 border border-amber/20 rounded-lg text-amber/90 text-xs font-body leading-relaxed">
              <span className="font-semibold text-amber">💡 Example: </span>
              {hints[questionId]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
