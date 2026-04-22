import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';
import './ChatbotWidget.css';
import { sendMessageToAPI } from './chatAPI';
import { faqsService, serviceService } from '../utils/dataService';
import { defaultFaqs } from '../components/FAQs';
import { defaultServices } from '../components/Services';

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
  const [contextData, setContextData] = useState<string>('');
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadContext() {
      try {
        const [faqs, services] = await Promise.all([
          faqsService.getFaqs(),
          serviceService.getServices()
        ]);

        const finalFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
        const finalServices = services && services.length > 0 ? services : defaultServices;

        let ctx = '';
        if (finalFaqs && finalFaqs.length > 0) {
          setFaqsList(finalFaqs);
          ctx += 'HOSPITAL FAQs:\n' + finalFaqs.map((f: any) => `Q: ${f.q}\nA: ${f.a}`).join('\n') + '\n\n';
        }
        if (finalServices && finalServices.length > 0) {
          setServicesList(finalServices);
          ctx += 'HOSPITAL SERVICES:\n' + finalServices.map((s: any) => `- ${s.title}: ${s.description || s.desc}`).join('\n') + '\n\n';
        }
        setContextData(ctx);
      } catch (err) {
        console.warn('Failed to load chat context', err);
      }
    }
    loadContext();
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      return;
    }

    if (isMedicalAdviceQuestion(userInput)) {
      const reply = "I'm here to help with general information about VisayasMed only. I can't provide diagnosis, treatment recommendations, or medication advice. Please consult a licensed physician or visit our hospital for medical concerns.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: reply, timestamp: new Date() }]);
      setIsLoading(false);
      return;
    }

    // Local Search Logic against Front-end Data
    const lowered = userInput.toLowerCase();
    let localAnswer = null;

    if (lowered.includes('hour') || lowered.includes('time') || lowered.includes('open')) {
      const hoursFaq = faqsList.find(f => f.q.toLowerCase().includes('hour') || f.q.toLowerCase().includes('time'));
      if (hoursFaq) localAnswer = hoursFaq.a;
    } else if (lowered.includes('appoint') || lowered.includes('book') || lowered.includes('schedule')) {
      const apptFaq = faqsList.find(f => f.q.toLowerCase().includes('appoint') || f.q.toLowerCase().includes('book'));
      if (apptFaq) localAnswer = apptFaq.a;
    } else if (lowered.includes('bring') || lowered.includes('need')) {
      const bringFaq = faqsList.find(f => f.q.toLowerCase().includes('bring'));
      if (bringFaq) localAnswer = bringFaq.a;
    } else if (lowered.includes('insur') || lowered.includes('pay') || lowered.includes('hmo') || lowered.includes('accept')) {
      const payFaq = faqsList.find(f => f.q.toLowerCase().includes('insur') || f.q.toLowerCase().includes('pay') || f.q.toLowerCase().includes('accept'));
      if (payFaq) localAnswer = payFaq.a;
    }

    if (!localAnswer) {
      const words = lowered.split(/\s+/).filter(w => w.length > 4);
      for (const faq of faqsList) {
        const qLower = faq.q.toLowerCase();
        if (qLower.includes(lowered) || lowered.includes(qLower) || words.some(w => qLower.includes(w))) {
          localAnswer = faq.a;
          break;
        }
      }
    }

    if (!localAnswer) {
      const words = lowered.split(/\s+/).filter(w => w.length > 4);
      for (const service of servicesList) {
        const tLower = service.title.toLowerCase();
        if (tLower.includes(lowered) || lowered.includes(tLower) || words.some(w => tLower.includes(w))) {
          localAnswer = `${service.title}: ${service.description || service.desc}`;
          break;
        }
      }
    }

    if (localAnswer) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: localAnswer, timestamp: new Date() }]);
      setIsLoading(false);
      return;
    }

    try {
      const botReply = await sendMessageToAPI(userInput, contextData);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: botReply, timestamp: new Date() }]);
      setIsLoading(false);
    } catch {
      const fallback = "I'm sorry, the assistant service is currently unavailable. Please check our website pages directly for more information.";
      setMessages((prev) => [...prev, { id: (Date.now() + 2).toString(), type: 'bot', text: fallback, timestamp: new Date() }]);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: '0', type: 'bot',
      text: "Hello! I'm your VisayasMed Hospital Assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
  };
  return (
    <div className="chatbot-container">
      <div className="chatbot-main">
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

                {message.type === 'bot' && index === 0 && (
                  <div className="quick-replies-section">
                    <p className="quick-replies-label">Quick Questions:</p>
                    <div className="quick-replies-grid">
                      {QUICK_REPLIES.map((reply) => (
                        <button
                          key={reply.id}
                          className="quick-reply-btn"
                          onClick={() => handleSendMessage(null, reply.message)}
                          disabled={isLoading}
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
              placeholder="Type your message..."
              disabled={isLoading}
              className="chat-input"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="send-button"
              title="Send message"
            >
              {isLoading ? '...' : <SendIcon size={20} color="currentColor" />}
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              disabled={isLoading}
              className="clear-button"
              title="Clear chat history"
            >
              &#x21BB;
            </button>
          </form>

          <div className="chat-footer">
            <p className="disclaimer">
              This assistant provides general hospital information only. For emergencies, call our hotline directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
