// =========================================================
// FILE 2: generatePPTX.js
// BACKEND FILE
// =========================================================

const PptxGenJS = require('pptxgenjs');

const THEMES = {
  'biz-vision-blue': {
    bg: '0A2463',
    accent: '4F8EF7',
    highlight: 'F5C842',
    bodyBg: 'F4F7FA',
    text: '1A1A2E',
    white: 'FFFFFF',
    gold: 'F5C842',
    rose: 'F06292',
  },
};

function topBar(slide, pptx, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.1,
    fill: { color },
    line: { width: 0 },
  });
}

function footer(slide, pptx, t, num) {
  slide.addText(
    '⚡ BIZ VISION DEMO DAY | SRKR ENGINEERING COLLEGE (A)',
    {
      x: 0.3,
      y: 7.12,
      w: 8,
      h: 0.2,

      fontSize: 7,
      color: t.white,
      fontFace: 'Open Sans',
    }
  );

  for (let i = 1; i <= 12; i++) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 11.4 + i * 0.12,
      y: 7.16,
      w: i === num ? 0.18 : 0.08,
      h: 0.08,

      fill: {
        color:
          i === num
            ? t.accent
            : t.white + '55',
      },

      line: { width: 0 },
    });
  }
}

function title(slide, t, text) {
  slide.addText(text, {
    x: 0.55,
    y: 0.72,
    w: 12.1,
    h: 0.4,

    fontSize: 22,
    bold: true,

    color: t.bg,

    fontFace: 'Montserrat',

    margin: 0,

    valign: 'mid',
  });
}

function bulletList(
  slide,
  t,
  bullets,
  x,
  y,
  w,
  h,
  icon = '✦'
) {
  if (!bullets?.length) return;

  const rows = bullets.map((b) => ({
    text: `${icon} ${b}`,
    options: {
      bullet: false,
      fontSize: 12,
      color: t.text,
      paraSpaceAfter: 5,
      breakLine: true,
      fontFace: 'Open Sans',
    },
  }));

  slide.addText(rows, {
    x,
    y,
    w,
    h,
    margin: 0.03,
    fit: 'shrink',
    valign: 'top',
  });
}

function glassCard(
  slide,
  pptx,
  t,
  text,
  x,
  y,
  w,
  h,
  accentColor
) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,

    rectRadius: 0.08,

    fill: {
      color: t.white,
      transparency: 85,
    },

    line: {
      color: accentColor,
      transparency: 70,
    },

    shadow: {
      type: 'outer',
      blur: 4,
      offset: 2,
      opacity: 0.2,
    },
  });

  slide.addText(text, {
    x: x + 0.15,
    y: y + 0.15,
    w: w - 0.3,
    h: h - 0.3,

    fontSize: 14,
    bold: true,

    color: t.text,

    align: 'center',
    valign: 'mid',

    fontFace: 'Montserrat',
  });
}

function genericSlide(
  pptx,
  slide,
  c,
  t,
  num,
  meta
) {
  slide.background = { fill: t.bodyBg };

  topBar(slide, pptx, t.accent);

  title(
    slide,
    t,
    c.headline || meta.label
  );

  const bullets = (
    c.bullets || []
  ).slice(0, 6);

  bullets.forEach((b, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);

    const x = 0.45 + col * 4.15;
    const y = 1.5 + row * 1.95;

    slide.addShape(
      pptx.ShapeType.roundRect,
      {
        x,
        y,
        w: 3.9,
        h: 1.55,

        rectRadius: 0.06,

        fill: {
          color: t.white,
          transparency: 15,
        },

        line: {
          color: t.accent,
          transparency: 70,
        },

        shadow: {
          type: 'outer',
          blur: 2,
          opacity: 0.1,
        },
      }
    );

    slide.addText(`${i + 1}. ${b}`, {
      x: x + 0.15,
      y: y + 0.15,
      w: 3.55,
      h: 1.2,

      fontSize: 11,

      color: t.text,

      fontFace: 'Open Sans',

      fit: 'shrink',

      margin: 0.03,

      valign: 'mid',
    });
  });

  footer(slide, pptx, t, num);
}

const SLIDE_META = {
  6: { label: 'Business Model' },
  7: { label: 'Traction' },
  8: { label: 'Competition' },
  9: { label: 'GTM Strategy' },
  10: { label: 'Team' },
  11: { label: 'Roadmap' },
};

const generatePPTX = async (project) => {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';

  const t =
    THEMES[project.selectedTheme] ||
    THEMES['biz-vision-blue'];

  for (let i = 0; i < 12; i++) {
    const slide = pptx.addSlide();

    let content = {
      headline: '',
      bullets: [],
      subtext: '',
      callout: '',
    };

    try {
      const raw =
        project.slides[i]?.aiGeneratedContent;

      if (raw) {
        content = JSON.parse(raw);
      }
    } catch (_) { }

    if (i >= 5 && i <= 10) {
      genericSlide(
        pptx,
        slide,
        content,
        t,
        i + 1,
        SLIDE_META[i + 1]
      );
    } else {
      slide.background = {
        fill: t.bodyBg,
      };

      topBar(slide, pptx, t.accent);

      title(
        slide,
        t,
        content.headline ||
        `Slide ${i + 1}`
      );

      bulletList(
        slide,
        t,
        content.bullets,
        0.55,
        1.45,
        7.2,
        3.5
      );

      glassCard(
        slide,
        pptx,
        t,
        content.callout ||
        'Key Insight',
        8.2,
        1.45,
        4.4,
        3.4,
        t.accent
      );

      slide.addText(
        content.subtext || '',
        {
          x: 0.55,
          y: 5.15,
          w: 7.4,
          h: 0.5,

          fontSize: 10,

          italic: true,

          color: t.text,

          fontFace: 'Open Sans',
        }
      );

      footer(slide, pptx, t, i + 1);
    }
  }

  return await pptx.write({
    outputType: 'nodebuffer',
  });
};

module.exports = { generatePPTX };