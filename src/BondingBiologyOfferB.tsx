"use client";

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getEvergreenDeadline, getStoredUtmParams } from "./lib/utils";
import {
  GHL_WEBHOOK_URL,
  formatPhoneNumber,
  triggerBlueprintDownload,
  trackFacebookEvent,
} from "./lib/leadCapture";
import { useDeferredLeadCapture } from "./lib/useDeferredLeadCapture";

// TODO: replace with the real checkout/booking link before launch.
const OFFER_CHECKOUT_URL = "https://example.com/REPLACE-ME-checkout-link";

const OFFER_DEADLINE_STORAGE_KEY = "bb_offer_b_deadline";
const OFFER_DURATION_MS = 15 * 60 * 1000;
const SUBMITTED_NAME_STORAGE_KEY = "bb_offer_submitted_name";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function useEvergreenCountdown() {
  const [deadline] = useState(() =>
    getEvergreenDeadline(OFFER_DEADLINE_STORAGE_KEY, OFFER_DURATION_MS)
  );
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return remaining;
}

const ORIGINAL_PRICE = 197;
const OFFER_PRICE = 27;
const SAVINGS = ORIGINAL_PRICE - OFFER_PRICE;
const SAVINGS_PERCENT = Math.round((SAVINGS / ORIGINAL_PRICE) * 100);

