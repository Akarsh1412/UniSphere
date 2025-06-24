import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, MessageCircle, Wifi } from 'lucide-react';
import { usePresence } from 'ably/react';

const OnlineUsers = () => {
  const [users, setUsers] = useState([]);
  const currentUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const DEFAULT_AVATAR = "https://placehold.co/150x150/E2E8F0/4A5568?text=U";

  // Use Ably presence to track online users
  const { presenceData, updateStatus } = usePresence('online-users', 
    currentUser ? {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar || currentUser.profilePicture,
      email: currentUser.email
    } : null
  );

  useEffect(() => {
    if (!presenceData || !Array.isArray(presenceData)) {
      setUsers([]);
      return;
    }

    const filteredUsers = presenceData
      .filter(member => member.data?.id !== currentUser?.id)
      .map(member => ({
        id: member.data?.id,
        name: member.data?.name,
        avatar: member.data?.avatar,
        email: member.data?.email,
        clientId: member.clientId
      }))
      .filter(user => user.id);

    setUsers(filteredUsers);
  }, [presenceData, currentUser]);

  useEffect(() => {
    if (currentUser && updateStatus) {
      updateStatus({
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || currentUser.profilePicture,
        email: currentUser.email
      });
    }
  }, [currentUser, updateStatus]);

  const handleStartChat = (userId) => {
    if (!currentUser) {
      alert('Please log in to start a chat');
      navigate('/login');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Online Now
            </h3>
            <p className="text-xs text-gray-500">{users.length} active users</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-600">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user.clientId || user.id} 
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/50"
              onClick={() => handleStartChat(user.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors ${user.avatar ? 'hidden' : 'flex'}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                    {user.name || 'Anonymous User'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Active now
                  </p>
                </div>
              </div>

              <button 
                className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300 transform scale-90 group-hover:scale-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartChat(user.id);
                }}
                title="Send message"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No one's online right now</p>
            <p className="text-xs text-gray-500">Check back later or invite friends!</p>
          </div>
        )}
      </div>

      {users.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>Click on any user to start chatting</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
