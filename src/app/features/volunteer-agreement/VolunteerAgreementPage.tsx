import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { SignaturePad, type SignaturePadHandle } from './SignaturePad';
import { agreementIntro, agreementPdfPath } from './agreementContent';
import { AREA_OPTIONS, DIETARY_OPTIONS, type VolunteerAgreementSubmission } from './types';
import { volunteerAgreementConfig } from './config';
import { buildAgreementPdf } from './buildAgreementPdf';
import { submitVolunteerAgreement } from './submitAgreement';
import { useTurnstile } from './useTurnstile';

const inputClasses =
  'w-full px-4 py-3 bg-input-background border border-border rounded-lg';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  area: '',
  emergencyContact: '',
  dietary: '',
  allergies: '',
  signedName: '',
};

// Every field the volunteer must fill in, in the order they appear on the page.
// Kept as one list so validation, the error summary and the focus-the-first-
// problem behaviour below can never drift apart from the markup.
const REQUIRED_FIELDS: ReadonlyArray<keyof typeof initialForm> = [
  'fullName',
  'email',
  'phone',
  'area',
  'emergencyContact',
  'dietary',
  'signedName',
];

export function VolunteerAgreementPage() {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [agreed, setAgreed] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<{
    state: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({ state: 'idle', message: '' });

  const formRef = useRef<HTMLFormElement | null>(null);
  const signaturePadRef = useRef<SignaturePadHandle | null>(null);
  const turnstile = useTurnstile(volunteerAgreementConfig.turnstileSiteKey);

  // When the agreement is submitted, the form is replaced by the success screen.
  // Scroll back to the top so the "You're all set!" confirmation is actually
  // visible instead of leaving the viewport down where the submit button was.
  useEffect(() => {
    if (formStatus.state === 'success') {
      // Instant scroll (matching Layout's route-change scroll) — smooth scrolling
      // is unreliable right after the form is swapped for the success screen.
      window.scrollTo(0, 0);
    }
  }, [formStatus.state]);

  const signedDate = new Date().toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const validateField = (name: keyof typeof initialForm, value: string) => {
    const trimmedValue = value.trim();

    if (REQUIRED_FIELDS.includes(name) && !trimmedValue) {
      return 'This field is required.';
    }

    if (name === 'email' && trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return 'Please enter a valid email address.';
    }

    return '';
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof typeof initialForm, string>> = {};

    REQUIRED_FIELDS.forEach((name) => {
      const error = validateField(name, formData[name]);

      if (error) {
        errors[name] = error;
      }
    });

    return errors;
  };

  const resetStatusIfNeeded = () => {
    if (formStatus.state === 'error') {
      setFormStatus({ state: 'idle', message: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    resetStatusIfNeeded();

    const name = e.target.name as keyof typeof initialForm;
    const value = e.target.value;

    setFormData((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name]) {
      const error = validateField(name, value);

      setFieldErrors((current) => {
        const next = { ...current };

        if (error) {
          next[name] = error;
        } else {
          delete next[name];
        }

        return next;
      });
    }
  };

  const handleSignatureChange = useCallback((dataUrl: string | null) => {
    setSignatureImage(dataUrl);
  }, []);

  // Telling someone their form is wrong is only half of it — they also need to
  // land on the problem. Without this, a keyboard or screen-reader user hears
  // "please correct the highlighted fields" and is left at the submit button
  // with no idea which of the seven fields to go back to.
  const focusFirstInvalidField = (errors: Partial<Record<keyof typeof initialForm, string>>) => {
    const firstInvalid = REQUIRED_FIELDS.find((name) => errors[name]);

    if (!firstInvalid) {
      return;
    }

    const element = formRef.current?.elements.namedItem(firstInvalid);

    if (element instanceof HTMLElement) {
      element.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormStatus({
        state: 'error',
        message: 'Please correct the highlighted fields before submitting.',
      });
      focusFirstInvalidField(errors);
      return;
    }

    if (!agreed) {
      setFormStatus({
        state: 'error',
        message: 'Please confirm you have read and agree to the terms before submitting.',
      });
      return;
    }
    if (!signatureImage) {
      setFormStatus({
        state: 'error',
        message: 'Please draw your signature in the box above before submitting.',
      });
      return;
    }
    if (volunteerAgreementConfig.turnstileSiteKey && turnstile.error) {
      setFormStatus({ state: 'error', message: turnstile.error });
      return;
    }
    if (volunteerAgreementConfig.turnstileSiteKey && !turnstile.token) {
      setFormStatus({
        state: 'error',
        message: 'Please complete the security check before submitting.',
      });
      return;
    }

    setFormStatus({ state: 'submitting', message: 'Submitting your agreement...' });

    try {
      const pdf = await buildAgreementPdf({
        ...formData,
        startDate: signedDate,
        signedDate,
        signatureImage,
      });

      const submission: VolunteerAgreementSubmission = {
        ...formData,
        startDate: signedDate,
        agreementVersion: volunteerAgreementConfig.agreementVersion,
        signedDate,
        signedAtIso: new Date().toISOString(),
        signatureImage,
        pdfBase64: pdf.base64,
        pdfFilename: pdf.filename,
        turnstileToken: turnstile.token,
      };

      await submitVolunteerAgreement(submission);

      setFormStatus({
        state: 'success',
        message: 'Thank you for signing the Volunteer Agreement. We will be in touch soon.',
      });
      setFormData(initialForm);
      setAgreed(false);
      setSignatureImage(null);
      signaturePadRef.current?.clear();
      turnstile.reset();
    } catch (err) {
      setFormStatus({
        state: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'There was a problem submitting your agreement. Please try again.',
      });
      turnstile.reset();
    }
  };

  if (formStatus.state === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-28">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-primary" size={36} aria-hidden="true" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">You're all set!</h1>
              <p className="text-lg text-muted-foreground mb-8">{formStatus.message}</p>
              <Button href="/" variant="primary" size="lg">
                Back to Home
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="page-hero-background bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6">
              <HeartHandshake size={18} aria-hidden="true" />
              Become a MARRA volunteer
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Volunteer Agreement</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Thank you for offering your time to Marra Community Hub. Please read the agreement
              below, fill in your details, and sign to get started.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro + read full agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-muted-foreground leading-relaxed">{agreementIntro}</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl border border-border p-6 md:p-8"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Volunteer details */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Your details</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block mb-2 text-foreground">
                      Full name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.fullName)}
                      aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                      className={inputClasses}
                    />

                    {fieldErrors.fullName && (
                      <p id="fullName-error" className="mt-2 text-sm text-destructive">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-foreground">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                        className={inputClasses}
                      />

                      {fieldErrors.email && (
                        <p id="email-error" className="mt-2 text-sm text-destructive">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-foreground">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                        className={inputClasses}
                      />

                      {fieldErrors.phone && (
                        <p id="phone-error" className="mt-2 text-sm text-destructive">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="area" className="block mb-2 text-foreground">
                      Where would you like to volunteer? *
                    </label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(fieldErrors.area)}
                      aria-describedby={fieldErrors.area ? 'area-error' : undefined}
                      className={inputClasses}
                    >
                      <option value="">Select an area...</option>
                      {AREA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {fieldErrors.area && (
                      <p id="area-error" className="mt-2 text-sm text-destructive">
                        {fieldErrors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="emergencyContact" className="block mb-2 text-foreground">
                      Emergency contact (name &amp; phone) *
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                      placeholder="Name — 04XX XXX XXX"
                      aria-invalid={Boolean(fieldErrors.emergencyContact)}
                      aria-describedby={
                        fieldErrors.emergencyContact ? 'emergencyContact-error' : undefined
                      }
                      className={inputClasses}
                    />

                    {fieldErrors.emergencyContact && (
                      <p id="emergencyContact-error" className="mt-2 text-sm text-destructive">
                        {fieldErrors.emergencyContact}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dietary" className="block mb-2 text-foreground">
                        Dietary preference *
                      </label>
                      <select
                        id="dietary"
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.dietary)}
                        aria-describedby={fieldErrors.dietary ? 'dietary-error' : undefined}
                        className={inputClasses}
                      >
                        <option value="">Select a preference...</option>
                        {DIETARY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {fieldErrors.dietary && (
                        <p id="dietary-error" className="mt-2 text-sm text-destructive">
                          {fieldErrors.dietary}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="allergies" className="block mb-2 text-foreground">
                        Allergies / other dietary needs
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="Optional — e.g. nut allergy"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Acknowledgement & signature */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-primary" size={22} aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Acknowledgement &amp; signature</h2>
                </div>

                <a
                  href={agreementPdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mb-6 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-primary font-medium transition-colors hover:bg-muted/50"
                >
                  <FileText size={18} aria-hidden="true" />
                  Read the full Volunteer Agreement
                </a>

                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      resetStatusIfNeeded();
                      setAgreed(e.target.checked);
                    }}
                    className="mt-1 h-5 w-5 flex-shrink-0 rounded border-border text-primary accent-primary"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    I have read, understood and agree to the terms of this Volunteer Agreement. I
                    confirm the information I have provided is true and complete.
                  </span>
                </label>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="signedName" className="block mb-2 text-foreground">
                      Full legal name (typed signature) *
                    </label>
                    <input
                      type="text"
                      id="signedName"
                      name="signedName"
                      value={formData.signedName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.signedName)}
                      aria-describedby={fieldErrors.signedName ? 'signedName-error' : undefined}
                      className={inputClasses}
                    />

                    {fieldErrors.signedName && (
                      <p id="signedName-error" className="mt-2 text-sm text-destructive">
                        {fieldErrors.signedName}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="block mb-2 text-foreground">Date</span>
                    <div className={`${inputClasses} bg-muted/40 text-muted-foreground`}>
                      {signedDate}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block mb-2 text-foreground">Draw your signature *</span>
                  <SignaturePad ref={signaturePadRef} onChange={handleSignatureChange} />
                </div>
              </div>

              {volunteerAgreementConfig.turnstileSiteKey && (
                <div className="space-y-2">
                  <div ref={turnstile.containerRef} className="min-h-[65px]" />
                  <p className="text-xs text-muted-foreground">
                    This form is protected by Cloudflare Turnstile to reduce spam and automated
                    submissions.
                  </p>
                </div>
              )}

              {formStatus.state !== 'idle' && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    formStatus.state === 'error'
                      ? 'border-destructive/20 bg-destructive/5 text-destructive'
                      : 'border-border bg-muted/50 text-muted-foreground'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {formStatus.message}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={formStatus.state === 'submitting'}
              >
                {formStatus.state === 'submitting' ? 'Submitting...' : 'Sign & submit agreement'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                This Agreement is a statement of mutual intention made in good faith and is not a
                contract of employment.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
