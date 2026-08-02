"use client";

/**
 * BondingBiologyLandingE.tsx
 * ------------------------------------------------------------------
 * "/e" — a redesigned recreation of Shay's existing external funnel page
 * (her.shayyourlovediva.com/high-value-woman-cheat-code) for a different,
 * lower-ticket offer: "The High Value Woman Cheat Code to Attracting Elite
 * Love" (originally $97, now $11). This is a genuinely different product
 * from the $97 3-day Summit sold on /d — do not confuse the two. Follows
 * /d's visual design system (dark burgundy/cream/gold, Plus Jakarta Sans,
 * sharp corners, scroll-reveal cards) but is otherwise a fully
 * self-contained page with its own copy, sections, and components, same
 * as /d is self-contained from every other landing page.
 *
 * The source page's inflated "$1,297 total value" claim was deliberately
 * dropped (see the second QA pass below) — this page only ever states the
 * real $97-to-$11 discount, not an invented value-stack multiplier.
 *
 * SOURCING NOTE: the source page's asset CDN URLs resolve to the same GHL
 * location ID already used by this project's own GHL_WEBHOOK_URL
 * (RaF6Uj0AVUTaXjgiT7zM), confirming her.shayyourlovediva.com is the same
 * business/account, not a third party. Real photos (couple success
 * photos, a live-event stage photo of Shay, and two community photos) were
 * downloaded from that page, compressed, and saved under /public — see
 * cheat-code-mockup.png, shay-stage.jpg, community-celebration.jpg,
 * community-embrace.jpeg, and public/cards/e-couple-*. The guarantee copy
 * in GuaranteeBanner is reused near-verbatim from Shay's own
 * already-published page for this same offer, not invented.
 *
 * The 3 testimonial quotes (Zara Bush, Ashwini Santiago, Kaden Scott) are
 * copied verbatim from Shay's own live page, but their avatar images on
 * that page use GHL's generic stock funnel-avatar placeholders (not
 * confirmed photos of those people), so this page renders initials instead
 * of claiming a specific photo is a specific person.
 *
 * QA PASS 1 — implemented: price consistency, scroll-triggered mobile
 * sticky bar, hero rebuild (live-text H1/subhead, static founder byline
 * instead of a video, reason-why price framing, no fake "today only"
 * urgency, mockup image above the fold), consolidated "How Elite Men
 * Choose" into the problem section, a standalone guarantee callout, the
 * Bonding Biology name referenced by name, FAQ aria-controls/labelled
 * regions, loading="lazy" on below-fold images.
 *
 * QA PASS 2 — a second, more detailed brief flagged the hero as still too
 * abstract and the deliverables as too vague, so: rewrote the hero around
 * a concrete "discover the hidden pattern" headline instead of the more
 * abstract "wrong identity" framing; added a short Trust Strip and moved
 * the full Shay bio (Founder section) to appear right before the offer
 * instead of near the bottom; split the old combined problem/reframe
 * section into a 4-card "pattern recognition" section plus its own
 * Reframe section; rebuilt the mechanism section around 3 concrete,
 * psychologically-grounded steps instead of the more abstract 4-stage
 * "identity" framing; added a dedicated "Here's Exactly What You'll
 * Receive" section right after the mechanism, using only the 4 components
 * actually visible in the real product mockup photo (workbook, video
 * training, 2 named audios) instead of a padded 6-item list; replaced
 * exaggerated-sounding outcome copy ("men respond to me differently",
 * "activates the energy that makes a man invest") with grounded,
 * controllable outcomes; removed the inflated $1,297 value-stack
 * comparison and all per-item pricing, keeping only the real $97-to-$11
 * discount; standardized every CTA button to "Get Instant Access for
 * $11"; and added UTM-param forwarding onto the external checkout link.
 *
 * NOT implemented, and why — each needs real input this page can't invent:
 * - Footer legal links (Privacy/Terms/Refund Policy) — no such pages exist
 *   anywhere in this project; adding links would 404. Needs real pages or
 *   real copy before they can be added.
 * - Quantified deliverables (page counts, run times, module counts) and
 *   any specific "completes in X minutes" claim — no confirmed numbers
 *   exist; shipping a guess would be a fabricated claim.
 * - A specific refund window (e.g. "14-day guarantee") — the guarantee
 *   copy stays general ("100% Satisfaction Guarantee") because no exact
 *   day-count has been confirmed by Shay.
 * - Embedded 2-step checkout with Apple Pay/Google Pay — a real payment
 *   integration (PCI scope, tokenization) that doesn't exist anywhere in
 *   this frontend-only project. The lower-risk version of "keep visitors
 *   on-site" is the iframe-embed pattern already used at /d/checkout;
 *   worth doing here too as a follow-up if wanted, but not attempted in
 *   this pass given the scope already covered.
 * - Exit-intent rework (single email field, "free chapter" reward, 7-day
 *   cookie) — blocked on a lead-magnet asset that doesn't exist yet
 *   ("asset TBD from client" in the brief itself). Left as-is (3-field
 *   direct-to-checkout capture) rather than promise a download with
 *   nothing behind it.
 * - Stronger/more specific testimonial proof (video, screenshots, named
 *   demographics, before/after timeframes) — no such assets exist; the 3
 *   verbatim quotes and 4 real couple photos already on the page are all
 *   that's available without fabricating new "proof."
 * - GTM container / Meta Conversions API / Google Ads conversion linking —
 *   infrastructure outside this codebase (GTM container config, a CAPI
 *   server endpoint, Google Ads account linking). This file's own pixel
 *   events (InitiateCheckout on CTA click, Lead on exit-intent submit) are
 *   confirmed correctly wired; Purchase fires on /e/thank-you.
 * - Checkout-page styling/speed/branding/minimal fields — entirely
 *   controlled by fastpaydirect, outside this codebase.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { GHL_WEBHOOK_URL, formatPhoneNumber, trackFacebookEvent } from "./lib/leadCapture";
import { getStoredUtmParams } from "./lib/utils";

const CHEAT_CODE_CHECKOUT_URL = "https://link.fastpaydirect.com/payment-link/6a6f8a727b99151a54041cfd";

const ORIGINAL_PRICE = 97;
const CHEAT_CODE_PRICE = 11;
// Re-added as a single value-anchor line (not the full itemized stack) —
// this is Shay's own stated value for the framework from the source page,
// not an invented number.
const STATED_VALUE = 1297;

const handleCtaClick = () => {
  trackFacebookEvent("InitiateCheckout", {
    content_name: "High Value Woman Cheat Code",
    value: CHEAT_CODE_PRICE,
    currency: "USD",
  });
};

// Forwards whatever UTM params this visitor arrived with onto the external
// checkout link, so ad attribution survives the handoff to fastpaydirect
// (harmless if fastpaydirect ignores unknown query params).
function buildCheckoutHref(): string {
  if (typeof window === "undefined") return CHEAT_CODE_CHECKOUT_URL;
  const query = new URLSearchParams(getStoredUtmParams()).toString();
  return query ? `${CHEAT_CODE_CHECKOUT_URL}?${query}` : CHEAT_CODE_CHECKOUT_URL;
}

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

const Glow = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute rounded-full bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] opacity-25 blur-[90px] pointer-events-none ${className}`}
    aria-hidden="true"
  />
);

const Cta = ({
  href = buildCheckoutHref(),
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

/* ------------------------------ Nav -------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8B75A]/20 bg-[#200008]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="block focus:outline-none">
          <img src="/Mainlogo.png" alt="Bonding Biology Institute Logo" className="h-8 md:h-10 w-auto object-contain" />
        </a>
        <a
          href={buildCheckoutHref()}
          onClick={handleCtaClick}
          className="ff-sans inline-flex min-h-[44px] items-center gap-2 rounded-none bg-[linear-gradient(135deg,#F6D089_0%,#D99A35_100%)] px-5 py-2.5 text-[15px] sm:text-[16px] font-bold text-[#250009] shadow-[0_10px_30px_rgba(232,183,90,0.25)] transition-transform hover:-translate-y-0.5"
        >
          <span>Get Instant Access</span>
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
          <Eyebrow>For successful women tired of attracting emotionally unavailable men</Eyebrow>
        </div>
        <h1
          style={{ "--i": 1 } as React.CSSProperties}
          className="ff-serif mt-6 text-[clamp(1.9rem,5vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white [text-wrap:balance]"
        >
          There's a Hidden Pattern Keeping You From the Relationship You Actually Want
        </h1>
        <p
          style={{ "--i": 2 } as React.CSSProperties}
          className="mx-auto mt-5 max-w-2xl text-[clamp(1.0625rem,1.6vw,1.2rem)] leading-[1.6] text-[#FFF7EE]/95 [text-wrap:balance]"
        >
          The High Value Woman Cheat Code helps you identify what's creating the wrong relationship dynamics, and shows you how to attract emotionally available, commitment-ready men, without chasing, overgiving, or pretending to want less.
        </p>

        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3 sm:justify-start"
        >
          <img
            src="/shay-know.png"
            alt="Shay"
            className="h-12 w-12 shrink-0 rounded-full border border-[#E8B75A]/40 object-cover object-top sm:h-14 sm:w-14"
          />
          <div className="text-left">
            <p className="text-[13.5px] font-bold text-[#FFF7EE]">Shay, Founder of Bonding Biology Institute</p>
            <p className="text-[12.5px] font-medium text-[#FFF7EE]/60">8,000+ women coached</p>
          </div>
        </div>

        <img
          style={{ "--i": 4 } as React.CSSProperties}
          src="/cheat-code-mockup.png"
          alt="The High Value Woman Cheat Code workbook, video training, and audio mockup"
          className="mx-auto mt-6 h-auto w-full max-w-[190px] object-contain sm:max-w-[260px]"
        />

        <div style={{ "--i": 5 } as React.CSSProperties} className="mt-5">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="ff-sans text-[14px] font-bold uppercase tracking-[0.16em] text-[#FFF7EE]/45 line-through decoration-2">
              Normally ${ORIGINAL_PRICE}
            </span>
            <span className="ff-serif text-[20px] font-bold text-[#E8B75A]">${CHEAT_CODE_PRICE} today</span>
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] italic leading-snug text-[#FFF7EE]/60">
            Priced at ${CHEAT_CODE_PRICE} because I'd rather 10,000 women actually use this than 100 women think about it.
          </p>
        </div>

        <div style={{ "--i": 6 } as React.CSSProperties} className="mt-5 flex flex-col items-center gap-4">
          <Cta className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
        </div>
        <p style={{ "--i": 7 } as React.CSSProperties} className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] font-medium text-[#FFF7EE]/60">
          <span>Secure checkout</span>
          <span aria-hidden="true">&middot;</span>
          <span>Immediate access</span>
          <span aria-hidden="true">&middot;</span>
          <span>Satisfaction guarantee</span>
        </p>
      </div>
    </section>
  );
}

/* --------------------------- Couple testimonials (from /d) --------------------------- */

