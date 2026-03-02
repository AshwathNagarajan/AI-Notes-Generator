import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserListSection from '../components/UserListSection';
import { LogOut, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminToken = localStorage.getItem('adminToken');

  // Enforce admin login restriction - Cannot access user management without admin token
  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login', { replace: true });
      return;
    }
    loadUsers();
  }, [adminToken, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/admin/users?admin_token=${adminToken}&limit=100`
      );
      
      if (response.ok) {
        const data = await response.json();
        // Enrich user data with status
        const enrichedUsers = data.users.map(user => ({
          ...user,
          status: user.last_login ? 'Active' : 'Inactive',
          role: user.role || 'User'
        }));
        setUsers(enrichedUsers);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">User Management</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User List */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <UserListSection 
                  users={users}
                  title="All Users"
                  onUserSelect={handleUserSelect}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-2 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Click on any user to view their profile</h3>
                    <p className="text-sm">The profile card will appear below the list with detailed information including:</p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Profile avatar (circular)</li>
                      <li>Full name and role</li>
                      <li>Email address</li>
                      <li>Active/Inactive status badge</li>
                      <li>Join date and last login date</li>
                      <li>Activity count</li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-semibold text-white mb-2">Features</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Smooth fade-in animation when opening profile</li>
                      <li>Responsive design works on all screen sizes</li>
                      <li>Click another user to switch profiles</li>
                      <li>Click the same user again to close the card</li>
                      <li>Status badge indicates if user is active or inactive</li>
                      <li>Hover effects on user list items</li>
                    </ul>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-semibold text-white mb-2">Component Overview</h3>
                    <p className="text-sm">
                      The user profile card system consists of two main components:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li><span className="text-blue-400">UserListSection.jsx</span> - Displays clickable user items</li>
                      <li><span className="text-blue-400">UserProfileCard.jsx</span> - Shows detailed user information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
