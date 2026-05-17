import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

const scoreColor = (s) => {
  if (s >= 8) return 'text-green-400 bg-green-400/10 border-green-400/30';
  if (s >= 5) return 'text-amber bg-amber/10 border-amber/30';
  return 'text-crimson bg-crimson/10 border-crimson/30';
};

export default function QualityScore({ score, suggestions }) {
  if (!score) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-white/3 border border-white/10 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`quality-badge border ${scoreColor(score)}`}>
          <Star className="w-3 h-3" />
          {score}/10
        </div>
        <span className="text-white/60 text-xs font-body">Slide Quality Score</span>
      </div>
      {suggestions?.length > 0 && (
        <div className="space-y-1.5">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/60 font-body">
              <TrendingUp className="w-3.5 h-3.5 text-amber flex-shrink-0 mt-0.5" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
