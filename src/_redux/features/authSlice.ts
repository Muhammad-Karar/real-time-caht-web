import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginAPI } from '../services/authService';

interface AuthState {
  username: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  username: null,
  status: 'idle',
};

// Async Thunk for Login
export const loginUser = createAsyncThunk('auth/login', async (username: string) => {
  await loginAPI(username);
  // 2. Save to LocalStorage (Persist the session)
  localStorage.setItem('chat_username', username);
  return username;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.status = 'idle';
      // 3. Clear LocalStorage on Logout
      localStorage.removeItem('chat_username');
    },
    // 4. New Action: Restore session from LocalStorage
    restoreSession: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.username = action.payload;
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;