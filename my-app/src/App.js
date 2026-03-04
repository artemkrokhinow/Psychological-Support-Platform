import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/authPage/AuthPage';
import StartPage from './pages/startPage/startPage';
import MainPage from './pages/mainPage/MainPage';
import TrainerSimulator from './pages/mainPage/trainerSimulator/TrainerSimulator';
import SosPage from './pages/sosPage/sosPage';
import ProfilePage from './pages/profilePage/ProfilePage';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('dr_token');
    return token ? children : <Navigate to="/auth" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
                <Route path="/start" element={
                    <ProtectedRoute>
                        <StartPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/main/:answers?" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <TrainerSimulator />
                    </ProtectedRoute>
                } />
                
                <Route path="/sos/:answers?" element={<SosPage />} />
                
                <Route path="/" element={<Navigate to="/auth" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;