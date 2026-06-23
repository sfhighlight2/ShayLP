"use client";

/**
 * BondingBiologyLanding.tsx
 * ------------------------------------------------------------------
 * A self-contained, high-conversion landing page for the
 * Bonding Biology Institute $27 workshop.
 *
 * Stack: React + Tailwind (zero-config — all colors use arbitrary
 * values, fonts + keyframes are injected via a single <style> tag).
 *
 * Email capture: every CTA opens an accessible modal that calls the
 * optional `onSubmit({ name, email })` prop. Wire this to your ESP /
 * backend. If omitted, it resolves a stubbed success so the page is
 * demoable immediately.
 *
 * NOTE ON CLAIMS: "2,000+ women coached", "★★★★★ rated", and the named
 * testimonials are carried over from the source. Substantiate or soften
 * these before running paid traffic (FTC / ad-platform compliance).
 * Search for  // ⚠ CLAIM  to find each spot.
 * ------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import starIcon from "@/assets/1.png";

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/RaF6Uj0AVUTaXjgiT7zM/webhook-trigger/597d218e-6d54-401a-8e31-996d527e270d";

type LeadData = {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  city: string;
  ageRange: string;
};

type Props = {
  onSubmit?: (data: LeadData) => Promise<void> | void;
  onStartQuiz: () => void;
};

/* ----------------------------- Icons ----------------------------- */

const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Check = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 6.5 9.5 17 4 11.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Spark = ({ className = "" }: { className?: string }) => (
  <img src={starIcon} alt="" className={`${className} object-contain`} aria-hidden="true" />
);

const Shield = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3 5 5.5v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9v-5L12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m9 11.8 2 2 4-4.2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Close = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="m6 6 12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={className} aria-label="five out of five stars">
    {"★★★★★"}
  </span>
);

/* --------------------------- Reveal hook -------------------------- */

function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
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

/* --------------------------- Small parts -------------------------- */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="ff-sans inline-block text-[12px] font-bold uppercase tracking-[0.22em] text-[#E8B75A]">
    {children}
  </span>
);

const Cta = ({
  onClick,
  children,
  variant = "gold",
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "gold" | "dark";
  className?: string;
}) => {
  const base =
    "ff-sans group btn-shimmer flex sm:inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-[15px] font-bold transition-all duration-300 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8D896] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const styles =
    variant === "gold"
      ? "bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.28)] hover:shadow-[0_22px_55px_rgba(232,183,90,0.42)] hover:-translate-y-0.5"
      : "bg-[#250009] text-[#FFF2EA] shadow-[0_14px_36px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:bg-[#310010]";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
      <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
};

/* ============================ Component =========================== */

export default function BondingBiologyLanding({ onSubmit, onStartQuiz }: Props) {
  useReveal();

  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => onStartQuiz(), [onStartQuiz]);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        const hasShown = sessionStorage.getItem("exit_intent_shown");
        if (!hasShown) {
          setExitIntentOpen(true);
          sessionStorage.setItem("exit_intent_shown", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="ff-sans relative min-h-screen overflow-x-clip bg-[#170006] text-[#FFF7EE] antialiased [scroll-behavior:smooth]">
      <StyleTag />
      <Grain />
      <CustomCursor />

      <Nav onJoin={openModal} />
      <Hero onJoin={openModal} />
      <CredibilityBar />
      <TrustBar />
      <WhoFor onJoin={openModal} />
      <WhatYouWillKnow />
      <Problem />
      <OfferIntro onJoin={openModal} />
      <WhyItWorks />
      <Testimonials onJoin={openModal} />
      <FinalCta />
      <Footer />

      <MobileBar onJoin={openModal} />
      <LeadModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
      <ExitIntentModal open={exitIntentOpen} onClose={() => setExitIntentOpen(false)} onSubmit={onSubmit} onStartQuiz={onStartQuiz} />
    </div>
  );
}

/* ------------------------------ Nav ------------------------------- */

