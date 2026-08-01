"use client";

/**
 * BondingBiologyLandingD.tsx
 * ------------------------------------------------------------------
 * "/d" — a standalone sales page for a different product entirely: the
 * $97 3-day "Bonding Biology Summit" (not the free blueprint or the $27
 * evaluation funnel used by "/", "/b", "/c"). Intentionally a full,
 * self-contained duplicate-style page (not sharing components with the
 * other landing files) so none of them are ever at risk of changing.
 *
 * The summit is framed as a fully virtual, on-demand experience (no live
 * date/time — enroll and get instant access, watch anytime), so there is
 * no event date/timezone/replay-policy placeholder to fill in.
 *
 * REMAINING PLACEHOLDERS — search for "TODO:" in this file before sending
 * traffic here. They're also rendered visibly on the page itself (in
 * amber) so they can't be missed in a preview: the refund/guarantee
 * policy and the support email in the footer.
 *
 * The 4 testimonial quotes paired with real couple photos in the
 * Testimonials section were written by request as illustrative launch
 * copy, not sourced from verified clients — swap in real, verified quotes
 * (with consent from the people pictured) before running paid traffic.
 * ------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { trackFacebookEvent } from "./lib/leadCapture";

const SUMMIT_CHECKOUT_URL = "https://link.fastpaydirect.com/payment-link/6a5e81b2a655fa0b802a53e4";

const SUMMIT_VALUE = 497;
const SUMMIT_PRICE = 97;
const SAVINGS = SUMMIT_VALUE - SUMMIT_PRICE;

const handleCtaClick = () => {
  trackFacebookEvent('InitiateCheckout', {
    content_name: 'Bonding Biology Summit',
    value: SUMMIT_PRICE,
    currency: 'USD',
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

/* --------------------------- Small parts -------------------------- */

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`ff-sans inline-block text-[12px] font-bold uppercase tracking-[0.22em] text-[#E8B75A] ${className}`}>
    {children}
  </span>
);

// Reusable "photo texture" background layer — reuses existing site images at
// low opacity so sections aren't flat blocks of color. `tone` picks a dark
// or light multiply blend to match the section it sits behind.
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
  href = SUMMIT_CHECKOUT_URL,
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
    "ff-sans btn-shimmer group inline-flex items-center justify-center gap-2.5 rounded-none px-10 py-4 text-[15px] font-bold transition-all duration-300 will-change-transform";
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
          href={SUMMIT_CHECKOUT_URL}
          onClick={handleCtaClick}
          className="ff-sans inline-flex items-center gap-2 rounded-none bg-[linear-gradient(135deg,#F6D089_0%,#D99A35_100%)] px-5 py-2.5 text-[13px] sm:text-[14px] font-bold text-[#250009] shadow-[0_10px_30px_rgba(232,183,90,0.25)] transition-transform hover:-translate-y-0.5"
        >
          <span>Reserve My Spot</span>
        </a>
      </div>
    </header>
  );
}

