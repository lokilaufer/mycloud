import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../api/client';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await client.get('users/');
  return res.data;
});

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await client.delete(`users/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Ошибка удаления' });
    }
  }
);

export const toggleAdmin = createAsyncThunk(
  'users/toggleAdmin',
  async ({ id, is_admin }, { rejectWithValue }) => {
    try {
      const res = await client.patch(`users/${id}/`, { is_admin });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { detail: 'Ошибка изменения прав' });
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearUsersError: (s) => { s.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchUsers.rejected, (s) => { s.loading = false; })

      .addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter((u) => u.id !== a.payload);
        s.error = null;
      })
      .addCase(deleteUser.rejected, (s, a) => {
        s.error = a.payload?.detail || 'Ошибка удаления';
      })

      .addCase(toggleAdmin.fulfilled, (s, a) => {
        const idx = s.list.findIndex((u) => u.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
        s.error = null;
      })
      .addCase(toggleAdmin.rejected, (s, a) => {
        s.error = a.payload?.detail || 'Ошибка изменения прав';
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
