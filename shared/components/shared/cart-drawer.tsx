'use client';

import React from 'react';
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails } from '@/shared/lib';
import { useCartStore } from '@/app/store/cart';
import { PizzaSizeKey, PizzaTypeKey } from '@/shared/constants/pizza';
import { Ingredient } from '@prisma/client';

interface Props {
className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children, className }) => {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const items = useCartStore((state) => state.items);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  console.log('CartDrawer items:', items);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  console.log('fetchCartItems:', fetchCartItems);
  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };
  

  React.useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  
  return (
    <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
          <SheetHeader>
            <SheetTitle>
                Im Warenkorb <span className="font-bold">{items.length} Waren</span>
            </SheetTitle>
          </SheetHeader>
        
            <div className="-mx-6 mt-5 overflow-auto flex-1">
              {items.map((item) => (
                <div key={item.id} className="mb-2">
                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl}
                    details={item.pizzaSize && item.pizzaType ? getCartItemDetails(
                      item.pizzaType as PizzaTypeKey, 
                      item.pizzaSize as PizzaSizeKey,
                      item.ingredients,
                    ) : ''}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onClickCountButton={(type) => {
                      onClickCountButton(item.id, item.quantity, type)
                    }}
                    onClickRemove={() => removeCartItem(item.id)}
                  />
                </div>
              ))}
            </div>

            <SheetFooter className="-mx-6 bg-white p-8">
                <div className="w-full">
                    <div className="flex mb-4">
                        <span className="flex flex-1 text-lg text-neutral-500">
                            Gesamt:
                            <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                        </span>
                        <span className="text-lg font-bold">{totalAmount.toFixed(2)} €</span>
                    </div>

                    <Link href="/checkout">
                        <Button
                            type="submit"
                            className="w-full h-12 text-base">
                            Zur Bestellung
                            <ArrowRight className="w-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </SheetFooter>
        </SheetContent>
    </Sheet>
  );
};
