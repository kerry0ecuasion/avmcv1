import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './Avatar';
import { SendIcon, MicrophoneIcon } from './Icons';
import './ChatbotWidget.css';
import { sendMessageToAPI } from './chatAPI';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  onClose: () => void;
}

const STORAGE_KEY = 'visayasmed-chat-messages-v1';

const QUICK_REPLIES = [
  { id: 'services', label: 'Services & Departments', message: 'What services do you offer?' },
  { id: 'hours', label: 'Hours & Availability', message: 'What are your operating hours?' },
  { id: 'contact', label: 'Contact & Location', message: 'How can I contact the hospital?' },
  { id: 'admission', label: 'Admission Process', message: 'How do I get admitted?' },
  { id: 'insurance', label: 'Insurance & Payment', message: 'What payment options do you accept?' },
  { id: 'visiting', label: 'Visiting Hours', message: 'What are the visiting hours?' },
];

const getSimpleGreeting = (text: string): string | null => {
  const lowered = text.toLowerCase().trim();
  const greetings: Record<string, string> = {
    hi: "Hello! Welcome to VisayasMed Hospital. I'm your hospital assistant. How can I help you today?",
    hello: "Hello! Welcome to VisayasMed Hospital. I'm your hospital assistant. How can I help you today?",
    hey: "Hey there! I'm the VisayasMed Hospital Assistant. What information can I provide for you?",
    'hi there': "Hi! Welcome to VisayasMed. How can I assist you?",
    'hello there': "Hello! I'm the VisayasMed Hospital Assistant. What can I help you with?",
    'how are you': "I'm doing well, thank you for asking! I'm here to help with hospital information. How can I assist you?",
    'what can you do':
      "I'm here to help with general information about VisayasMed Hospital! I can tell you about our services, departments, visiting hours, contact information, and admission procedures. What would you like to know?",
  };
  return greetings[lowered] ?? null;
};

const isMedicalAdviceQuestion = (text: string): boolean => {
  const lowered = text.toLowerCase();
  const keywords = [
    'diagnose', 'diagnosis', 'symptom', 'symptoms', 'treatment', 'medicine',
    'medication', 'pill', 'dose', 'dosage', 'side effect', 'prescribe', 'prescription',
  ];
  return keywords.some((kw) => lowered.includes(kw));
};

