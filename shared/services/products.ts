import { axiosInstance } from './instances';
import { ApiRoutes } from './constants';

export type ProductSearchItem = {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

export const search = async (query: string) => {
  const { data } = await axiosInstance.get<ProductSearchItem[]>(ApiRoutes.PRODUCTS_SEARCH, {
    params: { query },
  });
  return data;
};