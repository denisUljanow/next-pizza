import { PizzaSizeKey, PizzaTypeKey, pizzaTypesMap } from '@/shared/constants/pizza';
import { Ingredient } from '@prisma/client';

export const getCartItemDetails = (
  pizzaType?: PizzaTypeKey,
  pizzaSize?: PizzaSizeKey,
  ingredients?: Ingredient[]
): string => {
  const details = [];

  if (pizzaSize && pizzaType) {
    const typeName = pizzaTypesMap[pizzaType];
    details.push(`${typeName} ${pizzaSize} см`);
  }

  if (ingredients) {
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return details.join(', ');
};
