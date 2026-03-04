 import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contentAPI, userAPI } from '../../api/api';
import FocusMode from './focusMode/FocusMode';
import './mainPage.css';

export default function MainPage() {
    const navigate = useNavigate();
    const { answers } = useParams();
    const [materials, setMaterials] = useState([]);
    const [userStats, setUserStats] = useState({ resilience: 0, stabilityDays: 0, history: [] });
    const [selectedContent, setSelectedContent] = useState(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        // Отримуємо профіль, щоб знати, чи це гість
        userAPI.getProfile().then(data => {
            if (data) {
                setUserStats({
                    resilience: data.stats?.resilience || 0,
                    stabilityDays: data.stats?.stabilityDays || 0,
                    history: data.history || []
                });
                setIsGuest(data.isGuest); 
            }
        }).catch(err => console.error("Помилка завантаження профілю:", err));

        contentAPI.getMaterials().then(data => {
            if (Array.isArray(data)) setMaterials(data);
        }).catch(err => console.error("Помилка завантаження матеріалів:", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('dr_token');
        navigate('/auth');
    };

    return (
        <div className={`dr-dashboard-layout ${selectedContent ? 'dr-blur-active' : ''}`}>
            <header className="dr-header">
                <div className="dr-logo" onClick={() => navigate('/main')}>
                    <span className="dr-logo-icon">🛡️</span> Цифровий Прихисток
                </div>
                <div className="dr-profile">
                    {/* Логіка кнопок для Гостя та Користувача */}
                    {isGuest ? (
                        <button className="dr-profile-btn" onClick={() => navigate('/auth')}>Зареєструватися</button>
                    ) : (
                        <button className="dr-profile-btn" onClick={() => navigate('/profile')}>Особистий кабінет</button>
                    )}
                    <button className="dr-profile-btn" style={{marginLeft: '10px'}} onClick={handleLogout}>Вийти</button>
                </div>
            </header>

            <main className="dr-main-content">
                <section className="dr-analytics-widget">
                    <h2 className="dr-section-title">Мій стан</h2>
                    <div className="dr-chart-container">
                        <div className="dr-mock-chart">
                            <svg viewBox="0 0 400 100" className="dr-chart-svg">
                                <path 
                                    d={`M0,80 ${userStats.history.map((h, i) => `L${(i + 1) * 80},${100 - h.score}`).join(' ')}`} 
                                    className="dr-chart-line" 
                                />
                            </svg>
                        </div>
                        <div className="dr-stat-value">{userStats.resilience}%</div>
                    </div>
                </section>

                <div className="dr-materials-grid">
                    {materials.length > 0 ? materials.map(m => (
                        <div key={m._id} className="dr-material-card" onClick={() => setSelectedContent(m)}>
                            <div className="dr-card-icon">{m.icon}</div>
                            <div className="dr-card-content">
                                <h3 className="dr-card-title">{m.title}</h3>
                                <p className="dr-card-desc">{m.desc}</p>
                            </div>
                        </div>
                    )) : <p className="dr-loader-text">Завантаження матеріалів...</p>}
                </div>
            </main>

            <button className="dr-sos-fab" onClick={() => navigate('/sos')}>
                <span className="dr-sos-text">SOS</span>
            </button>

            {selectedContent && <FocusMode content={selectedContent} onClose={() => setSelectedContent(null)} />}
        </div>
    );
}