/* ------------------------------ Hero -------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#170006] bg-[url('/hero-bg.png')] bg-cover bg-[position:left_25%] bg-no-repeat px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,0,6,0.5)_0%,rgba(23,0,6,0.62)_60%,rgba(23,0,6,0.72)_100%)] z-0 pointer-events-none" />
      <Glow className="h-[380px] w-[380px] -top-32 -right-32 z-0" />
      <div className="hero-stagger relative z-10 mx-auto max-w-3xl text-center">
        <div style={{ "--i": 0 } as React.CSSProperties}>
          <Eyebrow>The Bonding Biology Summit</Eyebrow>
        </div>
        <h1
          style={{ "--i": 1 } as React.CSSProperties}
          className="ff-serif mt-6 text-[clamp(2.2rem,5.4vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[#FFF7EE] [text-wrap:balance]"
        >
          You Have Built a Successful Life. Now It Is Time to Build the Love That Belongs in It.
        </h1>
        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.6] text-[#FFF7EE]/78 [text-wrap:balance]"
        >
          A transformational 3-day experience for accomplished women who are ready to understand why relationships keep stalling, break the patterns that interfere with commitment, and create the conditions for secure, lasting love.
        </p>
        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
        >
          <span className="ff-sans text-[13px] font-bold uppercase tracking-[0.16em] text-[#FFF7EE]/45 line-through decoration-2">
            Normally ${SUMMIT_VALUE}
          </span>
          <span className="ff-sans text-[13px] font-bold uppercase tracking-[0.16em] text-[#E8B75A]">
            Today Only ${SUMMIT_PRICE}
          </span>
          <span className="ff-sans inline-flex items-center rounded-none bg-[#DC2626] px-3 py-1 text-[13px] font-black uppercase tracking-[0.08em] text-white shadow-[0_6px_18px_rgba(220,38,38,0.4)]">
            Save ${SAVINGS}
          </span>
        </div>
        <div style={{ "--i": 4 } as React.CSSProperties} className="mt-5 flex flex-col items-center gap-4">
          <Cta className="w-full sm:w-auto">Reserve My Spot for ${SUMMIT_PRICE}</Cta>
        </div>
        <p style={{ "--i": 5 } as React.CSSProperties} className="mt-4 text-[13.5px] font-bold uppercase tracking-[0.12em] text-[#E8B75A]/90">
          Limited-time launch price — the $97 rate won't last
        </p>
        <p style={{ "--i": 5 } as React.CSSProperties} className="mt-2 text-[13.5px] font-medium text-[#FFF7EE]/60">
          100% virtual — enroll and get instant access, watch anytime.
        </p>

        <div
          style={{ "--i": 6 } as React.CSSProperties}
          className="mx-auto mt-9 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#E8B75A]/15 pt-6"
        >
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">8,000+</span>
            <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Women Coached</span>
          </div>
          <div className="h-6 w-[1px] bg-[#E8B75A]/20" />
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">★★★★★</span>
            <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Top Rated</span>
          </div>
          <div className="h-6 w-[1px] bg-[#E8B75A]/20" />
          <div className="flex flex-col items-center">
            <span className="ff-serif text-[22px] font-bold text-[#E8B75A] leading-none">3 Days</span>
            <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#FFF7EE]/55">Watch Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Empathy + Reframe (merged) ----------------------- */

function EmpathyReframe() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <SectionBg src="/offfer-banner-original.avif" opacity={0.1} />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>An honest look</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          You Are Not Too Successful, Too Independent, or Too Much to Be Loved
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-8 max-w-2xl space-y-4 text-[16px] leading-[1.65] text-[#FFF7EE]/75" data-reveal>
        <p>
          You have built a life you are proud of. You have worked on yourself, raised your standards, and learned from past relationships. You promised yourself you would never ignore the warning signs again.
        </p>
        <p className="ff-serif text-[20px] font-medium text-[#F1C97A]">Yet love still feels harder than it should.</p>
        <p>
          The connection begins with chemistry, attention, and possibility. Then something changes — he becomes inconsistent, the relationship stops progressing, and you find yourself doing more, explaining more, or waiting for him to become certain.
        </p>
        <p className="ff-serif text-[21px] italic font-medium text-[#FFF7EE]">
          “Why does this keep happening when I have done so much work on myself?”
        </p>
        <p>
          The answer may not be that you are choosing wrong every time. It may be that there are emotional, subconscious, and relational patterns operating beneath the surface that interrupt bonding before secure commitment has a chance to develop.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-2xl rounded-lg border border-[#E8B75A]/25 bg-white/[0.04] p-7 sm:p-9" data-reveal>
        <Eyebrow className="text-[#E8B75A]">A different approach</Eyebrow>
        <h3 className="ff-serif mt-3 text-[clamp(1.5rem,3.2vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#FFF7EE] [text-wrap:balance]">
          Love Is Not Something You Should Have to Chase, Perform for, or Earn
        </h3>
        <p className="mt-4 text-[15px] leading-[1.6] text-[#FFF7EE]/70">
          Most dating advice focuses on what to say, how long to wait, or how to appear more desirable. But scripts cannot create emotional safety, and pretending to need less will never produce the connection you actually want. The Bonding Biology Summit gives you a different way to understand love — how attraction, emotional safety, subconscious conditioning, and relationship dynamics work together to support bonding or quietly interfere with it.
        </p>
        <p className="ff-serif mt-4 text-[17px] text-[#E8B75A]">
          This is not about controlling a man. It is about understanding yourself.
        </p>
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta className="w-full sm:w-auto">Show Me What Has Been Blocking Love</Cta>
      </div>
    </section>
  );
}

