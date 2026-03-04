import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './trainerSimulator.css';

export default function TrainerSimulator({ scenarioId = 'work_conflict' }) {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [nodes, setNodes] = useState(null);
    const [currentNode, setCurrentNode] = useState('start');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/scenarios/${scenarioId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.nodes) {
                    setNodes(data.nodes);
                    setHistory([{ text: data.nodes.start.text, type: 'system' }]);
                }
            }).catch(err => console.error("Помилка завантаження сценарію:", err));
    }, [scenarioId]);

    const handleChoice = (nextKey, choiceText) => {
        if (!nodes || !nodes[nextKey]) return;

        const nextNode = nodes[nextKey];
        const currentOptions = nodes[currentNode]?.options || [];
        const option = currentOptions.find(o => o.next === nextKey);
        const feedback = option ? option.feedback : "";

        setHistory(prev => [
            ...prev, 
            { text: choiceText, type: 'user' },
            { text: feedback, type: 'feedback' },
            { text: nextNode.text, type: 'system' }
        ]);
        setCurrentNode(nextKey);
    };

    // Перевірка наявності даних перед рендером
    if (!nodes || !nodes[currentNode]) return <div className="dr-loader">Завантаження тренажера...</div>;

    return (
        <div className="dr-trainer-layout">
            <header className="dr-trainer-header">
                <button className="dr-back-btn" onClick={() => navigate('/main')}>✕ Закрити</button>
                <div className="dr-trainer-title">Тренажер навичок</div>
            </header>

            <main className="dr-chat-area" ref={scrollRef}>
                <div className="dr-message-column">
                    {history.map((msg, index) => (
                        <div key={index} className={`dr-bubble ${msg.type}`}>{msg.text}</div>
                    ))}
                </div>
            </main>

            <footer className="dr-choice-panel">
                {!nodes[currentNode].isFinal ? (
                    <div className="dr-options-stack">
                        {nodes[currentNode].options?.map((opt, idx) => (
                            <button key={idx} className="dr-choice-btn" onClick={() => handleChoice(opt.next, opt.text)}>
                                {opt.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <button className="dr-final-btn" onClick={() => navigate('/main')}>Завершити</button>
                )}
            </footer>
            <button className="dr-sos-fab" onClick={() => navigate('/sos')}><span className="dr-sos-text">SOS</span></button>
        </div>
    );
}