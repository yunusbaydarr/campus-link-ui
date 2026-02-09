import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';
import type { LoginRequest, AuthResponse, RegisterRequest } from '../types/authTypes';
import { toast } from 'react-toastify';

const token = localStorage.getItem('accessToken');

const initialState: any = {
  user: null,
  token: token || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<AuthResponse>('/api/v1/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Giriş başarısız';
      return rejectWithValue(message);
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ values, file }: { values: RegisterRequest; file: File | null }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      const userBlob = new Blob([JSON.stringify(values)], {
        type: 'application/json'
      });
      formData.append('user', userBlob);

      if (file) {
        formData.append('file', file);
      }

      const response = await axiosClient.post('/user/createUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kayıt başarısız';
      return rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/user/me');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message);
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      toast.success('Giriş başarılı!');
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
     state.user = action.payload;
     });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;