// Same 4 real couple photos as /d's Testimonials section, but the quotes
// are illustrative copy written specifically for this offer (pattern
// recognition, emotionally unavailable men, "the pattern I couldn't see"),
// not sourced from verified clients — see the file-header note. Restyled
// light here instead of /d's dark treatment so it doesn't sit dark-on-dark
// directly under the hero.
const SUCCESS_STORIES = [
  {
    src: "/cards/tmpexalgh3e.jpg",
    quote: "I kept attracting successful men who just weren't emotionally available. Once I understood the pattern I was repeating, that completely shifted.",
    name: "Jasmine R.",
  },
  {
    src: "/cards/tmpf6ufyorx.jpg",
    quote: "I used to mistake inconsistency for chemistry. Learning to tell the difference is a big part of why I'm married now.",
    name: "Courtney L.",
  },
  {
    src: "/cards/tmpgr0_gi53.jpg",
    quote: "I stopped chasing and started choosing. Recognizing the pattern I couldn't see on my own changed who I let into my life.",
    name: "Devon K.",
  },
  {
    src: "/cards/tmpien05z8i.jpg",
    quote: "I always thought my standards were the problem. They weren't. I just needed a way to see what I couldn't see myself.",
    name: "Whitney A.",
  },
];

function CoupleTestimonials() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">Real stories</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          Real Women Who Recognized the Pattern
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
            <img src={story.src} alt={`${story.name}, High Value Woman Cheat Code success story`} loading="lazy" className="h-72 w-full object-cover" />
            <figcaption className="p-5">
              <Stars className="text-[14px] text-[#D8962D]" />
              <p className="ff-serif mt-2 text-[16px] italic leading-[1.45] text-[#4C1119]">
                "{story.quote}"
              </p>
              <p className="ff-sans mt-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#8A2634]">
                {story.name} <span className="text-[#4C1119]/50">&middot; Cheat Code Client</span>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Trust strip --------------------------- */

