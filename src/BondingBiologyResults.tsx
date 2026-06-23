import { useSearchParams, useNavigate } from "react-router-dom";

type Archetype = "Pressure" | "Pulling-Back" | "Proving" | "Guarded";

export default function BondingBiologyResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const archetypeResult = searchParams.get("archetype") as Archetype | null;

  const archetypeDetails: Record<Archetype, {
    title: string;
    subtitle: string;
    why: string;
    blindSpot: string;
    recommendation: string;
  }> = {
    "Pressure": {
      title: "The Pressure Pattern",
      subtitle: "Moving towards closeness with urgency.",
      why: "When a partner creates distance, your biological system interprets it as a threat to safety. This triggers an urgent impulse to text, clarify, or over-give in an attempt to re-establish connection.",
      blindSpot: "By trying to resolve the distance immediately, your actions can feel like pressure to a partner, causing them to pull back even further to regain space.",
      recommendation: "Practice a '24-hour pause' when you feel the urge to push for closeness. Let the initial spike of anxiety settle before choosing how to respond."
    },
    "Pulling-Back": {
      title: "The Pulling-Back Pattern",
      subtitle: "Withdrawing to maintain emotional control.",
      why: "Your nervous system associates vulnerability with risk. When you feel a partner pulling away, your protective instinct is to go quiet, act unbothered, and withdraw before they can reject you.",
      blindSpot: "While this keeps you safe in the short term, it signals to a partner that you are emotionally unavailable or indifferent, causing the connection to cool down permanently.",
      recommendation: "Try speaking one small, vulnerable truth instead of withdrawing (e.g. 'I really enjoyed our time and get a bit nervous when things go quiet.')."
    },
    "Proving": {
      title: "The Proving Pattern",
      subtitle: "Auditioning for commitment by being perfect.",
      why: "You default to acting as the 'ideal' partner — highly accommodating, effortless, and always available. Your system seeks safety by making yourself indispensable.",
      blindSpot: "You end up doing all the relationship planning and emotional labor, which makes commitment feel like an audition rather than a natural, shared choice.",
      recommendation: "Allow a partner space to initiate plans, reach out first, and show up. Clues of real commitment only appear when you stop carrying the interaction."
    },
    "Guarded": {
      title: "The Guarded Pattern",
      subtitle: "Keeping your walls high to prevent pain.",
      why: "Past disappointment has taught your system to protect itself at all costs. You keep a strict filter and stay alert for red flags, waiting for absolute certainty before opening up.",
      blindSpot: "Your caution can be misread as lack of interest. A good partner seeking safety will sense the barrier and eventually move on, leaving you with unavailable candidates.",
      recommendation: "Experiment with low-stakes openness. Share a personal story or request support in a small area to see how they handle your trust."
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  // If no archetype or invalid archetype is provided, direct them to take the quiz
  if (!archetypeResult || !archetypeDetails[archetypeResult]) {
    return (
      <div className="ff-sans min-h-screen bg-[#f9e9e3] text-[#250009] flex flex-col justify-between py-10 px-5 text-center">
        <div className="max-w-md mx-auto my-auto space-y-6">
          <h2 className="ff-serif text-[32px] font-bold">No Pattern Found</h2>
          <p className="text-[15px] text-[#250009]/75">
            Please complete the 7-question relationship pattern diagnostic to reveal your blueprint.
          </p>
          <button
            onClick={handleRetakeQuiz}
            className="ff-sans inline-flex items-center justify-center gap-2 rounded-2xl bg-[#250009] px-8 py-3.5 text-[15px] font-bold text-[#FFF2EA] shadow-lg hover:bg-[#3d0010]"
          >
            Start Diagnostic Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-sans min-h-screen bg-[#f9e9e3] text-[#250009] antialiased flex flex-col justify-between relative selection:bg-[#E8B75A]/45">
      {/* Header Logo */}
      <header className="border-b border-[#250009]/10 bg-white/70 backdrop-blur-md sticky top-0 z-40 py-3.5 px-5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-1.5 text-[14px] font-bold text-[#8A2634] hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span>Home</span>
          </button>
          <a href="/" onClick={(e) => { e.preventDefault(); handleBackToHome(); }}>
            <img src="/Mainlogo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-5 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-7 py-6 animate-fadeIn text-left">
          <div className="text-center">
            <span className="ff-sans inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A2634] bg-[#8A2634]/10 rounded-full px-4 py-1.5">
              Your Relationship Blueprint
            </span>
            <h2 className="ff-serif mt-3 text-[clamp(2.1rem,5vw,2.8rem)] font-bold leading-tight">
              {archetypeDetails[archetypeResult].title}
            </h2>
            <p className="text-[#8A2634] text-[15px] font-bold uppercase tracking-wider mt-1.5">
              {archetypeDetails[archetypeResult].subtitle}
            </p>
          </div>

          <div className="bg-white border border-[#250009]/10 rounded-3xl p-7 sm:p-9 shadow-lg space-y-6">
            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#8A2634]">Why It Happens</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#250009]/85">
                {archetypeDetails[archetypeResult].why}
              </p>
            </div>

            <div className="border-t border-[#250009]/10 pt-5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#8A2634]">Your Biggest Blind Spot</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#250009]/85">
                {archetypeDetails[archetypeResult].blindSpot}
              </p>
            </div>

            <div className="border-t border-[#250009]/10 pt-5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#8A2634]">Immediate Recommendation</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#250009]/85 font-medium">
                {archetypeDetails[archetypeResult].recommendation}
              </p>
            </div>
          </div>

          {/* Results Call to Action */}
          <div className="text-center space-y-4 pt-4 border-t border-[#250009]/10">
            <h3 className="text-[17px] font-bold">Next Step: Shift this pattern in our live workshop</h3>
            <p className="text-[14.5px] text-[#250009]/75 max-w-md mx-auto leading-relaxed">
              The 5-day Bonding Biology workshop shows you how to stop triggering this response sequence, letting commitment reveal itself naturally.
            </p>
            <div className="pt-2">
              <button
                onClick={handleBackToHome}
                className="ff-sans inline-flex items-center justify-center gap-2 rounded-2xl bg-[#250009] px-10 py-4.5 text-[16px] font-bold text-[#FFF2EA] shadow-[0_16px_40px_rgba(37,0,9,0.15)] hover:bg-[#3d0010] active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer"
              >
                <span>Get Started Free</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-[18px] w-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <p className="text-[12px] text-[#250009]/45 font-bold uppercase tracking-wider">
              Free workshop · Replays included · Instant access
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-5 border-t border-[#250009]/5 text-center text-[12px] text-[#250009]/40">
        <p>© {new Date().getFullYear()} Bonding Biology Institute. All rights reserved.</p>
      </footer>
    </div>
  );
}
