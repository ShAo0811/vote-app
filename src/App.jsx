import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArknightsPage from './pages/Arknights/ArknightsPage';
import ArknightsComparePage from './pages/Arknights/ArknightsComparePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Arknights Routes */}
        <Route path="/arknights" element={<ArknightsPage />} />
        <Route path="/arknights/compare" element={<ArknightsComparePage />} />
        
        {/* Redirects */}
        <Route path="/compare" element={<Navigate to="/arknights/compare" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
