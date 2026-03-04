import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/api';
import './authPage.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = isLogin ? await authAPI.login(formData) : await authAPI.register(formData);
        if (data.token) {
            localStorage.setItem('dr_token', data.token);
            navigate('/start');
        } else {
            alert(data.message || "Помилка");
        }
    };

    const handleGuest = async () => {
        const data = await authAPI.guestLogin(); // Виклик API для гостя
        if (data.token) {
            localStorage.setItem('dr_token', data.token);
            navigate('/start');
        }
    };

    return (
        <div className="dr-auth-container">
            <button className="dr-auth-back-btn" onClick={() => navigate('/main')}>← Назад</button>
            <div className="dr-auth-card">
                <h1 className="dr-auth-title">{isLogin ? 'Увійти' : 'Реєстрація'}</h1>
                <form className="dr-auth-form" onSubmit={handleSubmit}>
                    {!isLogin && <input type="text" placeholder="Ім'я" className="dr-auth-input" onChange={e => setFormData({...formData, username: e.target.value})} />}
                    <input type="email" placeholder="Email" className="dr-auth-input" onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Пароль" className="dr-auth-input" onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="submit" className="dr-auth-submit-btn">{isLogin ? 'Увійти' : 'Почати'}</button>
                </form>
                <div className="dr-auth-footer">
                    <button className="dr-auth-toggle-btn guest" onClick={handleGuest}>Продовжити як гість</button>
                    <button className="dr-auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Створити акаунт' : 'Вже є акаунт?'}
                    </button>
                </div>
            </div>
            <button className="dr-sos-fab" onClick={() => navigate('/sos')}><span className="dr-sos-text">SOS</span></button>
        </div>
    );
}