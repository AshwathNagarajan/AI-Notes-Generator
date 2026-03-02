import React from 'react';
import { X, Mail, Calendar, Activity, User, Badge } from 'lucide-react';

const UserInfoModal = ({ user, onClose, onViewActivities = null, onDeactivate = null, isLoading = false }) => {
  if (!user) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    return statusLower === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
  };

  const getStatusDot = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    return statusLower === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  const getInitial = () => {
    if (user.display_name) return user.display_name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pointer-events-none">
        <div
          className="w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Header with gradient background */}
          <div className="h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative rounded-t-2xl" />

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Avatar - Positioned overlapping header */}
            <div className="flex justify-center -mt-20 mb-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-900 shadow-2xl">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.display_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-white">{getInitial()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Name and Status */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{user.display_name || 'User'}</h2>
              {user.role || user.designation ? (
                <p className="text-gray-400 text-lg mb-4">{user.role || user.designation}</p>
              ) : null}
              {user.status && (
                <div className="inline-flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(user.status)}`}>
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(user.status)}`}></div>
                    <span className="font-semibold text-sm">{user.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-white text-sm mt-1 break-all">{user.email}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Badge className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">User ID</p>
                  <p className="text-white text-sm mt-1 font-mono break-all">{user._id || user.id || 'N/A'}</p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Joined</p>
                  <p className="text-white text-sm mt-1">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Last Login</p>
                  <p className="text-white text-sm mt-1">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Never'}
                  </p>
                </div>
              </div>

              {/* Activity Count */}
              {user.activity_count !== undefined && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Activities</p>
                    <p className="text-white text-sm mt-1 font-semibold">{user.activity_count}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onViewActivities && (
                <button
                  onClick={() => onViewActivities(user._id || user.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/50 rounded-lg transition-all font-semibold disabled:opacity-50"
                >
                  View Activities
                </button>
              )}

              {onDeactivate && (
                <button
                  onClick={() => onDeactivate(user._id || user.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all font-semibold disabled:opacity-50"
                >
                  Deactivate User
                </button>
              )}

              {!onViewActivities && !onDeactivate && (
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-lg transition-all font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfoModal;
