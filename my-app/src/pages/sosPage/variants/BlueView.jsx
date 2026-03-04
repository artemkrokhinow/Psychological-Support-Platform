import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlueView({answers}) {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const tasks = [
        { text: "Знайдіть 5 синіх предметів", icon: "🔵" },
        { text: "Знайдіть 4 текстури", icon: "🧱" },
        { text: "Знайдіть 3 джерела звуку", icon: "👂" },
        { text: "Знайдіть 2 запахи", icon: "☕" },
        { text: "Знайдіть 1 річ на смак", icon: "🍕" }
    ];

    const progress = (step / (tasks.length - 1)) * 100;

    return (
        <main className="sos-immersive-layout grounding-mode">
            <button className="exit-btn" onClick={() => navigate('/')}>Вийти</button>
            
            <header className="header">
                <p className="progress-text">
                    {step + 1} <span className="divider">/</span> 5
                </p>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </header>

            <section className="action-zone">
                <span className="sticker-large">{tasks[step].icon}</span>
                <h1 className="task">{tasks[step].text}</h1>

                <footer className="action-trigger-area">
                    {step < tasks.length - 1 ? (
                        <button className="btn-confirm" onClick={() => setStep(step + 1)}>
                            Я знайшов
                        </button>
                    ) : (
                        <nav className="final-controls">
                            <button className="btn-confirm" onClick={() => navigate('/main', {answers: answers})}>
                                Стан стабілізовано
                            </button>
                            <button className="btn-restart" onClick={() => setStep(0)}>
                                <span className="restart-icon">🔄</span> Почати спочатку
                            </button>
                        </nav>
                    )}
                </footer>
            </section>
        </main>
    );
}