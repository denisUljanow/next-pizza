import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { PizzaImage } from './pizza-image';
import { GroupVariants, Variant } from './group-variants';
import { pizzaSizesMap, pizzaTypesMap } from '@/shared/constants/pizza';

type PizzaSizeKey = keyof typeof pizzaSizesMap;
type PizzaTypeKey = keyof typeof pizzaTypesMap;

interface Props {
    className?: string;
    name: string;
    imageUrl: string;
    ingredients?: any[];
    items?: any[];
    onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({ className, name, imageUrl, ingredients, items, onClickAdd, }) => {
    const textDetails = '30 cm, dünne Teig 30';
    const totalPrice = 350;
    const [size, setSize] = React.useState<PizzaSizeKey>(30);
    const [type, setType] = React.useState<PizzaTypeKey>(1);

    const sizeVariants = Object.entries(pizzaSizesMap).map(([value, text]) => ({
        name: text,
        value,
    })) as Variant[];
    const typeVariants = Object.entries(pizzaTypesMap).map(([value, text]) => ({
        name: text,
        value,
    })) as Variant[];
    // console.log('sizeState: ', size);
    // console.log('typeState: ', type);
    return (
    <div className={cn(className, 'flex flex-1')}>
        <div className="flex items-center justify-center flex-1 relative w-full">
            <PizzaImage imageUrl={imageUrl} size={size} />
        </div>
        <div className="w-[380px] shrink-0 bg-[#f7f6f5] px-7 pb-7 pt-10">
            <Title text={name} size="md" className="font-extrabold mb-1" />
            <p className="text-gray-400">{textDetails}</p>
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
            <Button className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                In den Warenkorb - {totalPrice} €
            </Button>
        </div>
    </div>
  );
};
