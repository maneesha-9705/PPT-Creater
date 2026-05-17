// =========================================================
// FILE 1: SlidePreview.jsx
// FRONTEND FILE
// =========================================================

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 30,
};

const TYPE = {
  hero: '2.3rem',
  title: '1.7rem',
  subtitle: '0.95rem',
  body: '0.9rem',
  caption: '0.72rem',
};

const THEMES = {
  'biz-vision-blue': {
    bg: '#020617',
    surface: 'rgba(15,23,42,0.7)',
    border: 'rgba(56,189,248,0.18)',
    accent: '#38BDF8',
    accentB: '#818CF8',
    text: '#F8FAFC',
    textMut: '#94A3B8',
    grad: 'linear-gradient(135deg,#38BDF8 0%,#818CF8 100%)',
    glow: 'rgba(56,189,248,0.28)',
  },
};

const LAYOUTS = {
  1: { columns: '1fr', visual: 'none', headline: TYPE.hero, bullets: 'pill' },
  2: { columns: '1.2fr 0.8fr', visual: 'right', headline: TYPE.title, bullets: 'dash' },
  3: { columns: '1.2fr 0.8fr', visual: 'right', headline: TYPE.title, bullets: 'dash' },
  4: { columns: '1fr 1fr', visual: 'right', headline: TYPE.title, bullets: 'numbered' },
  5: { columns: '1.1fr 0.9fr', visual: 'right', headline: TYPE.title, bullets: 'dash' },
  6: { columns: '1.15fr 0.85fr', visual: 'right', headline: TYPE.title, bullets: 'dash' },
  7: { columns: '0.9fr 1.1fr', visual: 'right', headline: TYPE.title, bullets: 'stat' },
  8: { columns: '1.15fr 0.85fr', visual: 'right', headline: TYPE.title, bullets: 'dash' },
  9: { columns: '1.2fr 0.8fr', visual: 'right', headline: TYPE.title, bullets: 'numbered' },
  10: { columns: '0.85fr 1.15fr', visual: 'left', headline: TYPE.title, bullets: 'dash' },
  11: { columns: '0.9fr 1.1fr', visual: 'right', headline: TYPE.title, bullets: 'stat' },
  12: { columns: '1fr', visual: 'none', headline: TYPE.hero, bullets: 'pill' },
};

const BulletDash = ({ bullets, t }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {bullets.map((b, i) => (
      <div key={i} style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            width: 12,
            height: 2,
            background: t.accent,
            marginTop: 10,
          }}
        />
        <span
          style={{
            color: t.text,
            fontSize: TYPE.body,
            lineHeight: 1.6,
          }}
        >
          {b}
        </span>
      </div>
    ))}
  </div>
);

const BulletNumbered = ({ bullets, t }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    {bullets.map((b, i) => (
      <div key={i} style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: t.grad,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {i + 1}
        </div>

        <span
          style={{
            color: t.text,
            fontSize: TYPE.body,
            lineHeight: 1.6,
          }}
        >
          {b}
        </span>
      </div>
    ))}
  </div>
);

const BulletPill = ({ bullets, t }) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
  >
    {bullets.map((b, i) => (
      <div
        key={i}
        style={{
          padding: '8px 18px',
          borderRadius: 999,
          background: `${t.accent}18`,
          border: `1px solid ${t.border}`,
          color: t.accent,
          fontWeight: 700,
        }}
      >
        {b}
      </div>
    ))}
  </div>
);

const BulletStat = ({ bullets, t }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    {bullets.map((b, i) => (
      <div key={i}>
        <span
          style={{
            color: t.accent,
            fontWeight: 800,
          }}
        >
          {b}
        </span>
      </div>
    ))}
  </div>
);

const BULLET_TYPES = {
  dash: BulletDash,
  numbered: BulletNumbered,
  pill: BulletPill,
  stat: BulletStat,
};

const VisualFrame = ({ t }) => (
  <div
    style={{
      width: '100%',
      height: 320,
      borderRadius: 20,
      border: `1px solid ${t.border}`,
      background: t.surface,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(20px)',
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 22,
        ease: 'linear',
      }}
      style={{
        width: 160,
        height: 160,
        borderRadius: '50%',
        border: `1px dashed ${t.accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: t.grad,
          boxShadow: `0 0 40px ${t.glow}`,
        }}
      />
    </motion.div>
  </div>
);

const SlideBody = ({
  slideNum,
  content,
  t,
}) => {
  const layout = LAYOUTS[slideNum];

  const Bullet =
    BULLET_TYPES[layout.bullets] || BulletDash;

  const isCentered = layout.visual === 'none';

  const bullets = (content.bullets || []).slice(
    0,
    4
  );

  const TextSection = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <h1
        style={{
          margin: 0,
          color: t.text,
          fontSize: layout.headline,
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: '-0.03em',
        }}
      >
        {content.headline}
      </h1>

      {content.subtext && (
        <p
          style={{
            margin: 0,
            color: t.textMut,
            lineHeight: 1.7,
            fontSize: TYPE.body,
          }}
        >
          {content.subtext}
        </p>
      )}

      {bullets.length > 0 && (
        <Bullet bullets={bullets} t={t} />
      )}
    </div>
  );

  if (isCentered) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 820 }}>
          {TextSection}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: layout.columns,
        gap: 24,
        alignItems: 'center',
        height: '100%',
      }}
    >
      {layout.visual === 'left' ? (
        <>
          <VisualFrame t={t} />
          {TextSection}
        </>
      ) : (
        <>
          {TextSection}
          <VisualFrame t={t} />
        </>
      )}
    </div>
  );
};

export default function SlidePreview({
  slideConfig,
  slideData,
  project,
}) {
  const t =
    THEMES[project?.selectedTheme] ||
    THEMES['biz-vision-blue'];

  const slideNum = (slideConfig?.index || 0) + 1;

  const content = useMemo(() => {
    try {
      if (slideData?.aiGeneratedContent) {
        return JSON.parse(
          slideData.aiGeneratedContent
        );
      }
    } catch (e) { }

    return {
      headline: '',
      subtext: '',
      bullets: [],
    };
  }, [slideData]);

  return (
    <div
      style={{
        aspectRatio: '16/9',
        width: '100%',
        background: t.bg,
        borderRadius: 28,
        overflow: 'hidden',
        padding: 28,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        border: `1px solid ${t.border}`,
        position: 'relative',
        fontFamily:
          'Inter, ui-sans-serif, system-ui',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            padding: '6px 16px',
            borderRadius: 999,
            background: t.grad,
            color: '#fff',
            fontWeight: 800,
            fontSize: TYPE.caption,
          }}
        >
          {(slideConfig?.title || 'Strategy').toUpperCase()}
        </div>

        <div
          style={{
            color: t.textMut,
            fontWeight: 700,
            fontSize: TYPE.caption,
          }}
        >
          SLIDE // {String(slideNum).padStart(2, '0')}
        </div>
      </header>

      <SlideBody
        slideNum={slideNum}
        content={content}
        t={t}
      />

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
        }}
      >
        <div
          style={{
            color: t.textMut,
            fontSize: TYPE.caption,
          }}
        >
          BIZ VISION DEMO DAY 2026
        </div>

        <div
          style={{
            display: 'flex',
            gap: 5,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === slideNum ? 18 : 5,
                height: 5,
                borderRadius: 999,
                background:
                  i + 1 === slideNum
                    ? t.accent
                    : t.border,
              }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}