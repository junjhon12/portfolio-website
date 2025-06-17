// front/src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import PortfolioAdminPage from './pages/PortfolioAdminPage'; // We will create this next
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    // The Routes component is the container for all our individual routes
    <Routes>
      {/* A Route maps a URL path to a component */}
      <Route path="/" element={<PortfolioAdminPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;