import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { useChannel, ChannelProvider } from 'ably/react';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  fetchRecipientDetails,
  addMessage,
  setActiveConversation,
  updateConversationLastMessage,
  clearError,
  clearMessages,
  resetChatState
} from '../redux/chatSlice';

const ChatContent = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const {
    conversations,
    messages,
    activeConversation,
    recipientDetails,
    status,
    messageStatus,
    error
  } = useSelector(state => state.chat);
  const currentUser = useSelector(state => state.user);
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const prevParamUserIdRef = useRef(null);
  const DEFAULT_AVATAR = "https://placehold.co/150x150/E2E8F0/4A5568?text=U";

  // Ably channel for private messages
  const { channel } = useChannel(`private-messages-${currentUser?.id}`, (message) => {
    const messageData = message.data;
    
    if (activeConversation?.id.toString() === messageData.sender_id.toString()) {
      dispatch(addMessage(messageData));
    }
    
    dispatch(updateConversationLastMessage({
      conversationId: messageData.sender_id,
      message: messageData
    }));
  });

  // Format time to show only hours and minutes
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  // Improved scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    if (messagesContainerRef.current && (!isUserScrolling || force)) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [isUserScrolling]);

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    
    setIsUserScrolling(!isAtBottom);
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, scrollToBottom]);

  // Initialize component and fetch conversations
  useEffect(() => {
    if (currentUser && !isInitialized) {
      dispatch(fetchConversations());
      setIsInitialized(true);
    }
  }, [currentUser, dispatch, isInitialized]);

  // FIXED: Handle paramUserId changes with proper cleanup
  useEffect(() => {
    // Only proceed if component is initialized
    if (!isInitialized) return;

    // Check if paramUserId actually changed
    if (prevParamUserIdRef.current === paramUserId) return;
    
    prevParamUserIdRef.current = paramUserId;

    if (paramUserId) {
      // Clear previous state first
      dispatch(clearMessages());
      dispatch(setActiveConversation(null));
      
      // Small delay to ensure state is cleared
      const timeoutId = setTimeout(() => {
        const existingConversation = conversations.find(c => c.id.toString() === paramUserId);
        
        if (existingConversation) {
          console.log('Found existing conversation:', existingConversation);
          dispatch(setActiveConversation(existingConversation));
        } else {
          console.log('Fetching new recipient details for:', paramUserId);
          dispatch(fetchRecipientDetails(paramUserId))
            .unwrap()
            .then((recipientData) => {
              const newConversation = {
                id: recipientData.id,
                name: recipientData.name,
                profile_picture: recipientData.profile_picture,
                last_message: 'Start a conversation',
                created_at: new Date().toISOString()
              };
              dispatch(setActiveConversation(newConversation));
            })
            .catch((error) => {
              console.error('Failed to fetch recipient details:', error);
              // Navigate back to chat list on error
              navigate('/chat');
            });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Clear state when no user is selected
      dispatch(resetChatState());
    }
  }, [paramUserId, conversations, dispatch, navigate, isInitialized]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation?.id && isInitialized) {
      console.log('Fetching messages for conversation:', activeConversation.id);
      dispatch(fetchMessages(activeConversation.id));
      setIsUserScrolling(false);
    }
  }, [activeConversation?.id, dispatch, isInitialized]);

  // Handle sidebar user click
  const handleUserClick = useCallback((e, userId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent navigation if already on the same user
    if (paramUserId === userId.toString()) return;
    
    const currentScrollPosition = window.pageYOffset;
    navigate(`/chat/${userId}`);
    
    setTimeout(() => {
      window.scrollTo(0, currentScrollPosition);
    }, 0);
  }, [navigate, paramUserId]);

  // Handle send message
  const handleSendMessage = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!newMessage.trim() || !activeConversation || !currentUser) return;

    const messageContent = newMessage;
    setNewMessage('');

    const currentScrollPosition = window.pageYOffset;

    try {
      const resultAction = await dispatch(sendMessage({
        receiverId: activeConversation.id,
        content: messageContent
      }));

      if (sendMessage.fulfilled.match(resultAction)) {
        await channel.publish('new-message', {
          ...resultAction.payload,
          receiverId: activeConversation.id
        });
        
        setIsUserScrolling(false);
        setTimeout(() => {
          scrollToBottom(true);
          window.scrollTo(0, currentScrollPosition);
        }, 50);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageContent);
    }
  }, [newMessage, activeConversation, currentUser, dispatch, channel, scrollToBottom]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  // Check if conversation has unread messages
  const hasUnreadMessages = useCallback((conversationId) => {
    return messages.some(msg => 
      msg.sender_id.toString() === conversationId.toString() && 
      msg.receiver_id === currentUser.id && 
      !msg.is_read
    );
  }, [messages, currentUser]);

  // Loading state for initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to access chat</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getConversationDisplayInfo = () => {
    if (!activeConversation) return null;
    
    if (recipientDetails && recipientDetails.id.toString() === activeConversation.id.toString()) {
      return {
        name: recipientDetails.name,
        profile_picture: recipientDetails.profile_picture
      };
    }
    
    return {
      name: activeConversation.name,
      profile_picture: activeConversation.profile_picture
    };
  };

  const displayInfo = getConversationDisplayInfo();

  return (
    <div className="min-h-screen bg-gray-50" style={{ overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                {status === 'loading' && (
                  <div className="text-sm text-gray-500">Loading conversations...</div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((convo) => {
                  const isActive = activeConversation?.id.toString() === convo.id.toString();
                  const hasUnread = hasUnreadMessages(convo.id);
                  
                  return (
                    <div
                      key={convo.id}
                      onClick={(e) => handleUserClick(e, convo.id)}
                      className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={convo.profile_picture || DEFAULT_AVATAR}
                            alt={convo.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = DEFAULT_AVATAR;
                            }}
                          />
                          {hasUnread && !isActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            hasUnread && !isActive ? 'font-bold text-blue-700' : 'text-gray-900'
                          }`}>
                            {convo.name}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className={`text-sm truncate flex-1 mr-2 ${
                              hasUnread && !isActive ? 'font-semibold text-gray-700' : 'text-gray-500'
                            }`}>
                              {convo.last_message}
                            </p>
                            <p className="text-xs text-gray-400 flex-shrink-0">
                              {formatTime(convo.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {activeConversation && !conversations.find(c => c.id.toString() === activeConversation.id.toString()) && displayInfo && (
                  <div className="p-4 border-b border-gray-100 bg-blue-50 border-l-4 border-l-blue-500">
                    <div className="flex items-center space-x-3">
                      <img
                        src={displayInfo.profile_picture || DEFAULT_AVATAR}
                        alt={displayInfo.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayInfo.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          New conversation
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation && displayInfo ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const currentScrollPosition = window.pageYOffset;
                          navigate('/chat');
                          setTimeout(() => window.scrollTo(0, currentScrollPosition), 0);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <img
                        src={displayInfo.profile_picture || DEFAULT_AVATAR}
                        alt={displayInfo.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {displayInfo.name}
                        </h3>
                        {messageStatus === 'loading' && (
                          <p className="text-sm text-gray-500">Loading messages...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div 
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    style={{ 
                      maxHeight: 'calc(100vh - 16rem)',
                      minHeight: '0',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {messageStatus === 'loading' ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center text-gray-500">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
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
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} style={{ height: '1px' }} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="1"
                        disabled={messageStatus === 'sending'}
                        style={{ maxHeight: '100px' }}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || messageStatus === 'sending'}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {messageStatus === 'sending' ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </form>
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

const Chat = () => {
  const currentUser = useSelector(state => state.user);

  if (!currentUser?.id) {
    return <ChatContent />;
  }

  return (
    <ChannelProvider channelName={`private-messages-${currentUser.id}`}>
      <ChatContent />
    </ChannelProvider>
  );
};

export default Chat;
