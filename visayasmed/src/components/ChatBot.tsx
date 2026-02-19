import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '🏥 Kumusta! I\'m MedHelper, VisayasMed\'s intelligent health companion. Whether you\'re looking for our specialist doctors, need guidance on medical services, or have health concerns, I\'m here to assist. Ask me about our cardiology, orthopedic, pediatric, or any other services! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to AI
  const sendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call AI API (using environment variable for API key)
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        // Fallback response if no API key is configured
        const fallbackResponse: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content:
            '⚕️ VisayasMed Connection Offline: I\'m in limited mode right now, but I can still help! I have access to information about our world-class medical facilities, 24/7 emergency services, specialized departments, and doctor profiles. For real-time appointment booking or complex medical queries, please visit our main website or call us at our hotline. What would you like to know about VisayasMed?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackResponse]);
        setIsLoading(false);
        return;
      }

      // Use ChatGPT API (configured via VITE_OPENAI_API_KEY)
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages.map((msg) => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content,
            })).concat({
              role: 'user',
              content: trimmedInput,
            }),
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from ChatGPT');
        }

        const data = await response.json();
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content: data.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      }
      // Use Gemini API (configured via VITE_GEMINI_API_KEY)
      else if (import.meta.env.VITE_GEMINI_API_KEY) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: trimmedInput,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get response from Gemini');
        }

        const data = await response.json();
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content:
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I couldn\'t process that request.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content:
          '🏥 Oops! A system error occurred while processing your query. Please try again or contact VisayasMed\'s support team at our main office. For urgent medical concerns, please dial our emergency hotline. We apologize for the inconvenience!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: '✨ Fresh start! I\'m MedHelper, back and ready to assist. Whether you need information about our specialized departments, want to find a doctor, or have health inquiries, I\'m here to help. What brings you to VisayasMed today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      <style>{`
        /* Keyframe Animations */
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-8deg); }
          20%, 40%, 60%, 80% { transform: rotate(8deg); }
        }

        @keyframes shake-gentle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          75% { transform: translateX(3px) rotate(2deg); }
        }

        /* Chatbot Button Styling */
        .chatbot-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 100px;
          height: 100px;
          background: transparent;
          border: none;
          border-radius: 8px;
          box-shadow: none;
          cursor: pointer;
          z-index: 1000;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: shake 2.5s ease-in-out infinite;
        }

        .chatbot-button:hover {
          animation: shake 0.5s ease-in-out infinite;
          transform: scale(1.15);
        }

        .chatbot-button:active {
          transform: scale(0.95);
        }

        .robot-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .message-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        /* Chat Widget Styling */
        .chat-widget {
          position: fixed;
          bottom: 7rem;
          right: 2rem;
          width: 100%;
          max-width: 420px;
          height: 600px;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: all 0.3s ease;
        }

        /* Light Mode */
        .chat-widget {
          background: #FFFFFF;
          color: #212529;
        }

        .chat-header {
          background: #F8F9FA;
          color: #212529;
          border-bottom: 1px solid #DEE2E6;
          padding: 1.5rem;
          border-radius: 1rem 1rem 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          color: #212529;
        }

        .chat-header p {
          font-size: 0.75rem;
          margin: 0.25rem 0 0 0;
          color: #6C757D;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          max-width: 100%;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 1.125rem;
          max-width: 85%;
          word-wrap: break-word;
          font-size: 0.9375rem;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .message.user .message-bubble {
          background: #0066cc;
          color: #FFFFFF;
          border-bottom-right-radius: 0.25rem;
        }

        .message.ai .message-bubble {
          background: #E9ECEF;
          color: #212529;
          border-bottom-left-radius: 0.25rem;
        }

        .message-time {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }

        .message.user .message-time {
          color: #AED6F1;
        }

        .message.ai .message-time {
          color: #6C757D;
        }

        .chat-input {
          background: #FFFFFF;
          border: 1px solid #DEE2E6;
          color: #212529;
          font-size: 0.9375rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .chat-input::placeholder {
          color: #6C757D;
        }

        .input-container {
          border-top: 1px solid #DEE2E6;
          padding: 1rem;
          background: #FFFFFF;
          border-radius: 0 0 1rem 1rem;
        }

        .input-tip {
          font-size: 0.75rem;
          margin-top: 0.5rem;
          color: #6C757D;
        }

        .typing-indicator {
          display: flex;
          gap: 0.5rem;
        }

        .typing-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: #212529;
          animation: bounce 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        /* Dark Mode */
        .dark-mode .chat-widget {
          background: #1E1E1E;
          color: #E0E0E0;
        }

        .dark-mode .chat-header {
          background: #2D2D2D;
          color: #F5F5F5;
          border-bottom: 1px solid #4A4A4A;
        }

        .dark-mode .chat-header h3 {
          color: #F5F5F5;
        }

        .dark-mode .chat-header p {
          color: #9E9E9E;
        }

        .dark-mode .messages-container {
          background: #1E1E1E;
        }

        .dark-mode .message.ai .message-bubble {
          background: #3A3A3A;
          color: #E0E0E0;
        }

        .dark-mode .message.user .message-bubble {
          background: #4A90E2;
          color: #FFFFFF;
        }

        .dark-mode .message.ai .message-time {
          color: #9E9E9E;
        }

        .dark-mode .message.user .message-time {
          color: #B0D4FA;
        }

        .dark-mode .chat-input {
          background: #2D2D2D;
          border: 1px solid #4A4A4A;
          color: #F5F5F5;
        }

        .dark-mode .chat-input:focus {
          border-color: #4A90E2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
        }

        .dark-mode .chat-input::placeholder {
          color: #9E9E9E;
        }

        .dark-mode .input-container {
          background: #2D2D2D;
          border-top: 1px solid #4A4A4A;
        }

        .dark-mode .input-tip {
          color: #9E9E9E;
        }

        .dark-mode .typing-dot {
          background: #E0E0E0;
        }

        /* Visibility States */
        .chat-widget.hidden {
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          pointer-events: none;
        }

        .chat-widget.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Button States */
        .chatbot-button.open {
          animation: none;
        }

        /* Scrollbar Styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #DEE2E6;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #ADB5BD;
        }

        .dark-mode .messages-container::-webkit-scrollbar-thumb {
          background: #4A4A4A;
        }

        .dark-mode .messages-container::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        /* Button Elements */
        .clear-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          transition: opacity 0.2s;
        }

        .clear-btn:hover {
          opacity: 0.8;
        }

        .light-mode .clear-btn {
          color: #0066cc;
        }

        .dark-mode .clear-btn {
          color: #4A90E2;
        }

        .send-btn {
          background: #0066cc;
          border: none;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
          min-width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover:not(:disabled) {
          background: #0052a3;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dark-mode .send-btn {
          background: #4A90E2;
        }

        .dark-mode .send-btn:hover:not(:disabled) {
          background: #357abd;
        }

        /* Message Bubble above button */
        .chatbot-message-bubble {
          position: fixed;
          bottom: 8.5rem;
          right: 2rem;
          background: white;
          border: 2px solid #333;
          border-radius: 20px;
          padding: 10px 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 13px;
          font-weight: 500;
          color: #333;
          max-width: 180px;
          text-align: center;
          animation: float-pulse 2s ease-in-out infinite;
          z-index: 999;
        }

        .chatbot-message-bubble::after {
          content: '';
          position: absolute;
          bottom: -12px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid white;
        }

        .chatbot-message-bubble::before {
          content: '';
          position: absolute;
          bottom: -16px;
          right: 17px;
          width: 0;
          height: 0;
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          border-top: 16px solid #333;
        }

        @keyframes float-pulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 640px) {
          .chatbot-message-bubble {
            bottom: 7.5rem;
            right: 1.5rem;
            max-width: 150px;
            font-size: 12px;
          }
        }

        @media (max-width: 640px) {
          .chat-widget {
            max-width: 100%;
            right: 0;
            bottom: 0;
            height: 100vh;
            border-radius: 0;
          }

          .chatbot-button {
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>

      {/* Floating Chat Button */}
      <div className="chatbot-message-bubble">
        Hello! Need help?
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        aria-label="Open AI Chat Assistant"
        title="Chat with AI Assistant"
      >
        {isOpen ? (
          // Close X icon
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Doctor/Chatbot character image
          <img 
            src="/avatar.png" 
            alt="MedHelper Chat Assistant" 
            className="object-contain"
            style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'contain' }}
          />
        )}
      </button>

      {/* Chat Widget */}
      <div className={`chat-widget ${isDarkMode ? 'dark-mode' : ''} ${isOpen ? 'visible' : 'hidden'}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div>
            <h3>MedHelper - VisayasMed</h3>
            <p>Your trusted health partner 24/7</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="clear-btn"
              title="Clear chat"
              aria-label="Clear chat history"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user' : 'ai'}`}
            >
              <div className="message-bubble">
                <p className="whitespace-pre-wrap wrap-break-word m-0">{message.content}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="input-container">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="chat-input flex-1"
              aria-label="Chat message input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
              aria-label="Send message"
              title="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="input-tip">
            � Press Enter to send. VisayasMed AI-powered health assistance | For emergencies, call our hotline.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
