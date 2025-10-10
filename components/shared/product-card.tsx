import React from 'react';
import { Title } from './title';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface Props {
  id: number;
  name: string;
  price: number;
  count?: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ name, price, count, imageUrl, className }) => {
  return (
    <div className={className}>
      <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
        <img className="w-[215px] h-[215px]" src={imageUrl} alt="Logo" />
      </div>
      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
      <p className="text-sm text-gray-400">
        Hähnchen, Mozzarella, Cheddar- und Parmesan-Käse, Käsesauce, Tomaten, Alfredo-Sauce,
        Knoblauch
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          ab <b>{price} ₽</b>
        </span>

        <Button variant="secondary">
          <Plus size={20} className="mr-1" />
          Hinzufügen
        </Button>
      </div>
    </div>
  );
};
