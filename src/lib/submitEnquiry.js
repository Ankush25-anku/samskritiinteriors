/**
 * The one place an enquiry leaves the site.
 *
 * TODO(backend): connect this to email. Replace the timeout below with a POST to your form endpoint
 * (e.g. a serverless function that emails the studio, or Formspree / Resend / Postmark), e.g.
 *
 *   const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
 *   if (!res.ok) throw new Error(`Enquiry failed: ${res.status}`);
 *   return res.json();
 *
 * `payload` = { name, email, type, location, budget, brief, palette, scope, question, drawingNo, date }.
 * Throwing here makes the Contact section show its error state instead of the confirmation.
 */
export async function submitEnquiry(payload) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true, drawingNo: payload.drawingNo };
}
