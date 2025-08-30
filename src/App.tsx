import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from '@/pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Crops from './pages/Crops';
import ExploreCrops from './pages/ExploreCrops';
import ExploreSchemes from './pages/ExploreSchemes';
import EnhancedCrops from './pages/EnhancedCrops';
import EnhancedStates from './pages/EnhancedStates';
import EnhancedInvestments from './pages/EnhancedInvestments';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/crops" element={<Crops />} />
              <Route path="/explore-crops" element={<ExploreCrops />} />
              <Route path="/explore-schemes" element={<ExploreSchemes />} />
              <Route path="/enhanced-crops" element={<EnhancedCrops />} />
              <Route path="/states" element={<EnhancedStates />} />
              <Route path="/enhanced-states" element={<EnhancedStates />} />
              <Route path="/investments" element={<EnhancedInvestments />} />
              <Route path="/enhanced-investments" element={<EnhancedInvestments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