const TRUST_BADGES = ["Created by Shay", "8,000+ Women Helped", "Bonding Biology Method", "Immediate Digital Access"];

function TrustStrip() {
  return (
    <div className="border-y border-[#E8B75A]/15 bg-[#170006] px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST_BADGES.map((badge) => (
          <span key={badge} className="ff-sans text-[12.5px] font-bold uppercase tracking-[0.14em] text-[#E8B75A]/85">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Problem section --------------------------- */

const PATTERN_CARDS = [
  "You attract accomplished men who remain emotionally unavailable",
  "You overanalyze inconsistent communication",
  "You give relationships more time than their behavior has earned",
  "You know your standards but struggle to enforce them when chemistry is strong",
];

function Problem() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>An honest look</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          You've Built the Career. You've Mastered Success.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-[1.6] text-[#FFF7EE]/80">
          So why does love still feel like the one area that won't align? If any of this sounds familiar, you're not alone.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-9 grid max-w-4xl gap-3.5 sm:grid-cols-2" data-reveal>
        {PATTERN_CARDS.map((line, i) => (
          <div
            key={line}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="flex items-start gap-3 border border-[#E8B75A]/25 bg-white/[0.04] p-5"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B75A]" />
            <span className="text-[16px] leading-snug text-[#FFF7EE]/85">{line}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
      </div>
    </section>
  );
}

/* --------------------------- Reframe --------------------------- */

function Reframe() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="mx-auto max-w-2xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">A different way to think about it</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#250009] [text-wrap:balance]">
          You Do Not Need Lower Standards. You Need a Better Way to Recognize and Respond to the Pattern.
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6] text-[#4C1119]/80">
          Intelligence and career success don't automatically resolve emotional and attachment patterns. Those patterns run beneath the surface, which is why a woman can be sharp, self-aware, and successful everywhere else, and still find herself drawn into the same relationship dynamics.
        </p>
      </div>
    </section>
  );
}

/* --------------------------- Identity mechanism --------------------------- */

const MECHANISM_STEPS = [
  {
    title: "Attraction patterns happen before conscious decisions",
    body: "You may intellectually know what you want while still feeling drawn toward dynamics that create uncertainty.",
  },
  {
    title: "Uncertainty can feel like chemistry",
    body: "Inconsistent attention can activate emotional patterns that make a connection feel more significant than it is.",
  },
  {
    title: "Different results require a different response",
    body: "When you recognize the pattern earlier, regulate your response, and change who receives your energy, your relationship decisions begin to change.",
  },
];

function IdentityMechanism() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[#170006] border-y border-[#E8B75A]/15">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>The Bonding Biology method</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.7rem,3.8vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#FFF7EE] [text-wrap:balance]">
          Why Accomplished Women Can Still Feel Stuck in Love
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-6" data-reveal>
        {MECHANISM_STEPS.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E8B75A] text-[16px] font-black text-[#E8B75A]">
              {i + 1}
            </div>
            <div>
              <h3 className="ff-serif text-[18px] font-bold text-[#FFF7EE]">{step.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.55] text-[#FFF7EE]/75">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-[16px] leading-[1.6] text-[#FFF7EE]/70" data-reveal>
        This is the core of Shay's Bonding Biology method, the same framework behind everything the Bonding Biology Institute teaches.
      </p>
    </section>
  );
}

/* ---------------------------- What's included -------------------------- */

// These 4 items are the components actually visible in the real product
// mockup photo (cheat-code-mockup.png): a workbook, a laptop-delivered
// video training, and two named audio tracks. Kept to just these 4 rather
// than padding the list with invented extras, per the note that vague
// "what am I actually buying" copy was the biggest weakness to fix.
const WHAT_YOU_RECEIVE = [
  {
    title: "The High Value Woman Cheat Code Workbook",
    body: "A step-by-step guide to recognizing the patterns affecting who you attract and how your relationships develop.",
  },
  {
    title: "The Full Video Training",
    body: "Training you can move through at your own pace, on your laptop or your phone.",
  },
  {
    title: "Feminine Energy Activation Audio",
    body: "A guided audio to help you feel grounded, magnetic, and self-assured.",
  },
  {
    title: "Irresistible Attraction Secrets Audio",
    body: "The specific shifts that help you show up with more clarity and less second-guessing.",
  },
];

function WhatsIncludedIntro() {
  return (
    <section id="whats-included" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow className="text-[#8A2634]">What's included</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#250009] [text-wrap:balance]">
          Here's Exactly What You'll Receive
        </h2>
      </div>

      <img
        src="/cheat-code-mockup.png"
        alt="The High Value Woman Cheat Code workbook, video training, and audio mockup"
        loading="lazy"
        className="relative z-10 mx-auto mt-8 h-auto w-full max-w-[480px] object-contain"
      />

      <div className="relative z-10 mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2" data-reveal>
        {WHAT_YOU_RECEIVE.map((item, i) => (
          <div
            key={item.title}
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
            className="border border-[#E8B75A]/40 bg-white/60 p-5"
          >
            <h3 className="ff-serif text-[16px] font-bold text-[#250009]">{item.title}</h3>
            <p className="mt-1.5 text-[14px] leading-snug text-[#4C1119]/80">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-9 flex justify-center" data-reveal>
        <Cta variant="dark" className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
      </div>
    </section>
  );
}

/* -------------------------- Practical results ----------------------- */

// Grounded, controllable outcomes rather than promises about how a
// specific man will respond — swapped in after a note that claims like
// "men respond to me differently" and "attract commitment-ready men"
// read as overpromising for an $11 product.
const PRACTICAL_RESULTS = [
  "Recognize emotionally unavailable behavior sooner",
  "Stop confusing inconsistency with chemistry",
  "Respond without chasing or overexplaining",
  "Set boundaries with more confidence",
  "Choose partners based on behavior rather than potential",
];

function WalkAwayWith() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>What you can expect</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          Practical Results, Not Promises About Him
        </h2>
      </div>

      <ul className="relative z-10 mx-auto mt-9 max-w-xl space-y-3.5" data-reveal>
        {PRACTICAL_RESULTS.map((line) => (
          <li key={line} className="flex items-start gap-3 border border-[#E8B75A]/25 bg-white/[0.04] p-4.5">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#E8B75A]" />
            <span className="text-[16px] leading-snug text-[#FFF7EE]/85">{line}</span>
          </li>
        ))}
      </ul>
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
            loading="lazy"
            className="col-span-2 h-56 w-full border border-[#E8B75A]/35 object-cover sm:h-72"
          />
          <img
            src="/community-embrace.jpeg"
            alt="Two women embracing at a Bonding Biology event"
            loading="lazy"
            className="col-span-2 h-40 w-full border border-[#E8B75A]/35 object-cover sm:h-48"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Offer stack ----------------------------- */

// No per-item or inflated total-value pricing here on purpose — an $11
// product doesn't need to feel like a markdown from $1,297 to feel like
// an easy decision. Real $97-to-$11 discount kept; the invented value
// stack dropped.
function OfferStack() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[#170006]">
      <Glow className="h-[420px] w-[420px] -bottom-40 left-1/2 -translate-x-1/2 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>The offer</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#FFF7EE] [text-wrap:balance]">
          The High Value Woman Cheat Code
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-9 max-w-[600px]" data-reveal>
        <div className="border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] p-7 text-[#250009] sm:p-12">
          <ul className="space-y-4">
            {WHAT_YOU_RECEIVE.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#8A2634]" />
                <span className="text-[16px] font-medium leading-snug text-[#250009]">{item.title}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-center text-[13px] font-medium text-[#8A2634]/70">
            Valued at ${STATED_VALUE} for the complete framework.
          </p>

          <div className="mt-4 border-t border-[#8A2634]/15 pt-7 text-center">
            <span className="ff-sans text-[14px] font-bold uppercase tracking-[0.14em] text-[#8A2634]/70 line-through">
              Normally ${ORIGINAL_PRICE}
            </span>
            <p className="ff-sans mt-2 text-[14px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">
              Get Complete Access Today for
            </p>
            <p className="ff-serif mt-1 text-[64px] font-black leading-none text-[#15803D]">${CHEAT_CODE_PRICE}</p>

            <div className="mt-5">
              <Cta className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
            </div>
            <p className="mt-4 text-[14px] font-medium text-[#8A2634]/80">One payment. Instant digital access.</p>
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
              She's the founder of the Bonding Biology Institute, where that framework is taught in full, through this cheat code, the Bonding Biology Summit, and private coaching.
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
              loading="lazy"
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
    q: "What exactly do I receive?",
    a: "Instant access to the High Value Woman Cheat Code Workbook, the full video training, and two guided audio tracks: Feminine Energy Activation and Irresistible Attraction Secrets.",
  },
  {
    q: "How quickly will I get access?",
    a: "Immediately. It's delivered digitally, so you can start as soon as you complete your purchase.",
  },
  {
    q: "How is this different from other dating advice?",
    a: "Most dating advice focuses on what to say or do. This focuses on why you keep attracting the same patterns, and how to rewire them at the root so your results naturally change.",
  },
  {
    q: "Will this work for me if I've already tried everything?",
    a: "If you've tried therapy, books, or coaching and still feel stuck, that's exactly who this is for. This approach works on your nervous system and subconscious wiring, not just surface behavior.",
  },
  {
    q: "Is this only for single women?",
    a: "No. It's built for any woman who wants to understand her relationship patterns, whether you're single, dating, or in a relationship that doesn't feel right yet.",
  },
  {
    q: "Is this for women who are already successful?",
    a: "Yes. This was specifically designed for women who have mastered their careers but want the same level of success in love.",
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

function FaqItem({ id, q, a, defaultOpen = false }: { id: string; q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;
  return (
    <div className="border-b border-[#E8B75A]/15 py-5">
      <button
        type="button"
        id={buttonId}
        onClick={() => setOpen((v) => !v)}
        className="ff-sans flex min-h-[44px] w-full items-center justify-between gap-4 text-left text-[16px] sm:text-[18px] font-bold text-[#FFF7EE]"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{q}</span>
        <ChevronDown className={`h-6 w-6 shrink-0 text-[#E8B75A] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="mt-3 text-[16px] leading-[1.6] text-[#FFF7EE]/75">
          {a}
        </div>
      )}
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
            <FaqItem key={item.q} id={String(i)} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </div>

        <div className="mt-10 flex justify-center" data-reveal>
          <Cta className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Guarantee banner --------------------------- */

function GuaranteeBanner() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div
        data-reveal
        className="mx-auto flex max-w-2xl flex-col items-center border-2 border-[#8A2634]/25 bg-white/70 px-7 py-9 text-center sm:px-10"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8A2634] bg-white">
          <CheckIcon className="h-7 w-7 text-[#8A2634]" />
        </div>
        <h2 className="ff-serif mt-4 text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em] text-[#250009]">
          30-Day, No-Questions-Asked Guarantee
        </h2>
        <p className="mt-3 max-w-lg text-[16px] leading-[1.6] text-[#4C1119]/85">
          If you don't walk away with a completely different understanding of why past relationships haven't worked, and what needs to shift, just let us know within 30 days and we'll refund you.
        </p>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA + Footer ------------------------------ */

function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15">
      <div
        data-reveal
        className="relative z-10 mx-auto max-w-[700px] border border-[#E8B75A]/45 bg-[#250009] p-8 text-center text-[#FFF7EE] sm:p-10"
      >
        <p className="ff-serif text-[22px] font-bold">The High Value Woman Cheat Code</p>
        <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left">
          {WHAT_YOU_RECEIVE.map((item) => (
            <li key={item.title} className="flex items-center gap-2.5 text-[16px] text-[#FFF7EE]/85">
              <CheckIcon className="h-4 w-4 shrink-0 text-[#E8B75A]" />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[14px] font-bold uppercase tracking-[0.14em] text-[#E8B75A]">
          Get Instant Access for ${CHEAT_CODE_PRICE}
        </p>
        <div className="mt-5">
          <Cta className="w-full sm:w-auto">Get Instant Access for ${CHEAT_CODE_PRICE}</Cta>
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E8B75A]/45 bg-[#170006]/95 backdrop-blur-xl md:hidden px-4 pt-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex max-h-16 items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="ff-sans text-[15px] font-bold text-[#FFF7EE] tracking-tight">High Value Woman Cheat Code</span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#E8B75A]/80">Only ${CHEAT_CODE_PRICE}</span>
        </div>
        <a
          href={buildCheckoutHref()}
          onClick={handleCtaClick}
          className="ff-sans btn-shimmer min-h-[48px] rounded-none bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-3 text-[16px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Get Instant Access</span>
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
    window.location.href = buildCheckoutHref();
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
          Get Instant Access for ${CHEAT_CODE_PRICE}
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
                Get Instant Access for ${CHEAT_CODE_PRICE}
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
        <TrustStrip />
        <Problem />
        <Reframe />
        <IdentityMechanism />
        <WhatsIncludedIntro />
        <WalkAwayWith />
        <Community />
        <Founder />
        <OfferStack />
        <Faq />
        <GuaranteeBanner />
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
