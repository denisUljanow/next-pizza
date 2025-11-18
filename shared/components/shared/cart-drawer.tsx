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

interface Props {
className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE]">
          <SheetHeader>
            <SheetTitle>
                Im Warenkorb <span className="font-bold">3 Waren</span>
              </SheetTitle>
            </SheetHeader>
        

            <CartDrawerItem
              id={1}
              imageUrl='https://media.dodostatic.com/image/r:292x292/11ee9b96fd6947e9a993cadea7e4d04a.avif'
              details={getCartItemDetails(2, 30,
                [{ name: 'Käse' }, { name: 'Tomaten' }, { name: 'Salami' }]
              )}
              name="Pepperoni Pizza"
              price={12}
              quantity={1}
            />

            <SheetFooter className="-mx-6 bg-white p-8">
                <div className="w-full">
                    <div className="flex mb-4">
                        <span className="flex flex-1 text-lg text-neutral-500">
                            Gesamt:
                            <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                        </span>
                        <span className="text-lg font-bold">10 €</span>
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