import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';
import type { Event } from '../types/domainTypes';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

export const getAllEvents = createAsyncThunk(
  'event/getAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get<Event[]>('/event/getAllEvents');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Etkinlikler yüklenemedi');
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventSlice.reducer;