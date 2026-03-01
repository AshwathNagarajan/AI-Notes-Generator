const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const adminService = {
  // Admin Authentication
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Dashboard Statistics
  getDashboardStats: async (adminToken) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/dashboard/stats?admin_token=${adminToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get All Users
  getAllUsers: async (adminToken, skip = 0, limit = 50) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users?admin_token=${adminToken}&skip=${skip}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get User Activities
  getUserActivities: async (adminToken, userId, limit = 50) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/user/${userId}/activities?admin_token=${adminToken}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  },

  // Get All Activities
  getAllActivities: async (adminToken, limit = 100) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/activities?admin_token=${adminToken}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get Analytics
  getAnalytics: async (adminToken) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/analytics?admin_token=${adminToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Token management
  saveAdminToken: (token) => {
    localStorage.setItem('adminToken', token);
  },

  getAdminToken: () => {
    return localStorage.getItem('adminToken');
  },

  removeAdminToken: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
  },

  isAdminLoggedIn: () => {
    return !!localStorage.getItem('adminToken');
  },
};

export default adminService;
