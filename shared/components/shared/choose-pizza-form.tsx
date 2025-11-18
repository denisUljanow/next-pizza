import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { PizzaImage } from './pizza-image';
import { GroupVariants, Variant } from './group-variants';
import { PizzaSizeKey, pizzaSizesMap, PizzaTypeKey, pizzaTypesMap } from '@/shared/constants/pizza';
import { Ingredient, ProductItem } from '@prisma/client';
import { IngredientItem } from './ingredient-item';
import { useSet } from 'react-use';
import { totalPizzaPrice } from '@/libs/calc-total-pizza-price';

interface Props {
    className?: string;
    name: string;
    imageUrl: string;
    ingredients?: Ingredient[];
    items: ProductItem[];
    onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({ className, name, imageUrl, ingredients, items, onClickAdd, }) => {

    
    const [size, setSize] = React.useState<PizzaSizeKey>(30);
    const [type, setType] = React.useState<PizzaTypeKey>(1);
    const textDetails = `${size} cm, ${pizzaTypesMap[type]}`;
    const [selectedIngredients, {toggle: addIngredient}] = useSet(new  Set<number>([]));
    
    const sizeVariants = Object.entries(pizzaSizesMap).map(([value, text]) => {
        const numericValue = Number(value);
        const combinationExists = items?.some(
            (item) => item.pizzaType === type && item.size === numericValue,
        );

        return {
            name: text,
            value,
            disabled: !combinationExists,
        };
    }) as Variant[];
    
    React.useEffect(() => {             // Die erste verfügbare Pizza-Größe wird ausgewählt, wenn die aktuelle Kombination nicht existiert 
        const currentCombinationExists = items?.some(
            (item) => item.pizzaType === type && item.size === size,
        );

        if (currentCombinationExists) {
            return;
        }

        const firstAvailableSize = Object.keys(pizzaSizesMap).find((value) =>
            items?.some(
                (item) => item.pizzaType === type && item.size === Number(value),
            ),
        );

        if (firstAvailableSize) {
            setSize(Number(firstAvailableSize) as PizzaSizeKey);
        }
    }, [items, size, type]);
    
    const typeVariants = Object.entries(pizzaTypesMap).map(([value, text]) => ({
        name: text,
        value,
    })) as Variant[];

    const totalPrice = totalPizzaPrice(
        items,
        size,
        type,
        ingredients,
        selectedIngredients,
    );

    const availablePizzas = items.filter((item) => item.pizzaType == type);
    /* const sizeVariants = Object.entries(pizzaSizesMap).map(([value, text]) => ({
        name: text,
        value,
        disabled: !items.map((item) => {}) includes(Number(value)),
    })) as Variant[]; */

    console.log('availablePizzas: ', availablePizzas);
    console.log("items: ", items);

    console.log("Ingredients: ", ingredients);
    // console.log('sizeState: ', size);
    // console.log('typeState: ', type);
    return (
    <div className={cn(className, 'flex flex-1')}>
        <div className="flex items-center justify-center flex-1 relative w-full">
            <PizzaImage imageUrl={imageUrl} size={size} />
        </div>
        <div className="w-[560px] shrink-0 bg-[#f7f6f5] px-7 pb-7 pt-10">
            <Title text={name} size="md" className="font-extrabold mb-1" />
            <p className="text-gray-400">{textDetails}</p>
            <div className='flex flex-col gap-4 mt-5'>
                <GroupVariants
                    items={sizeVariants}
                    selectedValue={String(size)}
                    className="mt-4"
                    onClick={(value) => setSize(Number(value) as PizzaSizeKey)}
                />
                <GroupVariants
                    items={typeVariants}
                    selectedValue={String(type)}
                    className="mt-3"
                    onClick={(value) => setType(Number(value) as PizzaTypeKey)}
                />
            </div>
            <div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar mt-5">
                <div className="grid grid-cols-3 gap-3">
                    {ingredients?.map((ingredient) => (
                    <IngredientItem 
                        key={ingredient.id}
                        imageUrl={ingredient.imageUrl}
                        name={ingredient.name}
                        price={ingredient.price}
                        onClick={() => addIngredient(ingredient.id)}
                        active={selectedIngredients.has(ingredient.id)}
                    />
                    ))}
                </div>
            </div>
            <Button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                In den Warenkorb - {totalPrice} €
            </Button>
        </div>
    </div>
  );
};
