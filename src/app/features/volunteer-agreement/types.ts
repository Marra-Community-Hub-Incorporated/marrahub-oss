// Public data contract for the volunteer-agreement feature.
// This is the seam the Hub SaaS migrates against: keep this stable and the
// frontend, backend, and any future portal can all speak the same shape.

export const AREA_OPTIONS = ['Workshop', 'Administration & IT', 'Both'] as const;
export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Non-vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
] as const;

/** The fields a volunteer fills in. */
export interface VolunteerAgreementFields {
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  area: string;
  emergencyContact: string;
  dietary: string;
  allergies: string;
  signedName: string;
}

/** The full payload sent to the backend when an agreement is signed. */
export interface VolunteerAgreementSubmission extends VolunteerAgreementFields {
  /** Which version of the agreement text was signed (see config). */
  agreementVersion: string;
  /** Human-readable signing date, e.g. "29 June 2026". */
  signedDate: string;
  /** Machine timestamp of signing. */
  signedAtIso: string;
  /** Drawn signature as a PNG data URL. */
  signatureImage: string;
  /** The generated signed PDF, base64-encoded (no data: prefix). */
  pdfBase64: string;
  /** Suggested filename for the PDF, e.g. "Marra-Volunteer-Agreement-Jane-Doe.pdf". */
  pdfFilename: string;
  /** Cloudflare Turnstile token, verified server-side. */
  turnstileToken: string;
}
