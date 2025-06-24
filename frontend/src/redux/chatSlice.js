import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const chatAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/chat`,
  timeout: 10000,
});

// Add request interceptor to include auth token
chatAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunks
export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.get('/unread-count');
      return response.data.count;
    } catch (error) {
      console.error("Failed to fetch unread count", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.get('/conversations');
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.get(`/messages/${userId}`);
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.post('/messages', {
        receiverId,
        content
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchRecipientDetails = createAsyncThunk(
  'chat/fetchRecipientDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.get(`/recipient/${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipient details');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    unreadCount: 0,
    conversations: [],
    messages: [],
    activeConversation: null,
    recipientDetails: null,
    status: 'idle',
    error: null,
    messageStatus: 'idle',
  },
  reducers: {
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.last_message = message.content;
        conversation.created_at = message.created_at;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.messageStatus = 'idle';
    },
    clearRecipientDetails: (state) => {
      state.recipientDetails = null;
    },
    resetChatState: (state) => {
      state.messages = [];
      state.activeConversation = null;
      state.recipientDetails = null;
      state.messageStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messageStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messageStatus = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messageStatus = 'failed';
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.messageStatus = 'sending';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageStatus = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageStatus = 'failed';
        state.error = action.payload;
      })
      
      // Recipient details
      .addCase(fetchRecipientDetails.pending, (state) => {
        state.recipientDetails = null;
      })
      .addCase(fetchRecipientDetails.fulfilled, (state, action) => {
        state.recipientDetails = action.payload;
      })
      .addCase(fetchRecipientDetails.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  incrementUnreadCount, 
  resetUnreadCount, 
  addMessage, 
  setActiveConversation,
  updateConversationLastMessage,
  clearError,
  clearMessages,
  clearRecipientDetails,
  resetChatState
} = chatSlice.actions;

export default chatSlice.reducer;
