import { Product } from '@prisma/client';
import { axiosInstance } from './instances';
import { ApiRoutes } from './constants';

export const search = async (query: string) => {
  const { data } = await axiosInstance.get<Product[]>(ApiRoutes.PRODUCTS_SEARCH, {
    params: { query },
  });
  return data;
};
