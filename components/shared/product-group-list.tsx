'use client';

import React, { useEffect } from 'react';
import { Title } from './title';
import { ProductCard } from './product-card';
import { useRef, useState } from 'react';
import { useCategoryStore } from '@/app/store/category';

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
  if (!items.length) {
    return null;
  }
  const intersectionRef = useRef(null);
  const useSetActiveId = useCategoryStore((state) => state.setActiveId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            useSetActiveId(categoryId);
          }
        });
      },
      { threshold: 0.4 },
    );
    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }
    return () => {
      if (intersectionRef.current) {
        observer.unobserve(intersectionRef.current);
      }
    };
  }, [title, categoryId]);

  return (
    <div ref={intersectionRef} className={className} id={title}>
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
