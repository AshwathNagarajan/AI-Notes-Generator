import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const chatbotService = {
  /**
   * Send a message to the chatbot and get a response
   * @param {string} message - The user's message
   * @param {Array} conversationHistory - Previous messages in conversation
   * @param {string} systemPrompt - Optional custom system prompt
   * @returns {Promise<{response: string, processing_time: float}>}
   */
  async sendMessage(message, conversationHistory = [], systemPrompt = null) {
    try {
      const response = await api.post('/api/chatbot/chat', {
        message,
        conversation_history: conversationHistory,
        system_prompt: systemPrompt
      });

      return {
        success: true,
        response: response.data.response,
        processingTime: response.data.processing_time
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to get response from chatbot';
      return {
        success: false,
        error: errorMessage,
        response: null
      };
    }
  },

  /**
   * Start a new chat session
   * @returns {Promise}
   */
  async startNewSession() {
    return {
      messages: [],
      sessionId: `session_${Date.now()}`
    };
  }
};

export default chatbotService;
