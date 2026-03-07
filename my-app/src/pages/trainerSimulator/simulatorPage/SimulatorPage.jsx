import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import "./simulatorPage.css";

export default function SimulatorPage() {
	const { id } = useParams();

	const navigate = useNavigate();
	const chatEndRef = useRef(null);
	const [scenario, setScenario] = useState(null);
	const [history, setHistory] = useState([]);
	const [currentNodeId, setCurrentNodeId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isFinished, setIsFinished] = useState(false);
	const [progress, setProgress] = useState(5);

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		api
			.getScenarioById(id)
			.then((data) => {
				if (data && data.nodes) {
					setScenario(data);
					const startNodeId = data.nodes["start"]
						? "start"
						: Object.keys(data.nodes)[0];
					setCurrentNodeId(startNodeId);
					setHistory([{ role: "bot", text: data.nodes[startNodeId].text }]);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [id]);

	useEffect(() => {
		scrollToBottom();
	}, [history, isFinished]);

	if (loading) return <div className="dr-sim-loader">Завантаження...</div>;
	if (!scenario || !currentNodeId)
		return <div className="dr-sim-loader">Сценарій не знайдено</div>;

	const currentNode = scenario.nodes[currentNodeId];

	const handleOption = (option) => {
		const nextId = option.next;
		const newHistory = [...history, { role: "user", text: option.text }];

		if (!nextId || !scenario.nodes[nextId]) {
			setHistory(newHistory);
			setIsFinished(true);
			setProgress(100);
			return;
		}

		const nextNode = scenario.nodes[nextId];
		setHistory([...newHistory, { role: "bot", text: nextNode.text }]);
		setCurrentNodeId(nextId);

		if (nextNode.isFinal) {
			setIsFinished(true);
			setProgress(100);
		} else {
			setProgress((prev) => Math.min(prev + 15, 90));
		}
	};

	return (
		<div className="dr-trainer-layout">
			<div className="dr-trainer-progress-track">
				<div
					className="dr-trainer-progress-fill"
					style={{ width: `${progress}%` }}
				></div>
			</div>

			<header className="dr-trainer-header">
				<button className="dr-back-btn" onClick={() => navigate("/exercises")}>
					← Вийти
				</button>
				<span className="dr-trainer-title">{scenario.name}</span>
				<div style={{ width: "80px" }}></div>
			</header>

			<main className="dr-chat-area">
				<div className="dr-message-column">
					{history.map((msg, idx) => (
						<div key={idx} className={`dr-bubble ${msg.role}`}>
							{msg.text}
						</div>
					))}

					{isFinished && (
						<div className="dr-feedback-block">
							<div className="dr-feedback-icon">🌟</div>
							<h3>Вправу завершено!</h3>
							<p>Дякую за практику. Сподіваюсь, тобі стало трохи краще.</p>
						</div>
					)}

					<div ref={chatEndRef} />
				</div>
			</main>

			<footer className="dr-choice-panel">
				<div className="dr-options-stack">
					{isFinished ? (
						<button
							className="dr-final-btn"
							onClick={() => navigate("/exercises")}
						>
							Повернутись до списку
						</button>
					) : (
						currentNode?.options?.map((opt, idx) => (
							<button
								key={idx}
								className="dr-choice-btn"
								onClick={() => handleOption(opt)}
							>
								{opt.text}
							</button>
						))
					)}
				</div>
			</footer>

			<button className="dr-sos-fab-trainer" onClick={() => navigate("/sos")}>
				SOS
			</button>
		</div>
	);
}
