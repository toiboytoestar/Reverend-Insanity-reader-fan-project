import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LandingPage from "@/pages/LandingPage";
import TocPage from "@/pages/TocPage";
import ReaderPage from "@/pages/ReaderPage";
import BookmarksPage from "@/pages/BookmarksPage";
import HistoryPage from "@/pages/HistoryPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { ReaderSettingsProvider } from "@/context/ReaderSettings";

function App() {
  return (
    <div className="App">
      <ReaderSettingsProvider>
        <BrowserRouter>
          <SiteHeader />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/toc" element={<TocPage />} />
            <Route path="/read/:chapterId" element={<ReaderPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <SiteFooter />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0B0D0E",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#E2E8F0",
              },
            }}
          />
        </BrowserRouter>
      </ReaderSettingsProvider>
    </div>
  );
}

export default App;
