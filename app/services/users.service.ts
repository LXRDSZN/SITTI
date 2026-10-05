import { api } from './api.js';

export interface UserItem {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string | null;
  id_rol: number;
  rol: string;
  id_area: number;
  area: string;
  activo: boolean;
  creado_en: string;
}

export interface RoleItem {
  id_rol: number;
  nombre: string;
}

export interface AreaItem {
  id_area: number;
  nombre: string;
  activo: boolean;
}

export interface UsersResponse {
  success: boolean;
  usuarios: UserItem[];
}

export interface MetaResponse {
  success: boolean;
  roles: RoleItem[];
  areas: AreaItem[];
}

export interface CreateUserInput {
  nombre: string;
  correo: string;
  password?: string;
  id_rol: number;
  id_area: number;
  activo?: boolean;
}

export interface UpdateUserInput {
  nombre?: string;
  correo?: string;
  telefono?: string | null;
  password?: string;
  id_rol?: number;
  id_area?: number;
  activo?: boolean;
}

export const usersService = {
  async getUsers(): Promise<UsersResponse> {
    return api.get('/api/users');
  },

  async getMeta(): Promise<MetaResponse> {
    return api.get('/api/users/meta/roles-areas');
  },

  async createUser(data: CreateUserInput): Promise<{ success: boolean; message: string; usuario: UserItem }> {
    return api.post('/api/users', data);
  },

  async updateUser(id: number, data: UpdateUserInput): Promise<{ success: boolean; message: string; usuario: UserItem }> {
    return api.put(`/api/users/${id}`, data);
  },

  async deleteUser(id: number): Promise<{ success: boolean; message: string; softDeleted?: boolean }> {
    return api.delete(`/api/users/${id}`);
  },
};
