import { Ingredient } from '@prisma/client';
import { axiosInstance } from './instances';
import { ApiRoutes } from './constants';

export const getAll = async (): Promise<Ingredient[]> => {
  const { data } = await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS);
  return data;
};