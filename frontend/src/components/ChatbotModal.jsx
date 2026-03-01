import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import chatbotService from '../services/chatbotService';

const ChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hi! How can I help you?', timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setError('');

    try {
      // Convert messages to the format expected by the backend
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        text: msg.text,
        timestamp: msg.timestamp
      }));

      const result = await chatbotService.sendMessage(userMessage, conversationHistory);
      
      if (result.success) {
        const assistantMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          text: result.response || 'I understand. Tell me more.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(result.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get response');

      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };



  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      await sendMessage(textInput);
      setTextInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Premium Overlay with Blur Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Premium Modal */}
      <div className="relative group w-full max-w-md max-h-[650px] overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
        
        {/* Main Modal Card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/70 dark:to-gray-800/70 rounded-2xl shadow-2xl flex flex-col border border-white/20 dark:border-white/10 backdrop-blur-xl overflow-hidden">
          {/* Premium Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-sm border-b border-white/10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Chatbot</h2>
                <p className={`text-xs ${isProcessing ? 'text-yellow-300' : 'text-emerald-300'} font-medium`}>
                  {isProcessing ? '● Thinking...' : '● Ready to chat'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container - Premium Styling */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth max-h-[400px]">
            {messages.map((msg) => (
              msg.role === 'user' ? (
                <div key={msg.id} className="flex justify-end animate-fade-in">
                  <div className="relative group max-w-xs">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg backdrop-blur-sm border border-blue-400/50 hover:border-blue-400/80 transition-colors">
                      <p className="text-sm leading-relaxed break-words font-medium">{msg.text}</p>
                      <span className="text-xs opacity-60 mt-1.5 block">You</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start animate-fade-in">
                  <div className="relative group max-w-xs">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl rounded-tl-sm px-5 py-3 shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/80 transition-colors">
                      <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed break-words font-medium">{msg.text}</p>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 block">AI Assistant</span>
                    </div>
                  </div>
                </div>
              )
            ))}

            {isProcessing && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl rounded-tl-sm px-5 py-3 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                  <div className="flex gap-2.5 items-center">
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error State - Premium */}
          {error && (
            <div className="mx-5 mb-4 p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg text-xs text-red-300 font-medium">
              {error}
            </div>
          )}

          {/* Input Controls - Premium */}
          <div className="border-t border-white/10 p-5 space-y-3 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-sm">
            {/* Text Input Form */}
            <form onSubmit={handleTextSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 bg-white/10 dark:bg-black/20 border border-white/20 rounded-full text-sm text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm"
                />
              </div>

              {/* Send Button - Premium */}
              <button
                type="submit"
                disabled={isProcessing || !textInput.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 group outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
