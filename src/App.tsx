import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BondingBiologyLanding from "./BondingBiologyLanding";
import { captureUtmParams } from "./lib/utils";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BondingBiologyLanding />} />
      <Route path="/quiz" element={<Navigate to="/" replace />} />
      <Route path="/results" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    captureUtmParams();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;