function Nav({ onJoin }: { onJoin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Who it's for", "#who"],
    ["What you'll learn", "#curriculum"],
    ["The Science", "#science"],
    ["Reviews", "#reviews"],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8B75A]/20 bg-[#200008]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="block focus:outline-none">
          <img
            src="/Mainlogo.png"
            alt="Bonding Biology Institute Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link-reveal text-[14px] font-medium text-[#FFF7EE]/70 transition-colors hover:text-[#E8B75A]"
            >
              {label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onJoin}
            className="ff-sans inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F6D089_0%,#D99A35_100%)] px-5 py-2.5 text-[14px] font-bold text-[#250009] shadow-[0_10px_30px_rgba(232,183,90,0.25)] transition-transform hover:-translate-y-0.5"
          >
            <span>Show Me How</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none z-50 text-[#FFF7EE] hover:text-[#E8B75A] transition-colors relative"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-30 md:hidden flex flex-col bg-[#170006]/98 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="ff-serif text-[28px] font-medium tracking-tight text-[#FFF7EE] hover:text-[#E8B75A] transition-colors"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                onJoin();
              }}
              className="ff-sans mt-4 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-8 py-4 text-[16px] font-bold text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.25)] w-full max-w-xs"
            >
              <span>Show Me How</span>
              <ArrowRight className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-[#170006] bg-[url('/hero-bg.png')] bg-cover bg-[position:left_25%] bg-no-repeat px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24"
    >
      {/* Dark overlay for mobile readability */}
      <div className="absolute inset-0 bg-[#170006]/90 lg:hidden z-0 pointer-events-none" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Empty space on the left to push content to the right where the woman is not standing */}
        <div className="hidden lg:block" aria-hidden="true" />

        {/* Copy */}
        <div className="hero-stagger relative z-10 lg:pl-6">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <Eyebrow>5-day live workshop · replays included</Eyebrow>
          </div>
          <h1
            style={{ "--i": 1 } as React.CSSProperties}
            className="ff-serif mt-6 text-[clamp(2.6rem,6.4vw,4.9rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#FFF7EE] [text-wrap:balance]"
          >
            Lasting love isn't found. It's{" "}
            <em className="font-medium not-italic text-[#F1C97A] [font-style:italic]">
              built.
            </em>{" "}
            Here's how.
          </h1>
          <p
            style={{ "--i": 2 } as React.CSSProperties}
            className="mt-7 max-w-xl text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[#FFF7EE]/78 [text-wrap:balance]"
          >
            Inside the Bonding Biology workshop, you'll see the exact pattern that
            turns early attraction into commitment that actually stabilizes, and
            how to build it yourself. No chasing. No performing. No pretending
            you want less than you do.
          </p>
          <div
            style={{ "--i": 3 } as React.CSSProperties}
            className="mt-9 flex flex-col items-start gap-4 w-full"
          >
            <Cta onClick={onJoin} className="w-full sm:w-auto">Show Me How</Cta>
          </div>
          <p
            style={{ "--i": 4 } as React.CSSProperties}
            className="mt-5 text-[14px] font-medium text-[#FFF7EE]/65"
          >
            Free workshop · Replays included · Instant access
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Credibility Bar ------------------------- */

function CredibilityBar() {
  return (
    <div className="border-y border-[#E8B75A]/20 bg-[#250009] py-6 relative z-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-around gap-y-6 px-5 text-center sm:px-8 md:flex-row md:gap-y-0">
        <div className="flex flex-col items-center">
          <span className="ff-serif text-[30px] font-bold text-[#E8B75A] leading-none">
            2,000+
          </span>
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFF7EE]/60">
            Women Coached
          </span>
        </div>
        <div className="h-8 w-[1px] bg-[#E8B75A]/20 hidden md:block" />
        <div className="flex flex-col items-center">
          <span className="ff-serif text-[30px] font-bold text-[#E8B75A] leading-none">
            ★★★★★
          </span>
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFF7EE]/60">
            Top Rated Program
          </span>
        </div>
        <div className="h-8 w-[1px] bg-[#E8B75A]/20 hidden md:block" />
        <div className="flex flex-col items-center">
          <span className="ff-serif text-[30px] font-bold text-[#E8B75A] leading-none">
            100%
          </span>
          <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FFF7EE]/60">
            Biology-Based
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Trust bar ---------------------------- */

