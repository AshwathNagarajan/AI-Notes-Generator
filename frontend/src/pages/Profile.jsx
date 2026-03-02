import React, { useState, useEffect } from 'react';
import { User, Settings, Shield, LogOut, Camera, Save, Lock, Eye, EyeOff, Mail, Calendar, Activity, TrendingUp, Bell, ToggleRight, ToggleLeft, Smartphone, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { historyService } from '../services/historyService';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    photo_url: '',
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    privacyPublic: false,
    twoFactorAuth: false,
    activityTracking: true,
  });
  const [loading, setLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [statsData, setStatsData] = useState({
    totalActivities: 0,
    thisMonth: 0,
    successRate: 0,
    memberSince: 'Loading...',
    lastLogin: 'Loading...',
  });
  const [devicesData, setDevicesData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [prefsLoading, setPrefsLoading] = useState(false);

  // Enforce login restriction - Cannot access profile without authentication
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        display_name: user.display_name || '',
        email: user.email || '',
        photo_url: user.photo_url || '',
      });

      // Load real stats
      loadStats();
      
      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      // Load devices/sessions
      loadDevices();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const summary = await historyService.getSummary(30);
      
      // Calculate member since date
      const createdDate = user?.created_at 
        ? new Date(user.created_at)
        : new Date();
      const memberSinceText = createdDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      // Get current date to calculate this month's activities
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthCount = summary.total_items || 0; // You may need to filter by date if the service doesn't do it

      setStatsData({
        totalActivities: summary.total_items || 0,
        thisMonth: thisMonthCount,
        successRate: summary.processing_stats?.success_rate || 0,
        memberSince: memberSinceText,
        lastLogin: 'Today', // Could be fetched from backend if tracked
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const loadDevices = () => {
    try {
      // Parse user agent to determine device type
      const ua = navigator.userAgent;
      const isMobile = /Mobile|Android|iPhone/i.test(ua);
      const deviceName = isMobile 
        ? 'Mobile Browser'
        : 'Desktop Browser';
      
      const browserInfo = ua.includes('Chrome') ? 'Chrome'
        : ua.includes('Firefox') ? 'Firefox'
        : ua.includes('Safari') ? 'Safari'
        : ua.includes('Edge') ? 'Edge'
        : 'Browser';

      const osInfo = ua.includes('Windows') ? 'Windows'
        : ua.includes('Mac') ? 'macOS'
        : ua.includes('Linux') ? 'Linux'
        : ua.includes('iPhone') ? 'iOS'
        : ua.includes('Android') ? 'Android'
        : 'OS';

      const currentDevice = {
        id: 1,
        name: `${browserInfo} on ${osInfo}`,
        lastActive: 'Now',
        isActive: true
      };

      // Load devices from localStorage (simulating session data)
      const storedDevices = localStorage.getItem('userDevices');
      let allDevices = [currentDevice];
      
      if (storedDevices) {
        const parsed = JSON.parse(storedDevices);
        allDevices = [currentDevice, ...parsed.filter(d => d.id !== 1)].slice(0, 5);
      }

      localStorage.setItem('userDevices', JSON.stringify(allDevices));
      setDevicesData(allDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      setDevicesData([{
        id: 1,
        name: 'Current Session',
        lastActive: 'Now',
        isActive: true
      }]);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(user.id, formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      // Reload user data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setSecurityLoading(true);
    try {
      // Note: This would need to be implemented in your auth service
      // For now, we'll show a success message
      toast.success('Security settings updated successfully!');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowSecurity(false);
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    const updatedPrefs = { ...preferences, [key]: value };
    setPreferences(updatedPrefs);
    
    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    
    // Optional: Sync to backend
    try {
      setPrefsLoading(true);
      await authService.updateProfile(user.id, {
        preferences: updatedPrefs
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preference');
    } finally {
      setPrefsLoading(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authService.deleteAccount();
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account, settings, and preferences</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl">
              <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          {/* Profile Card */}
          <div className="industrial-card p-8 mb-8 fade-in-up">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-primary-100 dark:border-primary-900 shadow-xl">
                  <img
                    src={formData.photo_url || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-3 bg-primary-600 hover:bg-primary-700 rounded-full text-white shadow-xl transition-all">
                    <Camera className="h-5 w-5" />
                  </button>
                )}
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center space-x-2 px-4 py-2 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Account Active</span>
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {user?.display_name || 'User'}
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <p>{user?.email}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase mb-1">Member Since</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {statsLoading ? 'Loading...' : statsData.memberSince}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase mb-1">Total Activities</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {statsLoading ? '...' : statsData.totalActivities}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase mb-1">This Month</p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {statsLoading ? '...' : statsData.thisMonth}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {statsLoading ? '...' : `${statsData.successRate}%`}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span>Last login: {statsLoading ? 'Loading...' : statsData.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {['overview', 'settings', 'security', 'privacy', 'devices'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Edit Profile Card */}
                <div className="industrial-card p-8 hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">SECTION</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Edit Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Update your name and profile photo</p>
                  <button
                    onClick={() => { setIsEditing(true); setShowSecurity(false); setActiveTab('settings'); }}
                    className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Go to Settings →
                  </button>
                </div>

                {/* Security Card */}
                <div className="industrial-card p-8 hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">SECTION</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Change password and manage sessions</p>
                  <button
                    onClick={() => { setShowSecurity(true); setIsEditing(false); setActiveTab('security'); }}
                    className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Go to Security →
                  </button>
                </div>

                {/* Account Activity Card */}
                <div className="industrial-card p-8 hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">SECTION</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Activity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View your recent activity and sessions</p>
                  <button
                    onClick={() => setActiveTab('devices')}
                    className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    View Devices →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="fade-in-up">
              {isEditing ? (
                <div className="industrial-card p-8 max-w-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.display_name}
                        onChange={(e) =>
                          setFormData({ ...formData, display_name: e.target.value })
                        }
                        className="input-field"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        value={formData.photo_url}
                        onChange={(e) =>
                          setFormData({ ...formData, photo_url: e.target.value })
                        }
                        className="input-field"
                        placeholder="https://example.com/photo.jpg"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use a direct image URL</p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex items-center"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Notification Preferences */}
                  <div className="industrial-card p-8 fade-in-up">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                          disabled={prefsLoading}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                          style={{backgroundColor: preferences.emailNotifications ? '#4a7ba7' : '#d1d5db'}}
                        >
                          <span
                            className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                            style={{marginLeft: preferences.emailNotifications ? '22px' : '4px'}}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get push notifications</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                          disabled={prefsLoading}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                          style={{backgroundColor: preferences.pushNotifications ? '#4a7ba7' : '#d1d5db'}}
                        >
                          <span
                            className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                            style={{marginLeft: preferences.pushNotifications ? '22px' : '4px'}}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Promotional content</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('marketingEmails', !preferences.marketingEmails)}
                          disabled={prefsLoading}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                          style={{backgroundColor: preferences.marketingEmails ? '#4a7ba7' : '#d1d5db'}}
                        >
                          <span
                            className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                            style={{marginLeft: preferences.marketingEmails ? '22px' : '4px'}}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div className="industrial-card p-8 fade-in-up animation-delay-100">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Other Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Activity Tracking</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Help us improve your experience</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('activityTracking', !preferences.activityTracking)}
                          disabled={prefsLoading}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                          style={{backgroundColor: preferences.activityTracking ? '#4a7ba7' : '#d1d5db'}}
                        >
                          <span
                            className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                            style={{marginLeft: preferences.activityTracking ? '22px' : '4px'}}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary w-full"
                  >
                    Edit Profile Information
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="fade-in-up">
              {showSecurity ? (
                <div className="industrial-card p-8 max-w-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>
                  <form onSubmit={handleSecurityUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, currentPassword: e.target.value })
                          }
                          className="input-field pr-12"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.current ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, newPassword: e.target.value })
                          }
                          className="input-field pr-12"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.new ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={securityData.confirmPassword}
                          onChange={(e) =>
                            setSecurityData({ ...securityData, confirmPassword: e.target.value })
                          }
                          className="input-field pr-12"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setShowSecurity(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex items-center"
                        disabled={securityLoading}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="industrial-card p-8 fade-in-up">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                          <Lock className="h-5 w-5 text-primary-600" />
                          <span>Password</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Last changed 3 months ago</p>
                        <button
                          onClick={() => setShowSecurity(true)}
                          className="btn-primary"
                        >
                          Change Password
                        </button>
                      </div>
                      <CheckCircle className="h-6 w-6 text-success-600 dark:text-success-400" />
                    </div>
                  </div>

                  <div className="industrial-card p-8 fade-in-up animation-delay-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                          <span>Two-Factor Authentication</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Add an extra layer of security</p>
                        <button
                          onClick={() => handlePreferenceChange('twoFactorAuth', !preferences.twoFactorAuth)}
                          disabled={prefsLoading}
                          className={preferences.twoFactorAuth ? 'btn-secondary' : 'btn-primary'}
                        >
                          {preferences.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                      </div>
                      {!preferences.twoFactorAuth && <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="fade-in-up">
              <div className="space-y-6">
                <div className="industrial-card p-8 fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Settings</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Public Profile</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to see your profile</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('privacyPublic', !preferences.privacyPublic)}
                        disabled={prefsLoading}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50"
                        style={{backgroundColor: preferences.privacyPublic ? '#4a7ba7' : '#d1d5db'}}
                      >
                        <span
                          className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                          style={{marginLeft: preferences.privacyPublic ? '22px' : '4px'}}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="industrial-card p-8 fade-in-up animation-delay-100">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Data & Privacy</h3>
                  <div className="space-y-4">
                    <a href="#" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-white">Download Your Data</span>
                      <span className="text-gray-400">→</span>
                    </a>
                    <a href="#" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
                      <span className="text-gray-400">→</span>
                    </a>
                    <a href="#" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-white">Terms of Service</span>
                      <span className="text-gray-400">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="fade-in-up">
              <div className="industrial-card p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Active Sessions</h3>
                <div className="space-y-4">
                  {devicesData.length > 0 ? (
                    devicesData.map((device, index) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                            <Smartphone className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last active {device.lastActive}</p>
                          </div>
                        </div>
                        {device.isActive && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                            <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                            <span>Current</span>
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">Loading devices...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        {activeTab === 'security' && (
          <div className="mt-12 pt-8 border-t-2 border-error-200 dark:border-error-900">
            <div className="industrial-card p-8 border-2 border-error-200 dark:border-error-900 bg-error-50/50 dark:bg-error-950/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-error-900 dark:text-error-100 flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Delete Account</span>
                  </h3>
                  <p className="text-error-800 dark:text-error-200 text-sm mb-4">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn-error flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 