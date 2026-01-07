'use client'

import { DialogContent, Dialog, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelationsPlain } from '@/shared/types/prisma';
import { ChoosePizzaForm } from '../choose-pizza-form';
import { useCartStore } from '@/app/store/cart';

interface Props {
    product: ProductWithRelationsPlain;
    className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
    const router = useRouter();
    const addCartItem = useCartStore((state) => state.addCartItem);
    const firstItem = product.items[0];
    const isPizzaType = product.items?.some((item) => item.pizzaType !== null && item.pizzaType !== undefined);
    console.log("product: ", product);

    const onAddProduct = async () => {
        await addCartItem({
            productItemId: firstItem.id,
        });
    };

    const onAddPizza = async (productItemId: number, ingredients: number[]) => {
        await addCartItem({
            productItemId,
            ingredients,
        });
    };

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
                    onSubmit={onAddPizza}
                />
            ) : (
                <ChooseProductForm 
                    name={product.name} 
                    imageUrl={product.imageUrl} 
                    onSubmit={onAddProduct} 
                    price={firstItem.price} 
                />  
            )}
        </DialogContent>
    </Dialog>
  );
};
