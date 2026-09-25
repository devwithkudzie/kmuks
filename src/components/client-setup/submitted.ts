// Remembers, for this browser tab, that a form was sent. Refreshing or going
// back to a sent form then lands on the main website instead of an empty form
// the person might think they have to fill in again.

const keyFor = (token: string) => `form-submitted:${token}`;

export function markFormSubmitted(token: string) {
  try {
    sessionStorage.setItem(keyFor(token), "1");
  } catch {
    // Storage unavailable (private mode): the thank-you screen still shows.
  }
}

/** Sends the visitor to the main website if this tab already sent the form. Returns true when redirecting. */
export function redirectIfSubmitted(token: string): boolean {
  try {
    if (sessionStorage.getItem(keyFor(token)) !== "1") return false;
  } catch {
    return false;
  }
  window.location.replace("/");
  return true;
}
