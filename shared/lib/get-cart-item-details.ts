import { CartState } from '@/app/store/cart';
import { PizzaSizeKey, PizzaTypeKey, pizzaTypesMap } from '@/shared/constants/pizza';
import { Ingredient } from '@prisma/client';
import { CartStateItem } from './get-cart-details';

export const getCartItemDetails = (
  pizzaType?: PizzaTypeKey,
  pizzaSize?: PizzaSizeKey,
  ingredients?: CartStateItem['ingredients'],
): string => {
  const details = [];

  if (pizzaSize && pizzaType) {
    const typeName = pizzaTypesMap[pizzaType];
    details.push(`${typeName} ${pizzaSize} cm`);
  }

  if (ingredients) {
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return details.join(', ');
};