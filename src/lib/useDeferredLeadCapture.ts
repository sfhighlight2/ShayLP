import { useCallback, useEffect, useRef } from "react";
import { GHL_WEBHOOK_URL } from "./leadCapture";

const FALLBACK_DELAY_MS = 10 * 60 * 1000;

// Holds a step-1 lead payload without sending it. If step 2 completes,
// the caller calls disarm() and nothing is ever sent from here. If not,
// the payload is sent as a fallback either after FALLBACK_DELAY_MS or
// immediately if the visitor leaves the page first, so a partial lead
// still reaches GHL. The setTimeout is intentionally not cleared on
// unmount — it must keep running across SPA navigation so the fallback
// still fires later even if this component instance goes away.
export function useDeferredLeadCapture() {
  const payloadRef = useRef<Record<string, unknown> | null>(null);
  const sentRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendFallback = useCallback((useBeacon: boolean) => {
    if (sentRef.current || !payloadRef.current) return;
    sentRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const body = JSON.stringify(payloadRef.current);
    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(GHL_WEBHOOK_URL, blob);
    } else {
      fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }).catch((err) => console.error("Webhook error:", err));
    }
  }, []);

  const arm = useCallback(
    (payload: Record<string, unknown>) => {
      payloadRef.current = payload;
      sentRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => sendFallback(false), FALLBACK_DELAY_MS);
    },
    [sendFallback]
  );

  const disarm = useCallback(() => {
    sentRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    payloadRef.current = null;
  }, []);

  useEffect(() => {
    const onPageHide = () => sendFallback(true);
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [sendFallback]);

  return { arm, disarm };
}
