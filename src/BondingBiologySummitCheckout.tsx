"use client";

/**
 * BondingBiologySummitCheckout.tsx
 * ------------------------------------------------------------------
 * "/d/checkout" — every CTA on /d now routes here instead of linking
 * straight out to the external fastpaydirect.com payment link, so the
 * visitor stays on-site and sees the announcement bar. The actual
 * payment link is embedded in an iframe below the banner.
 *
 * If arrived at with ?firstName=&lastName=&email=&phone= (the exit-intent
 * form on /d sends these), they're forwarded onto the iframe's src so
 * the embedded checkout can prefill them.
 *
 * KNOWN RISKS — verify these live before sending paid traffic here:
 * 1. Many payment processors send X-Frame-Options / CSP frame-ancestors
 *    headers specifically to block being iframed (a common anti-clickjacking
 *    measure, sometimes required for PCI compliance). If fastpaydirect does
 *    this, the iframe will show a blank/broken frame instead of the
 *    checkout. The "open in a new tab" link below the iframe is a fallback
 *    for exactly this case, but it's a workaround, not a fix — if the
 *    iframe is blocked, most visitors will just see a broken box.
 * 2. Even if it loads, the post-payment redirect to /d/thank-you (which is
 *    how the Purchase pixel event gets fired) is configured on fastpaydirect's
 *    side to redirect the browser. From inside an iframe, that redirect may
 *    only navigate the iframe itself rather than the top-level page,
 *    leaving the visitor looking at the thank-you page trapped inside this
 *    page's small iframe instead of a full-page confirmation, or may be
 *    blocked outright by the browser. Test a real (or sandbox) purchase
 *    end-to-end and confirm the thank-you page and Purchase event both
 *    still fire correctly before relying on this for paid traffic.
 * ------------------------------------------------------------------
 */

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { trackFacebookEvent } from "./lib/leadCapture";

const SUMMIT_CHECKOUT_URL = "https://link.fastpaydirect.com/payment-link/6a5e81b2a655fa0b802a53e4";
const SUMMIT_PRICE = 97;

const FORWARDED_PARAMS = ["firstName", "lastName", "email", "phone"];

function buildIframeSrc(searchParams: URLSearchParams): string {
  const params = new URLSearchParams();
  FORWARDED_PARAMS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `${SUMMIT_CHECKOUT_URL}?${query}` : SUMMIT_CHECKOUT_URL;
}

export default function BondingBiologySummitCheckout() {
  const [searchParams] = useSearchParams();
  const iframeSrc = buildIframeSrc(searchParams);

  useEffect(() => {
    trackFacebookEvent("InitiateCheckout", {
      content_name: "Bonding Biology Summit",
      value: SUMMIT_PRICE,
      currency: "USD",
    });
  }, []);

  return (
    <div className="bb-checkout ff-sans flex min-h-screen flex-col bg-[#170006] text-[#FFF7EE] antialiased">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
      />
      <style>{`
        .bb-checkout, .bb-checkout .ff-sans {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif !important;
        }
      `}</style>

      <header className="border-b border-[#E8B75A]/20 bg-[#200008] px-5 py-3 sm:px-8">
        <a href="/d" className="inline-block focus:outline-none">
          <img src="/Mainlogo.png" alt="Bonding Biology Institute Logo" className="h-8 w-auto object-contain" />
        </a>
      </header>

      <div className="bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-5 py-3 text-center">
        <p className="text-[14px] font-black uppercase tracking-[0.06em] text-black sm:text-[16px]">
          Extra 40% Off &middot; Use Code: LOVE40
        </p>
      </div>

      <iframe src={iframeSrc} title="Secure Checkout" className="w-full flex-1 border-0" />

      <p className="border-t border-[#E8B75A]/15 bg-[#170006] px-5 py-3 text-center text-[12px] text-[#FFF7EE]/50">
        Trouble loading checkout?{" "}
        <a
          href={iframeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#E8B75A]/40 underline-offset-2 text-[#E8B75A] hover:text-[#F8D896]"
        >
          Open in a new tab
        </a>
      </p>
    </div>
  );
}
