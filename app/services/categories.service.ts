import { api } from './api.js';

export interface CategoryItem {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  categorias: CategoryItem[];
}

export interface UpdateCategoryInput {
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export const categoriesService = {
  async getCategories(): Promise<CategoriesResponse> {
    return api.get('/api/categories');
  },

  async updateCategory(
    id: number,
    data: UpdateCategoryInput,
  ): Promise<{ success: boolean; categoria: CategoryItem }> {
    return api.put(`/api/categories/${id}`, data);
  },
};