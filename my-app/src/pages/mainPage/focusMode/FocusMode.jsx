import React, { useState, useRef, useEffect } from 'react';
import './focusMode.css'

export default function FocusMode({ content, onClose, onSos }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const toggleVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!content) return null;

  return (
    <div className="dr-focus-layout">
      <div className="dr-focus-header">
        <button className="dr-focus-close-btn" onClick={onClose}>✕ Закрити</button>
      </div>

      <main className="dr-focus-content-area">
        {content.type === 'Відео' && (
          <div className="dr-focus-video-wrapper">
            <div className="dr-focus-video-container">
              <video 
                ref={videoRef}
                className="dr-real-video-player"
                src={content.url || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                poster="https://via.placeholder.com/800x450/1A2B48/BCEDF3?text=Механізми+стресу"
                onClick={toggleVideo}
              />
              {!isPlaying && (
                <div className="dr-video-overlay-play" onClick={toggleVideo}>
                  <button className="dr-play-huge">▶️</button>
                </div>
              )}
            </div>
            <h1 className="dr-focus-main-title">{content.title}</h1>
            <div className="dr-focus-text-box">
              <h3>Ключові тези:</h3>
              <p>{content.notes}</p>
            </div>
          </div>
        )}

        {content.type === 'Аудіо' && (
          <div className="dr-focus-audio-wrapper">
            <div className="dr-audio-card">
              <div className={`dr-focus-visualizer ${isPlaying ? 'active' : ''}`}>
                {[...Array(10)].map((_, i) => <div key={i} className="dr-focus-bar"></div>)}
              </div>
              <audio 
                ref={audioRef}
                src={content.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <h1 className="dr-focus-main-title">{content.title}</h1>
              <div className="dr-audio-controls-row">
                <button className="dr-play-circle-real" onClick={toggleAudio}>
                  {isPlaying ? '⏸' : '▶️'}
                </button>
              </div>
            </div>
          </div>
        )}

        {content.type === 'Текст' && (
          <article className="dr-focus-reader-mode">
            <div className="dr-focus-read-progress"></div>
            <h1 className="dr-focus-main-title">{content.title}</h1>
            <div className="dr-focus-article-body">
                <div className="dr-focus-illustration">
                    <p>{content.fullText}</p>
                </div>

            </div>
          </article>
        )}

        <footer className="dr-focus-footer">
          {!showFeedback ? (
            <button className="dr-focus-finish-btn" onClick={() => setShowFeedback(true)}>
              Завершити вивчення
            </button>
          ) : (
            <div className="dr-focus-feedback-card">
              <p>Як змінився ваш стан після цього матеріалу?</p>
              <div className="dr-focus-feedback-group">
                <button className="dr-focus-feedback-btn" onClick={onClose}>Покращився</button>
                <button className="dr-focus-feedback-btn" onClick={onClose}>Без змін</button>
              </div>
            </div>
          )}
        </footer>
      </main>

      <button className="dr-sos-fab" onClick={onSos}>
        <span className="dr-sos-text">SOS</span>
      </button>
    </div>
  );
}