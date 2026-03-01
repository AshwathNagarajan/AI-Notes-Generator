import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, TrendingUp, LogOut, Search, ChevronRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [adminToken, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats
      const statsRes = await fetch(`http://localhost:8000/api/admin/dashboard/stats?admin_token=${adminToken}`);
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // Load users
      const usersRes = await fetch(`http://localhost:8000/api/admin/users?admin_token=${adminToken}&limit=100`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }

      // Load activities
      const activitiesRes = await fetch(`http://localhost:8000/api/admin/activities?admin_token=${adminToken}&limit=100`);
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.activities);
      }

      // Load analytics
      const analyticsRes = await fetch(`http://localhost:8000/api/admin/analytics?admin_token=${adminToken}`);
      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleViewUserActivities = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/user/${userId}/activities?admin_token=${adminToken}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(userId);
        setUserActivities(data.activities);
      }
    } catch (error) {
      toast.error('Failed to load user activities');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const chartData = analytics?.feature_usage ? Object.entries(analytics.feature_usage).map(([key, value]) => ({
    name: key,
    value
  })) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Monitor users and system activities</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {['overview', 'users', 'activities', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold capitalize border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Users', value: stats.total_users, icon: Users, color: 'from-blue-500 to-blue-600' },
                      { label: 'Active Users (7d)', value: stats.active_users, icon: TrendingUp, color: 'from-green-500 to-green-600' },
                      { label: 'Inactive Users', value: stats.inactive_users, icon: Activity, color: 'from-red-500 to-red-600' },
                      { label: 'Created Today', value: stats.created_today, icon: Users, color: 'from-purple-500 to-purple-600' },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="relative group">
                          <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                          <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                              </div>
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Recent Activities */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Recent Activities
                    </h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {activities.slice(0, 10).map((activity, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white font-semibold">{activity.feature_type || 'Unknown'}</p>
                              <p className="text-gray-400 text-sm mt-1">{activity.user_id}</p>
                              <p className="text-gray-500 text-xs mt-2">
                                {new Date(activity.created_at).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              activity.status === 'completed'
                                ? 'bg-green-500/30 text-green-300'
                                : activity.status === 'failed'
                                ? 'bg-red-500/30 text-red-300'
                                : 'bg-yellow-500/30 text-yellow-300'
                            }`}>
                              {activity.status || 'unknown'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
                          <th className="px-4 py-3 text-left text-white font-semibold">Email</th>
                          <th className="px-4 py-3 text-left text-white font-semibold">Joined</th>
                          <th className="px-4 py-3 text-left text-white font-semibold">Last Login</th>
                          <th className="px-4 py-3 text-left text-white font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-white">{user.display_name || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-300">{user.email}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleViewUserActivities(user._id || user.id)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Showing {filteredUsers.length} of {users.length} users
                  </p>
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                {selectedUser ? (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                      >
                        ← Back to All Activities
                      </button>
                      <h3 className="text-xl font-bold text-white mb-4">Activities for User: {selectedUser}</h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {userActivities.map((activity, idx) => (
                          <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-white font-semibold">{activity.feature_type}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                activity.status === 'completed'
                                  ? 'bg-green-500/30 text-green-300'
                                  : 'bg-red-500/30 text-red-300'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-white mb-6">All Activities</h2>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {activities.map((activity, idx) => (
                          <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-white font-semibold">{activity.feature_type}</p>
                                <p className="text-gray-400 text-sm mt-1">{activity.user_id}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                activity.status === 'completed'
                                  ? 'bg-green-500/30 text-green-300'
                                  : 'bg-red-500/30 text-red-300'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Usage */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Feature Usage</h2>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="rgba(255,255,255,0.5)" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-400 text-center py-8">No data available</p>
                    )}
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Status Breakdown</h2>
                    <div className="space-y-3">
                      {Object.entries(analytics.status_breakdown || {}).map(([status, count], idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-400 capitalize">{status}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-white/10 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{
                                  width: `${(count / (Object.values(analytics.status_breakdown || {}).reduce((a, b) => a + b, 0))) * 100}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold min-w-12 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
