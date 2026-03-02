import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import UserProfileCard from './UserProfileCard';

const UserListSection = ({ users = [], title = 'Users', onUserSelect = null }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRef, setSelectedUserRef] = useState(null);

  const handleUserClick = (user, event) => {
    setSelectedUser(selectedUser?.id === user.id || selectedUser?._id === user._id ? null : user);
    setSelectedUserRef(event.currentTarget);
    onUserSelect?.(user);
  };

  const handleCloseCard = () => {
    setSelectedUser(null);
    setSelectedUserRef(null);
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      {title && (
        <h3 className="text-white font-bold text-lg">{title}</h3>
      )}

      {/* User List Container */}
      <div className="space-y-2">
        {users && users.length > 0 ? (
          users.map((user, idx) => (
            <button
              key={user._id || user.id || idx}
              onClick={(e) => handleUserClick(user, e)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                selectedUser?._id === user._id || selectedUser?.id === user.id
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-md">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={user.display_name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-white">
                      {(user.display_name || user.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">
                  {user.display_name || 'Unknown User'}
                </p>
                <p className="text-gray-400 text-sm">
                  {user.email}
                </p>
              </div>

              {/* Status Badge */}
              {user.status && (
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  user.status?.toLowerCase() === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.status}
                </div>
              )}

              {/* Chevron Icon */}
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                selectedUser?._id === user._id || selectedUser?.id === user.id ? 'rotate-90' : ''
              }`} />
            </button>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No users available</p>
          </div>
        )}
      </div>

      {/* Profile Card - Position relative to selected user button */}
      {selectedUser && selectedUserRef && (
        <div className="fixed inset-0 z-40" onClick={handleCloseCard}>
          <div 
            className="absolute z-50 bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl w-96"
            onClick={(e) => e.stopPropagation()}
            style={{
              top: `${selectedUserRef.getBoundingClientRect().top + window.scrollY + selectedUserRef.offsetHeight + 16}px`,
              right: `${window.innerWidth - selectedUserRef.getBoundingClientRect().right}px`,
            }}
          >
            <UserProfileCard 
              user={selectedUser}
              onClose={handleCloseCard}
              showBackdrop={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListSection;
