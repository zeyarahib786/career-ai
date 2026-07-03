import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import SiteNav from "./components/navigation/SiteNav";
import SiteFooter from "./components/navigation/SiteFooter";
import ScrollToTop from "./components/navigation/ScrollToTop";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  PrivacyPage,
  TermsPage,
  AccessibilityPage,
  CookiesPage,
} from "./pages/LegalPages";
import "./styles/global.css";

const LOGO_SRC = "/solvagence-logo-transparent.png";

const App = () => {
  const [enrollOpen, setEnrollOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LangProvider>
        <ErrorBoundary>
          <SiteNav
            logoSrc={LOGO_SRC}
            onEnrollClick={() => setEnrollOpen(true)}
          />
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <HomePage
                    logoSrc={LOGO_SRC}
                    onEnrollClick={() => setEnrollOpen(true)}
                    enrollModalOpen={enrollOpen}
                    onCloseModal={() => setEnrollOpen(false)}
                  />
                </ErrorBoundary>
              }
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <SiteFooter logoSrc={LOGO_SRC} />
        </ErrorBoundary>
      </LangProvider>
    </BrowserRouter>
  );
};

export default App;
