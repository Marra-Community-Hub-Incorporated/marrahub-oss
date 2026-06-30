import { volunteerAgreementConfig } from './config';
import type { VolunteerAgreementSubmission } from './types';

// The single network seam for the feature. Everything else is UI + PDF; this is
// the only place that knows how a signed agreement leaves the browser. To move
// the feature to the Hub SaaS, point VITE_VOLUNTEER_API_URL at the new backend —
// no other change needed. To swap providers entirely, reimplement just this fn.
export async function submitVolunteerAgreement(
  submission: VolunteerAgreementSubmission,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(volunteerAgreementConfig.submitEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(submission),
    });
  } catch {
    throw new Error(
      'Could not reach the server. Please check your connection and try again.',
    );
  }

  if (!response.ok) {
    let message = 'There was a problem submitting your agreement. Please try again.';
    try {
      const data = (await response.json()) as { error?: string } | null;
      if (data?.error) message = data.error;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }
}
