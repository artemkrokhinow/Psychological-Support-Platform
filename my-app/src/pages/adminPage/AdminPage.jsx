
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI, scenarioAPI } from '../../api/api';
import './adminPage.css';

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('content');

    // State for material creation
    const [materialForm, setMaterialForm] = useState({ 
        title: '', 
        desc: '', 
        type: 'text', 
        icon: '📖', 
        content: '' 
    });

    // State for scenario creation
    const [scenarioTitle, setScenarioTitle] = useState('');
    const [nodes, setNodes] = useState([
        { id: 'start', text: '', isFinal: false, options: [{ text: '', next: '', feedback: '' }] }
    ]);

    const handleCreateMaterial = async (e) => {
        e.preventDefault();
        try {
            const res = await contentAPI.createMaterial(materialForm);
            if (res._id) {
                alert("Матеріал успішно створено!");
                setMaterialForm({ title: '', desc: '', type: 'text', icon: '📖', content: '' });
            }
        } catch (error) {
            alert("Помилка при створенні матеріалу.");
        }
    };

    const addNode = () => {
        setNodes([...nodes, { id: `node_${nodes.length}`, text: '', isFinal: false, options: [{ text: '', next: '', feedback: '' }] }]);
    };

    const updateNode = (index, field, value) => {
        const newNodes = [...nodes];
        newNodes[index][field] = value;
        setNodes(newNodes);
    };

    const addOption = (nodeIndex) => {
        const newNodes = [...nodes];
        newNodes[nodeIndex].options.push({ text: '', next: '', feedback: '' });
        setNodes(newNodes);
    };

    const updateOption = (nodeIndex, optionIndex, field, value) => {
        const newNodes = [...nodes];
        newNodes[nodeIndex].options[optionIndex][field] = value;
        setNodes(newNodes);
    };
    
    const removeOption = (nodeIndex, optionIndex) => {
        const newNodes = [...nodes];
        newNodes[nodeIndex].options.splice(optionIndex, 1);
        setNodes(newNodes);
    };

    const handleCreateScenario = async () => {
        const nodesObject = nodes.reduce((acc, node) => {
            acc[node.id] = { text: node.text, isFinal: node.isFinal, options: node.options };
            return acc;
        }, {});

        try {
            await scenarioAPI.createScenario({ title: scenarioTitle, nodes: nodesObject });
            alert("Сценарій успішно збережено!");
        } catch (error) {
            alert("Помилка при збереженні сценарію.");
        }
    };

    const renderContentForm = () => (
        <div className="tab-content">
            <form onSubmit={handleCreateMaterial} className="form-grid">
                <div className="form-group" style={{gridColumn: 'span 2'}}>
                    <label>Заголовок</label>
                    <input type="text" value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Тип контенту</label>
                    <select value={materialForm.type} onChange={e => setMaterialForm({...materialForm, type: e.target.value})}>
                        <option value="text">📄 Текст</option>
                        <option value="video">🎥 Відео (YouTube)</option>
                        <option value="audio">🎵 Аудіо (URL)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Emoji іконка</label>
                    <input type="text" style={{width: '100px'}} value={materialForm.icon} onChange={e => setMaterialForm({...materialForm, icon: e.target.value})} />
                </div>
                <div className="form-group" style={{gridColumn: 'span 2'}}>
                    <label>Короткий опис</label>
                    <textarea value={materialForm.desc} onChange={e => setMaterialForm({...materialForm, desc: e.target.value})} required />
                </div>
                <div className="form-group" style={{gridColumn: 'span 2'}}>
                    <label>Вміст</label>
                    {materialForm.type === 'text' ? (
                        <textarea 
                            placeholder="Повний текст статті..." 
                            value={materialForm.content} 
                            onChange={e => setMaterialForm({...materialForm, content: e.target.value})} 
                        />
                    ) : (
                        <input 
                            type="text" 
                            placeholder={materialForm.type === 'video' ? "Посилання на YouTube (https://...)" : "URL аудіо (mp3/ogg)"} 
                            value={materialForm.content} 
                            onChange={e => setMaterialForm({...materialForm, content: e.target.value})} 
                        />
                    )}
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">Опублікувати матеріал</button>
                </div>
            </form>
        </div>
    );

    const renderScenarioBuilder = () => (
        <div className="tab-content">
            <div className="scenario-builder">
                <div className="form-group">
                    <label>Назва сценарію</label>
                    <input type="text" value={scenarioTitle} onChange={e => setScenarioTitle(e.target.value)} />
                </div>

                {nodes.map((node, nIdx) => (
                    <div key={nIdx} className="node-card">
                        <div className="node-header">
                            <input type="text" value={node.id} onChange={e => updateNode(nIdx, 'id', e.target.value)} placeholder="ID вузла (напр. start)"/>
                            <div className="checkbox-group">
                                <input type="checkbox" checked={node.isFinal} onChange={e => updateNode(nIdx, 'isFinal', e.target.checked)} id={`isFinal-${nIdx}`} />
                                <label htmlFor={`isFinal-${nIdx}`}>Кінцевий вузол</label>
                            </div>
                        </div>
                        <div className="node-body">
                            <textarea placeholder="Текст, який буде говорити бот..." value={node.text} onChange={e => updateNode(nIdx, 'text', e.target.value)} />
                        </div>
                        {!node.isFinal && (
                            <div className="options-list">
                                {node.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="option-item">
                                        <input type="text" placeholder="Текст опції" value={opt.text} onChange={e => updateOption(nIdx, oIdx, 'text', e.target.value)} />
                                        <input type="text" placeholder="ID наступного вузла" value={opt.next} onChange={e => updateOption(nIdx, oIdx, 'next', e.target.value)} />
                                        <button className="remove-button" onClick={() => removeOption(nIdx, oIdx)}>×</button>
                                    </div>
                                ))}
                                <button className="add-button" style={{alignSelf: 'flex-start'}} onClick={() => addOption(nIdx)}>+ Додати опцію</button>
                            </div>
                        )}
                    </div>
                ))}
                
                <div className="button-row">
                    <button className="add-button" onClick={addNode}>+ Додати вузол</button>
                    <button className="submit-button" onClick={handleCreateScenario}>Зберегти сценарій</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Адмін-центр «Прихисток»</h1>
                <button className="back-button" onClick={() => navigate('/main')}>← На головну</button>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
                    Керування контентом
                </button>
                <button className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`} onClick={() => setActiveTab('scenarios')}>
                    Конструктор сценаріїв
                </button>
            </div>

            {activeTab === 'content' ? renderContentForm() : renderScenarioBuilder()}
        </div>
    );
}
