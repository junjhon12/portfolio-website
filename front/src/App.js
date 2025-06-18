// front/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioAdminPage from './pages/PortfolioAdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // 1. Import the guard
import './App.css';

function App() {
  return (
    <Routes>
      {/* 2. Wrap the admin page route with ProtectedRoute */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <PortfolioAdminPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;