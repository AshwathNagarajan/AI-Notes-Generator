import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

const learningTwinService = {
  buildTwin: async ({ topic, learnerExplanation, quizMistakes, doubts, learningStyle }) => {
    try {
      const response = await axiosInstance.post('/api/learning-twin/build', {
        topic,
        learner_explanation: learnerExplanation,
        quiz_mistakes: quizMistakes,
        doubts,
        learning_style: learningStyle,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Learning twin build error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to build learning twin',
      };
    }
  },
};

export default learningTwinService;
