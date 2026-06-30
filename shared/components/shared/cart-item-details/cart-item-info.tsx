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
  className?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details, pizzaSize, type, ingredients, className }) => {
  const detailsList = details ? [details] : [];

  if (!details && pizzaSize && type) {
    const typeName = pizzaTypesMap[type];
    detailsList.push(`${typeName} ${pizzaSize} cm`);
  }

  if (!details && ingredients) {
    detailsList.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
      </div>
      {detailsList.length > 0 && <p className="text-xs text-gray-400 w-[90%]">{detailsList.join(', ')}</p>}
    </div>
  );
};
