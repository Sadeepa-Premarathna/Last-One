import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  async verifyToken(): Promise<{ user: User }> {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};