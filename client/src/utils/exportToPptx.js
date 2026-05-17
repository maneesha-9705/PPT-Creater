import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDF_W = 297;          // mm — landscape A4 width
const PDF_H = 166.875;      // mm — 297 * 9/16  (true 16:9)

/**
 * Screenshot the pre-rendered off-screen slide element
 * identified by  data-slide-export="i"
 */
async function captureSlideNode(index) {
  const el = document.querySelector(`[data-slide-export="${index}"]`);
  if (!el) throw new Error(`Export node not found for slide ${index}`);

  const canvas = await html2canvas(el, {
    width:           1280,
    height:          720,
    scale:           2,          // → 2560×1440 output
    useCORS:         true,
    allowTaint:      true,
    logging:         false,
    backgroundColor: null,
    scrollX:         0,
    scrollY:         0,
    windowWidth:     1280,
    windowHeight:    720,
  });

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Export all 12 slides to a PDF.
 * Captures from the hidden off-screen container — no UI slide switching.
 *
 * @param {string}   projectTitle   Used for the filename
 * @param {function} onProgress     (cur, total) => void
 */
export async function exportProjectToPdf(projectTitle, onProgress) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit:        'mm',
    format:      [PDF_W, PDF_H],
    compress:    true,
  });

  for (let i = 0; i < 12; i++) {
    if (onProgress) onProgress(i + 1, 12);

    // Small delay to let the browser breathe between captures
    await new Promise(r => setTimeout(r, 80));

    const imgData = await captureSlideNode(i);

    if (i > 0) pdf.addPage([PDF_W, PDF_H], 'landscape');
    pdf.addImage(imgData, 'JPEG', 0, 0, PDF_W, PDF_H, undefined, 'FAST');
  }

  pdf.setProperties({
    title:   projectTitle,
    subject: 'Pitch Deck',
    author:  'PitchCraft — Biz Vision Demo Day',
    creator: 'PitchCraft',
  });

  const safeName = (projectTitle || 'PitchDeck').replace(/[^a-zA-Z0-9_\- ]/g, '_');
  pdf.save(`${safeName}_PitchDeck.pdf`);
}
