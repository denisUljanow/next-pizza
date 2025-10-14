'use client';

import { useCategoryStore } from '@/app/store/category';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
  className?: string;
}

const cats = [
  { id: 1, name: 'Pizzas' },
  { id: 2, name: 'Combo' },
  { id: 3, name: 'Vorspeise' },
  { id: 4, name: 'Cocktails' },
  { id: 5, name: 'Kaffee' },
  { id: 6, name: 'Getränke' },
  { id: 7, name: 'Desserts' },
];

export const Categories: React.FC<Props> = ({ className }) => {
  const useActiveId = useCategoryStore((state) => state.activeId);
  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {cats.map(({ id, name }, index) => (
        <Link
          key={index}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5',
            useActiveId === id && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          href="">
          {name}
        </Link>
      ))}
    </div>
  );
};
