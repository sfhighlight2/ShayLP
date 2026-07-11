"use client";

/**
 * BondingBiologyLandingC.tsx
 * ------------------------------------------------------------------
 * "/c" variant — identical to BondingBiologyLandingB.tsx (the "/b"
 * variant) except for the Hero section, which is centered and leads
 * with the bonding-problem video instead of the right-aligned copy
 * block. Intentionally a full duplicate (not a shared component) so
 * neither "/" nor "/b" is ever at risk of changing.
 *
 * Stack: React + Tailwind (zero-config — all colors use arbitrary
 * values, fonts + keyframes are injected via a single <style> tag).
 *
 * NOTE ON CLAIMS: "8,000+ women coached", "★★★★★ rated", and the named
 * testimonials are carried over from the source. Substantiate or soften
 * these before running paid traffic (FTC / ad-platform compliance).
 * Search for  // ⚠ CLAIM  to find each spot.
 * ------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

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

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={className} aria-label="five out of five stars">
    {"★★★★★"}
  </span>
);

const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M7 5.5v13a1 1 0 0 0 1.53.85l10.5-6.5a1 1 0 0 0 0-1.7l-10.5-6.5A1 1 0 0 0 7 5.5Z" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 6.5 9.5 17 4 11.5"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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

export default function BondingBiologyLandingC() {
  useReveal();
  const navigate = useNavigate();

  const goToApply = useCallback(
    (source: string) => navigate(`/b/offer?variant=c&source=${source}`),
    [navigate]
  );

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        const hasShown = sessionStorage.getItem("exit_intent_shown_c");
        if (!hasShown) {
          sessionStorage.setItem("exit_intent_shown_c", "true");
          navigate("/b/offer?variant=c&source=exit_intent");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [navigate]);

  return (
    <div className="ff-sans relative min-h-screen overflow-x-clip bg-[#170006] text-[#FFF7EE] antialiased [scroll-behavior:smooth]">
      <StyleTag />
      <Grain />
      <CustomCursor />

      <Nav onJoinDesktop={() => goToApply("nav_desktop")} onJoinMobile={() => goToApply("nav_mobile")} />
      <Hero onJoin={() => goToApply("hero")} />
      <CredibilityBar />
      <TrustBar />
      <WhoFor onJoin={() => goToApply("who_for")} />
      <WhatYouWillKnow />
      <Problem />
      <OfferIntro onJoin={() => goToApply("offer_intro")} />
      <WhyItWorks />
      <Testimonials onJoin={() => goToApply("testimonials")} />
      <FinalCta onJoin={() => goToApply("final_cta")} />
      <Footer />

      <MobileBar onJoin={() => goToApply("mobile_bar")} />
    </div>
  );
}

/* ------------------------------ Nav ------------------------------- */

