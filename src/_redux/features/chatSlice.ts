import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchHistoryAPI, fetchUsersAPI } from '../services/authService';

// Define Types
interface Message {
  _id?: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
}

interface User {
  username: string;
  isOnline: boolean;
}

interface ChatState {
  messages: Message[];
  onlineUsers: User[];
  selectedUser: string | null;
  status: 'idle' | 'loading';
}

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  selectedUser: null,
  status: 'idle',
};

// --- Thunks ---
export const loadHistory = createAsyncThunk(
  'chat/loadHistory',
  async ({ user1, user2 }: { user1: string; user2: string }) => {
    return await fetchHistoryAPI(user1, user2);
  }
);

export const loadUsers = createAsyncThunk('chat/loadUsers', async () => {
  return await fetchUsersAPI();
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateUserStatus: (state, action: PayloadAction<{ username: string; status: string }>) => {
      const user = state.onlineUsers.find((u) => u.username === action.payload.username);
      if (user) {
        user.isOnline = action.payload.status === 'online';
      } else {
        // If new user joins, add them
        state.onlineUsers.push({ username: action.payload.username, isOnline: true });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.onlineUsers = action.payload;
      });
  },
});

export const { selectUser, addMessage, updateUserStatus } = chatSlice.actions;
export default chatSlice.reducer;