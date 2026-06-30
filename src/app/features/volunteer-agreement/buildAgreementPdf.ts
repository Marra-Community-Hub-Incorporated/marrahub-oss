import { agreementIntro, agreementTerms } from './agreementContent';

export interface AgreementPdfInput {
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  area: string;
  emergencyContact: string;
  dietary: string;
  allergies: string;
  signedName: string;
  signedDate: string;
  signatureImage: string; // PNG data URL
}

export interface BuiltPdf {
  blob: Blob;
  base64: string; // no data: prefix
  filename: string;
}

const BRAND: [number, number, number] = [30, 69, 58]; // #1e453a
const MUTED: [number, number, number] = [90, 90, 90];

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// Builds a complete, signed copy of the Volunteer Agreement as a PDF and returns
// it as a Blob + base64 (for upload) + a suggested filename. It does NOT trigger
// a download — the caller decides what to do with the bytes (e.g. POST to the
// backend so the organisation receives it). jsPDF is imported dynamically so it
// only loads when someone actually signs.
export async function buildAgreementPdf(data: AgreementPdfInput): Promise<BuiltPdf> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = 0;

  const drawHeader = () => {
    doc.setFillColor(...BRAND);
    doc.rect(0, 0, pageW, 64, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('Marra Community Hub Incorporated', margin, 34);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Volunteer Agreement', margin, 52);
    doc.setTextColor(0, 0, 0);
    y = 88;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      drawHeader();
    }
  };

  const writeParagraph = (text: string, size = 9, gap = 14) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    const lineH = size + 2.5;
    lines.forEach((line) => {
      ensureSpace(lineH);
      doc.text(line, margin, y);
      y += lineH;
    });
    y += gap;
  };

  const sectionHeading = (text: string) => {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...BRAND);
    doc.text(text, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 18;
  };

  drawHeader();

  // Intro
  writeParagraph(agreementIntro, 9, 12);

  // Volunteer details
  sectionHeading('Volunteer Details');
  const rows: [string, string][] = [
    ['Full name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Start date', data.startDate || '—'],
    ['Preferred area', data.area],
    ['Emergency contact', data.emergencyContact],
    ['Dietary preference', data.dietary || '—'],
    ['Allergies / dietary needs', data.allergies || 'None provided'],
  ];
  rows.forEach(([label, value]) => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const valueLines = doc.splitTextToSize(value || '—', contentW - 140) as string[];
    doc.text(valueLines, margin + 140, y);
    y += Math.max(16, valueLines.length * 12);
  });
  y += 12;

  // Terms
  sectionHeading('Terms');
  agreementTerms.forEach((term) => {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${term.n}. ${term.title}`, margin, y);
    y += 13;
    writeParagraph(term.body, 8.5, 10);
  });

  // Acknowledgement & signature
  ensureSpace(150);
  sectionHeading('Acknowledgement & Signature');
  writeParagraph(
    'By signing below, the Volunteer acknowledges that they have read, understood and agree to the ' +
      'terms of this Agreement, and confirm the information provided is true and complete.',
    9,
    10,
  );

  ensureSpace(110);
  try {
    doc.addImage(data.signatureImage, 'PNG', margin, y, 200, 60);
  } catch {
    /* if the signature can't be embedded, fall back to the typed name only */
  }
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y + 64, margin + 220, y + 64);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Signature', margin, y + 76);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(data.signedName, margin, y + 94);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Name & date: ${data.signedName} — ${data.signedDate}`, margin, y + 110);
  doc.setTextColor(0, 0, 0);

  const safeName = data.fullName.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Volunteer';
  const filename = `Marra-Volunteer-Agreement-${safeName}.pdf`;

  const blob = doc.output('blob') as Blob;
  const base64 = arrayBufferToBase64(doc.output('arraybuffer') as ArrayBuffer);
  return { blob, base64, filename };
}
