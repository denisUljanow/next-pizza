import { Product, Ingredient, ProductItem } from '@prisma/client';

export type IngredientPlain = Omit<Ingredient, 'price'> & { price: number };
export type ProductItemPlain = Omit<ProductItem, 'price'> & { price: number };

export type ProductWithRelations = Product & {
  ingredients: Ingredient[];
  items: ProductItem[];
};

export type ProductWithRelationsPlain = Product & {
  ingredients: IngredientPlain[];
  items: ProductItemPlain[];
};
