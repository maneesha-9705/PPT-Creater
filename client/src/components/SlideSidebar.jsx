import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import SLIDES from '../utils/slideConfig';

export default function SlideSidebar({ currentSlide, slides, onSelect }) {
  const getStatus = (i) => {
    const s = slides?.[i];
    if (s?.questionsAnswered) return 'done';
    if (i <= (slides?.findIndex(sl => !sl.questionsAnswered) ?? 0) || i === currentSlide) return 'active';
    if (i > currentSlide) return 'locked';
    return 'idle';
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-20">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, padding:'0 4px' }}>
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase' }}>12 Slides</span>
          <div style={{ background:'linear-gradient(90deg,#4F8EF7,#F5A623)', borderRadius:20, padding:'2px 8px', fontSize:9, fontWeight:800, color:'#fff' }}>
            {slides?.filter(s=>s?.questionsAnswered).length||0}/12
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:'calc(100vh - 148px)', overflowY:'auto', paddingRight:4 }}>
          {SLIDES.map((slide, i) => {
            const status = getStatus(i);
            const isActive = i === currentSlide;
            const isDone   = status === 'done';
            const isLocked = status === 'locked';

            return (
              <motion.button
                key={i}
                onClick={() => !isLocked && onSelect(i)}
                whileHover={!isLocked ? { x: 4, transition:{ duration:0.15 } } : {}}
                whileTap={!isLocked ? { scale:0.97 } : {}}
                style={{
                  width:'100%', textAlign:'left', border:'none', cursor: isLocked ? 'not-allowed' : 'pointer',
                  borderRadius:12, padding:'8px 10px',
                  display:'flex', alignItems:'center', gap:8,
                  opacity: isLocked ? 0.38 : 1,
                  background: isActive
                    ? 'linear-gradient(135deg,rgba(79,142,247,0.18),rgba(245,166,35,0.10))'
                    : isDone
                    ? 'rgba(52,211,153,0.08)'
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(79,142,247,0.45), 0 4px 16px rgba(79,142,247,0.15)' :
                             isDone   ? 'inset 0 0 0 1px rgba(52,211,153,0.3)' :
                             'inset 0 0 0 1px rgba(255,255,255,0.05)',
                  transition:'all 0.2s ease',
                }}
              >
                {/* Status icon */}
                <div style={{ flexShrink:0, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isDone ? (
                    <CheckCircle2 style={{ width:16, height:16, color:'#34D399', filter:'drop-shadow(0 0 4px #34D399)' }}/>
                  ) : isLocked ? (
                    <Lock style={{ width:14, height:14, color:'rgba(255,255,255,0.25)' }}/>
                  ) : isActive ? (
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#4F8EF7,#F5A623)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff', boxShadow:'0 0 8px #4F8EF755' }}>
                      {i+1}
                    </div>
                  ) : (
                    <div style={{ width:16, height:16, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'rgba(255,255,255,0.35)' }}>
                      {i+1}
                    </div>
                  )}
                </div>

                {/* Label */}
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{
                    margin:0, fontSize:11, fontWeight:700, letterSpacing:'0.01em',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                    color: isActive ? '#fff' : isDone ? '#34D399' : 'rgba(255,255,255,0.6)',
                    fontFamily:"'Montserrat','Inter',sans-serif"
                  }}>
                    <span style={{ marginRight:4 }}>{slide.icon}</span>{slide.title}
                  </p>
                </div>

                {/* Active play indicator */}
                {isActive && <Play style={{ width:10, height:10, color:'#F5A623', flexShrink:0 }}/>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile: horizontal strip */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-2">
        {SLIDES.map((slide, i) => {
          const status  = getStatus(i);
          const isActive = i === currentSlide;
          return (
            <motion.button
              key={i}
              onClick={() => status !== 'locked' && onSelect(i)}
              whileTap={{ scale:0.9 }}
              style={{
                flexShrink:0, width:32, height:32, borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:10, fontWeight:900, border:'none', cursor: status==='locked'?'not-allowed':'pointer',
                background: isActive ? 'linear-gradient(135deg,#4F8EF7,#F5A623)'
                          : status==='done' ? 'rgba(52,211,153,0.25)'
                          : status==='locked' ? 'rgba(255,255,255,0.04)'
                          : 'rgba(255,255,255,0.1)',
                color: isActive ? '#fff' : status==='done' ? '#34D399' : status==='locked' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                boxShadow: isActive ? '0 4px 16px rgba(79,142,247,0.45)' : 'none',
              }}
            >
              {status === 'done' ? '✓' : i + 1}
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
