import React, { useState } from "react";

// Webhook endpoint
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/RaF6Uj0AVUTaXjgiT7zM/webhook-trigger/597d218e-6d54-401a-8e31-996d527e270d";

type Archetype = "Pressure" | "Pulling-Back" | "Proving" | "Guarded";

interface QuizAnswer {
  question: string;
  answer: string;
  index: number;
}

export default function BondingBiologyQuiz({ onBackToHome }: { onBackToHome: () => void }) {
  const [step, setStep] = useState(1); // 1 to 6
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
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

    // Smooth transition to next step
    if (step < 5) {
      setStep(step + 1);
    } else {
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBackToHome();
    }
  };

  const calculateArchetype = (selectedAnswers: QuizAnswer[]): Archetype => {
    // We score based on answers to Q2 (index 1), Q3 (index 2), and Q4 (index 3)
    const indices = [1, 2, 3];
    const counts = [0, 0, 0, 0]; // Pressure, Pulling-Back, Proving, Guarded

    indices.forEach((qIdx) => {
      const ans = selectedAnswers[qIdx];
      if (ans) {
        counts[ans.index]++;
      }
    });

    // Find the max count
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

    // Tie-breaker: Use Q2 (index 1) option as the primary diagnostic indicator
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
          step: 2, // Marks complete diagnostic capture submission
          formSource: "quiz",
          archetype: resolvedArchetype,
          q1_answer: answers[0]?.answer,
          q2_answer: answers[1]?.answer,
          q3_answer: answers[2]?.answer,
          q4_answer: answers[3]?.answer,
          q5_answer: answers[4]?.answer,
        }),
      });
      setStatus("success");
    } catch (err) {
      console.error("Quiz submission error:", err);
      // Still display result to user even if webhook drops
      setStatus("success");
    }
  };

  const archetypeDescriptions: Record<Archetype, { title: string; subtitle: string; desc: string }> = {
    "Pressure": {
      title: "The Pressure Pattern",
      subtitle: "Moving towards closeness with urgency.",
      desc: "Your system is highly sensitive to distance. When you feel a partner pulling away, your natural instinct is to try and resolve the distance immediately. While built out of a desire for connection, this can inadvertently signal pressure to the other person, triggering their avoidant behaviors."
    },
    "Pulling-Back": {
      title: "The Pulling-Back Pattern",
      subtitle: "Withdrawing to maintain control.",
      desc: "When things get vulnerable or uncertain, your system signals danger. To protect yourself from rejection, you pull back, go silent, or match their distance. This shields you in the short term, but it often interrupts connection before it has a chance to stabilize."
    },
    "Proving": {
      title: "The Proving Pattern",
      subtitle: "Auditioning for love by being perfect.",
      desc: "You operate under the belief that you must perform, be perfect, or prove your worth to keep someone interested. You are highly attuned to what they want, often at the expense of your own needs, leading to exhaustion and uneven commitment."
    },
    "Guarded": {
      title: "The Guarded Pattern",
      subtitle: "Keeping your guard up to stay safe.",
      desc: "You keep your walls high and stay extremely cautious, waiting for him to make the first move or prove himself entirely. While this keeps you safe from immediate pain, it can prevent deep emotional safety from forming."
    }
  };

  const progressPercent = Math.round(((step - 1) / 6) * 100);

  return (
    <div className="ff-sans min-h-screen bg-[#170006] text-[#FFF7EE] antialiased flex flex-col justify-between relative overflow-x-hidden selection:bg-[#E8B75A]/30">
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-[#8A2634]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-[#E8B75A]/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-[#E8B75A]/10 bg-[#170006]/85 backdrop-blur-md sticky top-0 z-40 py-4 px-5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[14px] font-bold text-[#FFF7EE]/70 hover:text-[#E8B75A] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E8B75A] animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#E8B75A]">Bonding Quiz</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {status !== "success" && (
        <div className="w-full bg-[#250009] h-1.5 overflow-hidden">
          <div
            className="bg-[linear-gradient(90deg,#F8D896_0%,#D8962D_100%)] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-5 max-w-2xl mx-auto w-full">
        {status === "success" && archetypeResult ? (
          /* Results Page Screen */
          <div className="w-full text-center space-y-7 py-8 animate-fadeIn">
            <span className="ff-sans text-[12.5px] font-bold uppercase tracking-[0.25em] text-[#E8B75A]">
              Diagnostic Results
            </span>
            <div className="bg-[#250009]/60 border border-[#E8B75A]/25 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
              <h2 className="ff-serif text-[clamp(2rem,5vw,3rem)] font-bold text-[#FFF7EE] leading-tight">
                {archetypeDescriptions[archetypeResult].title}
              </h2>
              <p className="text-[#E8B75A] text-[15px] font-bold uppercase tracking-wide mt-2">
                {archetypeDescriptions[archetypeResult].subtitle}
              </p>
              <p className="mt-6 text-[15.5px] leading-relaxed text-[#FFF7EE]/85 text-left border-t border-[#E8B75A]/15 pt-6">
                {archetypeDescriptions[archetypeResult].desc}
              </p>
            </div>

            {/* Results CTA Flow */}
            <div className="space-y-4">
              <h3 className="text-[17px] font-bold text-[#FFF7EE]">Next Step: Secure your seat to shift this pattern</h3>
              <p className="text-[14px] text-[#FFF7EE]/70 max-w-md mx-auto">
                Your pattern is highly responsive to safety. The 3-day workshop shows you how to establish the sequence that stabilizes commitment naturally.
              </p>
              <div className="pt-2">
                <button
                  onClick={onBackToHome}
                  className="ff-sans inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-10 py-4.5 text-[16px] font-bold text-[#250009] shadow-[0_16px_40px_rgba(232,183,90,0.3)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <span>Save My Seat in the Workshop</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-[18px] w-[18px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              <p className="text-[12px] text-[#FFF7EE]/50">
                Free workshop · Replays included · Instant access
              </p>
            </div>
          </div>
        ) : step === 6 ? (
          /* Lead Capture Screen */
          <div className="w-full space-y-6 py-6 animate-fadeIn text-left">
            <div className="text-center">
              <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#E8B75A]">
                Step 6 of 6
              </span>
              <h2 className="ff-serif mt-3 text-[clamp(1.8rem,4vw,2.5rem)] font-bold leading-tight">
                Where should we send your Bonding Pattern results?
              </h2>
              <p className="mt-2 text-[14.5px] text-[#FFF7EE]/70">
                We'll prepare your full report along with personalized next steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#250009]/60 border border-[#E8B75A]/25 rounded-3xl p-7 sm:p-8 space-y-4 shadow-xl backdrop-blur-md">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#E8B75A] mb-1.5">First & Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#E8B75A] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                />
                {emailError && (
                  <p className="mt-1.5 text-[13px] font-semibold text-[#FF5D73]">
                    {emailError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#E8B75A] mb-1.5">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#E8B75A]/20 bg-white/[0.04] px-4 py-3.5 text-[15px] text-[#FFF7EE] outline-none transition-all placeholder:text-[#FFF7EE]/30 focus:border-[#E8B75A] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#E8B75A]/50"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="sms-consent"
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1.5 h-4.5 w-4.5 rounded border-[#E8B75A]/30 text-[#D8962D] focus:ring-[#E8B75A]"
                />
                <label htmlFor="sms-consent" className="text-[12px] leading-relaxed text-[#FFF7EE]/60 cursor-pointer">
                  I consent to receive text updates, results, and support from Bonding Biology Institute. Msg & data rates may apply.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="ff-sans mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#F8D896_0%,#D8962D_100%)] px-6 py-4 text-[15.5px] font-bold text-[#250009] shadow-[0_14px_34px_rgba(232,183,90,0.3)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#250009]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing your pattern...
                  </>
                ) : (
                  <>
                    Show My Bonding Pattern
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-[18px] w-[18px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            <div className="text-center text-[12px] text-[#FFF7EE]/40">
              Free workshop · Replays included · Instant access
            </div>
          </div>
        ) : (
          /* Diagnostic Question Screens */
          <div className="w-full space-y-6 py-6 text-center animate-slideIn">
            <div>
              <span className="ff-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#E8B75A]">
                Question {step} of 5
              </span>
              <h2 className="ff-serif mt-3 text-[clamp(1.9rem,4.5vw,2.7rem)] font-semibold leading-[1.1] tracking-tight">
                {questions[step - 1].q}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3.5 mt-8 max-w-xl mx-auto">
              {questions[step - 1].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className="w-full text-left px-5 py-4 sm:py-4.5 rounded-2xl border border-[#E8B75A]/15 bg-[#250009]/30 hover:bg-[#E8B75A]/10 hover:border-[#E8B75A]/50 transition-all duration-300 text-[14.5px] sm:text-[15.5px] leading-snug font-medium focus:outline-none focus:ring-2 focus:ring-[#E8B75A]/50 flex justify-between items-center group active:scale-[0.99]"
                >
                  <span>{option}</span>
                  <span className="h-5 w-5 rounded-full border border-[#E8B75A]/30 flex items-center justify-center shrink-0 ml-4 group-hover:border-[#E8B75A] transition-colors">
                    <span className="h-2 w-2 rounded-full bg-[#E8B75A] scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-5 border-t border-[#E8B75A]/10 text-center text-[12px] text-[#FFF7EE]/30">
        <p>© {new Date().getFullYear()} Bonding Biology Institute. All rights reserved.</p>
      </footer>
    </div>
  );
}
