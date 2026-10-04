import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../api/client';

export const fetchFiles = createAsyncThunk('files/fetchFiles', async (userId) => {
  const params = userId ? { user_id: userId } : {};
  const res = await client.get('files/', { params });
  return res.data;
});

export const uploadFile = createAsyncThunk('files/uploadFile', async ({ file, comment }) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('comment', comment);
  const res = await client.post('files/upload/', fd);
  return res.data;
});

export const deleteFile = createAsyncThunk('files/deleteFile', async (id) => {
  await client.delete(`files/${id}/`);
  return id;
});

export const updateFile = createAsyncThunk('files/updateFile', async ({ id, data }) => {
  const res = await client.patch(`files/${id}/`, data);
  return res.data;
});

export const shareFile = createAsyncThunk('files/shareFile', async (id) => {
  const res = await client.post(`files/${id}/share/`);
  return { id, special_link: res.data.special_link };
});

const filesSlice = createSlice({
  name: 'files',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (s) => { s.loading = true; })
      .addCase(fetchFiles.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchFiles.rejected, (s) => { s.loading = false; })
      .addCase(uploadFile.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(deleteFile.fulfilled, (s, a) => {
        s.list = s.list.filter((f) => f.id !== a.payload);
      })
      .addCase(updateFile.fulfilled, (s, a) => {
        const idx = s.list.findIndex((f) => f.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      });
  },
});

export default filesSlice.reducer;
