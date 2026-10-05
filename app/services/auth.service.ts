import { api } from './api.js';

export interface LoginResponse {
  token: string;
  usuario: {
    id_usuario: number;
    nombre: string;
    correo: string;
    telefono?: string | null;
    rol: string;
    id_area?: number;
    area: string;
  };
}

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  rol: string;
  id_area?: number;
  area: string;
}

export const authService = {
  async login(correo: string, password: string): Promise<LoginResponse> {
    return api.post('/auth/login', { correo, password });
  },

  async me(): Promise<{ usuario: UserProfile }> {
    return api.get('/auth/me');
  },

  async logout() {
    api.clearToken();
  },
};
