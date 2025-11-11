'use client';
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useClickAway, useDebounce } from 'react-use';
import Link from 'next/link';
import { Api } from '@/shared/services/api-client';
import type { ProductSearchItem } from '@/shared/services/products';

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [products, setProducts] = React.useState<ProductSearchItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const closeDropdown = React.useCallback(() => {
    setFocused(false);
  }, []);

  const onClickDropdownItem = () => {
    closeDropdown();
    setSearchQuery('');
  };

  useClickAway(ref, closeDropdown);

  useDebounce(
    async () => {
      try {
        const items = await Api.products.search(searchQuery);
        setProducts(items);
      } catch (error) {
        console.error('Failed to search products:', error);
      }
    },
    500,
    [searchQuery],
  );

  return (
    <>
      {focused && <div className="fixed inset-0 bg-black/50 z-30" onClick={closeDropdown} />}
      <div
        ref={ref}
        className={cn(
          'w-full',
          focused && 'fixed inset-x-0 top-0 z-40 flex flex-col items-center pt-9 px-9',
        )}
        onClick={closeDropdown}>
        <div
          className={cn(
            'relative rounded-2xl bg-white w-full shadow-lg',
            focused && 'max-w-3xl',
            className,
          )}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
          <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Suche nach Produkten..."
            className="w-full h-11 rounded-2xl pl-10 pr-4 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            onFocus={() => setFocused(true)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {focused && (
          <div
            className={cn(
              'relative mt-4 rounded-2xl bg-white w-full max-w-3xl shadow-lg justify-center py-6 px-9',
              className,
            )}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
            {products.map((product) => (
              <Link
                onClick={onClickDropdownItem}
                key={product.id}
                className="flex items-center gap-4 w-full px-3 py-3 hover:bg-primary/10"
                href={`/product/${product.id}`}>
                <img
                  className="rounded-sm h-8 w-8"
                  src={`/${product.imageUrl}`}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
