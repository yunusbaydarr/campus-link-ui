import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';
import type { Club } from '../types/domainTypes';

interface ClubState {
  clubs: Club[];
  loading: boolean;
  error: string | null;
}

const initialState: ClubState = {
  clubs: [],
  loading: false,
  error: null,
};


export const getAllClubs = createAsyncThunk(
  'club/getAllClubs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<Club[]>('/club/getAllClubs');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kulüpler yüklenemedi');
    }
  }
);

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(getAllClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default clubSlice.reducer;