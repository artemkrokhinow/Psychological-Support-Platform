import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import StartPage from './pages/startPage/startPage';
import MainPage from './pages/mainPage/MainPage';
import AuthPage from './pages/authPage/AuthPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import TrainerSimulator from './pages/mainPage/trainerSimulator/TrainerSimulator';
import SosPage from './pages/sosPage/sosPage';
import AdminPage from './pages/adminPage/AdminPage';

const checkTestStatus = () => {
    const saved = localStorage.getItem('dr_test_results');
    if (!saved) return false;
    try {
        const { expiry } = JSON.parse(saved);
        if (Date.now() < expiry) return true;
        localStorage.removeItem('dr_test_results');
        return false;
    } catch (e) { return false; }
};

const ProtectedRoute = ({ children }) => {
    return localStorage.getItem('dr_token') ? children : <Navigate to="/auth" replace />;
};

function App() {
    const hasValidTest = checkTestStatus();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={hasValidTest ? <Navigate to="/main" /> : <Navigate to="/start" /> } />
                <Route path="/start" element={<StartPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/sos" element={<SosPage />} />
                <Route path="/chat" element={<TrainerSimulator />} />
                
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;