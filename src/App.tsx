import { useState } from "react";
import BondingBiologyLanding from "./BondingBiologyLanding";
import BondingBiologyQuiz from "./BondingBiologyQuiz";

function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "quiz">("landing");

  const handleNavigateToQuiz = () => {
    setCurrentPage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToHome = () => {
    setCurrentPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return currentPage === "landing" ? (
    <BondingBiologyLanding onStartQuiz={handleNavigateToQuiz} />
  ) : (
    <BondingBiologyQuiz onBackToHome={handleNavigateToHome} />
  );
}

export default App;
