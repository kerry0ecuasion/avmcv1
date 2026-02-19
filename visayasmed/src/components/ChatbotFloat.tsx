import React from 'react';

const ChatbotFloat: React.FC = () => {
  return (
    <a
      href="https://chat.openai.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
      aria-label="Open AI Chat Assistant"
      title="Chat with AI Assistant"
    >
      {/* Robot/Chatbot icon */}
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Robot head */}
        <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.8" />
        {/* Robot eyes */}
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <circle cx="16" cy="10" r="1.5" fill="white" />
        {/* Robot mouth */}
        <path d="M8 13 L16 13" stroke="white" strokeWidth="1" strokeLinecap="round" />
        {/* Robot body connector */}
        <rect x="10" y="18" width="4" height="2" fill="currentColor" opacity="0.6" />
        {/* Left antenna */}
        <line x1="6" y1="6" x2="4" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right antenna */}
        <line x1="18" y1="6" x2="20" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </a>
  );
};

export default ChatbotFloat;
