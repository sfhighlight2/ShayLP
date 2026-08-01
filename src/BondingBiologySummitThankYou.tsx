"use client";

/**
 * BondingBiologySummitThankYou.tsx
 * ------------------------------------------------------------------
 * "/d/thank-you" — the page a buyer lands on after paying for the
 * Bonding Biology Summit via the external checkout (fastpaydirect.com).
 * That checkout must be configured to redirect here on successful
 * payment — this app has no other way to know a purchase happened,
 * since the payment itself never touches this codebase.
 *
 * Fires the Meta Pixel `Purchase` event once per page load (guarded by
 * sessionStorage so a refresh doesn't double-count it in Ads Manager).
 * If the checkout redirect is ever configured to pass along
 * `?amount=&email=&first_name=`, those are read and used; otherwise
 * this falls back to the fixed $97 price.
 *
 * TODO: this page does not currently notify GHL of the purchase — the
 * FB pixel fire was the only requirement given for this page. If the
 * business also wants the sale logged to GHL (e.g. to tag the contact
 * as a Summit buyer), that needs either a webhook call from here (if
 * the checkout passes back enough contact info) or a native GHL/Zapier
 * integration configured directly on the fastpaydirect side.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { trackFacebookEvent } from "./lib/leadCapture";

const SUMMIT_PRICE = 97;
const PURCHASE_TRACKED_KEY = "bb_d_purchase_tracked";

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M20 6.5 9.5 17 4 11.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TodoNote = ({ children }: { children: React.ReactNode }) => (
  <span className="ff-sans inline-block rounded-md border border-dashed border-[#D8962D] bg-[#D8962D]/10 px-2 py-0.5 text-[12px] font-bold text-[#8A2634]">
    TODO: {children}
  </span>
);

const NEXT_STEPS = [
  "Check your email for your receipt and access details — it may take a few minutes to arrive.",
  "Add our email address to your contacts so nothing lands in spam.",
  "Everything is virtual and on-demand, so you can start whenever it works for you.",
];

export default function BondingBiologySummitThankYou() {
  const [searchParams] = useSearchParams();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    let alreadyTracked = false;
    try {
      alreadyTracked = sessionStorage.getItem(PURCHASE_TRACKED_KEY) === "1";
    } catch {
      // sessionStorage unavailable — fall through and track anyway.
    }
    if (alreadyTracked) return;

    const amountParam = Number(searchParams.get("amount"));
    const value = Number.isFinite(amountParam) && amountParam > 0 ? amountParam : SUMMIT_PRICE;

    trackFacebookEvent("Purchase", {
      value,
      currency: "USD",
      content_name: "Bonding Biology Summit",
      content_type: "product",
    });

    try {
      sessionStorage.setItem(PURCHASE_TRACKED_KEY, "1");
    } catch {
      // Best-effort only — worst case a refresh fires Purchase again.
    }
  }, [searchParams]);

  const firstName = searchParams.get("first_name");

  return (
    <div className="bb-thank-you ff-sans relative min-h-screen overflow-x-clip bg-[#170006] text-[#FFF7EE] antialiased">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
      />
      <style>{`
        .bb-thank-you, .bb-thank-you .ff-serif, .bb-thank-you .ff-sans {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif !important;
        }
      `}</style>

      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-[position:left_25%] bg-no-repeat opacity-[0.18] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,0,6,0.75)_0%,rgba(23,0,6,0.92)_100%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <img src="/Mainlogo.png" alt="Bonding Biology Institute Logo" className="h-9 w-auto object-contain sm:h-11" />

        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#E8B75A]/50 bg-[#E8B75A]/10">
          <CheckIcon className="h-8 w-8 text-[#E8B75A]" />
        </div>

        <h1 className="ff-serif mt-6 text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">
          {firstName ? `You're In, ${firstName}!` : "You're In!"}
        </h1>
        <p className="mt-4 max-w-lg text-[16px] leading-[1.6] text-[#FFF7EE]/75">
          Your enrollment in the Bonding Biology Summit is confirmed. Welcome — we're glad you're here.
        </p>

        <div className="mt-9 w-full max-w-md border border-[#E8B75A]/30 bg-white/[0.04] p-7 text-left sm:p-8">
          <p className="ff-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#E8B75A]">
            What happens next
          </p>
          <ul className="mt-4 space-y-3">
            {NEXT_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-[#FFF7EE]/85">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B75A]" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 max-w-md text-[13px] leading-[1.6] text-[#FFF7EE]/55">
          Questions about your order? Contact <TodoNote>Insert support email.</TodoNote>
        </p>
      </div>
    </div>
  );
}
