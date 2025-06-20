import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Send, ArrowLeft } from 'lucide-react';
import { getSocket } from '../socket';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = useSelector(state => state.user);
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const DEFAULT_AVATAR = "https://placehold.co/150x150/E2E8F0/4A5568?text=U";

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (message) => {
      if (activeConversation?.id.toString() === message.sender_id.toString()) {
        setMessages(prev => [...prev, message]);
      }
      setConversations(prev => {
        const convoExists = prev.find(c => c.id.toString() === message.sender_id.toString());
        if (convoExists) {
          return prev.map(c => c.id.toString() === message.sender_id.toString() ? {...c, last_message: message.content} : c);
        }
        return prev;
      });
    };

    socket.on('receivePrivateMessage', handleReceiveMessage);
    return () => socket.off('receivePrivateMessage', handleReceiveMessage);
  }, [activeConversation, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        let allConversations = res.data.conversations;
        
        if (paramUserId && !allConversations.some(c => c.id.toString() === paramUserId)) {
          const userRes = await axios.get(`http://localhost:5000/api/chat/recipient/${paramUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          allConversations = [{ ...userRes.data.user, last_message: 'Start a conversation' }, ...allConversations];
        }
        setConversations(allConversations);
      } catch (err) {
        console.error(err);
      }
    };

    if(currentUser) fetchConversations();
  }, [paramUserId, currentUser]);

  useEffect(() => {
    const conversation = conversations.find(c => c.id.toString() === paramUserId);
    if (conversation) setActiveConversation(conversation);
  }, [paramUserId, conversations]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${activeConversation.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !currentUser) return;

    const socket = getSocket();
    const tempId = Date.now();
    const messageData = {
      id: tempId,
      content: newMessage,
      sender_id: currentUser.id,
      receiver_id: activeConversation.id,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/chat/messages`, {
        receiverId: activeConversation.id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => prev.map(m => m.id === tempId ? response.data.message : m));
      socket.emit('privateMessage', {
        content: newMessage,
        to: activeConversation.id,
        from: currentUser.id
      });
    } catch(err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Please log in to access chat</h2>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Go to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="overflow-y-auto h-full">
                {conversations.map((convo) => (
                  <Link
                    key={convo.id}
                    to={`/chat/${convo.id}`}
                    className={`block p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      activeConversation?.id === convo.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={convo.profilePicture || DEFAULT_AVATAR}
                        alt={convo.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {convo.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {convo.last_message}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate('/chat')}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <img
                        src={activeConversation.profilePicture || DEFAULT_AVATAR}
                        alt={activeConversation.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activeConversation.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === currentUser.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
