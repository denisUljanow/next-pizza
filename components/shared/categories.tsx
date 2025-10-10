import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
  className?: string;
}

const cats = ['Pizzas', 'Combo', 'Vorspeise', 'Cocktails', 'Kaffee', 'Getränke', 'Desserts'];
const activeIndex = 0;
export const Categories: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {cats.map((cat, index) => (
        <Link
          key={index}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5',
            activeIndex === index && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          href="">
          {cat}
        </Link>
      ))}
    </div>
  );
};
