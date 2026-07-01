import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UTM_STORAGE_KEY = "bb_utm_params";
const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

// Captures UTM/click-id params from the current URL and stores first-touch
// values in sessionStorage so later form submissions (e.g. after navigating
// within the funnel) still carry the original attribution.
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  UTM_FIELDS.forEach((field) => {
    const value = params.get(field);
    if (value) found[field] = value;
  });
  if (Object.keys(found).length === 0) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
  } catch {
    // sessionStorage unavailable (e.g. privacy mode) — skip silently
  }
}

export function getStoredUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
