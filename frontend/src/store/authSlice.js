import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../api/client';

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const res = await client.get('me/');
  return res.data;
});

export const login = createAsyncThunk('auth/login', async ({ login, password }, { rejectWithValue }) => {
  try {
    const res = await client.post('login/', { login, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Ошибка' });
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await client.post('logout/');
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await client.post('register/', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Ошибка' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    registerError: null,
    registerSuccess: false,
  },
  reducers: {
    clearRegisterState: (state) => {
      state.registerError = null;
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(fetchMe.rejected, (s) => { s.user = null; })

      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(logout.fulfilled, (s) => { s.user = null; })

      .addCase(register.pending, (s) => { s.registerError = null; s.registerSuccess = false; })
      .addCase(register.fulfilled, (s) => { s.registerSuccess = true; })
      .addCase(register.rejected, (s, a) => { s.registerError = a.payload; });
  },
});

export const { clearRegisterState } = authSlice.actions;
export default authSlice.reducer;
