import { Product, Ingredient, ProductItem } from '@prisma/client';

export type ProductWithRelations = Product & {
  ingredients: Ingredient[];
  items: ProductItem[];
};