function Nav({ onJoinDesktop, onJoinMobile }: { onJoinDesktop: () => void; onJoinMobile: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Who it's for", "#who"],
    ["What you'll learn", "#curriculum"],
    ["The Science", "#science"],
    ["Reviews", "#reviews"],
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E8B75A]/20 bg-[#200008]/85 backdrop-blur-xl">
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
              onClick={onJoinDesktop}
              className="ff-sans inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F6D089_0%,#D99A35_100%)] px-5 py-2.5 text-[14px] font-bold text-[#250009] shadow-[0_10px_30px_rgba(232,183,90,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <span>Start My Love Success Evaluation</span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none z-[60] text-[#FFF7EE] hover:text-[#E8B75A] transition-colors relative"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-[1.5px] bg-current transition-all duration-300 absolute ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </header>
  
      {/* Mobile Drawer Overlay */}
      {menuOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 md:hidden flex flex-col bg-black animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        >
          {/* Close button in top-right */}
          <button 
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 text-[#FFF7EE] hover:text-[#E8B75A] transition-colors p-2 focus:outline-none"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                onJoinMobile();
              }}
              className="ff-sans mt-4 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-8 py-4 text-[16px] font-bold text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.25)] w-full max-w-xs"
            >
              <span>Start My Love Success Evaluation</span>
              <ArrowRight className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-[#170006] bg-[url('/hero-bg.png')] bg-cover bg-[position:left_25%] bg-no-repeat px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20"
    >
      {/* Darkened overlay across all breakpoints so centered copy + video stay readable over the photo */}
      <div className="absolute inset-0 bg-[#0E0004]/76 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,0,4,0.42)_0%,rgba(14,0,4,0.7)_55%,rgba(14,0,4,0.85)_100%)] z-0 pointer-events-none" />

      <div className="hero-stagger relative z-10 mx-auto max-w-3xl text-center">
        <div style={{ "--i": 0 } as React.CSSProperties}>
          <Eyebrow>Private assessment · Personalized review · One-on-one evaluation</Eyebrow>
        </div>

        <div
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <Stars className="text-[13px] text-[#E8B75A]" />
          <span className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-[#FFF7EE]/70">
            Top Rated · 8,000+ Women Coached
          </span>
        </div>

        <h1
          style={{ "--i": 2 } as React.CSSProperties}
          className="ff-serif mt-6 text-[clamp(2.4rem,5.6vw,4.2rem)] font-semibold leading-[1] tracking-[-0.04em] text-[#FFF7EE] [text-wrap:balance]"
        >
          What Is Really Blocking You From Lasting Love?
        </h1>
        <p
          style={{ "--i": 3 } as React.CSSProperties}
          className="mx-auto mt-6 max-w-xl text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[#FFF7EE]/78 [text-wrap:balance]"
        >
          Your dating history may not be random. Complete the Love Success Assessment and meet privately with a Bonding Biology specialist to uncover the pattern behind your relationships.
        </p>

        <div
          style={{ "--i": 4 } as React.CSSProperties}
          className="mx-auto mt-9 w-full max-w-2xl"
        >
          <span className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#E8B75A]">
            <PlayIcon className="h-3.5 w-3.5" />
            Watch how it works
          </span>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#E8B75A]/30 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <iframe
              src="https://player.vimeo.com/video/871282339?h=615ce06ef0&title=0&byline=0&portrait=0"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Bonding Biology Workshop Video"
            ></iframe>
          </div>
        </div>

        <div
          style={{ "--i": 5 } as React.CSSProperties}
          className="mx-auto mt-6 w-full max-w-2xl"
        >
          <Cta onClick={onJoin} className="w-full">Start My Love Success Evaluation</Cta>
        </div>

        <div
          style={{ "--i": 6 } as React.CSSProperties}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[13px] font-medium text-[#FFF7EE]/65"
        >
          <span className="flex items-center gap-1.5">
            <CheckIcon className="h-3.5 w-3.5 text-[#E8B75A]" /> Private
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="h-3.5 w-3.5 text-[#E8B75A]" /> Confidential
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="h-3.5 w-3.5 text-[#E8B75A]" /> By application
          </span>
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
            8,000+
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
          If these four feel uncomfortably accurate, this assessment was built to
          reveal what's really running your nervous system, your standards, and
          your pace.
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
            Start My Love Success Evaluation
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
        {/* Left column - Copy */}
        <div className="lg:col-span-7 pb-12 sm:pb-16 lg:pb-20" data-reveal>
          <h2 className="ff-serif text-[clamp(2rem,4.5vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#250009]">
            You don't have a dating problem. You have a bonding problem.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-[#250009]/75 max-w-xl">
            The Love Success Assessment helps you see exactly where your pattern is interrupting connection — and a Bonding Biology specialist walks you through it personally, before you invest more effort.
          </p>

          <div className="relative mt-8 w-full max-w-xl aspect-video rounded-2xl overflow-hidden border border-[#E8B75A]/25 bg-black shadow-2xl z-10">
            <video
              src="https://d19l5vddyw4dqz.cloudfront.net/videos/others/Landing_Page_Video_v2.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
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
            Not theory. Not slogans. Not affirmations. A private, one-on-one
            evaluation that shows you what creates chemistry, what builds safety, and what
            makes commitment feel natural instead of forced.
          </p>

          {/* Simple 3-step visual plan */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full border-t border-[#8A2634]/15 pt-6 text-left">
            <div className="flex gap-3">
              <span className="ff-serif text-[24px] font-bold text-[#8A2634]">1.</span>
              <div>
                <h4 className="font-bold text-[14.5px] text-[#250009]">Get Your Evaluation</h4>
                <p className="text-[12.5px] text-[#4C1119]/70 leading-normal mt-0.5">A few honest questions about your dating pattern.</p>
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
            Start My Love Success Evaluation
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
          novelty to attachment. That’s the pathway this assessment reveals so
          you can stop interrupting it.
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
            Built from coaching patterns observed across 8,000+ high-achieving
            women. {/* ⚠ CLAIM */}
          </h3>
          <p className="mt-4 text-[16px] leading-[1.45] text-[#4C1119]">
            Your specialist translates the repeatable patterns behind men
            committing first — without turning love into manipulation or
            performance.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-2xl bg-[#250009] px-8 py-7 text-center sm:w-56">
          <span className="ff-serif text-[clamp(2.6rem,5vw,3rem)] font-bold leading-[0.95] tracking-[-0.05em] text-[#F8D896]">
            8,000+
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
        <Cta onClick={onJoin} variant="dark" className="w-full sm:w-auto">Start My Love Success Evaluation</Cta>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA ---------------------------- */

function FinalCta({ onJoin }: { onJoin: () => void }) {
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
            It follows patterns. Get the evaluation that makes commitment feel safe.
          </h2>

          <div className="mt-8 w-full max-w-md">
            <Cta onClick={onJoin} variant="dark" className="w-full">
              Start My Love Success Evaluation
            </Cta>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-[13px] font-bold text-[#8A2634]/80">
            <span className="flex items-center gap-1.5">
              <Stars className="text-[#D8962D]" /> rated {/* ⚠ CLAIM */}
            </span>
            <span>Private · Confidential · By application</span>
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
            Love Success Evaluation
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Stars className="text-[12px] text-[#E8B75A]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8B75A]/80">8k+ Coached</span>
          </div>
        </div>
        <button
          onClick={onJoin}
          className="ff-sans btn-shimmer rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-3 text-[14.5px] font-bold text-[#250009] shadow-[0_8px_20px_rgba(232,183,90,0.25)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Start My Love Success Evaluation</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
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
