import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
    className?: string;
    name: string;
    price: number;
    onSubmit: VoidFunction;
    imageUrl: string;
}

export const ChooseProductForm: React.FC<Props> = ({ className, name, imageUrl, onSubmit, price }) => {
    const textDetails = '30 cm, dünne Teig 30';
    const totalPrice = 350;

    return (
    <div className={cn(className, 'flex flex-1')}>
        <div className="flex items-center justify-center flex-1 relative w-full">
            <img src={imageUrl} 
                 alt={name} 
                 className="relative left-2 top-2 transition-all z-10 duration-300-w-[300px] h-[350px]"
            />
        </div>
        <div className="w-[380px] shrink-0 bg-[#f7f6f5] px-7 pb-7 pt-10">
            <Title text={name} size="md" className="font-extrabold mb-1" />

            <Button 
                className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
                onClick={onSubmit}>
                In den Warenkorb - {price} €
            </Button>
        </div>
    </div>
  );
};