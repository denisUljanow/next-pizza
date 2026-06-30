import React from 'react';
import { WhiteBlock } from '../white-block';
import { CheckoutItemDetails } from '../checkout-item-details';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '@/shared/lib/utils';

const VAT = 20;
const DELIVERY_PRICE = 10;

interface Props {
  className?: string;
  totalAmount: number;
}

export const CheckoutSidebar: React.FC<Props> = ({ className, totalAmount }) => {
    const vatPrice = (totalAmount / 100) * VAT;
    const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE;

    return (
    <WhiteBlock className={cn("p-6 sticky top-4", className)}>
        <div className="flex flex-col gap-1">
            <span className="text-xl">Gesamtbetrag:</span>
            <span className="text-[34px] font-extrabold">€ {totalPrice.toFixed(2)}</span>
        </div>

        <CheckoutItemDetails title={
            <div className="flex items-center">
                <Package size={18} className="mr-2 text-grey-300"/>
                Betrag inkl. MwSt.: 
            </div>
        } value={`€ ${totalAmount.toFixed(2)}`} />
        <CheckoutItemDetails title={
        <div className="flex items-center">
                <Percent size={18} className="mr-2 text-grey-300"/>
                MwSt.: 
            </div>
        } value={`€ ${vatPrice.toFixed(2)}`} />
        <CheckoutItemDetails title={
            <div className="flex items-center">
                <Truck size={18} className="mr-2 text-grey-300"/>
                Versandkosten: 
            </div>
        } value={`€ ${DELIVERY_PRICE.toFixed(2)}`} />

        <Button type="submit" className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
            Bestellung aufgeben
            <ArrowRight className="w-5 ml-2" />
        </Button>
    </WhiteBlock>
  );
};
