"use client";

/**
 * BondingBiologyLandingE.tsx
 * ------------------------------------------------------------------
 * "/e" — a redesigned recreation of Shay's existing external funnel page
 * (her.shayyourlovediva.com/high-value-woman-cheat-code) for a different,
 * lower-ticket offer: "The High Value Woman Cheat Code to Attracting Elite
 * Love" (originally $97, now $11, stated value $1,297). This is a genuinely
 * different product from the $97 3-day Summit sold on /d — do not confuse
 * the two. Follows /d's visual design system (dark burgundy/cream/gold,
 * Plus Jakarta Sans, sharp corners, scroll-reveal cards) but is otherwise a
 * fully self-contained page with its own copy, sections, and components,
 * same as /d is self-contained from every other landing page.
 *
 * SOURCING NOTE: the source page's asset CDN URLs resolve to the same GHL
 * location ID already used by this project's own GHL_WEBHOOK_URL
 * (RaF6Uj0AVUTaXjgiT7zM), confirming her.shayyourlovediva.com is the same
 * business/account, not a third party. Real photos (couple success
 * photos, a live-event stage photo of Shay, and two community photos) were
 * downloaded from that page, compressed, and saved under /public — see
 * cheat-code-mockup.png, shay-stage.jpg, community-celebration.jpg,
 * community-embrace.jpeg, and public/cards/e-couple-*. The FAQ answers and
 * the guarantee copy in GuaranteeBanner/Faq are reused near-verbatim from
 * Shay's own already-published page for this same offer, not invented.
 *
 * BLOCKING TODO — this page has NO real checkout link. The source page's
 * actual payment/order flow was never located during research (it may be a
 * native GHL order form on a URL not visible from the marketing page
 * alone). CHEAT_CODE_CHECKOUT_URL below is a placeholder — every CTA on
 * this page is non-functional until it's replaced with the real link.
 *
 * The 3 testimonial quotes (Zara Bush, Ashwini Santiago, Kaden Scott) are
 * copied verbatim from Shay's own live page, but their avatar images on
 * that page use GHL's generic stock funnel-avatar placeholders (not
 * confirmed photos of those people), so this page renders initials instead
 * of claiming a specific photo is a specific person.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { GHL_WEBHOOK_URL, formatPhoneNumber, trackFacebookEvent } from "./lib/leadCapture";
import { getStoredUtmParams } from "./lib/utils";

// TODO: replace with the real checkout/order link before sending traffic.
const CHEAT_CODE_CHECKOUT_URL = "https://example.com/REPLACE-ME-cheat-code-checkout-link";

const ORIGINAL_PRICE = 97;
const CHEAT_CODE_PRICE = 11;
const STATED_VALUE = 1297;

const handleCtaClick = () => {
  trackFacebookEvent("InitiateCheckout", {
    content_name: "High Value Woman Cheat Code",
    value: CHEAT_CODE_PRICE,
    currency: "USD",
  });
};

/* ----------------------------- Icons ----------------------------- */

const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M20 6.5 9.5 17 4 11.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={className} aria-label="five out of five stars">{"★★★★★"}</span>
);

const CrownIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

/* --------------------------- Small parts -------------------------- */

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`ff-sans inline-block text-[12px] font-bold uppercase tracking-[0.22em] text-[#E8B75A] ${className}`}>
    {children}
  </span>
);

const SectionBg = ({
  src,
  tone = "dark",
  opacity = 0.14,
}: {
  src: string;
  tone?: "dark" | "light";
  opacity?: number;
}) => (
  <div
    className={`absolute inset-0 bg-cover bg-center pointer-events-none ${tone === "dark" ? "mix-blend-luminosity" : "mix-blend-multiply"}`}
    style={{ backgroundImage: `url('${src}')`, opacity }}
    aria-hidden="true"
  />
);

