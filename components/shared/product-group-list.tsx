import React from 'react';
import { Title } from './title';
import { ProductCard } from './product-card';

interface Props {
  title: string;
  items: any[];
  categoryId: number;
  listClassName?: string;
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  categoryId,
  listClassName,
  className,
}) => {
  return (
    <div className={className}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />
      <div className="grid grid-cols-3 gap-[50px]">
        {items.map((pizza, i) => (
          <ProductCard
            key={i}
            id={pizza.id}
            name={pizza.name}
            price={pizza.price}
            imageUrl={pizza.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