const BENEFITS = [
  "A private session with a Bonding Biology specialist — not a generic call",
  "A personalized breakdown of the pattern behind your assessment answers",
  "A clear, specific next step for your situation, not generic advice",
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-[#8A2634]" aria-hidden="true">
    <path
      d="M20 6.5 9.5 17 4 11.5"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Spinner = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

function OfferContent({
  firstName,
  remaining,
  expired,
}: {
  firstName?: string;
  remaining: number;
  expired: boolean;
}) {
  return (
    <>
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] p-5 pb-24 text-center text-[#250009] sm:p-8 sm:pb-8">
        <h1 className="ff-serif text-[clamp(1.6rem,4.2vw,2.2rem)] font-semibold leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">
          {firstName ? `Thank you, ${firstName}!` : "Thank you!"}
        </h1>
        <p className="mx-auto mt-2.5 max-w-lg text-[14.5px] leading-[1.45] text-[#4C1119]/80">
          You've unlocked a limited-time invitation to meet privately with a
          Bonding Biology specialist and go over your pattern one-on-one.
        </p>

        <div className="relative mt-5 rounded-2xl border border-[#8A2634]/15 bg-white/60 p-5 sm:p-6">
          <span className="ff-sans absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#8A2634] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_rgba(138,38,52,0.35)]">
            Limited-Time Invitation
          </span>

          <p className="mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#8A2634]">
            Private Love Success Evaluation
          </p>

          <div className="mt-2.5 flex flex-col items-center justify-center gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="ff-sans text-[20px] font-bold text-[#DC2626] line-through decoration-2">
              ${ORIGINAL_PRICE}
            </span>
            <span className="ff-sans text-[52px] font-black leading-none text-[#15803D]">
              ${OFFER_PRICE}
            </span>
          </div>
          <span className="ff-sans mt-2 inline-block rounded-full bg-[#DC2626] px-3.5 py-1 text-[12px] font-bold text-white">
            You save ${SAVINGS} · {SAVINGS_PERCENT}% off
          </span>

          <div className="mx-auto mt-4 max-w-xs border-t border-[#8A2634]/15 pt-3.5">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">
              {expired ? "Offer reserved for" : "Offer expires in"}
            </p>
            <p className="ff-sans mt-0.5 text-[32px] font-bold tabular-nums leading-none text-[#250009]">
              {formatRemaining(remaining)}
            </p>
          </div>

          <a
            href={OFFER_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ff-sans mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-10 py-5 text-[18px] font-bold text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.28)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            Claim My ${OFFER_PRICE} Evaluation
          </a>
          <p className="mt-3 text-[12px] font-medium text-[#8A2634]/80">
            Private · Confidential · Limited spots each week
          </p>

          <ul className="mx-auto mt-6 max-w-sm space-y-2.5 border-t border-[#8A2634]/15 pt-5 text-left">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#4C1119]">
                <CheckIcon />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Credibility strip */}
        <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A2634]/85">
          <span>8,000+ Women Coached</span>
          <span className="hidden h-3 w-[1px] bg-[#8A2634]/25 sm:block" />
          <span>★★★★★ Top Rated</span>
          <span className="hidden h-3 w-[1px] bg-[#8A2634]/25 sm:block" />
          <span>100% Biology-Based</span>
        </div>

        <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.5] text-[#4C1119]/65">
          No pressure, no script — just clarity on what's actually been
          shaping your relationships, from someone who does this every day.
        </p>
      </div>

      {/* Social proof */}
      <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[#E8B75A]/25 bg-white/[0.04] p-6 text-center sm:p-7">
        <span className="text-[15px] text-[#D8962D]" aria-label="five out of five stars">
          {"★★★★★"}
        </span>
        <blockquote className="ff-serif mt-3 text-[clamp(1.1rem,2vw,1.35rem)] font-medium italic leading-[1.3] tracking-[-0.02em] text-[#FFF7EE]">
          “He brought up exclusivity first. I didn’t have to convince him,
          decode him, or pretend I was fine with less.”
        </blockquote>
        <p className="mt-3 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#E8B75A]/80">
          Maya R. · now engaged {/* ⚠ CLAIM */}
        </p>
      </div>

      {/* Sticky mobile CTA — guarantees the button stays reachable regardless of device height */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8B75A]/45 bg-[#170006]/95 backdrop-blur-xl sm:hidden px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8B75A]/80">
              {expired ? "Offer reserved" : `Expires in ${formatRemaining(remaining)}`}
            </span>
            <span className="ff-sans text-[15px] font-bold text-[#FFF7EE]">${OFFER_PRICE} Evaluation</span>
          </div>
          <a
            href={OFFER_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ff-sans shrink-0 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-5 py-3 text-[14px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)]"
          >
            Claim Now
          </a>
        </div>
      </div>
    </>
  );
}

function LeadForm({
  variant,
  source,
  onSuccess,
}: {
  variant: "b" | "c";
  source: string;
  onSuccess: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const formSource = `${variant}_${source}`;
  const { arm, disarm } = useDeferredLeadCapture();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!email.includes("@")) {
        setEmailError("Please enter a valid email address containing '@'.");
        return;
      }
      setEmailError("");
      if (name && email && phone) {
        arm({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          step: 1,
          formSource,
          ...getStoredUtmParams(),
        });

        trackFacebookEvent('Lead', { content_category: 'Workshop Registration Step 1' });
        setStep(2);
      }
      return;
    }
    if (status === "loading") return;
    if (!(name && email && phone && occupation && city && ageRange)) return;
    setStatus("loading");
    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          city: city.trim(),
          ageRange,
          step: 2,
          formSource,
          ...getStoredUtmParams(),
        }),
      });
      disarm();
      trackFacebookEvent('CompleteRegistration', { content_name: 'Workshop Registration Complete' });
      triggerBlueprintDownload();
      try {
        sessionStorage.setItem(SUBMITTED_NAME_STORAGE_KEY, name.trim());
      } catch {
        // sessionStorage unavailable — in-page reveal still works for this view
      }
      onSuccess(name.trim());
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] p-8 text-[#250009] sm:p-10">
      <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#8A2634]">
        Private assessment
      </span>
      <h1 className="ff-serif mt-3 text-[clamp(1.9rem,4.5vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
        Start your Love Success Evaluation.
      </h1>
      <p className="mt-2 text-[15px] leading-[1.45] text-[#4C1119]">
        Answer a few quick questions and we'll connect you with a Bonding Biology specialist.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
        {step === 1 ? (
          <>
            <div>
              <label htmlFor="apply-name" className="sr-only">Full name</label>
              <input
                id="apply-name"
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
              />
            </div>
            <div>
              <label htmlFor="apply-email" className="sr-only">Email address</label>
              <input
                id="apply-email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
              />
              {emailError && (
                <p className="mt-1.5 text-[13px] font-semibold text-[#9B1B2B]">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="apply-phone" className="sr-only">Phone number</label>
              <input
                id="apply-phone"
                type="tel"
                required
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
              />
            </div>
            <button
              type="submit"
              className="ff-sans flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.4)] transition-all hover:-translate-y-0.5"
            >
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="apply-occupation" className="sr-only">Occupation</label>
              <input
                id="apply-occupation"
                type="text"
                required
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
              />
            </div>
            <div>
              <label htmlFor="apply-city" className="sr-only">City</label>
              <input
                id="apply-city"
                type="text"
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
              />
            </div>
            <div>
              <label htmlFor="apply-ageRange" className="sr-only">Age Range</label>
              <select
                id="apply-ageRange"
                required
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%23250009%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10 text-[#250009]/70"
              >
                <option value="" disabled>Select your age range</option>
                <option value="Under 25">Under 25</option>
                <option value="25 - 34">25 - 34</option>
                <option value="35 - 44">35 - 44</option>
                <option value="45 - 54">45 - 54</option>
                <option value="55+">55+</option>
              </select>
            </div>

            {status === "error" && (
              <p className="text-[13.5px] font-semibold text-[#9B1B2B]">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="ff-sans flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.4)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Spinner /> Processing…
                </>
              ) : (
                <>
                  Start My Love Success Evaluation
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[13px] font-semibold text-[#8A2634] hover:underline block mx-auto mt-2"
            >
              ← Back to details
            </button>
          </>
        )}
      </form>

      <p className="mt-5 text-center text-[12.5px] font-medium text-[#6E1622]/80">
        Private · Confidential · By application
      </p>
    </div>
  );
}

export default function BondingBiologyOfferB() {
  const [searchParams] = useSearchParams();
  const variant: "b" | "c" = searchParams.get("variant") === "c" ? "c" : "b";
  const source = searchParams.get("source") ?? "unknown";
  const legacyName = searchParams.get("name")?.trim();

  const [submittedName, setSubmittedName] = useState<string | null>(() => {
    if (legacyName) return legacyName;
    try {
      return sessionStorage.getItem(SUBMITTED_NAME_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const remaining = useEvergreenCountdown();
  const expired = remaining <= 0;

  return (
    <div className="ff-sans relative min-h-screen bg-[#170006] text-[#FFF7EE] antialiased">
      <header className="sticky top-0 z-50 border-b border-[#E8B75A]/20 bg-[#200008]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to={`/${variant}`} className="block focus:outline-none">
            <img
              src="/Mainlogo.png"
              alt="Bonding Biology Institute Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      <main className={submittedName ? "px-5 py-6 sm:px-8 sm:py-10" : "px-5 py-16 sm:px-8 sm:py-24"}>
        {submittedName ? (
          <OfferContent firstName={submittedName} remaining={remaining} expired={expired} />
        ) : (
          <LeadForm variant={variant} source={source} onSuccess={setSubmittedName} />
        )}
      </main>

      <footer className="border-t border-[#E8B75A]/15 px-5 py-10 text-center sm:px-8">
        <p className="ff-serif text-[18px] font-semibold tracking-[-0.02em]">
          Bonding Biology Institute
        </p>
      </footer>
    </div>
  );
}
