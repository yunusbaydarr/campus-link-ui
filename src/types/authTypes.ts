
export interface LoginRequest {
  username: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username: string; 
}

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
}

export interface AuthState {
  user: UserResponse | null; 
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}