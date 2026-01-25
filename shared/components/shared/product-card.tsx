import React from 'react';
import { Title } from './title';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: number;
  name: string;
  price: number;
  count?: number;
  imageUrl: string;
  ingredients?: Array<{ name: string }>;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, price, count, imageUrl, ingredients, className }) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
          <img className="w-[215px] h-[215px]" src={imageUrl} alt="Logo" />
        </div>
        <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
        <p className="text-sm text-gray-400">
          {ingredients && ingredients.map((ing) => ing.name).join(', ')}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-[20px]">
            ab <b>{price} €</b>
          </span>

          <Button variant="secondary">
            <Plus size={20} className="mr-1" />
            Hinzufügen
          </Button>
        </div>
      </Link>
    </div>
  );
};
