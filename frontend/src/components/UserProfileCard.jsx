import React from 'react';
import { X, Mail, BadgeCheck, Calendar, UserCheck } from 'lucide-react';

const UserProfileCard = ({ user, onClose, isLoading = false, showBackdrop = true }) => {
  if (!user) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    return statusLower === 'active' ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20';
  };

  const getStatusDot = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    return statusLower === 'active' ? 'bg-green-400' : 'bg-red-400';
  };

  return (
    <div className="animate-fade-in">
      {showBackdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      )}
      
      <div className={showBackdrop ? "absolute bottom-full right-0 mb-4 z-50" : ""}>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl w-96">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500/30 to-purple-500/30 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Avatar positioned overlapping header */}
            <div className="absolute -bottom-8 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-lg">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.display_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {(user.display_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="pt-14 px-6 pb-6 space-y-5">
            {/* Name and Status */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user.display_name || 'User'}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {user.role || user.designation || 'Member'}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getStatusColor(user.status)}`}>
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(user.status)}`}></div>
                  <span className="text-xs font-semibold">
                    {user.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/10 to-transparent"></div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Email</p>
                <p className="text-white text-sm break-all">{user.email}</p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Joined</p>
                <div className="space-y-1 mt-1">
                  <p className="text-white text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                  {user.last_login && (
                    <p className="text-gray-500 text-xs">
                      Last login: {new Date(user.last_login).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info if available */}
            {user.activity_count !== undefined && (
              <>
                <div className="h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Activities</p>
                    <p className="text-white text-sm font-semibold">{user.activity_count}</p>
                  </div>
                </div>
              </>
            )}

            {/* Close Button at bottom */}
            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/50 rounded-lg transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Arrow pointer */}
        {showBackdrop && (
          <div className="absolute -bottom-2 right-8 w-3 h-3 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-r border-white/20 transform rotate-45"></div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
