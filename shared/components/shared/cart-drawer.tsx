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
        

            {/* CartItems */}

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