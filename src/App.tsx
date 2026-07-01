import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BondingBiologyLanding from "./BondingBiologyLanding";

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
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;


