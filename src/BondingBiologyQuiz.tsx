import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Webhook endpoint
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/RaF6Uj0AVUTaXjgiT7zM/webhook-trigger/597d218e-6d54-401a-8e31-996d527e270d";

type Archetype = "Pressure" | "Pulling-Back" | "Proving" | "Guarded";

interface QuizAnswer {
  question: string;
  answer: string;
  index: number;
}

export default function BondingBiologyQuiz({ onBackToHome }: { onBackToHome: () => void }) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1); // 1 to 7 for questions, 8 for lead capture
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [archetypeResult, setArchetypeResult] = useState<Archetype | null>(null);


  const questions = [
    {
      q: "Where are you right now?",
      options: [
        "Single and dating",
        "In something undefined",
        "In a relationship that feels uncertain",
        "Taking a break from dating"
      ]
    },
    {
      q: "When you really like someone, what tends to happen?",
      options: [
        "I get anxious and start over-giving or over-texting",
        "I go quiet and pull back to protect myself",
        "I try to be the \"perfect\" version of myself",
        "I stay calm but he seems to lose interest anyway"
      ]
    },
    {
      q: "Which feels most true?",
      options: [
        "I attract men who don't stay or commit",
        "Things start hot then mysteriously cool off",
        "I'm the one who ends up doing the chasing",
        "I keep my guard up so I don't get hurt"
      ]
    },
    {
      q: "When he pulls back, your first instinct is to...",
      options: [
        "Reach out and fix it",
        "Match his distance and pull back too",
        "Analyze what I did wrong",
        "Act unbothered even though I'm not"
      ]
    },
    {
      q: "How do you usually handle conflict or tension in dating?",
      options: [
        "I try to talk it out immediately to make sure we're okay",
        "I shut down or go cold until the tension blows over",
        "I quickly apologize or adjust my behavior to keep the peace",
        "I view it as proof that the relationship won't work and start preparing to leave"
      ]
    },
    {
      q: "If he takes several hours to reply to a text, you tend to...",
      options: [
        "Feel anxious, check my phone constantly, or send a follow-up",
        "Purposely delay my reply to him when he finally texts back",
        "Re-read my last message to see if I said something wrong",
        "Tell myself he's losing interest and mentally write him off"
      ]
    },
    {
      q: "What do you most want to feel in a relationship?",
      options: [
        "Secure, without having to manage it",
        "Chosen, without having to convince him",
        "Calm, without the anxiety spikes",
        "Free to be myself without losing him"
      ]
    }
  ];

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[step - 1];
    const newAnswers = [...answers];
    newAnswers[step - 1] = {
      question: currentQ.q,
      answer: currentQ.options[optionIndex],
      index: optionIndex
    };
    setAnswers(newAnswers);

    if (step < 7) {
      setStep(step + 1);
    } else {
      setStep(8);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStarted(false);
    }
  };

  const calculateArchetype = (selectedAnswers: QuizAnswer[]): Archetype => {
    // We score based on answers to Q2 (index 1), Q3 (index 2), Q4 (index 3), Q5 (index 4), and Q6 (index 5)
    const indices = [1, 2, 3, 4, 5];
    const counts = [0, 0, 0, 0];

    indices.forEach((qIdx) => {
      const ans = selectedAnswers[qIdx];
      if (ans) {
        counts[ans.index]++;
      }
    });

    let maxCount = -1;
    let maxIdx = 0;
    let hasTie = false;

    counts.forEach((count, idx) => {
      if (count > maxCount) {
        maxCount = count;
        maxIdx = idx;
        hasTie = false;
      } else if (count === maxCount) {
        hasTie = true;
      }
    });

    if (hasTie && selectedAnswers[1]) {
      maxIdx = selectedAnswers[1].index;
    }

    const archetypes: Archetype[] = ["Pressure", "Pulling-Back", "Proving", "Guarded"];
    return archetypes[maxIdx];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address containing '@'.");
      return;
    }
    setEmailError("");
    setStatus("loading");

    const resolvedArchetype = calculateArchetype(answers);
    setArchetypeResult(resolvedArchetype);

    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          consent,
          step: 2,
          formSource: "quiz",
          archetype: resolvedArchetype,
          q1_answer: answers[0]?.answer,
          q2_answer: answers[1]?.answer,
          q3_answer: answers[2]?.answer,
          q4_answer: answers[3]?.answer,
          q5_answer: answers[4]?.answer,
          q6_answer: answers[5]?.answer,
          q7_answer: answers[6]?.answer,
        }),
      });
      setStatus("success");
      navigate(`/results?archetype=${resolvedArchetype}`);
    } catch (err) {
      console.error("Quiz submission error:", err);
      setStatus("success"); // Fall forward to results page regardless
      navigate(`/results?archetype=${resolvedArchetype}`);
    }
  };

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

  const progressPercent = started ? Math.round(((step - 1) / 7) * 100) : 0;

  return (
    <div className="ff-sans min-h-screen bg-[#f9e9e3] text-[#250009] antialiased flex flex-col justify-between relative selection:bg-[#E8B75A]/45">
      {/* Header Logo */}
      <header className="border-b border-[#250009]/10 bg-white/70 backdrop-blur-md sticky top-0 z-40 py-3.5 px-5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[14px] font-bold text-[#8A2634] hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span>{started ? "Back" : "Home"}</span>
          </button>
          <a href="#top" onClick={(e) => { e.preventDefault(); onBackToHome(); }}>
            <img src="/Untitleddesign-13.avif" alt="Logo" className="h-8 w-auto object-contain" />
          </a>
        </div>
      </header>

      {/* Progress Bar (Only during active questions) */}
      {started && status !== "success" && step <= 7 && (
        <div className="w-full bg-[#250009]/5 h-1.5 overflow-hidden">
          <div
            className="bg-[linear-gradient(90deg,#D8962D_0%,#8A2634_100%)] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-5 max-w-2xl mx-auto w-full">
        {!started ? (
          /* Start Screen */
          <div className="w-full text-center space-y-7 py-6 animate-fadeIn">
            <h1 className="ff-serif text-[clamp(2.2rem,5.5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[#250009] max-w-xl mx-auto">
              What’s Blocking You From Lasting Love?
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#250009]/80 max-w-lg mx-auto">
              Answer 7 biology-based questions to reveal your primary bonding pattern, your relationship blind spot, and the immediate shift to unlock commitment.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setStarted(true)}
                className="ff-sans inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#250009] px-10 py-4.5 text-[16px] font-bold text-[#FFF2EA] shadow-[0_16px_40px_rgba(37,0,9,0.15)] hover:bg-[#3d0010] active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer"
              >
                <span>Reveal My Love Pattern</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <p className="text-[12px] font-bold text-[#250009]/45 uppercase tracking-wider">
              Takes under 2 minutes · Free diagnostic
            </p>
          </div>
        ) : status === "success" && archetypeResult ? (
          /* Results Screen */
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
                The 3-day Bonding Biology workshop shows you how to stop triggering this response sequence, letting commitment reveal itself naturally.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBackToHome}
                  className="ff-sans inline-flex items-center justify-center gap-2 rounded-2xl bg-[#250009] px-10 py-4.5 text-[16px] font-bold text-[#FFF2EA] shadow-[0_16px_40px_rgba(37,0,9,0.15)] hover:bg-[#3d0010] active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer"
                >
                  <span>Save My Seat in the Workshop</span>
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
        ) : step === 8 ? (
          /* Lead Capture Screen (Before Results) */
          <div className="w-full space-y-6 py-6 animate-fadeIn text-left">
            <div className="text-center">
              <span className="ff-sans inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A2634] bg-[#8A2634]/10 rounded-full px-4 py-1.5">
                Your Pattern is Ready
              </span>
              <h2 className="ff-serif mt-4 text-[clamp(1.9rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
                Your Love Pattern Result Is Ready.
              </h2>
              <p className="mt-2.5 text-[14.5px] text-[#250009]/75 max-w-md mx-auto">
                Based on your answers, one pattern is affecting your relationships more than the others. Tell us where to email your blueprint.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-[#250009]/10 rounded-3xl p-7 sm:p-8 space-y-4.5 shadow-lg">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">First & Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#250009]/15 bg-[#FFFDFB]/60 px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#D8962D] focus:ring-1 focus:ring-[#D8962D]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#250009]/15 bg-[#FFFDFB]/60 px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#D8962D] focus:ring-1 focus:ring-[#D8962D]/50"
                />
                {emailError && (
                  <p className="mt-1.5 text-[13px] font-semibold text-[#9B1B2B]">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mb-1.5">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#250009]/15 bg-[#FFFDFB]/60 px-4 py-3.5 text-[15px] text-[#250009] outline-none transition-shadow placeholder:text-[#250009]/30 focus:border-[#D8962D] focus:ring-1 focus:ring-[#D8962D]/50"
                />
              </div>

              <div className="flex items-start gap-3 pt-1.5">
                <input
                  id="sms-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1.5 h-4.5 w-4.5 rounded border-[#250009]/20 text-[#250009] focus:ring-[#E8B75A]"
                />
                <label htmlFor="sms-consent" className="text-[12px] leading-relaxed text-[#250009]/60 cursor-pointer">
                  Yes, text me updates, results and tips from Bonding Biology. Msg & data rates may apply.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="ff-sans mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#250009] px-6 py-4 text-[15.5px] font-bold text-[#FFF2EA] shadow-[0_14px_34px_rgba(37,0,9,0.15)] hover:bg-[#3d0010] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FFF2EA]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating blueprint...
                  </>
                ) : (
                  <>
                    Get My Relationship Blueprint
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-[18px] w-[18px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Testimonial / Social Proof near Opt-in Form */}
            <div className="bg-white/60 border border-[#250009]/5 rounded-2xl p-4.5 flex items-start gap-3.5 mt-2">
              <div className="h-8 w-8 rounded-full bg-[#8A2634] text-white flex items-center justify-center font-bold text-[10.5px] shrink-0">MR</div>
              <div>
                <p className="text-[12.5px] text-[#250009]/75 italic">
                  \"I was skeptical but it resolved me into Pressure immediately. The recommendation to pause 24h completely transformed how my boyfriend and I communicate.\"
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A2634] mt-1.5">Maya R. · Austin, TX</p>
              </div>
            </div>
          </div>
        ) : (
          /* Diagnostic Questions */
          <div key={step} className="w-full space-y-6 py-6 text-center animate-slideIn">
            <div>
              <span className="ff-sans text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#8A2634] bg-[#8A2634]/10 rounded-full px-3 py-1">
                Question {step} of 7
              </span>
              <h2 className="ff-serif mt-5 text-[clamp(1.9rem,4.5vw,2.7rem)] font-bold leading-[1.1] tracking-tight">
                {questions[step - 1].q}
              </h2>
            </div>
 
            {/* Answer Options */}
            <div className="space-y-3.5 mt-8 max-w-xl mx-auto">
              {questions[step - 1].options.map((option, i) => (
                <button
                  key={`${step}-${i}`}
                  onClick={() => handleSelectOption(i)}
                  className="w-full text-left px-5 py-4 sm:py-4.5 rounded-2xl border border-[#250009]/10 bg-white hover:bg-[#F0DBD0]/35 hover:border-[#250009]/30 transition-all duration-300 text-[14.5px] sm:text-[15.5px] leading-snug font-medium focus:outline-none focus:ring-2 focus:ring-[#250009]/30 flex justify-between items-center group active:scale-[0.99] cursor-pointer shadow-sm"
                >
                  <span>{option}</span>
                  <span className="h-5 w-5 rounded-full border border-[#250009]/15 flex items-center justify-center shrink-0 ml-4 group-hover:border-[#250009]/30 transition-colors">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8A2634] scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-5 border-t border-[#250009]/5 text-center text-[12px] text-[#250009]/40">
        <p>© {new Date().getFullYear()} Bonding Biology Institute. All rights reserved.</p>
      </footer>
    </div>
  );
}
