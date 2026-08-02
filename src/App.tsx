import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BondingBiologyLanding from "./BondingBiologyLanding";
import BondingBiologyLandingB from "./BondingBiologyLandingB";
import BondingBiologyLandingC from "./BondingBiologyLandingC";
import BondingBiologyLandingD from "./BondingBiologyLandingD";
import BondingBiologyLandingE from "./BondingBiologyLandingE";
import BondingBiologyCheatCodeThankYou from "./BondingBiologyCheatCodeThankYou";
import BondingBiologySummitCheckout from "./BondingBiologySummitCheckout";
import BondingBiologySummitThankYou from "./BondingBiologySummitThankYou";
import BondingBiologyOfferB from "./BondingBiologyOfferB";
import { captureUtmParams } from "./lib/utils";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BondingBiologyLanding />} />
      <Route path="/b" element={<BondingBiologyLandingB />} />
      <Route path="/b/offer" element={<BondingBiologyOfferB />} />
      <Route path="/c" element={<BondingBiologyLandingC />} />
      <Route path="/d" element={<BondingBiologyLandingD />} />
      <Route path="/d/checkout" element={<BondingBiologySummitCheckout />} />
      <Route path="/d/thank-you" element={<BondingBiologySummitThankYou />} />
      <Route path="/e" element={<BondingBiologyLandingE />} />
      <Route path="/e/thank-you" element={<BondingBiologyCheatCodeThankYou />} />
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


