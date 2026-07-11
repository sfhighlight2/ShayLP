export const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/RaF6Uj0AVUTaXjgiT7zM/webhook-trigger/597d218e-6d54-401a-8e31-996d527e270d";

export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const triggerBlueprintDownload = () => {
  const a = document.createElement("a");
  a.href = "/Lovesuccess.pdf";
  a.download = "Love-Blueprint.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const trackFacebookEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', eventName, params);
  }
};

export const SUBMITTED_LEAD_STORAGE_KEY = "bb_offer_submitted_lead";

export type SubmittedLead = {
  name: string;
  email: string;
  phone: string;
};