const getHospitalInfo = (text: string): string | null => {
  const lowered = text.toLowerCase();

  if (lowered.includes('service') || lowered.includes('department') || lowered.includes('facility'))
    return "VisayasMed Hospital offers comprehensive services including Emergency Medicine, Cardiology, Orthopedics, General Surgery, Pediatrics, Obstetrics & Gynecology, Radiology, Laboratory Services, and 24/7 Nursing Care. Is there a specific department you'd like to know more about?";
  if (lowered.includes('hour') || lowered.includes('open') || lowered.includes('schedule'))
    return "VisayasMed Hospital operates 24/7. Our Emergency Department is always open. Outpatient clinics run Monday–Friday 7:00 AM–6:00 PM, Saturday 7:00 AM–2:00 PM.";
  if (lowered.includes('contact') || lowered.includes('phone') || lowered.includes('location'))
    return "Reach us at: Main Office: +63-xx-xxx-xxxx | Emergency: +63-xx-xxx-xxxx | Appointments: +63-xx-xxx-xxxx | Email: info@visayasmed.com";
  if (lowered.includes('admission') || lowered.includes('admit'))
    return "To be admitted, visit our Registration Office or call ahead. Bring a valid ID and insurance information. For emergencies, go directly to our Emergency Department.";
  if (lowered.includes('insurance') || lowered.includes('payment') || lowered.includes('bill'))
    return "We accept major insurance providers, HMOs, PhilHealth, and private insurance. Flexible payment plans are available. Contact our Billing Department at ext. 1234 for details.";
  if (lowered.includes('visit'))
    return "Visiting hours are 10:00 AM to 8:00 PM daily. ICU visiting is limited to immediate family. Up to 2 visitors per patient at a time.";
  return null;
};

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<{
          id: string; type: 'user' | 'bot'; text: string; timestamp: string;
        }>;
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {}
    return [{
      id: '0', type: 'bot',
      text: "Hello! I'm your VisayasMed Hospital Assistant. I can help with hospital services, departments, schedules, contact details, and directions. I provide general hospital information only and cannot offer medical diagnosis or treatment advice.",
      timestamp: new Date(),
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const cancelledByUserRef = useRef(false);
  const inputValueRef = useRef(input);

  useEffect(() => { inputValueRef.current = input; }, [input]);

  useEffect(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsListening(true);

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
      }
      if (finalTranscript) setInput(finalTranscript.trim());
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (cancelledByUserRef.current) { cancelledByUserRef.current = false; return; }
      const currentInput = inputValueRef.current.trim();
      if (currentInput) {
        setTimeout(() => handleSendMessage(null, currentInput), 300);
      }
    };

    recognitionRef.current.onerror = () => setIsListening(false);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      const serializable = messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {}
  }, [messages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes('Siri') || v.name.includes('Victoria') || v.lang?.includes('en-GB')
    ) || voices.find((v) => v.name.includes('Google') || v.name.includes('Alex'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) return;
    if (!isListening) {
      setInput('');
      cancelledByUserRef.current = false;
      recognitionRef.current.start();
    } else {
      cancelledByUserRef.current = true;
      recognitionRef.current.stop();
    }
  };

  const handleSendMessage = async (e: any, overrideMessage?: string) => {
    e?.preventDefault?.();
    const userInput = (overrideMessage ?? input).trim();
    if (!userInput || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: userInput, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    if (!overrideMessage) setInput('');
    setIsLoading(true);

    const greetingResponse = getSimpleGreeting(userInput);
    if (greetingResponse) {
      const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'bot', text: greetingResponse, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      speakResponse(greetingResponse);
      return;
    }

    if (isMedicalAdviceQuestion(userInput)) {
      const reply = "I'm here to help with general information about VisayasMed only. I can't provide diagnosis, treatment recommendations, or medication advice. Please consult a licensed physician or visit our hospital for medical concerns.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: reply, timestamp: new Date() }]);
      setIsLoading(false);
      speakResponse(reply);
      return;
    }

    try {
      const botReply = await sendMessageToAPI(userInput);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: botReply, timestamp: new Date() }]);
      setIsLoading(false);
      speakResponse(botReply);
    } catch {
      const fallback = getHospitalInfo(userInput) ||
        "I'm sorry, the assistant service is currently unavailable. I can still help with general hospital information! Ask me about our services, departments, visiting hours, or how to contact us.";
      setMessages((prev) => [...prev, { id: (Date.now() + 2).toString(), type: 'bot', text: fallback, timestamp: new Date() }]);
      setIsLoading(false);
      speakResponse(fallback);
    }
  };

  const handleClearChat = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setIsSpeaking(false);
    setIsListening(false);
    setMessages([{
      id: '0', type: 'bot',
      text: "Hello! I'm your VisayasMed Hospital Assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
  };

  const lastBotIndex = [...messages].map((m, i) => ({ ...m, i })).filter((m) => m.type === 'bot').pop()?.i ?? -1;

  return (
    <div className="chatbot-container">
      <div className="chatbot-main">
        <div className="avatar-section">
          <Avatar isTyping={isLoading} isSpeaking={isSpeaking} isListening={isListening} />
          {isSpeaking && <div className="speaking-label">Speaking...</div>}
          {isListening && <div className="listening-label">Listening...</div>}
        </div>

        <div className="chat-section">
          <div className="chat-header">
            <div className="chat-header-content">
              <h2>VisayasMed Hospital Chat</h2>
              <p className="header-status">Hospital Information Assistant</p>
            </div>
            <button className="chatbot-close-btn" onClick={onClose} title="Close (Esc)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <div className={`message message-${message.type}`}>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {message.type === 'bot' && index === lastBotIndex && (
                  <div className="quick-replies-section">
                    <p className="quick-replies-label">Quick Questions:</p>
                    <div className="quick-replies-grid">
                      {QUICK_REPLIES.map((reply) => (
                        <button
                          key={reply.id}
                          className="quick-reply-btn"
                          onClick={() => handleSendMessage(null, reply.message)}
                          disabled={isLoading || isSpeaking}
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {isLoading && (
              <div className="message message-bot loading">
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="input-section">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or use voice..."
              disabled={isLoading || isSpeaking || isListening}
              className="chat-input"
              autoFocus
            />
            <button
              type="button"
              onClick={handleStartListening}
              disabled={isLoading || isSpeaking}
              className={`voice-button ${isListening ? 'active' : ''}`}
              title="Voice input"
            >
              <MicrophoneIcon size={20} color="currentColor" />
            </button>
            <button
              type="submit"
              disabled={isLoading || isSpeaking || isListening || !input.trim()}
              className="send-button"
              title="Send message"
            >
              {isLoading ? '...' : <SendIcon size={20} color="currentColor" />}
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              disabled={isLoading || isSpeaking || isListening}
              className="clear-button"
              title="Clear chat history"
            >
              &#x21BB;
            </button>
          </form>

          <div className="chat-footer">
            <p className="disclaimer">
              Type or click the mic to speak. This assistant provides general hospital information only. For emergencies, call our hotline directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
