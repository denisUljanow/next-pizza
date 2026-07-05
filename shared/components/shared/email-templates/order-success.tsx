import type { CartItemDTO } from '@/shared/services/dto/cart.dto';
import * as React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

const formatPrice = (price: unknown) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
        return '0.00';
    }

    return value.toFixed(2);
};

export const OrderSuccessTemplate: React.FC<Props> = ({ 
    orderId, 
    items
}) => (
    <div>
      <h1>Danke für Ihre Bestellung! 🎉</h1>
      <p>Wir haben Ihre Bestellung #{orderId} erhalten und sie wird in Kürze bereitgestellt.</p>
      <p> Liste der bestellten Artikel:</p>
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    {item.productItem.product.name} - {item.quantity}x {formatPrice(item.productItem.price)} €
                </li>
            ))}
        </ul>
    </div>
  );