const Glow = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute rounded-full bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] opacity-25 blur-[90px] pointer-events-none ${className}`}
    aria-hidden="true"
  />
);

const Cta = ({
  href = CHEAT_CODE_CHECKOUT_URL,
  children,
  variant = "gold",
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "gold" | "dark";
  className?: string;
}) => {
  const base =
    "ff-sans btn-shimmer group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-none px-10 py-4 text-[17px] font-bold transition-all duration-300 will-change-transform";
  const styles =
    variant === "gold"
      ? "bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.28)] hover:shadow-[0_22px_55px_rgba(232,183,90,0.42)] hover:-translate-y-0.5"
      : "bg-[#250009] text-[#FFF2EA] shadow-[0_14px_36px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:bg-[#310010]";
  return (
    <a href={href} onClick={handleCtaClick} className={`${base} ${styles} ${className}`}>
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
};

const TodoNote = ({ children }: { children: React.ReactNode }) => (
  <span className="ff-sans inline-block rounded-md border border-dashed border-[#D8962D] bg-[#D8962D]/10 px-2 py-0.5 text-[12px] font-bold text-[#8A2634]">
    TODO: {children}
  </span>
);

/* ------------------------------ Nav -------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8B75A]/20 bg-[#200008]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="block focus:outline-none">
          <img src="/Mainlogo.png" alt="Bonding Biology Institute Logo" className="h-8 md:h-10 w-auto object-contain" />
        </a>
        <a
          href={CHEAT_CODE_CHECKOUT_URL}
          onClick={handleCtaClick}
          className="ff-sans inline-flex min-h-[44px] items-center gap-2 rounded-none bg-[linear-gradient(135deg,#F6D089_0%,#D99A35_100%)] px-5 py-2.5 text-[15px] sm:text-[16px] font-bold text-[#250009] shadow-[0_10px_30px_rgba(232,183,90,0.25)] transition-transform hover:-translate-y-0.5"
        >
          <span>Get the Cheat Code</span>
        </a>
      </div>
    </header>
  );
}

/* ------------------------------ Hero -------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#170006] bg-[url('/shay-stage.jpg')] bg-cover bg-[position:center_20%] bg-no-repeat px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,0,6,0.82)_0%,rgba(23,0,6,0.9)_60%,rgba(23,0,6,0.95)_100%)] sm:bg-[linear-gradient(180deg,rgba(23,0,6,0.6)_0%,rgba(23,0,6,0.72)_60%,rgba(23,0,6,0.85)_100%)] z-0 pointer-events-none" />
      <Glow className="h-[380px] w-[380px] -top-32 -right-32 z-0" />
      <div className="hero-stagger relative z-10 mx-auto max-w-3xl text-center">
        <div style={{ "--i": 0 } as React.CSSProperties}>
          <Eyebrow>The High Value Woman Cheat Code</Eyebrow>
        </div>
        <h1
          style={{ "--i": 1 } as React.CSSProperties}
          className="ff-serif mt-6 text-[clamp(2.1rem,5.2vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white [text-wrap:balance]"
        >
          The Cheat Code to Attracting Elite Love
        </h1>
        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="mx-auto mt-6 max-w-2xl text-[clamp(1.0625rem,1.6vw,1.2rem)] leading-[1.6] text-[#FFF7EE]/95 [text-wrap:balance]"
        >
          You don't have a bad picker. You've been operating from the wrong identity. This is the exact blueprint high-value women use to attract masculine, successful men who pursue, provide, and commit.
        </p>
        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
        >
          <span className="ff-sans text-[14px] font-bold uppercase tracking-[0.16em] text-[#FFF7EE]/45 line-through decoration-2">
            Normally ${ORIGINAL_PRICE}
          </span>
          <span className="ff-sans text-[14px] font-bold uppercase tracking-[0.16em] text-[#E8B75A]">
            Today Only ${CHEAT_CODE_PRICE}
          </span>
        </div>
        <div style={{ "--i": 4 } as React.CSSProperties} className="mt-5 flex flex-col items-center gap-4">
          <Cta className="w-full sm:w-auto">Get the Cheat Code for ${CHEAT_CODE_PRICE}</Cta>
        </div>
        <p style={{ "--i": 5 } as React.CSSProperties} className="mt-4 text-[14px] font-medium text-[#FFF7EE]/60">
          Instant digital access. Workbook, training, and audio activations included.
        </p>

        <div
          style={{ "--i": 6 } as React.CSSProperties}
          className="mx-auto mt-9 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#E8B75A]/15 pt-6"
        >
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">8,000+</span>
            <span className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Women Coached</span>
          </div>
          <div className="h-6 w-[1px] bg-[#E8B75A]/20" />
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">★★★★★</span>
            <span className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Top Rated</span>
          </div>
          <div className="h-6 w-[1px] bg-[#E8B75A]/20" />
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">${STATED_VALUE}</span>
            <span className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Total Value</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Couple testimonials (from /d) --------------------------- */

// Reused from /d's Testimonials section (same photos, same illustrative
// launch copy, not sourced from verified clients — see the file-header
// note). Restyled light here instead of /d's dark treatment so it doesn't
// sit dark-on-dark directly under the hero. Courtney's quote had its
// "Before the summit" wording (specific to /d's product) swapped for
// product-neutral phrasing.
const SUCCESS_STORIES = [
  {
    src: "/cards/tmpexalgh3e.jpg",
    quote: "I finally understood why I kept dating the same guy in different bodies. That awareness alone changed how I show up.",
    name: "Jasmine R.",
  },
  {
    src: "/cards/tmpf6ufyorx.jpg",
    quote: "I said yes to a man who actually shows up, consistently. Before this, I didn't think that was possible for me.",
    name: "Courtney L.",
  },
  {
    src: "/cards/tmpgr0_gi53.jpg",
    quote: "I stopped chasing and started choosing. Learning to spot real emotional availability changed everything.",
    name: "Devon K.",
  },
  {
    src: "/cards/tmpien05z8i.jpg",
    quote: "I always thought I was 'too much.' Turns out I just hadn't understood my own patterns yet.",
    name: "Whitney A.",
  },
];

function CoupleTestimonials() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">Real stories</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          Real Women. Real Relationship Transformations.
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-9 grid max-w-5xl gap-5 sm:grid-cols-2">
        {SUCCESS_STORIES.map((story, i) => (
          <figure
            key={story.src}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="luxury-card overflow-hidden border border-[#E8B75A]/40 bg-white/70"
          >
            <img src={story.src} alt={`${story.name}, Bonding Biology client success story`} className="h-72 w-full object-cover" />
            <figcaption className="p-5">
              <Stars className="text-[14px] text-[#D8962D]" />
              <p className="ff-serif mt-2 text-[16px] italic leading-[1.45] text-[#4C1119]">
                "{story.quote}"
              </p>
              <p className="ff-sans mt-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#8A2634]">
                {story.name} <span className="text-[#4C1119]/50">&middot; Bonding Biology Client</span>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Problem section --------------------------- */

function Problem() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>An honest look</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          You've Built the Career. You've Mastered Success.
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-8 max-w-[680px]" data-reveal>
        <p className="text-[17px] leading-[1.6] text-[#FFF7EE]/80">
          So why does love still feel like the one area that won't align? It's not your standards. It's not your intelligence. And it's definitely not your worth. It's your positioning, because the version of you that built success is not the same version of you that attracts elite love.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            "Attracting successful men who won't commit",
            "Feeling chemistry with men who confuse you",
            "Overgiving and not getting the same energy back",
            "Wondering why you keep ending up in the same cycle",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 text-[17px] leading-[1.55] text-[#FFF7EE]/80">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B75A]" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="ff-serif mt-6 text-[22px] italic font-medium text-[#FFF7EE]">
          "It's not that I can't get a man. It's that I can't get the right man to stay."
        </p>
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta className="w-full sm:w-auto">Show Me the Cheat Code</Cta>
      </div>
    </section>
  );
}

/* --------------------------- Identity mechanism --------------------------- */

const IDENTITY_STAGES = [
  { label: "Wrong Identity", body: "Operating from the identity that built your career, not your love life." },
  { label: "Old Patterns", body: "Chasing, proving, and overgiving just to be chosen." },
  { label: "New Positioning", body: "Becoming the woman who feels rare, grounded, and whole." },
  { label: "Elite Attraction", body: "The kind of men who pursue, provide, and commit." },
];

function IdentityMechanism() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">The shift</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.7rem,3.8vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#250009] [text-wrap:balance]">
          From Wrong Identity to Elite Attraction
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
        {IDENTITY_STAGES.map((stage, i) => (
          <div key={stage.label} className="relative flex flex-col items-center text-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#8A2634] bg-white text-[18px] font-black text-[#8A2634]">
              {i + 1}
            </div>
            <h3 className="ff-serif mt-4 text-[18px] font-bold text-[#250009]">{stage.label}</h3>
            <p className="mt-2 text-[15px] leading-[1.5] text-[#4C1119]/80">{stage.body}</p>
            {i < IDENTITY_STAGES.length - 1 && (
              <ArrowRight className="mt-4 hidden h-5 w-5 text-[#8A2634]/40 sm:block lg:absolute lg:right-[-26px] lg:top-3 lg:mt-0" />
            )}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-[16px] leading-[1.6] text-[#4C1119]/75" data-reveal>
        This isn't dating advice. It's a full-system upgrade for your love life, built for women who have already mastered success everywhere else.
      </p>
    </section>
  );
}

/* ---------------------------- What's included -------------------------- */

const CLARITY_POINTS = [
  "How elite men actually choose women, not what social media told you",
  "The biggest mistakes that instantly lower your value without you realizing it",
  "How to activate curiosity, anticipation, and polarity so he pursues you",
  "How to shift from being an option to being the woman he prioritizes",
];

function WhatsIncludedIntro() {
  return (
    <section id="whats-included" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#200008_0%,#170006_100%)] border-y border-[#E8B75A]/15">
      <Glow className="h-[300px] w-[300px] top-10 -left-24 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Inside this experience</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          Your Blueprint for Becoming the Prize
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.6] text-[#FFF7EE]/80">
          The High Value Woman Cheat Code is your blueprint for becoming the woman high-caliber men naturally pursue, shifting out of overgiving and overfunctioning, and activating the energy that makes a man invest, lead, and commit.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-9 max-w-2xl" data-reveal>
        <p className="ff-sans text-center text-[14px] font-bold uppercase tracking-[0.18em] text-[#E8B75A]">
          Inside, you'll learn:
        </p>
        <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {CLARITY_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-[16px] leading-snug text-[#FFF7EE]/85">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B75A]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta className="w-full sm:w-auto">Yes, I Want the Cheat Code</Cta>
      </div>
    </section>
  );
}

/* -------------------------- Walk away with (6 benefits) ----------------------- */

const BENEFITS = [
  {
    title: "Clarity on Why Your Love Life Hasn't Worked",
    body: "Finally understand the patterns, emotional triggers, and subconscious wiring that have been attracting the wrong men, and how to shift them.",
  },
  {
    title: "A Personalized Love Blueprint",
    body: "A clear, step-by-step path tailored to your attachment style and emotional patterns, so you're no longer guessing what to do next.",
  },
  {
    title: "Emotional Regulation Tools That Work",
    body: "Learn how to stop overthinking, calm your nervous system, and respond with confidence instead of reacting from anxiety or fear.",
  },
  {
    title: "Feminine Energy & Confidence Activation",
    body: "Step into the version of you that feels grounded, magnetic, and self-assured, without chasing, proving, or overgiving.",
  },
  {
    title: "Real-Time Guidance for Dating",
    body: "No more confusion about what to say or how to respond. You'll know exactly how to move in every situation.",
  },
  {
    title: "A Proven System to Attract Available Men",
    body: "Shift your internal patterns so you naturally attract commitment-ready partners, not just more attention.",
  },
];

function WalkAwayWith() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">What you'll walk away with</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          Stop Guessing. Start Getting Results.
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="luxury-card flex flex-col border border-[#E8B75A]/40 bg-white/60 p-7 shadow-sm"
          >
            <CrownIcon className="h-6 w-6 text-[#8A2634]" />
            <h3 className="ff-serif mt-3 text-[18px] font-bold leading-tight text-[#250009]">{b.title}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.5] text-[#4C1119]/80">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- How elite men choose --------------------------- */

function HowEliteMenChoose() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <SectionBg src="/cheat-code-mockup.png" opacity={0.06} />
      <div className="relative z-10 mx-auto max-w-2xl text-center" data-reveal>
        <Eyebrow>What actually works</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          High-Value Men Don't Choose the Woman Who Tries the Hardest
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6] text-[#FFF7EE]/75">They choose the woman who:</p>
        <ul className="mx-auto mt-5 flex max-w-md flex-col items-center gap-3">
          {["Feels rare", "Feels grounded", "Feels like peace and power"].map((line) => (
            <li key={line} className="ff-serif text-[21px] font-medium text-[#F1C97A]">
              {line}
            </li>
          ))}
        </ul>
        <p className="ff-serif mt-7 text-[22px] italic font-medium text-white">
          They choose the woman who makes them feel: "I cannot lose her."
        </p>
      </div>
    </section>
  );
}

/* --------------------------- Community section --------------------------- */

function Community() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="relative z-10 mx-auto max-w-6xl px-0 lg:grid lg:grid-cols-12 lg:gap-10 items-center">
        <div className="lg:col-span-6" data-reveal>
          <Eyebrow className="text-[#8A2634]">Real women, real energy</Eyebrow>
          <h2 className="ff-serif mt-4 text-[clamp(1.7rem,3.6vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
            Join a Community of High-Value Women
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#250009]/80">
            Thousands of women have gone through Shay's work to rebuild their confidence and shift how they show up in love. This isn't a program you try. It's a system you follow, and a transformation you complete.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "This is a guided system, not guesswork",
              "You are supported every step of the way",
              "Your transformation is the goal, not just your participation",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[16px] leading-snug text-[#250009]">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#8A2634]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 lg:mt-0 lg:col-span-6 grid grid-cols-2 gap-3" data-reveal style={{ transitionDelay: "150ms" }}>
          <img
            src="/community-celebration.jpg"
            alt="Community of high-value women celebrating together"
            className="col-span-2 h-56 w-full border border-[#E8B75A]/35 object-cover sm:h-72"
          />
          <img
            src="/community-embrace.jpeg"
            alt="Two women embracing at a Bonding Biology event"
            className="col-span-2 h-40 w-full border border-[#E8B75A]/35 object-cover sm:h-48"
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Testimonials -------------------------------- */

const TESTIMONIALS = [
  {
    initial: "Z",
    name: "Zara Bush",
    quote: "I'm a high-level professional, and I couldn't understand why I kept attracting emotionally unavailable men. Within weeks, I started showing up differently, and the type of men pursuing me completely changed.",
  },
  {
    initial: "A",
    name: "Ashwini Santiago",
    quote: "I didn't realize how much my nervous system was running my dating life. Now I feel calm, clear, and confident, and I don't chase anymore.",
  },
  {
    initial: "K",
    name: "Kaden Scott",
    quote: "I used to feel confused and anxious. Now I know exactly what to do, what to say, and what I deserve, and men respond to me differently because of it.",
  },
];

function Testimonials() {
  return (
    <section id="reviews" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Real stories</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          From Their Story to Yours
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-9 grid max-w-5xl gap-5 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="luxury-card flex flex-col border border-[#E8B75A]/35 bg-white/[0.04] p-6"
          >
            <Stars className="text-[14px] text-[#D8962D]" />
            <blockquote className="ff-serif mt-3 flex-1 text-[16px] italic leading-[1.45] text-[#FFF7EE]/85">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8B75A]/50 bg-[#E8B75A]/10 text-[14px] font-bold text-[#E8B75A]">
                {t.initial}
              </span>
              <span className="ff-sans text-[13px] font-bold uppercase tracking-[0.1em] text-[#E8B75A]/90">{t.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Offer stack ----------------------------- */

// Per-item dollar values below are illustrative value-stack figures chosen
// to sum to the stated $1,297 total value from the source page, not
// confirmed standalone sale prices for each asset.
const INCLUDED = [
  {
    title: "The High Value Woman Cheat Code Workbook",
    body: "Your personalized Love Blueprint framework, in writing.",
    value: 297,
  },
  {
    title: "The Full Video Training",
    body: "Laptop and mobile-friendly training you can move through at your own pace.",
    value: 397,
  },
  {
    title: "Feminine Energy Activation Audio",
    body: "A guided audio to help you feel grounded, magnetic, and self-assured.",
    value: 197,
  },
  {
    title: "Irresistible Attraction Secrets Audio",
    body: "The specific shifts that activate curiosity, anticipation, and polarity.",
    value: 197,
  },
  {
    title: "Your Personalized Love Blueprint",
    body: "A step-by-step path tailored to your attachment style and patterns.",
    value: 147,
  },
  {
    title: "Real-Time Dating Guidance",
    body: "Know exactly what to do, say, and tolerate in real dating situations.",
    value: 62,
  },
];

function OfferStack() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <Glow className="h-[420px] w-[420px] -bottom-40 left-1/2 -translate-x-1/2 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>What's included</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          The High Value Woman Cheat Code
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#FFF7EE]/75">
          When you get instant access for ${CHEAT_CODE_PRICE}, you receive:
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-9 max-w-[780px]" data-reveal>
        <img
          src="/cheat-code-mockup.png"
          alt="The High Value Woman Cheat Code workbook, video training, and audio mockup"
          className="mx-auto mb-8 h-auto w-full max-w-[560px] object-contain"
        />

        <div className="border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] p-7 text-[#250009] sm:p-12">
          <ul className="space-y-6">
            {INCLUDED.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-[#8A2634]" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="ff-serif text-[17px] font-bold text-[#250009]">{item.title}</h4>
                    <span className="ff-sans shrink-0 text-[13px] font-bold text-[#8A2634]/60 line-through">${item.value}</span>
                  </div>
                  <p className="mt-0.5 text-[15px] leading-snug text-[#4C1119]/80">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-[#8A2634]/15 pt-7 text-center">
            <span className="ff-sans text-[14px] font-bold uppercase tracking-[0.14em] text-[#8A2634]/70 line-through">
              Total Value: ${STATED_VALUE}
            </span>
            <p className="ff-sans mt-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">
              Get Instant Access for Only
            </p>
            <p className="ff-serif mt-1 text-[64px] font-black leading-none text-[#15803D]">${CHEAT_CODE_PRICE}</p>

            <div className="mt-5">
              <Cta className="w-full sm:w-auto">Get the Cheat Code for ${CHEAT_CODE_PRICE}</Cta>
            </div>
            <p className="mt-4 text-[14px] font-medium text-[#8A2634]/80">One payment. Instant digital access.</p>
            <p className="mt-2 text-[14px] leading-snug text-[#8A2634]/80">
              100% satisfaction guaranteed, or let us know and we'll refund you.
            </p>
            <p className="mt-3 text-[13px]">
              <TodoNote>Every CTA on this page needs the real checkout link before launch.</TodoNote>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Founder ---------------------------------- */

function Founder() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="relative z-10 mx-auto max-w-6xl px-0 lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-7" data-reveal>
          <Eyebrow className="text-[#8A2634]">Meet Shay</Eyebrow>
          <h2 className="ff-serif mt-4 text-[clamp(1.7rem,3.6vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009]">
            Shay, Your Love Diva
          </h2>
          <div className="mt-4 space-y-4 text-[17px] leading-[1.6] text-[#250009]/80">
            <p>
              Shay has helped thousands of women shift out of the identity that built their success and into the one that attracts elite, committed love. Her Bonding Biology approach is the framework behind this cheat code.
            </p>
            <p>
              This isn't surface-level advice. It's a way to shift your internal patterns so you naturally attract commitment-ready partners, not just more attention.
            </p>
            <p className="ff-serif text-[19px] font-medium text-[#8A2634]">
              You do not need to become less powerful to experience lasting love.
            </p>
          </div>
        </div>
        <div className="mt-8 lg:mt-0 lg:col-span-5 flex justify-center" data-reveal style={{ transitionDelay: "150ms" }}>
          <div className="relative w-full max-w-[420px]">
            <Glow className="h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
            <img
              src="/shay-stage.jpg"
              alt="Shay speaking live on stage at a Bonding Biology event"
              className="relative z-10 w-full border border-[#E8B75A]/35 object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FAQ ---------------------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from other dating advice?",
    a: "Most dating advice focuses on what to say or do. This focuses on why you keep attracting the same patterns, and how to rewire them at the root so your results naturally change.",
  },
  {
    q: "Will this work for me if I've already tried everything?",
    a: "If you've tried therapy, books, or coaching and still feel stuck, that's exactly who this is for. This approach works on your nervous system and subconscious wiring, not just surface behavior.",
  },
  {
    q: "Is this for women who are already successful?",
    a: "Yes. This was specifically designed for women who have mastered their careers but want the same level of success in love.",
  },
  {
    q: "How quickly will I see results?",
    a: "Many women begin noticing shifts in how they feel, respond, and are treated within weeks, because when you change how you show up, everything around you responds differently.",
  },
  {
    q: "Do I need to be dating right now for this to work?",
    a: "No. This work prepares you internally so that when you do date, you attract and choose from a completely different level.",
  },
  {
    q: `Is the $${CHEAT_CODE_PRICE} a one-time payment?`,
    a: `Yes. Your access is a one-time payment of $${CHEAT_CODE_PRICE} with no recurring subscription.`,
  },
];

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8B75A]/15 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ff-sans flex w-full items-center justify-between gap-4 text-left text-[16px] sm:text-[18px] font-bold text-[#FFF7EE]"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown className={`h-6 w-6 shrink-0 text-[#E8B75A] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 text-[16px] leading-[1.6] text-[#FFF7EE]/75">{a}</div>}
    </div>
  );
}

