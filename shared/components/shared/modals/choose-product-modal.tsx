'use client'

import { DialogContent, Dialog, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelationsPlain } from '@/app/@types/prisma';
import { ChoosePizzaForm } from '../choose-pizza-form';

interface Props {
    product: ProductWithRelationsPlain;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();
    const isPizzaType = product.items?.some((item) => item.pizzaType !== null && item.pizzaType !== undefined);
    
    return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
        <DialogContent className={cn('p-0 max-w-none sm:max-w-none w-[1200px] max-w-[1200px] min-h-[560px] bg-white overflow-hidden', className)}>
            <DialogTitle className="sr-only">{product.name}</DialogTitle>
            {isPizzaType ? (
                <ChoosePizzaForm 
                    name={product.name} 
                    imageUrl={product.imageUrl} 
                    ingredients={product.ingredients} 
                    items={product.items} 
                />
            ) : (
                <ChooseProductForm name={product.name} imageUrl={product.imageUrl} />  
            )}
        </DialogContent>
    </Dialog>
  );
};
