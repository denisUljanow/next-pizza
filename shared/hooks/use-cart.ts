import { CartStateItem, useCartStore } from '@/app/store/cart';
import React from 'react';

type ReturnProps = {
    totalAmount: number;
    items: CartStateItem[];
    removeCartItem: (id: number) => void;
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
    updateItemQuantity?: (id: number, quantity: number) => void;
};

export const useCart = (): ReturnProps => {
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

  return {
    totalAmount,
    items,
    removeCartItem,
    onClickCountButton,
    updateItemQuantity,
  };
}