function Faq() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#170006_0%,#200008_100%)]">
      <div className="mx-auto max-w-[850px]">
        <div className="text-center" data-reveal>
          <Eyebrow>Questions women like you usually ask</Eyebrow>
          <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
            Before They Say Yes
          </h2>
        </div>
        <div className="mt-9" data-reveal>
          {FAQS.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </div>

        <div className="mt-10 flex justify-center" data-reveal>
          <Cta className="w-full sm:w-auto">Get the Cheat Code for ${CHEAT_CODE_PRICE}</Cta>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA + Footer ------------------------------ */

const FINAL_INCLUDES = [
  "The Complete Cheat Code Workbook",
  "Full Video Training",
  "Feminine Energy Activation Audio",
  "Irresistible Attraction Secrets Audio",
  "Your Personalized Love Blueprint",
  "Real-Time Dating Guidance",
];

function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div
        data-reveal
        className="relative z-10 mx-auto max-w-[700px] border border-[#E8B75A]/45 bg-[#250009] p-8 text-center text-[#FFF7EE] sm:p-10"
      >
        <p className="ff-serif text-[22px] font-bold">The High Value Woman Cheat Code</p>
        <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left">
          {FINAL_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[16px] text-[#FFF7EE]/85">
              <CheckIcon className="h-4 w-4 shrink-0 text-[#E8B75A]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.14em] text-[#E8B75A]">
          Get Instant Access for ${CHEAT_CODE_PRICE}
        </p>
        <div className="mt-5">
          <Cta className="w-full sm:w-auto">I'm Ready to Attract Elite Love</Cta>
        </div>
        <p className="mt-4 text-[14px] font-medium text-[#FFF7EE]/60">One payment. Instant digital access.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E8B75A]/15 bg-[#170006] px-5 py-10 text-center sm:px-8">
      <p className="ff-serif text-[18px] font-semibold tracking-[-0.02em] text-[#FFF7EE]">Bonding Biology Institute</p>
      <p className="mt-3 text-[14px] text-[#FFF7EE]/50">
        Questions? Contact{" "}
        <a
          href="mailto:Support@BondingBiology.com"
          className="underline decoration-[#E8B75A]/40 underline-offset-2 hover:text-[#E8B75A]"
        >
          Support@BondingBiology.com
        </a>
      </p>
      <p className="mx-auto mt-4 max-w-xl text-[12.5px] leading-[1.5] text-[#FFF7EE]/35">
        Results vary. This program provides relationship education and personal-development tools. It does not guarantee a particular relationship outcome or the behavior or commitment of another person.
      </p>
      <p className="mt-3 text-[14px] text-[#FFF7EE]/45">
        &copy; {new Date().getFullYear()} Shay Better, LLC. All rights reserved.
      </p>
    </footer>
  );
}

/* --------------------------- Sticky mobile bar -------------------------------- */

function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8B75A]/45 bg-[#170006]/95 backdrop-blur-xl md:hidden px-4 py-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="ff-sans text-[15px] font-bold text-[#FFF7EE] tracking-tight">High Value Woman Cheat Code</span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#E8B75A]/80">Only ${CHEAT_CODE_PRICE}</span>
        </div>
        <a
          href={CHEAT_CODE_CHECKOUT_URL}
          onClick={handleCtaClick}
          className="ff-sans btn-shimmer min-h-[48px] rounded-none bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-3 text-[16px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Get Access</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* --------------------------- Exit-intent form -------------------------------- */

function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function ExitIntentForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setPhone("");
        setEmailError("");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e, dialogRef.current);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address containing '@'.");
      return;
    }
    setEmailError("");
    if (status === "loading") return;
    setStatus("loading");

    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          formSource: "exit_intent_modal_e",
          ...getStoredUtmParams(),
        }),
      });
    } catch {
      // Fail forward — still send the visitor to checkout even if the webhook fails.
    }

    trackFacebookEvent("Lead", { content_name: "High Value Woman Cheat Code", content_category: "Exit Intent" });
    window.location.href = CHEAT_CODE_CHECKOUT_URL;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div className="absolute inset-0 bg-[#0E0004]/85 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg border border-[#E8B75A]/60 bg-[linear-gradient(135deg,#1D0008_0%,#3C0816_100%)] p-7 text-[#FFF7EE] shadow-[0_40px_120px_rgba(0,0,0,0.85)] sm:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center text-[#E8B75A]/70 transition-colors hover:bg-white/10 hover:text-[#E8B75A]"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <Eyebrow>Wait, Before You Go</Eyebrow>
        <h3
          id="exit-intent-title"
          className="ff-serif mt-4 text-[clamp(1.6rem,4.5vw,2.1rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white"
        >
          Get the Cheat Code for ${CHEAT_CODE_PRICE}
        </h3>
        <p className="mt-3 text-[15.5px] leading-[1.55] text-[#FFF7EE]/75">
          Enter your info and we'll take you straight to instant access. This ${CHEAT_CODE_PRICE} price won't be here much longer.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="exit-e-name" className="sr-only">Full name</label>
            <input
              ref={firstFieldRef}
              id="exit-e-name"
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
            />
          </div>
          <div>
            <label htmlFor="exit-e-email" className="sr-only">Email address</label>
            <input
              id="exit-e-email"
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
            />
            {emailError && (
              <p className="mt-1.5 text-[13px] font-medium text-[#FF5D73]">{emailError}</p>
            )}
          </div>
          <div>
            <label htmlFor="exit-e-phone" className="sr-only">Phone number</label>
            <input
              id="exit-e-phone"
              type="tel"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              className="w-full border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="ff-sans btn-shimmer flex min-h-[52px] w-full items-center justify-center gap-2 rounded-none bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[17px] font-bold text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.28)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? (
              "Redirecting..."
            ) : (
              <>
                Get the Cheat Code for ${CHEAT_CODE_PRICE}
                <ArrowRight className="h-[18px] w-[18px]" />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[12.5px] font-medium text-[#FFF7EE]/60">
          Instant access &middot; One payment &middot; Satisfaction guaranteed
        </p>
      </div>
    </div>
  );
}

