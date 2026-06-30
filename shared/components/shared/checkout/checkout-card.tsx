import React from 'react';
import { WhiteBlock } from '../white-block';
import { CheckoutItem } from '../checkout-item';
import { getCartItemDetails } from '@/shared/lib';
import { PizzaSizeKey, PizzaTypeKey } from '@/shared/constants/pizza';
import { CartStateItem } from '@/shared/lib/get-cart-details';

interface Props {
    items: CartStateItem[];
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    removeCartItem: (id: number) => void;
    className?: string;
}

export const CheckoutCart: React.FC<Props> = ({items, onClickCountButton, removeCartItem, className}) => {
    return (
        <WhiteBlock title="1. Warenkorb" className={className}>
            <div className="flex flex-col gap-5">
                {items.map((item) => (
                <CheckoutItem 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    quantity={item.quantity}
                    details={getCartItemDetails(
                                            item.pizzaType as PizzaTypeKey, 
                                            item.pizzaSize as PizzaSizeKey,
                                            item.ingredients,
                    )}
                    onClickCountButton={(type) => {
                        onClickCountButton(item.id, item.quantity, type)
                    }}
                    onClickRemove={() => removeCartItem(item.id)}
                />
                ))
                }
            </div>
        </WhiteBlock>
    )
}