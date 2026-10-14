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

/** Slug left around the bleed, in mm, so the trim marks have somewhere to sit. */
const TRIM_MARK_GUTTER = 4;

/**
 * Corner trim marks in the slug, just outside the bleed, so the printer can see
 * where the 89 × 51 mm trim falls without being told. They stay clear of the
 * bleed, so they can never end up on the finished card.
 */
function drawTrimMarks(pdf, offset, pageWidth, pageHeight) {
  const { trimWidth, trimHeight, bleed } = PRINT;
  const left = offset + bleed;
  const right = left + trimWidth;
  const top = offset + bleed;
  const bottom = top + trimHeight;

  pdf.setLineWidth(0.25);
  pdf.setDrawColor(0);

  [top, bottom].forEach((y) => {
    pdf.line(0, y, offset, y);
    pdf.line(pageWidth - offset, y, pageWidth, y);
  });

  [left, right].forEach((x) => {
    pdf.line(x, 0, x, offset);
    pdf.line(x, pageHeight - offset, x, pageHeight);
  });
}

/**
 * Two-page, print-ready PDF: front then back, each placed at exactly 95 × 57 mm
 * — the 89 × 51 mm trim plus 3 mm of bleed on every edge — on a slightly larger
 * page whose slug carries corner trim marks. The artwork is rasterised at
 * 300 DPI, so a print shop can cut straight to the trim.
 */
export async function exportPdf({ front, back, frontBg, backBg }) {
  const { bleedWidth: bleedW, bleedHeight: bleedH } = PRINT;
  const pageWidth = bleedW + TRIM_MARK_GUTTER * 2;
  const pageHeight = bleedH + TRIM_MARK_GUTTER * 2;
  const pdf = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight],
    orientation: 'landscape',
    compress: true,
  });

  const sheets = [await rasterise(front, bleedW, frontBg), await rasterise(back, bleedW, backBg)];

  sheets.forEach((image, index) => {
    if (index > 0) pdf.addPage([pageWidth, pageHeight], 'landscape');
    pdf.addImage(image, 'PNG', TRIM_MARK_GUTTER, TRIM_MARK_GUTTER, bleedW, bleedH);
    drawTrimMarks(pdf, TRIM_MARK_GUTTER, pageWidth, pageHeight);
  });

  pdf.save(
    `maison-ai-card-print-${PRINT.trimWidth}x${PRINT.trimHeight}mm-bleed${PRINT.bleed}mm.pdf`,
  );
}
