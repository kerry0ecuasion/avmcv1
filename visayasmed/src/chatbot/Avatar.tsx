import React from 'react';
import './Avatar.css';

interface AvatarProps {
  isTyping?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  isTyping = false,
  isSpeaking = false,
  isListening = false,
}) => {
  return (
    <div className="avatar-container">
      <div className="hospital-branding">
        <div className="hospital-badge">VisayasMed</div>
        <p className="hospital-subtitle">Hospital Assistant</p>
      </div>
      <div
        className={`avatar-image-wrapper ${isListening ? 'listening' : ''} ${isTyping ? 'typing' : ''} ${isSpeaking ? 'speaking' : ''}`}
      >
        {isSpeaking ? (
          <video src="/avatar-doctor.mp4" autoPlay loop muted className="avatar-video" />
        ) : (
          <img src="/ai-avatar.png" alt="Doctor Avatar" className="avatar-image" />
        )}

        {isListening && (
          <div className="listening-indicator">
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
          </div>
        )}

        {isSpeaking && (
          <div className="speaking-indicator">
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
            <div className="sound-wave"></div>
          </div>
        )}

        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
};
