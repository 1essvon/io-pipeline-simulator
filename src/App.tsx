
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";

import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import LearningPage from "./pages/LearningPage";
import SimulatorPage from "./pages/SimulatorPage";
import ComparisonPage from "./pages/ComparisonPage";
import { GuidePage } from "./pages/GuidePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/belajar" element={<LearningPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/perbandingan" element={<ComparisonPage />} />
        <Route path="/panduan" element={<GuidePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