/* ---------------------------- Intro section -------------------------- */

const CLARITY_POINTS = [
  "Why promising relationships repeatedly lose momentum",
  "Why strong chemistry does not always become commitment",
  "The subconscious Love Blocks® that may be influencing your choices",
  "How emotional safety and attachment develop between two people",
  "Why you may feel drawn to partners who cannot fully meet you",
  "How to recognize a man who is emotionally capable of building with you",
];

function Intro() {
  return (
    <section id="curriculum" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#200008_0%,#170006_100%)] border-y border-[#E8B75A]/15">
      <Glow className="h-[300px] w-[300px] top-10 -left-24 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Introducing</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          The Bonding Biology Summit
        </h2>
        <p className="ff-serif mt-3 text-[18px] italic text-[#F1C97A]">
          A 3-Day Relationship Transformation Experience With Shay, Your Love Diva
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-[1.6] text-[#FFF7EE]/75">
          Shay will guide you through her Bonding Biology framework so you can understand what has been happening beneath the surface of your relationships — and learn how to participate in love without chasing, overgiving, proving, or abandoning yourself.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-9 max-w-2xl" data-reveal>
        <p className="ff-sans text-center text-[13px] font-bold uppercase tracking-[0.18em] text-[#E8B75A]">
          By the end of the summit, you will have greater clarity around:
        </p>
        <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {CLARITY_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-[#FFF7EE]/85">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B75A]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta className="w-full sm:w-auto">Yes, I Am Ready to Understand My Pattern</Cta>
      </div>
    </section>
  );
}

/* -------------------------- Curriculum (3 days) ----------------------- */

const CURRICULUM = [
  {
    day: "Day One",
    title: "Why Accomplished Women Keep Repeating the Same Relationship Pattern",
    intro: "You will identify the hidden Love Blocks® and subconscious beliefs that can influence who you choose and how you respond when a relationship feels uncertain.",
    points: [
      "Why career success does not automatically translate into security in love",
      "How previous relationships may still be shaping your current decisions",
      "The difference between high standards and standards used as protection",
    ],
    outcome: "You will begin seeing your relationship history as a recognizable pattern, not a collection of unrelated disappointments.",
  },
  {
    day: "Day Two",
    title: "The Patterns That Interrupt Attraction, Safety, and Attachment",
    intro: "You will explore how fear, overfunctioning, unmet emotional needs, and self-protective behavior affect the way connection develops.",
    points: [
      "Why you may become more anxious when a relationship matters",
      "How chasing, proving, overexplaining, or overgiving can begin",
      "What healthy emotional safety actually feels like in real life",
    ],
    outcome: "You will understand what may be interrupting connection — and what to practice instead.",
  },
  {
    day: "Day Three",
    title: "How Healthy Bonding Becomes Lasting Commitment",
    intro: "You will learn how attraction can grow into attachment, trust, and commitment when both people are emotionally available and relationally aligned.",
    points: [
      "The difference between attention, chemistry, attachment, and commitment",
      "How consistency, safety, and mutual investment support bonding",
      "How to create your personal Bonding Biology Blueprint",
    ],
    outcome: "You will leave with a clearer standard for love and a practical plan for healthier relationship experiences.",
  },
];

function Curriculum() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">The experience</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          What You Will Experience
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
        {CURRICULUM.map((d, i) => (
          <div
            key={d.day}
            data-reveal
            style={{ transitionDelay: `${i * 110}ms` }}
            className="luxury-card flex flex-col border border-[#E8B75A]/40 bg-white/60 p-7 shadow-sm"
          >
            <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#8A2634]">{d.day}</span>
            <h3 className="ff-serif mt-3 text-[19px] font-bold leading-tight text-[#250009]">{d.title}</h3>
            <p className="mt-3 text-[13.5px] leading-[1.5] text-[#4C1119]/80">{d.intro}</p>
            <ul className="mt-4 space-y-2">
              {d.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] leading-snug text-[#4C1119]">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#8A2634]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-[#8A2634]/15 pt-4">
              <span className="ff-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">Outcome</span>
              <p className="mt-1.5 text-[13px] leading-snug text-[#4C1119]/85">{d.outcome}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- Who for -------------------------------- */

const WHO_FOR = [
  "You are successful in many areas of your life but love still feels unpredictable",
  "You repeatedly attract men who are interested but not fully available",
  "Your relationships often begin intensely and then lose momentum",
  "You tend to overthink, overgive, overfunction, or become anxious in relationships",
  "You have done significant personal work but still feel stuck in the same romantic cycle",
  "You want a relationship that feels secure, mutual, passionate, and emotionally mature",
];

function WhoFor() {
  return (
    <section id="who" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <SectionBg src="/offer-banner.avif" opacity={0.08} />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Who this is for</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          This Summit Is for You If...
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-9 grid max-w-4xl gap-3.5 sm:grid-cols-2">
        {WHO_FOR.map((item, i) => (
          <div
            key={item}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="flex items-start gap-3 border border-[#E8B75A]/25 bg-white/[0.04] p-4.5"
          >
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#E8B75A]" />
            <span className="text-[14.5px] leading-snug text-[#FFF7EE]/85">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- Not this / Is this -------------------------- */

const NOT_THIS = [
  "A list of manipulative scripts",
  "A strategy for pretending not to care",
  "A promise that you can control another person",
  "Another explanation that blames every relationship on your standards",
];

const IS_THIS = [
  "A deeper understanding of your relationship patterns",
  "A practical framework for attraction, safety, bonding, and commitment",
  "A new way to recognize healthy versus unhealthy connection",
  "A blueprint for approaching love with clarity, confidence, and self-respect",
];

function NotThisIsThis() {
  return (
    <section className="px-5 pt-10 pb-0 sm:px-8 sm:pt-14 sm:pb-0 bg-[#170006]">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="ff-serif text-[clamp(1.7rem,3.8vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#FFF7EE] [text-wrap:balance]">
          This Is Not Another Collection of Dating Rules
        </h2>
      </div>
      <div className="relative mx-auto mt-9 grid max-w-6xl overflow-hidden border border-[#E8B75A]/35 bg-[#FFF2EA]/[0.05] md:grid-cols-2">
        <div data-reveal className="border-b border-[#E8B75A]/20 bg-black/15 p-8 md:border-b-0 md:border-r">
          <Eyebrow>This is not</Eyebrow>
          <ul className="mt-4 space-y-3">
            {NOT_THIS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14.5px] leading-snug text-[#FFF7EE]/65">
                <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FFF7EE]/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ transitionDelay: "120ms" }} className="bg-[linear-gradient(135deg,rgba(255,242,234,0.14)_0%,rgba(232,183,90,0.1)_100%)] p-8">
          <Eyebrow>This is</Eyebrow>
          <ul className="mt-4 space-y-3">
            {IS_THIS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14.5px] leading-snug text-[#FFF7EE]/90">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#F8D896]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-12" />
    </section>
  );
}

/* --------------------------- Before / After ----------------------------- */

const BEFORE = [
  "Attracted to men who cannot offer consistency",
  "Confusing intense chemistry with long-term compatibility",
  "Trying to earn certainty through effort",
  "Ignoring your own needs to preserve the connection",
  "Questioning whether lasting partnership is realistic for you",
];

const AFTER = [
  "Recognizing unhealthy patterns sooner",
  "Distinguishing attention from genuine investment",
  "Choosing partners from clarity rather than chemistry alone",
  "Creating space for mutual attachment to develop naturally",
  "Building relationships that are capable of progressing",
];

function BeforeAfter() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <SectionBg src="/final-cta-banner.jpg" tone="light" opacity={0.06} />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">The shift</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          What Changes When You Finally Understand the Pattern?
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-9 grid max-w-5xl gap-6 md:grid-cols-2">
        <div data-reveal className="border border-[#8A2634]/15 bg-white/60 p-7">
          <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#8A2634]/70">Before the Summit</span>
          <ul className="mt-4 space-y-2.5">
            {BEFORE.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#4C1119]/85">
                <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#8A2634]/50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ transitionDelay: "120ms" }} className="border border-[#E8B75A]/55 bg-[linear-gradient(145deg,rgba(232,183,90,0.2)_0%,rgba(255,242,234,0.7)_100%)] p-7">
          <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#8A2634]">After the Summit</span>
          <ul className="mt-4 space-y-2.5">
            {AFTER.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#250009] font-medium">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#8A2634]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta variant="dark" className="w-full sm:w-auto">Create My New Relationship Blueprint</Cta>
      </div>
    </section>
  );
}

/* ------------------------------ Offer stack ----------------------------- */

const INCLUDED = [
  {
    title: "The Complete 3-Day Bonding Biology Summit",
    body: "Three transformational training sessions to understand your patterns and build a healthier approach to love.",
  },
  {
    title: "The Love Blocks® Discovery Exercise",
    body: "A guided exercise to identify the subconscious beliefs and protective patterns influencing your relationships.",
  },
  {
    title: "The Bonding Biology Workbook + Personal Blueprint",
    body: "Reflection questions, exercises, and a step-by-step framework for recognizing patterns and creating healthier conditions for commitment.",
  },
  {
    title: "Summit Replays",
    body: "Revisit every session and move through the material at your own pace.",
  },
];

const BONUSES = [
  {
    title: "BONUS: Attention or Attachment?",
    body: "Distinguish between a man who enjoys your attention and one who is genuinely emotionally invested.",
  },
  {
    title: "BONUS: The Healthy Commitment Checklist",
    body: "The behaviors and relationship conditions associated with emotional availability and forward movement.",
  },
];

function OfferStack() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <Glow className="h-[420px] w-[420px] -bottom-40 left-1/2 -translate-x-1/2 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>What's included</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          Your Bonding Biology Summit Experience
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-[#FFF7EE]/70">
          When you reserve your place for ${SUMMIT_PRICE}, you receive:
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-9 max-w-2xl border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] p-7 text-[#250009] sm:p-10" data-reveal>
        <ul className="space-y-4">
          {INCLUDED.map((item) => (
            <li key={item.title} className="flex items-start gap-3.5">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-[#8A2634]" />
              <div>
                <h4 className="ff-serif text-[16px] font-bold text-[#250009]">{item.title}</h4>
                <p className="mt-0.5 text-[13px] leading-snug text-[#4C1119]/80">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-dashed border-[#8A2634]/30 pt-5 space-y-4">
          {BONUSES.map((item) => (
            <div key={item.title} className="flex items-start gap-3.5">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#8A2634] text-[10px] font-bold text-white">+</span>
              <div>
                <h4 className="ff-serif text-[16px] font-bold text-[#8A2634]">{item.title}</h4>
                <p className="mt-0.5 text-[13px] leading-snug text-[#4C1119]/80">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t border-[#8A2634]/15 pt-6 text-center">
          <span className="ff-sans text-[13px] font-bold uppercase tracking-[0.14em] text-[#8A2634]/70 line-through">
            Total Value: ${SUMMIT_VALUE}
          </span>
          <p className="ff-sans mt-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">
            Join Today for Only
          </p>
          <p className="ff-serif mt-1 text-[56px] font-black leading-none text-[#15803D]">${SUMMIT_PRICE}</p>
          <span className="mt-3 inline-block bg-[#DC2626] px-5 py-2 text-[18px] font-black uppercase tracking-[0.04em] text-white shadow-[0_10px_26px_rgba(220,38,38,0.4)]">
            You Save ${SAVINGS}
          </span>
          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A2634]/70">
            That's {Math.round((SAVINGS / SUMMIT_VALUE) * 100)}% off — limited-time launch pricing
          </p>

          <div className="mt-6">
            <Cta className="w-full sm:w-auto">Yes, I Want the Complete Summit</Cta>
          </div>
          <p className="mt-4 text-[12.5px] font-medium text-[#8A2634]/80">One payment. No recurring subscription.</p>
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
          <div className="mt-4 space-y-3.5 text-[15px] leading-[1.6] text-[#250009]/75">
            <p>
              Shay has helped thousands of women better understand their relationship patterns, rebuild their confidence, and approach love from a place of greater clarity and emotional security.
            </p>
            <p>
              Her Bonding Biology approach brings together relationship education, emotional pattern recognition, nervous-system awareness, and practical application — for women ready to stop repeating the past and become available for a different kind of relationship.
            </p>
            <p className="ff-serif text-[18px] font-medium text-[#8A2634]">
              You do not need to become less powerful to experience lasting love.
            </p>
          </div>
        </div>
        <div className="mt-8 lg:mt-0 lg:col-span-5 flex justify-center" data-reveal style={{ transitionDelay: "150ms" }}>
          <div className="relative w-full max-w-[420px]">
            <Glow className="h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="relative z-10 aspect-video w-full overflow-hidden rounded-none border border-[#E8B75A]/35 bg-black shadow-2xl">
              <iframe
                src="https://player.vimeo.com/video/871282339?h=615ce06ef0&title=0&byline=0&portrait=0"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Bonding Biology Workshop Video"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Testimonials -------------------------------- */

const SUCCESS_STORIES = [
  {
    src: "/cards/tmpexalgh3e.jpg",
    quote: "I finally understood why I kept dating the same guy in different bodies. That awareness alone changed how I show up.",
    name: "Jasmine R.",
  },
  {
    src: "/cards/tmpf6ufyorx.jpg",
    quote: "I said yes to a man who actually shows up — consistently. Before the summit, I didn't think that was possible for me.",
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

function Testimonials() {
  return (
    <section id="reviews" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <SectionBg src="/offer-banner.avif" opacity={0.08} />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Real stories</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          Real Women. Real Relationship Transformations.
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-9 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUCCESS_STORIES.map((story, i) => (
          <figure
            key={story.src}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="luxury-card overflow-hidden border border-[#E8B75A]/35 bg-white/[0.04]"
          >
            <img src={story.src} alt={`${story.name} — Bonding Biology client success story`} className="h-56 w-full object-cover" />
            <figcaption className="p-4">
              <Stars className="text-[13px] text-[#D8962D]" />
              <p className="ff-serif mt-2 text-[13.5px] italic leading-[1.35] text-[#FFF7EE]/70">
                “{story.quote}”
              </p>
              <p className="ff-sans mt-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#E8B75A]/80">
                {story.name}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- FAQ ---------------------------------------- */

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is this only for single women?",
    a: "No. The summit can support single women, women who are dating, and women currently navigating an uncertain relationship. The teachings focus on understanding relationship patterns, emotional safety, attachment, and commitment.",
  },
  {
    q: "Is this going to teach me how to manipulate men?",
    a: "No. The Bonding Biology Summit is not about controlling another person. It is designed to help you understand relationship dynamics, recognize your own patterns, identify emotional availability, and participate in healthier connections.",
  },
  {
    q: "What if I have already done therapy or relationship coaching?",
    a: "Many women understand their past intellectually but still find themselves repeating similar patterns in real relationships. This summit focuses specifically on how those patterns show up during attraction, dating, attachment, and commitment.",
  },
  {
    q: "Will this help me attract a successful or emotionally mature man?",
    a: "The summit cannot guarantee the behavior of another person. It can help you improve your discernment, recognize emotional availability sooner, stop investing in connections that cannot progress, and create healthier conditions for mutual attachment.",
  },
  {
    q: "What exactly do I receive?",
    a: "You receive access to the complete three-day summit, the Bonding Biology Workbook, the Love Blocks® Discovery Exercise, your Personal Bonding Blueprint, summit replays, and all listed bonuses.",
  },
  {
    q: "How long will I have access?",
    a: "The Bonding Biology Summit is 100% virtual and on-demand. Once you enroll, you'll have ongoing access to all three days of training and can revisit them anytime that works for you.",
  },
  {
    q: "Is this a live event, or can I watch anytime?",
    a: "There's no live call-in and no set start date to work around. As soon as you enroll, all three days unlock and you can move through them on your own schedule, wherever you are.",
  },
  {
    q: "Why is the price only $97 right now?",
    a: `$${SUMMIT_PRICE} is a limited-time launch price — the full value of the Summit is $${SUMMIT_VALUE}. This introductory rate won't be available indefinitely, so enrolling now locks in the savings.`,
  },
  {
    q: `Is the $${SUMMIT_PRICE} a one-time payment?`,
    a: `Yes. Your enrollment is a one-time payment of $${SUMMIT_PRICE} with no recurring subscription.`,
  },
  {
    q: "What is the refund policy?",
    a: <TodoNote>Insert the accurate refund or satisfaction-guarantee policy.</TodoNote>,
  },
];

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8B75A]/15 py-4.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ff-sans flex w-full items-center justify-between gap-4 text-left text-[15px] font-bold text-[#FFF7EE]"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#E8B75A] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 text-[14px] leading-[1.6] text-[#FFF7EE]/70">{a}</div>}
    </div>
  );
}

function Faq() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#170006_0%,#200008_100%)]">
      <div className="mx-auto max-w-3xl">
        <div className="text-center" data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mt-9" data-reveal>
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA + Footer ------------------------------ */

const FINAL_INCLUDES = [
  "Complete 3-Day Experience",
  "Implementation Workbook",
  "Love Blocks® Exercise",
  "Personal Bonding Blueprint",
  "Summit Replays",
  "Two Exclusive Bonuses",
];

function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <SectionBg src="/hero-bg.png" tone="light" opacity={0.05} />
      <div
        data-reveal
        className="relative z-10 mx-auto max-w-xl border border-[#E8B75A]/45 bg-[#250009] p-8 text-center text-[#FFF7EE] sm:p-10"
      >
        <p className="ff-serif text-[21px] font-bold">The Bonding Biology Summit</p>
        <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left">
          {FINAL_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[14px] text-[#FFF7EE]/85">
              <CheckIcon className="h-4 w-4 shrink-0 text-[#E8B75A]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.14em] text-[#E8B75A]">
          Join Today for ${SUMMIT_PRICE}
        </p>
        <span className="mt-2 inline-block bg-[#DC2626] px-4 py-1.5 text-[14px] font-black uppercase tracking-[0.04em] text-white shadow-[0_8px_20px_rgba(220,38,38,0.4)]">
          You Save ${SAVINGS}
        </span>
        <div className="mt-5">
          <Cta className="w-full sm:w-auto">Yes, I Am Ready for a Different Love Story</Cta>
        </div>
        <p className="mt-4 text-[12.5px] font-medium text-[#FFF7EE]/60">One payment. No recurring subscription.</p>
        <p className="mt-2 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#E8B75A]/80">
          Limited-time launch price — enroll now before it increases
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E8B75A]/15 bg-[#170006] px-5 py-10 text-center sm:px-8">
      <p className="ff-serif text-[18px] font-semibold tracking-[-0.02em] text-[#FFF7EE]">Bonding Biology Institute</p>
      <p className="mt-3 text-[13px] text-[#FFF7EE]/50">
        Questions? Contact <TodoNote>Insert support email.</TodoNote>
      </p>
      <p className="mx-auto mt-4 max-w-xl text-[11.5px] leading-[1.5] text-[#FFF7EE]/35">
        Results vary. The summit provides relationship education and personal-development tools. It does not guarantee a particular relationship outcome or the behavior or commitment of another person.
      </p>
      <p className="mt-3 text-[13px] text-[#FFF7EE]/45">
        © {new Date().getFullYear()} Bonding Biology Institute. All rights reserved.
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
          <span className="ff-sans text-[15px] font-bold text-[#FFF7EE] tracking-tight">Bonding Biology Summit</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8B75A]/80">3 Days · Only ${SUMMIT_PRICE}</span>
        </div>
        <a
          href={SUMMIT_CHECKOUT_URL}
          onClick={handleCtaClick}
          className="ff-sans btn-shimmer rounded-none bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-3 text-[14px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Reserve</span>
          <ArrowRight className="h-4 w-4" />
        </a>
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
      .bb-landing-d, .bb-landing-d .ff-serif, .bb-landing-d .ff-sans {
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

export default function BondingBiologyLandingD() {
  return (
    <RevealScope>
      <div className="bb-landing-d ff-sans relative min-h-screen overflow-x-clip bg-[#170006] text-[#FFF7EE] antialiased [scroll-behavior:smooth]">
        <StyleTag />
        <Nav />
        <Hero />
        <EmpathyReframe />
        <Intro />
        <Testimonials />
        <Curriculum />
        <WhoFor />
        <NotThisIsThis />
        <BeforeAfter />
        <OfferStack />
        <Founder />
        <Faq />
        <FinalCta />
        <Footer />
        <MobileBar />
      </div>
    </RevealScope>
  );
}

function RevealScope({ children }: { children: React.ReactNode }) {
  // Wires up the same IntersectionObserver-based [data-reveal] pattern used
  // on the other landing pages, scoped as a small wrapper so the effect
  // lives with the page instead of needing a top-level custom hook file.
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
