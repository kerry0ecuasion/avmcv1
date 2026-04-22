import React, { useState } from 'react';
import { ChatbotWidget } from '../chatbot/ChatbotWidget';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes chatbot-shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-6deg); }
          20%, 40%, 60%, 80% { transform: rotate(6deg); }
        }

        .chatbot-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0088b4 0%, #00a8e8 100%);
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 136, 180, 0.4);
          cursor: pointer;
          z-index: 1000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;

        }

        .chatbot-button:hover {
          transform: scale(1.1);
        }

        .chatbot-button:active {
          transform: scale(0.95);
        }

        .chatbot-button.open {
          animation: none;
        }

        .chatbot-message-bubble {
          position: fixed;
          bottom: 8rem;
          right: 2rem;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 16px;
          padding: 10px 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 0 20px rgba(6, 182, 212, 0.08);
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          max-width: 180px;
          text-align: center;
          animation: bubble-float 2.5s ease-in-out infinite;
          z-index: 999;
          pointer-events: none;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dark .chatbot-message-bubble {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: rgba(6, 182, 212, 0.15);
          color: #e2e8f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.1);
        }

        .chatbot-message-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 24px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #f0f9ff;
        }

        .dark .chatbot-message-bubble::after {
          border-top-color: #0f172a;
        }

        @keyframes bubble-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @media (max-width: 640px) {
          .chatbot-button { bottom: 1.5rem; right: 1.5rem; width: 50px; height: 50px; }
          .chatbot-message-bubble { bottom: 7rem; right: 1.5rem; max-width: 150px; font-size: 12px; }
        }
      `}</style>

      {!isOpen && (
        <div className="chatbot-message-bubble">Hello! Need help?</div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        title={isOpen ? 'Close chat' : 'Chat with MedHelper'}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="chatbot-popup-overlay"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="VisayasMed Chat Assistant"
        >
          <div
            className="chatbot-popup-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatbotWidget onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
