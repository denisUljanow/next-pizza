'use client';

import { useCategoryStore } from '@/app/store/category';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface Props {
  className?: string;
  categories?: Array<Pick<Category, 'id' | 'name'>>;
}

const cats = [
  { id: 1, name: '' },
];

export const Categories: React.FC<Props> = ({ categories, className }) => {
  const categoriesList = categories ?? cats;
  const activeId = useCategoryStore((state) => state.activeId);
  const setActiveId = useCategoryStore((state) => state.setActiveId);

  const handleCategoryClick = (event: React.MouseEvent<HTMLAnchorElement>, id: number, name: string) => {
    event.preventDefault();
    setActiveId(id);

    const targetElement = document.getElementById(name);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {categoriesList.map(({ id, name }, index) => (
        <Link
          key={index}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5',
            activeId === id && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          href={`/category/${id}`}
          onClick={(event) => handleCategoryClick(event, id, name)}>
          {name}
        </Link>
      ))}
    </div>
  );
};