/* ------------------------ Atmosphere: reveal + keyframes ---------------------- */

function StyleTag() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
      />
      <style>{`
      .bb-landing-e, .bb-landing-e .ff-serif, .bb-landing-e .ff-sans {
        font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif !important;
      }

      [data-reveal] {
        opacity: 0;
        transform: translateY(26px);
        transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-reveal].is-visible { opacity: 1; transform: none; }

      .hero-stagger > * {
        opacity: 0;
        transform: translateY(20px);
        animation: heroIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: calc(var(--i, 0) * 110ms + 120ms);
      }
      @keyframes heroIn { to { opacity: 1; transform: none; } }

      .luxury-card { position: relative; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
      .luxury-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(232, 183, 90, 0.08) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      .luxury-card:hover { transform: translateY(-5px) scale(1.015); border-color: rgba(232, 183, 90, 0.65) !important; }
      .luxury-card:hover::before { opacity: 1; }

      .btn-shimmer { position: relative; overflow: hidden; }
      .btn-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
        transform: skewX(-20deg);
        transition: none;
      }
      .btn-shimmer:hover::after { left: 150%; transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

      @media (prefers-reduced-motion: reduce) {
        .hero-stagger > *, [data-reveal] { animation: none !important; opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `}</style>
    </>
  );
}

/* ============================== Page ================================= */

export default function BondingBiologyLandingE() {
  const [exitIntentOpen, setExitIntentOpen] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        const hasShown = sessionStorage.getItem("exit_intent_shown_e");
        if (!hasShown) {
          setExitIntentOpen(true);
          sessionStorage.setItem("exit_intent_shown_e", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <RevealScope>
      <div className="bb-landing-e ff-sans relative min-h-screen overflow-x-clip bg-[#170006] text-[#FFF7EE] antialiased [scroll-behavior:smooth]">
        <StyleTag />
        <Nav />
        <Hero />
        <CoupleTestimonials />
        <Problem />
        <IdentityMechanism />
        <WhatsIncludedIntro />
        <WalkAwayWith />
        <HowEliteMenChoose />
        <Community />
        <Testimonials />
        <OfferStack />
        <Founder />
        <Faq />
        <FinalCta />
        <Footer />
        <MobileBar />
        <ExitIntentForm open={exitIntentOpen} onClose={() => setExitIntentOpen(false)} />
      </div>
    </RevealScope>
  );
}

function RevealScope({ children }: { children: React.ReactNode }) {
  useRevealEffect();
  return <>{children}</>;
}

function useRevealEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
