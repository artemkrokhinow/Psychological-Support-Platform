import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SosView({ answers }) {
	const [phase, setPhase] = useState('Вдих');
	const [statusCheck, setStatusCheck] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setPhase(prev => (prev === 'Вдих' ? 'Видих' : 'Вдих'));
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let timeout;
		if (!statusCheck) {
			timeout = setTimeout(() => {
				setStatusCheck(true);
			}, 30000);
		}
		return () => clearTimeout(timeout);
	}, [statusCheck]);

	return (
		<div className="sos-immersive-layout breathing-theme">
			<button
				className="exit-btn"
				onClick={() => navigate('/main', { state: { answers } })}>
				Вийти
			</button>
			<div className="action-zone">
				<div className="stable-breathing-container">
					<div className="breathe-circle-dynamic">
						<span key={phase} className="breathe-text-display">
							{phase}
						</span>
					</div>
				</div>
				{statusCheck && (
					<div className="feedback-overlay">
						<div className="feedback-plate">
							<p className="question-text">Полегшало вам?</p>
							<div className="answer-group">
								<button
									className="btn-yes"
									onClick={() => navigate('/main', { state: { answers } })}>
									Так
								</button>
								<button
									className="btn-no"
									onClick={() => setStatusCheck(false)}>
									Ні
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
