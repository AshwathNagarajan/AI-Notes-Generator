import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const knowledgeGapService = {
  detectGaps: async (topic, quizMistakes = [], explanationRequests = [], cognitiveProfile = '') => {
    try {
      const response = await axiosInstance.post('/api/knowledge-gap/detect', {
        topic,
        quiz_mistakes: quizMistakes,
        explanation_requests: explanationRequests,
        cognitive_profile: cognitiveProfile,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Knowledge gap detection error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to detect knowledge gaps',
      };
    }
  },

  getHints: async (topic) => {
    try {
      const response = await axiosInstance.get(`/api/knowledge-gap/hints/${encodeURIComponent(topic)}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error getting learning hints:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to get learning hints',
      };
    }
  },
};

export default knowledgeGapService;
