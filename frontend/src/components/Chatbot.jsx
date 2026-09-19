import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the WasteX assistant. I can help you understand our work, purpose, and objectives. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const demoQuestions = [
    "What is the purpose of WasteX?",
    "How does WasteX work?",
    "What are the main objectives of this platform?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];

      const response = await fetch(
        "http://localhost:8000/chat",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            messages: allMessages
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error("The AI model is currently loading. Please wait about 30 seconds and try again.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized: Please ensure your Hugging Face API key in the backend .env file is correct.");
        }
        throw new Error(errData.detail || "Failed to fetch response from backend API.");
      }

      const data = await response.json();
      const botResponseText = data.reply || "Sorry, I couldn't generate a response.";

      setMessages(prev => [...prev, { role: 'assistant', content: botResponseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: error.message || 'Oops! Something went wrong. Please check your network and try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[550px] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">WasteX Assistant</h3>
                <p className="text-emerald-100 text-xs flex items-center gap-1 mt-0.5">
                  <Sparkles size={12} /> AI Powered
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${msg.role === 'user' ? 'bg-gray-200' : 'bg-white shadow-sm border border-gray-200'}`}>
                  {msg.role === 'user' ? (
                    user?.photoURL ? (
                      <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <User size={16} className="text-gray-600" />
                    )
                  ) : (
                    <Bot size={18} className="text-emerald-600" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3.5 text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-gray-700 rounded-2xl rounded-tl-sm border border-gray-100'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                   <Bot size={18} className="text-emerald-600" />
                </div>
                <div className="max-w-[75%] p-4 bg-white text-gray-500 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-xs text-gray-400 font-medium px-1">Suggested questions:</span>
                {demoQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-left text-sm bg-emerald-50/50 border border-emerald-100 text-emerald-700 px-3.5 py-2.5 rounded-xl hover:bg-emerald-100 hover:border-emerald-200 transition-all duration-200 shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex gap-2 items-center bg-gray-50 rounded-full p-1.5 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-black placeholder-gray-500 focus:outline-none disabled:opacity-50"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center"
                disabled={isLoading || !input.trim()}
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageSquare size={26} className="group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
