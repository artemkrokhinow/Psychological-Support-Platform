import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrainerSimulator() {
    const [nodes, setNodes] = useState(null);
    const [currentNode, setCurrentNode] = useState('start');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/scenarios/work_conflict')
            .then(res => res.json())
            .then(data => setNodes(data.nodes));
    }, []);
    if (!nodes || !nodes[currentNode]) return <div className="dr-loader">Завантаження...</div>;

    return (
        <div className="dr-trainer-container">
            <button className="dr-back-btn" onClick={() => navigate('/main')}>✕ Закрити</button>
            <div className="dr-message">{nodes[currentNode].text}</div>
            <div className="dr-options">
                {nodes[currentNode].options.map((opt, i) => (
                    <button key={i} onClick={() => setCurrentNode(opt.next)}>{opt.text}</button>
                ))}
            </div>
            <button className="dr-sos-fab" onClick={() => navigate('/sos')}><span className="dr-sos-text">SOS</span></button>
        </div>
    );
}