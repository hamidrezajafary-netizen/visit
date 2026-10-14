import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { PRINT } from './defaults.js';

const PX_PER_MM = PRINT.dpi / 25.4;

/** Pixel width that gives the requested millimetre size at print resolution. */
function targetPx(mm) {
  return Math.round(mm * PX_PER_MM);
}

/**
 * Rasterises a card node at `widthMm` worth of 300 DPI pixels.
 * pixelRatio makes the canvas bigger without touching the node's own styles,
 * so the capture never reflows the page.
 */
async function rasterise(node, widthMm, background) {
  if (!node) throw new Error('Card is not mounted');
  const ratio = targetPx(widthMm) / node.offsetWidth;
  return toPng(node, { pixelRatio: ratio, backgroundColor: background, cacheBust: true });
}

function save(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Trim-size PNG (no bleed) for email, LinkedIn and other digital sharing. */
export async function exportPng(node, side, background) {
  const url = await rasterise(node, PRINT.trimWidth, background);
  save(url, `maison-ai-card-${side}-${PRINT.trimWidth}x${PRINT.trimHeight}mm-${PRINT.dpi}dpi.png`);
}

/** Two-page, print-ready PDF at bleed size (front, then back). */
export async function exportPdf({ front, back, frontBg, backBg }) {
  const { bleedWidth: w, bleedHeight: h } = PRINT;
  const pdf = new jsPDF({ unit: 'mm', format: [w, h], orientation: 'landscape', compress: true });

  pdf.addImage(await rasterise(front, w, frontBg), 'PNG', 0, 0, w, h);
  pdf.addPage([w, h], 'landscape');
  pdf.addImage(await rasterise(back, w, backBg), 'PNG', 0, 0, w, h);

  pdf.save(`maison-ai-card-print-${PRINT.trimWidth}x${PRINT.trimHeight}mm-bleed${PRINT.bleed}mm.pdf`);
}
