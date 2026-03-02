import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mic, Upload, MessageCircle, AlertCircle, Send, X } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import chatbotService from '../services/chatbotService';
import VoiceRecorder from '../components/VoiceRecorder';

const Voice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I\'m your AI Chatbot Assistant. You can chat with me by typing, recording audio, or uploading files. How can I help you today?', timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState([]);
  const [error, setError] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const fileInputRef = useRef();
  const messagesEndRef = useRef(null);

  // Enforce login restriction - Cannot access voice without authentication
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getFormats = async () => {
      try {
        const { data } = await voiceService.getSupportedFormats();
        setSupportedFormats(data.supported_formats);
      } catch (err) {
        console.error('Failed to get supported formats:', err);
      }
    };
    getFormats();
  }, []);

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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit.');
      }

      const fileType = file.type.toLowerCase();
      if (!fileType.includes('audio/')) {
        throw new Error('Please select a valid audio file.');
      }

      const result = await voiceService.transcribeAudioFile(file);

      if (result.transcription) {
        await sendMessage(result.transcription);
      } else {
        throw new Error('No transcription received');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to process audio';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscriptionComplete = async (data) => {
    setShowVoiceRecorder(false);
    await sendMessage(data.transcription);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      await sendMessage(textInput);
      setTextInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 p-4 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto h-full relative z-10">
        {/* Premium Header */}
        <div className="fade-in-up mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full p-4 text-white shadow-2xl">
                <MessageCircle className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                AI Chatbot
              </h1>
              <p className="text-lg text-purple-200/80 mt-2 font-medium">Intelligent conversation powered by advanced AI</p>
            </div>
          </div>
        </div>

        {/* Main Chat Container - Premium Card */}
        <div className="fade-in-up animation-delay-100">
          <div className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-xl h-[650px] flex flex-col border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Assistant</h2>
                    <p className={`text-xs ${isProcessing ? 'text-yellow-300' : 'text-emerald-300'} font-medium`}>
                      {isProcessing ? '● Thinking...' : '● Ready to chat'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-300 bg-black/30 px-3 py-1 rounded-full">Premium AI</div>
              </div>

              {/* Messages Container - Premium Styling */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                  msg.role === 'user' ? (
                    <div key={msg.id} className="fade-in-up flex justify-end">
                      <div className="relative group max-w-md">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl rounded-tr-sm px-6 py-4 shadow-lg backdrop-blur-sm border border-blue-400/50">
                          <p className="text-sm leading-relaxed break-words font-medium">{msg.text}</p>
                          <span className="text-xs opacity-70 mt-2 block">You</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="fade-in-up flex justify-start">
                      <div className="relative group max-w-md">
                        <div className="absolute -inset-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-3xl rounded-tl-sm px-6 py-4 shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                          <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed break-words font-medium">{msg.text}</p>
                          <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 block">AI Assistant</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}

                {isProcessing && (
                  <div className="fade-in-up flex justify-start">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-3xl rounded-tl-sm px-6 py-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                        <div className="flex gap-2 items-center">
                          <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                          <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Error State - Premium */}
              {error && (
                <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300 font-medium">{error}</p>
                </div>
              )}

              {/* Input Controls - Premium */}
              <div className="border-t border-white/10 p-6 space-y-3 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-sm">
                {/* Text Input with Premium Styling */}
                <form onSubmit={handleTextSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isProcessing}
                      className="w-full px-5 py-3 bg-white/10 dark:bg-black/20 border border-white/20 rounded-full text-sm text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all backdrop-blur-sm"
                    />
                  </div>

                  {/* Voice Button - Premium */}
                  <button
                    type="button"
                    onClick={() => setShowVoiceRecorder(true)}
                    disabled={isProcessing}
                    className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 border border-purple-400/30 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    title="Record audio"
                  >
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Send Button - Premium */}
                  <button
                    type="submit"
                    disabled={isProcessing || !textInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Recorder Modal - Premium */}
      {showVoiceRecorder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowVoiceRecorder(false)}
          />

          {/* Modal */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/50 dark:to-gray-800/50 rounded-3xl shadow-2xl max-w-md w-full border border-white/20 dark:border-white/10 overflow-hidden animate-scale-in backdrop-blur-xl">
            {/* Header - Premium Gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                Record Audio
              </h2>
              <button
                onClick={() => setShowVoiceRecorder(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Recorder */}
            <div className="p-8 flex items-center justify-center">
              <VoiceRecorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                compact={false}
                autoStart={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voice;

