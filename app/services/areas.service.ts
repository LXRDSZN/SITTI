import { api } from './api.js';

export interface AreaItem {
  id_area: number;
  nombre: string;
  activo: boolean;
}

export interface AreasResponse {
  success: boolean;
  areas: AreaItem[];
}

export interface UpdateAreaInput {
  nombre: string;
  activo: boolean;
}

export const areasService = {
  async getAreas(): Promise<AreasResponse> {
    return api.get('/api/areas');
  },

  async updateArea(id: number, data: UpdateAreaInput): Promise<{ success: boolean; area: AreaItem }> {
    return api.put(`/api/areas/${id}`, data);
  },
};