function TrustBar() {
  const logos = [
    "/logos/Logo_1.avif",
    "/logos/image_1121.avif",
    "/logos/image_1122.avif",
    "/logos/image_1123.avif",
    "/logos/image_1124.avif",
  ];
  // Repeat the logos array a few times to ensure smooth scrolling coverage
  const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="bg-[#f9e9e3] py-9 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#250009]/50 mb-7">
          As Featured In & Trusted By
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex gap-20 items-center">
            {/* First sequence */}
            {marqueeLogos.map((src, i) => (
              <img
                key={`logo-1-${i}`}
                src={src}
                alt="Partner Logo"
                className="h-14 md:h-16 w-auto object-contain opacity-55 grayscale contrast-125 transition-opacity hover:opacity-95"
              />
            ))}
            {/* Duplicate sequence for seamless loop */}
            {marqueeLogos.map((src, i) => (
              <img
                key={`logo-2-${i}`}
                src={src}
                alt="Partner Logo"
                className="h-14 md:h-16 w-auto object-contain opacity-55 grayscale contrast-125 transition-opacity hover:opacity-95"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Who it's for ------------------------- */

function WhoFor({ onJoin }: { onJoin: () => void }) {
  const cards = [
    {
      title: "High Standards",
      c: "You're accomplished and self-aware, yet commitment still runs hot and cold. The problem isn't your standards.",
      image: "/cards/tmpexalgh3e.jpg",
    },
    {
      title: "Zero Games",
      c: "You're done with scripts and 'be less available.' You want something real, not a performance.",
      image: "/cards/tmpf6ufyorx.jpg",
    },
    {
      title: "Real Mechanism",
      c: "You want a pattern you can understand, not a personality you have to fake.",
      image: "/cards/tmpgr0_gi53.jpg",
    },
    {
      title: "True Connection",
      c: "You're ready to stop auditioning for love and let commitment reveal itself.",
      image: "/cards/tmpien05z8i.jpg",
    },
  ];

  return (
    <section id="who" className="px-5 py-24 sm:px-8 overflow-hidden">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Who this is for</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(2rem,4.5vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]">
          For the woman who looks together — but love still feels like the one
          area she can’t control.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.55] text-[#FFF7EE]/72">
          If these four feel uncomfortably accurate, this workshop was built for
          your nervous system, your standards, and your pace.
        </p>
      </div>

      {/* 4-Card Responsive Grid */}
      <div className="mx-auto mt-12 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative flex flex-col overflow-hidden rounded-lg bg-[#f0dbd0] text-[#250009] shadow-xl border border-[#250009]/10"
            >
              {/* Image Header with Hover Scale (taking 65% of the card area height or aspect ratio) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="ff-serif text-[19px] font-bold leading-tight text-[#250009]">
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p className="mt-2 text-[14px] leading-relaxed text-[#250009]/85">
                    {card.c}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Centered CTA below grid */}
        <div className="mt-12 flex justify-center">
          <Cta onClick={onJoin} className="w-full sm:w-auto">
            Get Started Free
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- What you will know ----------------------- */

function WhatYouWillKnow() {
  return (
    <section id="curriculum" className="relative bg-[linear-gradient(180deg,#FFFDFB_0%,#F9E9E3_100%)] border-y border-[#E8B75A]/15 overflow-hidden">
      {/* Subtle Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-[url('/offer-banner.avif')] bg-cover bg-center opacity-[0.12] pointer-events-none mix-blend-multiply" 
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-20 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-24 items-end">
        {/* Left column - Copy + Video Embed */}
        <div className="lg:col-span-7 pb-20 sm:pb-24 lg:pb-32" data-reveal>
          <h2 className="ff-serif text-[clamp(2rem,4.5vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#250009]">
            You don't have a dating problem. You have a bonding problem.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-[#250009]/75 max-w-xl">
            The 5-day Bonding Biology workshop helps you see exactly where your pattern is interrupting connection before you invest more effort.
          </p>

          <div className="relative mt-8 w-full aspect-video rounded-2xl overflow-hidden border border-[#E8B75A]/25 bg-black shadow-2xl z-10">
            <iframe
              src="https://player.vimeo.com/video/871282339?h=615ce06ef0&title=0&byline=0&portrait=0"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Bonding Biology Workshop Video"
            ></iframe>
          </div>
        </div>

        {/* Right column - Image */}
        <div className="lg:col-span-5 h-full flex items-end justify-center lg:justify-end relative" data-reveal style={{ transitionDelay: "150ms" }}>
          {/* Soft Blurred Glow Effect Behind Image */}
          <div className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] opacity-35 blur-[70px] bottom-10 left-1/2 -translate-x-1/2 z-0 pointer-events-none" />
          
          <img
            src="/shay-know.png"
            alt="Shay Know What Fits"
            className="w-full max-w-[340px] lg:max-w-full object-contain block translate-y-2 lg:translate-y-4 relative z-10"
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------- The problem -------------------------- */

function Problem() {
  return (
    <section className="px-5 pt-12 pb-0 sm:px-8 sm:pt-16 sm:pb-0">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#E8B75A]/35 bg-[#FFF2EA]/[0.05] md:grid-cols-2">
        <div
          data-reveal
          className="border-b border-[#E8B75A]/20 bg-black/15 p-9 md:border-b-0 md:border-r"
        >
          <Eyebrow>What you’ve been told</Eyebrow>
          <h3 className="ff-serif mt-4 text-[clamp(1.7rem,3.5vw,2.3rem)] font-semibold tracking-[-0.03em]">
            It’s a dating problem.
          </h3>
          <p className="mt-4 text-[17px] leading-[1.55] text-[#FFF7EE]/60">
            Be cooler. Text less. Act busier. Lower your standards. Keep him
            guessing. Don’t care so much.
          </p>
        </div>
        <div
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className="bg-[linear-gradient(135deg,rgba(255,242,234,0.14)_0%,rgba(232,183,90,0.1)_100%)] p-9"
        >
          <Eyebrow>What’s actually happening</Eyebrow>
          <h3 className="ff-serif mt-4 text-[clamp(1.9rem,4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#F8D896]">
            It’s a bonding problem.
          </h3>
          <p className="mt-4 text-[17px] leading-[1.55] text-[#FFF7EE]/80">
            Your biology may be signaling pressure where it wants safety,
            performance where it wants warmth, and proving where it wants
            receptivity. Fix the bonding sequence and love stops feeling like a
            negotiation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Offer intro -------------------------- */

function OfferIntro({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
      <div
        data-reveal
        className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] text-[#250009] lg:grid-cols-12"
      >
        {/* Left Side - Copy Content (2/3 -> 8 cols) */}
        <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:col-span-8 lg:p-20 text-left">
          <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#8A2634]">
            The offer
          </span>
          <h2 className="ff-serif mt-6 text-[clamp(2.1rem,4vw,3.3rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#250009]">
            Make love feel less like luck — and more like a pattern.
          </h2>
          <p className="mt-6 max-w-xl text-[16.5px] leading-[1.55] text-[#4C1119]/80">
            Not theory. Not slogans. Not affirmations. A practical five-day reset
            that shows you what creates chemistry, what builds safety, and what
            makes commitment feel natural instead of forced.
          </p>

          {/* Simple 3-step visual plan */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full border-t border-[#8A2634]/15 pt-6 text-left">
            <div className="flex gap-3">
              <span className="ff-serif text-[24px] font-bold text-[#8A2634]">1.</span>
              <div>
                <h4 className="font-bold text-[14.5px] text-[#250009]">Join the Workshop</h4>
                <p className="text-[12.5px] text-[#4C1119]/70 leading-normal mt-0.5">5 days of live, immersive sessions.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="ff-serif text-[24px] font-bold text-[#8A2634]">2.</span>
              <div>
                <h4 className="font-bold text-[14.5px] text-[#250009]">Learn the Sequence</h4>
                <p className="text-[12.5px] text-[#4C1119]/70 leading-normal mt-0.5">Discover the biological bonding roadmap.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="ff-serif text-[24px] font-bold text-[#8A2634]">3.</span>
              <div>
                <h4 className="font-bold text-[14.5px] text-[#250009]">Secure Commitment</h4>
                <p className="text-[12.5px] text-[#4C1119]/70 leading-normal mt-0.5">Stop interrupting commitment naturally.</p>
              </div>
            </div>
          </div>

          <Cta onClick={onJoin} variant="dark" className="w-full sm:w-auto mt-9">
            Get Started Free
          </Cta>
        </div>

        {/* Right Side - Image Banner (1/3 -> 4 cols) */}
        <div className="relative min-h-[300px] lg:col-span-4 lg:min-h-full">
          <img
            src="/offer-banner.avif"
            alt="Offer Banner"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Why it works ------------------------- */

function WhyItWorks() {
  const steps = [
    {
      n: "01",
      title: "Dopamine",
      body: "Creates the spark — curiosity, attention, pursuit, and the feeling that something is alive.",
      featured: false,
    },
    {
      n: "02",
      title: "Vasopressin",
      body: "Deepens attachment — the brain begins mapping you as familiar, meaningful, and worth protecting.",
      featured: false,
    },
    {
      n: "03",
      title: "Safety",
      body: "Makes commitment plausible — love stops feeling like risk and starts feeling like home.",
      featured: true,
    },
  ];
  return (
    <section id="science" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <Eyebrow>Why this works</Eyebrow>
        <h2 className="ff-serif mt-5 text-[clamp(2rem,4.5vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]">
          Commitment is not a mystery. It is a biological sequence.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.55] text-[#FFF7EE]/72">
          When chemistry feels safe instead of pressured, the body moves from
          novelty to attachment. That’s the pathway this workshop teaches you to
          stop interrupting.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            data-reveal
            style={{ transitionDelay: `${i * 110}ms` }}
            className={`luxury-card rounded-lg border p-7 ${
              s.featured
                ? "border-[#E8B75A]/75 bg-[linear-gradient(145deg,rgba(232,183,90,0.24)_0%,rgba(255,242,234,0.1)_100%)]"
                : "border-[#E8B75A]/30 bg-[#FFF2EA]/[0.06]"
            }`}
          >
            <h3 className="ff-serif text-[clamp(1.5rem,2.6vw,1.9rem)] font-semibold tracking-[-0.03em]">
              {s.title}
            </h3>
            <p className="mt-3 text-[16px] leading-[1.5] text-[#FFF7EE]/72">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* Founder credibility */}
      <div
        data-reveal
        className="mx-auto mt-6 flex max-w-6xl flex-col items-center gap-7 rounded-3xl border border-[#E8B75A]/55 bg-[#FFF2EA]/95 p-7 text-[#250009] sm:flex-row sm:p-8"
      >
        <div className="flex-1">
          <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A2634]">
            Founder credibility
          </span>
          <h3 className="ff-serif mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-[1.05] tracking-[-0.04em]">
            Built from coaching patterns observed across 2,000+ high-achieving
            women. {/* ⚠ CLAIM */}
          </h3>
          <p className="mt-4 text-[16px] leading-[1.45] text-[#4C1119]">
            The workshop translates the repeatable patterns behind men
            committing first — without turning love into manipulation or
            performance.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-2xl bg-[#250009] px-8 py-7 text-center sm:w-56">
          <span className="ff-serif text-[clamp(2.6rem,5vw,3rem)] font-bold leading-[0.95] tracking-[-0.05em] text-[#F8D896]">
            2,000+
          </span>
          <span className="ff-sans mt-1 text-[13px] font-bold text-[#FFF7EE]/72">
            women coached {/* ⚠ CLAIM */}
          </span>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Testimonials ------------------------- */

function Testimonials({ onJoin }: { onJoin: () => void }) {
  // ⚠ CLAIM — substantiate or anonymize before running paid traffic.
  const quotes = [
    {
      q: "He brought up exclusivity first. I didn’t have to convince him, decode him, or pretend I was fine with less.",
      name: "Maya R.",
      location: "Austin, TX",
      status: "now engaged",
      initials: "MR",
    },
    {
      q: "I stopped trying to be the perfect woman and started noticing what made him feel safe to come closer.",
      name: "Danielle K.",
      location: "Miami, FL",
      status: "married in 2025",
      initials: "DK",
    },
    {
      q: "The biggest shift was calm. I finally understood how to stop creating pressure in the moments I wanted closeness.",
      name: "Ari L.",
      location: "San Francisco, CA",
      status: "committed relationship",
      initials: "AL",
    },
  ];
  return (
    <section id="reviews" className="relative px-5 py-24 sm:px-8 bg-[#f9e9e3] overflow-hidden text-[#250009] border-y border-[#E8B75A]/15">
      {/* Subtle Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-[url('/offfer-banner-original.avif')] bg-cover bg-center opacity-[0.12] pointer-events-none mix-blend-multiply" 
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center" data-reveal>
        <span className="ff-sans inline-block text-[12px] font-bold uppercase tracking-[0.22em] text-[#8A2634]">
          Men committing first
        </span>
        <h2 className="ff-serif mt-5 text-[clamp(2rem,4.5vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#250009]">
          The proof mirrors the promise.
        </h2>
      </div>
      <div className="relative z-10 mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
        {quotes.map((t, i) => (
          <figure
            key={t.name}
            data-reveal
            style={{ transitionDelay: `${i * 100}ms` }}
            className="luxury-card flex flex-col rounded-lg border border-[#E8B75A]/30 bg-white/40 backdrop-blur-[3px] p-7 shadow-sm"
          >
            <Stars className="text-[15px] text-[#D8962D]" />
            <blockquote className="ff-serif mt-4 flex-1 text-[clamp(1.25rem,2.2vw,1.55rem)] font-semibold italic leading-[1.18] tracking-[-0.025em] text-[#250009]">
              “{t.q}”
            </blockquote>
            
            {/* Enhanced Trust Captions with Avatar Initial Badge */}
            <div className="flex items-center gap-3.5 mt-6 border-t border-[#250009]/10 pt-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#250009_0%,#4C1119_100%)] text-[#E8B75A] font-bold text-[13px] border border-[#E8B75A]/25">
                {t.initials}
              </div>
              <div className="text-left">
                <figcaption className="ff-sans text-[12.5px] font-bold uppercase tracking-[0.05em] text-[#8A2634] leading-tight">
                  {t.name}
                </figcaption>
                <p className="text-[11.5px] text-[#250009]/65 font-medium mt-0.5 leading-snug">
                  {t.location} · {t.status}
                </p>
              </div>
            </div>
          </figure>
        ))}
      </div>
      <div className="relative z-10 mt-10 flex justify-center px-5 sm:px-0" data-reveal>
        <Cta onClick={onJoin} variant="dark" className="w-full sm:w-auto">Get Started Free</Cta>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA ---------------------------- */

function FinalCta() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    city: "",
    ageRange: "",
  });
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.email.includes("@")) {
        setEmailError("Please enter a valid email address containing '@'.");
        return;
      }
      setEmailError("");
      if (formData.name && formData.email && formData.phone) {
        // Send step 1 data to GHL webhook
        fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            step: 1,
            formSource: "final_cta"
          }),
        }).catch((err) => console.error("Webhook error:", err));

        setStep(2);
      }
      return;
    }
    if (formData.name && formData.email && formData.phone && formData.occupation && formData.city && formData.ageRange) {
      setStatus("loading");
      try {
        await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            occupation: formData.occupation.trim(),
            city: formData.city.trim(),
            ageRange: formData.ageRange,
            step: 2,
            formSource: "final_cta"
          }),
        });
      } catch (err) {
        console.error("Webhook error:", err);
      }
      setStatus("success");
    }
  };

  return (
    <section id="join" className="px-5 py-24 sm:px-8">
      <div
        data-reveal
        className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#E8B75A]/45 bg-[linear-gradient(180deg,rgba(255,242,234,0.97)_0%,rgba(255,229,218,0.92)_100%)] text-[#250009] lg:grid-cols-12"
      >
        {/* Left Side - Copy Content (2/3 -> 8 cols) */}
        <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:col-span-8 lg:p-20 text-left">
          <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#8A2634]">
            Love isn’t luck
          </span>
          <h2 className="ff-serif mt-6 text-[clamp(2.1rem,4vw,3.3rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#250009]">
            It follows patterns. Learn the one that makes commitment feel safe.
          </h2>

          {status === "success" ? (
            <div className="mt-8 w-full max-w-md py-6 text-left border-t border-[#E8B75A]/20">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#8D2331] text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[#250009] text-[17px]">Profile Created Successfully!</h4>
                  <p className="mt-1 text-[14.5px] text-[#4C1119]/80 leading-normal">
                    Check your inbox for your $27 access details and portal link.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 w-full max-w-md text-left">
              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
                {step === 1 ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarah@example.com"
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50"
                      />
                      {emailError && (
                        <p className="mt-1.5 text-[13px] font-semibold text-[#9B1B2B]">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="ff-sans mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#250009] px-6 py-3.5 text-[15px] font-bold text-[#FFF2EA] transition-all hover:bg-[#380010] hover:-translate-y-0.5"
                    >
                      Get Started Free
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        required
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Age Range</label>
                      <select
                        name="ageRange"
                        required
                        value={formData.ageRange}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#250009]/15 bg-white/60 px-4 py-3 text-[14.5px] text-[#250009] outline-none transition-shadow focus:border-[#B9842F] focus:ring-1 focus:ring-[#B9842F]/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%23250009%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10"
                      >
                        <option value="" disabled>Select your age range</option>
                        <option value="Under 25">Under 25</option>
                        <option value="25 - 34">25 - 34</option>
                        <option value="35 - 44">35 - 44</option>
                        <option value="45 - 54">45 - 54</option>
                        <option value="55+">55+</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="ff-sans mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#250009] px-6 py-3.5 text-[15px] font-bold text-[#FFF2EA] transition-all hover:bg-[#380010] hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? "Processing..." : "Get Started Free"}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[17px] w-[17px]" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
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
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-[13px] font-bold text-[#8A2634]/80">
            <span className="flex items-center gap-1.5">
              <Stars className="text-[#D8962D]" /> rated {/* ⚠ CLAIM */}
            </span>
            <span>Free workshop · Replays included · Instant access</span>
          </div>
        </div>

        {/* Right Side - Image Banner (1/3 -> 4 cols) */}
        <div className="relative min-h-[300px] lg:col-span-4 lg:min-h-full">
          <img
            src="/final-cta-banner.jpg"
            alt="Final CTA Banner"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Footer ---------------------------- */

function Footer() {
  return (
    <footer className="border-t border-[#E8B75A]/15 px-5 py-10 text-center sm:px-8">
      <p className="ff-serif text-[18px] font-semibold tracking-[-0.02em]">
        Bonding Biology Institute
      </p>
      <p className="mt-2 text-[13px] text-[#FFF7EE]/45">
        © {new Date().getFullYear()} Bonding Biology Institute. All rights
        reserved.
      </p>
    </footer>
  );
}

/* --------------------------- Mobile bar --------------------------- */

function MobileBar({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8B75A]/45 bg-[#170006]/95 backdrop-blur-xl md:hidden px-4 py-3.5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="ff-sans text-[15px] font-bold text-[#FFF7EE] tracking-tight">
            $27 Workshop Access
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Stars className="text-[12px] text-[#E8B75A]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8B75A]/80">2k+ Coached</span>
          </div>
        </div>
        <button
          onClick={onJoin}
          className="ff-sans btn-shimmer rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-3 text-[14.5px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- Modal ------------------------------ */

function LeadModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: LeadData) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset transient state whenever the modal closes.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setPhone("");
        setOccupation("");
        setCity("");
        setAgeRange("");
        setEmailError("");
        setStep(1);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC to close + lock body scroll + focus management.
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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!email.includes("@")) {
        setEmailError("Please enter a valid email address containing '@'.");
        return;
      }
      setEmailError("");
      if (name && email && phone) {
        // Send step 1 data to GHL webhook
        fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            step: 1,
            formSource: "lead_modal"
          }),
        }).catch((err) => console.error("Webhook error:", err));

        setStep(2);
      }
      return;
    }
    if (status === "loading") return;
    setStatus("loading");
    try {
      // Send step 2 data to GHL webhook
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          city: city.trim(),
          ageRange: ageRange,
          step: 2,
          formSource: "lead_modal"
        }),
      });

      if (onSubmit) {
        await onSubmit({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          city: city.trim(),
          ageRange: ageRange,
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        className="modal-overlay absolute inset-0 bg-[#0E0004]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="modal-card relative w-full max-w-md overflow-hidden rounded-lg border border-[#E8B75A]/55 bg-[linear-gradient(180deg,#FFF7EE_0%,#FFE9DD_100%)] p-7 text-[#250009] shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#6E1622] transition-colors hover:bg-[#250009]/10"
        >
          <Close className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#250009]">
              <Check className="h-7 w-7 text-[#F8D896]" />
            </div>
            <h3 id="lead-modal-title" className="ff-serif mt-5 text-[28px] font-bold tracking-[-0.03em]">
              You’re on the list.
            </h3>
            <p className="mt-3 text-[15.5px] leading-[1.5] text-[#4C1119]">
              Check your inbox for your access details and the live workshop
              schedule. (Look in promotions if you don’t see it.)
            </p>
            <button
              onClick={onClose}
              className="ff-sans mt-7 w-full rounded-2xl bg-[#250009] px-6 py-3.5 text-[15px] font-bold text-[#FFF2EA] transition-colors hover:bg-[#380010]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#8A2634]">
              Instant access
            </span>
            <h3
              id="lead-modal-title"
              className="ff-serif mt-3 text-[clamp(1.7rem,5vw,2rem)] font-bold leading-[1.05] tracking-[-0.04em]"
            >
              Get started free in the workshop.
            </h3>
            <p className="mt-2 text-[15px] leading-[1.45] text-[#4C1119]">
              Enter your details and we’ll send your access link right away.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              {step === 1 ? (
                <>
                  <div>
                    <label htmlFor="lead-name" className="sr-only">
                      Full name
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
                    />
                    {emailError && (
                      <p className="mt-1.5 text-[13px] font-semibold text-[#9B1B2B]">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ff-sans flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.4)] transition-all hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight className="h-[17px] w-[17px]" />
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="lead-occupation" className="sr-only">
                      Occupation
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="lead-occupation"
                      type="text"
                      required
                      placeholder="Occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-city" className="sr-only">
                      City
                    </label>
                    <input
                      id="lead-city"
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-[#250009]/15 bg-white px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/40 focus:border-[#D8962D] focus:ring-2 focus:ring-[#E8B75A]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-ageRange" className="sr-only">
                      Age Range
                    </label>
                    <select
                      id="lead-ageRange"
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
                        <Spinner /> Getting started…
                      </>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="h-[17px] w-[17px]" />
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

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[12.5px] font-medium text-[#6E1622]/80">
              <Shield className="h-4 w-4" />
              7-day money-back guarantee · No spam, unsubscribe anytime
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ExitIntentModal({
  open,
  onClose,
  onSubmit,
  onStartQuiz,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: LeadData) => Promise<void> | void;
  onStartQuiz: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset transient state whenever the modal closes.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setPhone("");
        setEmailError("");
        setStep(1);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC to close + lock body scroll + focus management.
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
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!email.includes("@")) {
        setEmailError("Please enter a valid email address containing '@'.");
        return;
      }
      setEmailError("");
      if (name && email && phone) {
        // Send step 1 data to GHL webhook
        fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            step: 1,
            formSource: "exit_intent_modal"
          }),
        }).catch((err) => console.error("Webhook error:", err));

        setStep(2);
      }
      return;
    }
    if (status === "loading") return;
    setStatus("loading");
    try {
      // Send step 2 data to GHL webhook
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          city: city.trim(),
          ageRange: ageRange,
          step: 2,
          formSource: "exit_intent_modal"
        }),
      });

      if (onSubmit) {
        await onSubmit({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          city: city.trim(),
          ageRange: ageRange,
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        className="modal-overlay absolute inset-0 bg-[#0E0004]/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="modal-card relative w-full max-w-lg overflow-hidden rounded-lg border border-[#E8B75A]/60 bg-[linear-gradient(135deg,#1D0008_0%,#3C0816_100%)] p-7 text-[#FFF7EE] shadow-[0_40px_120px_rgba(0,0,0,0.85)] sm:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#E8B75A]/70 transition-colors hover:bg-white/10 hover:text-[#E8B75A]"
        >
          <Close className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E8B75A]/20 border border-[#E8B75A]">
              <Check className="h-8 w-8 text-[#E8B75A]" />
            </div>
            <h3 id="exit-modal-title" className="ff-serif mt-6 text-[32px] font-bold tracking-[-0.03em] text-[#E8B75A]">
              Access Granted.
            </h3>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#FFF7EE]/80 max-w-md mx-auto">
              We've sent Day 1 of the Bonding Biology Workshop directly to your inbox.
              Begin changing your relationship patterns today.
            </p>
            <button
              onClick={onClose}
              className="ff-sans mt-8 w-full rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15px] font-bold text-[#250009] transition-all hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(232,183,90,0.3)]"
            >
              Start Learning Free
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[#E8B75A] font-bold tracking-[0.18em] text-[11px] uppercase">
              <Spark className="h-4 w-4" />
              <span>Wait! Before you go...</span>
            </div>
            <h3
              id="exit-modal-title"
              className="ff-serif mt-4 text-[clamp(1.8rem,5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[#FFF7EE]"
            >
              Get Day 1 of the Bonding Biology Workshop <span className="text-[#E8B75A] underline decoration-wavy decoration-[#E8B75A]/40 decoration-1">Free</span>.
            </h3>
            <p className="mt-3 text-[15.5px] leading-[1.55] text-[#FFF7EE]/75">
              Don't leave empty-handed. Experience the first day of our flagship workshop (usually paid) at zero cost. Discover the exact chemistry sequence.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <label htmlFor="exit-name" className="sr-only">
                      Full name
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="exit-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="exit-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="exit-email"
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                    />
                    {emailError && (
                      <p className="mt-1.5 text-[13px] font-medium text-[#FF5D73]">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="exit-phone" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="exit-phone"
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ff-sans flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.3)] transition-all hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight className="h-[17px] w-[17px]" />
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="exit-occupation" className="sr-only">
                      Occupation
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="exit-occupation"
                      type="text"
                      required
                      placeholder="Occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="exit-city" className="sr-only">
                      City
                    </label>
                    <input
                      id="exit-city"
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="exit-ageRange" className="sr-only">
                      Age Range
                    </label>
                    <select
                      id="exit-ageRange"
                      required
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%23FFF7EE%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat pr-10 text-[#FFF7EE]/70"
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
                    <p className="text-[13.5px] font-semibold text-[#FF5D73]">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="ff-sans mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15.5px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.3)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <Spinner /> Getting started…
                      </>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="h-[17px] w-[17px]" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[13px] font-semibold text-[#E8B75A] hover:underline block mx-auto mt-2 bg-transparent border-0 cursor-pointer"
                  >
                    ← Back to details
                  </button>
                </>
              )}
            </form>

            <div className="mt-4 border-t border-[#E8B75A]/20 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartQuiz();
                }}
                className="ff-sans flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E8B75A]/45 bg-transparent px-6 py-3.5 text-[15px] font-bold text-[#E8B75A] transition-all hover:bg-[#E8B75A]/10 active:scale-95 cursor-pointer"
              >
                Take the 90-Sec Quiz Instead
                <ArrowRight className="h-[17px] w-[17px]" />
              </button>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-center text-[12.5px] font-medium text-[#FFF7EE]/60">
              <Shield className="h-4 w-4 text-[#E8B75A]" />
              No credit card required · Free instant digital access
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const Spinner = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

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

/* ----------------- Atmosphere: grain + fonts + keyframes ---------- */

function Grain() {
  // Subtle film-grain overlay for depth. Pointer-events none, very low opacity.
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap');
      @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');

      .ff-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; font-weight: 500 !important; }
      .ff-sans  { font-family: 'Satoshi', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }

      /* Body default to Satoshi with a graceful fallback */
      .ff-sans, .ff-sans :where(p, span, a, li, button, input, summary, label) {
        font-family: 'Satoshi', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
      }

      /* Scroll-reveal */
      [data-reveal] {
        opacity: 0;
        transform: translateY(26px);
        transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [data-reveal].is-visible { opacity: 1; transform: none; }

      /* Hero load stagger */
      .hero-stagger > * {
        opacity: 0;
        transform: translateY(20px);
        animation: heroIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: calc(var(--i, 0) * 110ms + 120ms);
      }
      @keyframes heroIn {
        to { opacity: 1; transform: none; }
      }

      /* Modal entrance */
      .modal-overlay { animation: fadeIn 0.25s ease forwards; }
      .modal-card { animation: popIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: none; }
      }

      /* Scrolling marquee for trust logos */
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: flex;
        width: max-content;
        animation: marquee 75s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }

      /* Luxury Glow & Hover Transitions */
      .luxury-card {
        position: relative;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      .luxury-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(232, 183, 90, 0.08) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      .luxury-card:hover {
        transform: translateY(-5px) scale(1.015);
        border-color: rgba(232, 183, 90, 0.65) !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45), 0 0 35px rgba(232, 183, 90, 0.09);
      }
      .luxury-card:hover::before {
        opacity: 1;
      }

      /* Gold shimmer / sweep animation for buttons on hover */
      .btn-shimmer {
        position: relative;
        overflow: hidden;
      }
      .btn-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.25),
          transparent
        );
        transform: skewX(-20deg);
        transition: none;
      }
      .btn-shimmer:hover::after {
        left: 150%;
        transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }

      /* Premium line reveal animation for nav and text links */
      .nav-link-reveal {
        position: relative;
      }
      .nav-link-reveal::after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1.5px;
        bottom: -4px;
        left: 0;
        background: linear-gradient(90deg, #F8D896, #D8962D);
        transform-origin: bottom right;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .nav-link-reveal:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-stagger > *, [data-reveal], .modal-card, .modal-overlay {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        .animate-marquee {
          animation: none !important;
          transform: none !important;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
        }
      }

      @media (hover: hover) {
        body, a, button, select, input, [role="button"] {
          cursor: none !important;
        }
      }
    `}</style>
  );
}

function CustomCursor() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(hover: hover)");
    if (!media.matches) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "SELECT" ||
        target.tagName === "INPUT" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".group")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed pointer-events-none z-[9999] h-1.5 w-1.5 rounded-full bg-[#E8B75A] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${hovered ? 1.5 : 1})`,
        }}
      />
      {/* Outer Follower Ring */}
      <div
        className="fixed pointer-events-none z-[9999] h-8 w-8 rounded-full border border-[#E8B75A]/60 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${hovered ? 1.4 : 1})`,
          backgroundColor: hovered ? "rgba(232, 183, 90, 0.08)" : "transparent",
        }}
      />
    </>
  );
}
