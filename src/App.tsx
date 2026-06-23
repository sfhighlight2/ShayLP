import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BondingBiologyLanding from "./BondingBiologyLanding";
import BondingBiologyQuiz from "./BondingBiologyQuiz";
import BondingBiologyResults from "./BondingBiologyResults";

function AppRoutes() {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Routes>
      <Route path="/" element={<BondingBiologyLanding onStartQuiz={handleStartQuiz} />} />
      <Route path="/quiz" element={<BondingBiologyQuiz onBackToHome={handleBackToHome} />} />
      <Route path="/results" element={<BondingBiologyResults />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

