import { pizzaTypesMap } from '@/shared/constants/pizza';
import { cn } from '@/shared/lib/utils';
import { Ingredient } from '@prisma/client';
import { PizzaSizeKey, PizzaTypeKey } from '@/shared/constants/pizza';

interface Props {
  name: string;
  details?: string;
  pizzaSize?: PizzaSizeKey;
  type?: PizzaTypeKey;
  ingredients?: Ingredient[];
}

export const CartItemInfo: React.FC<Props> = ({ name, details, pizzaSize, type, ingredients }) => {
  const detailsList = details ? [details] : [];

  if (!details && pizzaSize && type) {
    const typeName = pizzaTypesMap[type];
    detailsList.push(`${typeName} ${pizzaSize} cm`);
  }

  if (!details && ingredients) {
    detailsList.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
      </div>
      {detailsList.length > 0 && <p className="text-xs text-gray-400">{detailsList.join(', ')}</p>}
    </div>
  );
};
