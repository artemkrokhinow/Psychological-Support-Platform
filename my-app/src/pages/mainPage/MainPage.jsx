import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI, userAPI } from '../../api/api';
import FocusMode from './focusMode/FocusMode'; // Обов'язково імпортуємо компонент
import './mainPage.css';

export default function MainPage() {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('dr_token'));
    const [userStats, setUserStats] = useState({ resilience: 75 }); 
    
    // ДОДАНО: Стан для керування відкриттям статті
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        contentAPI.getMaterials().then(data => {
            if (Array.isArray(data)) {
                setMaterials(data);
                setFilteredMaterials(data);
            }
        });
    }, []);

    const handleFilter = (type) => {
        setActiveFilter(type);
        if (type === 'all') {
            setFilteredMaterials(materials);
        } else {
            setFilteredMaterials(materials.filter(m => m.type === type));
        }
    };

    return (
        <div className="dr-dashboard-layout">
            <header className="dr-header">
                <div className="dr-logo" onClick={() => navigate('/')}>
                    <span className="dr-logo-icon">🛡️</span>
                    <span>Прихисток</span>
                </div>
                
                <nav className="dr-nav-menu">
                    <button className="dr-nav-item active">Головна</button>
                    <button className="dr-nav-item" onClick={() => navigate('/chat')}>Вправи</button>
                    <button className="dr-nav-item">Статистика</button>
                </nav>

                <button className="dr-profile-btn" onClick={() => navigate(isLoggedIn ? '/profile' : '/auth')}>
                    {isLoggedIn ? 'Мій профіль' : 'Увійти'}
                </button>
            </header>

            <main className="dr-main-content">
                <div className="dr-top-row">
                    <section className="dr-analytics-widget">
                        <h2 className="dr-section-title">Мій стан стійкості</h2>
                        <div className="dr-chart-container">
                            <div className="dr-mock-chart">
                                <svg viewBox="0 0 400 100" className="dr-chart-svg">
                                    <path 
                                        d="M0,80 L80,60 L160,70 L240,40 L320,50 L400,20" 
                                        className="dr-chart-line" 
                                    />
                                    <circle cx="400" cy="20" r="6" className="dr-chart-point" />
                                </svg>
                            </div>
                            <div className="dr-chart-stats">
                                <div className="dr-stat">
                                    <span className="dr-stat-value">{userStats.resilience}%</span>
                                    <span className="dr-stat-label">Рівень резильєнтності</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="dr-chat-cta-block">
                        <h2 className="dr-cta-title">Потрібна практика?</h2>
                        <p className="dr-cta-desc">Спробуйте наш симулятор для відпрацювання навичок саморегуляції в реальному часі.</p>
                        <button className="dr-cta-btn" onClick={() => navigate('/chat')}>Запустити тренажер</button>
                    </section>
                </div>

                <section className="dr-education-hub">
                    <div className="dr-hub-header">
                        <h2 className="dr-section-title">Бібліотека знань</h2>
                        <div className="dr-filters">
                            {['all', 'article', 'exercise', 'video', 'audio'].map(type => (
                                <button 
                                    key={type}
                                    className={`dr-filter-btn ${activeFilter === type ? 'active' : ''}`}
                                    onClick={() => handleFilter(type)}
                                >
                                    {type === 'all' ? 'Усі' : type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="dr-materials-grid">
                        {filteredMaterials.map(m => (
                            <div 
                                key={m._id} 
                                className="dr-material-card"
                                // ДОДАНО: Обробник кліку для відкриття фокус-режиму
                                onClick={() => setSelectedMaterial(m)}
                            >
                                <div className="dr-card-icon">{m.icon || '📄'}</div>
                                <div className="dr-card-content">
                                    <span className="dr-card-type">{m.type}</span>
                                    <h3 className="dr-card-title">{m.title}</h3>
                                    <p className="dr-card-desc">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ДОДАНО: Рендеринг FocusMode, якщо вибрано матеріал */}
            {selectedMaterial && (
                <FocusMode 
                    content={selectedMaterial} 
                    onClose={() => setSelectedMaterial(null)} 
                />
            )}

            <button className="dr-sos-fab" onClick={() => navigate('/sos')}>
                <span className="dr-sos-text">SOS</span>
            </button>
        </div>
    );
}