import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI, scenarioAPI } from '../../api/api';
import './adminPage.css';

export default function AdminPage() {
    const navigate = useNavigate();
    const [materialForm, setMaterialForm] = useState({ 
        title: '', desc: '', type: 'text', icon: '📖', content: '' 
    });
    
    const [scenarioTitle, setScenarioTitle] = useState('');
    const [nodes, setNodes] = useState([
        { id: 'start', text: '', isFinal: false, options: [{ text: '', next: '', feedback: '' }] }
    ]);

    const handleCreateMaterial = async (e) => {
        e.preventDefault();
        const res = await contentAPI.createMaterial(materialForm);
        if (res._id) {
            alert("Матеріал створено!");
            setMaterialForm({ title: '', desc: '', type: 'text', icon: '📖', content: '' });
        }
    };

    const addNode = () => setNodes([...nodes, { id: `node_${nodes.length + 1}`, text: '', isFinal: false, options: [{ text: '', next: '', feedback: '' }] }]);
    const updateNode = (i, f, v) => { const n = [...nodes]; n[i][f] = v; setNodes(n); };
    const addOption = (ni) => { const n = [...nodes]; n[ni].options.push({ text: '', next: '', feedback: '' }); setNodes(n); };
    const updateOption = (ni, oi, f, v) => { const n = [...nodes]; n[ni].options[oi][f] = v; setNodes(n); };

    const handleCreateScenario = async () => {
        const nodesObject = {};
        nodes.forEach(n => nodesObject[n.id] = { text: n.text, isFinal: n.isFinal, options: n.options });
        await scenarioAPI.createScenario({ title: scenarioTitle, nodes: nodesObject });
        alert("Сценарій збережено!");
    };

    return (
        <div className="dr-admin-layout">
            <header className="dr-admin-header">
                <button className="dr-back-btn" onClick={() => navigate('/main')}>← Назад</button>
                <h1>Адмін-центр «Прихисток»</h1>
            </header>

            <div className="dr-admin-grid">
                <section className="dr-admin-card">
                    <h2>Новий контент</h2>
                    <div className="dr-admin-form">
                        <input type="text" placeholder="Заголовок" value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})} />
                        
                        <div className="dr-row">
                            <select value={materialForm.type} onChange={e => setMaterialForm({...materialForm, type: e.target.value})}>
                                <option value="text">📄 Текст</option>
                                <option value="video">🎥 Відео (YouTube)</option>
                                <option value="audio">🎵 Аудіо (URL)</option>
                            </select>
                            <input type="text" placeholder="Emoji" style={{width: '70px'}} value={materialForm.icon} onChange={e => setMaterialForm({...materialForm, icon: e.target.value})} />
                        </div>

                        <textarea placeholder="Опис для картки" value={materialForm.desc} onChange={e => setMaterialForm({...materialForm, desc: e.target.value})} />

                        {/* ДИНАМІЧНІ ПОЛЯ */}
                        {materialForm.type === 'text' ? (
                            <textarea 
                                className="dr-content-field" 
                                placeholder="Повний текст статті..." 
                                value={materialForm.content} 
                                onChange={e => setMaterialForm({...materialForm, content: e.target.value})} 
                            />
                        ) : (
                            <input 
                                type="text" 
                                className="dr-content-field"
                                placeholder={materialForm.type === 'video' ? "YouTube Link (https://...)" : "Audio URL (mp3/ogg)"} 
                                value={materialForm.content} 
                                onChange={e => setMaterialForm({...materialForm, content: e.target.value})} 
                            />
                        )}

                        <button className="dr-admin-btn" onClick={handleCreateMaterial}>Опублікувати</button>
                    </div>
                </section>

                <section className="dr-admin-card">
                    <h2>Конструктор сценаріїв</h2>
                    <input type="text" className="dr-admin-input" placeholder="Назва сценарію" value={scenarioTitle} onChange={e => setScenarioTitle(e.target.value)} />
                    <div className="dr-nodes-list">
                        {nodes.map((node, nIdx) => (
                            <div key={nIdx} className="dr-node-item">
                                <input type="text" placeholder="ID (напр. start)" value={node.id} onChange={e => updateNode(nIdx, 'id', e.target.value)} />
                                <textarea placeholder="Текст бота" value={node.text} onChange={e => updateNode(nIdx, 'text', e.target.value)} />
                                {!node.isFinal && node.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="dr-opt-row">
                                        <input type="text" placeholder="Варіант" value={opt.text} onChange={e => updateOption(nIdx, oIdx, 'text', e.target.value)} />
                                        <input type="text" placeholder="Наступний ID" value={opt.next} onChange={e => updateOption(nIdx, oIdx, 'next', e.target.value)} />
                                    </div>
                                ))}
                                <button className="dr-add-btn" onClick={() => addOption(nIdx)}>+ Опція</button>
                            </div>
                        ))}
                    </div>
                    <button className="dr-add-btn" onClick={addNode}>+ Новий вузол</button>
                    <button className="dr-admin-btn" style={{marginTop: '20px'}} onClick={handleCreateScenario}>Зберегти сценарій</button>
                </section>
            </div>
        </div>
    );
}