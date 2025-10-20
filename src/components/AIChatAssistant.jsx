import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Welcome to Serenity Home! I\'m your AI wellness consultant. I can help you find the perfect products, answer questions about our tea sets and diffusers, or assist with orders. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const chatButtonRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setUnreadCount(0);
      setShowPrompt(false);
    }
  }, [isOpen]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatWindowRef.current && chatButtonRef.current) {
        const isClickedOutside = !chatWindowRef.current.contains(event.target) && !chatButtonRef.current.contains(event.target);
        
        if (isClickedOutside) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Trigger gentle prompts as user browses
  useEffect(() => {
    const prompts = [
      { message: "👋 Need help finding the perfect diffuser?", delay: 8000 },
      { message: "🍵 Curious about our tea ceremony sets?", delay: 15000 },
      { message: "💬 Have questions? I'm here to help!", delay: 25000 },
    ];

    let currentPrompt = 0;
    
    const showNextPrompt = () => {
      if (!isOpen && currentPrompt < prompts.length) {
        setPromptMessage(prompts[currentPrompt].message);
        setShowPrompt(true);
        
        setTimeout(() => {
          setShowPrompt(false);
        }, 5000);
        
        currentPrompt++;
        
        if (currentPrompt < prompts.length) {
          setTimeout(showNextPrompt, prompts[currentPrompt].delay);
        }
      }
    };

    const timer = setTimeout(showNextPrompt, prompts[0].delay);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Send message to n8n webhook
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch('https://n8n-production-0d7d.up.railway.app/webhook/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
          timestamp: new Date().toISOString(),
          sessionId: `session-${Date.now()}`,
          metadata: {
            storeName: 'Serenity Home',
            platform: 'web',
            userAgent: navigator.userAgent,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const text = await response.text();
      const assistantContent = text || 'I apologize, but I encountered an issue. Please try again.';

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '😔 I apologize, but I\'m having trouble connecting right now. Please try again in a moment or contact us at the Contact Us page',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickActions = [
    { label: '🍵 Tea Sets', message: 'Tell me about your tea sets' },
    { label: '✨ Diffusers', message: 'Show me your aroma diffusers' },
    { label: '📦 Shipping', message: 'What are your shipping options?' },
    { label: '💝 Gift Ideas', message: 'I need a gift recommendation' },
  ];

  return (
    <>
      {!isOpen && (
        <button
          ref={chatButtonRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 overflow-hidden p-2">
              <img 
                src="/images/ai-chat.png" 
                alt="AI Assistant" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
              Chat with us! 💬
              <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      )}

      {!isOpen && showPrompt && (
        <div className="fixed bottom-24 right-6 z-40 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-amber-200 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src="/images/ai-chat.png" 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm">{promptMessage}</p>
                <button
                  onClick={() => {
                    setShowPrompt(false);
                    setIsOpen(true);
                  }}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Chat with us →
                </button>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div ref={chatWindowRef} className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/images/ai-chat.png" 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Serenity Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-white/90 text-sm">Online & ready to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-br-sm'
                      : 'bg-white border-2 border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(action.message)}
                    className="px-3 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full transition border border-amber-200 font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • We're here to help 24/7
            </p>
          </form>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AIChatAssistant;
