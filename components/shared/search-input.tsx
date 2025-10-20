'use client';
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickAway } from 'react-use';
import Link from 'next/link';
import { Api } from '@/services/api-client';

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  React.useEffect(() => {
    Api.products.search(searchQuery);
  }, [searchQuery]);

  return (
    <>
      {focused && <div className="fixed inset-0 bg-black/50 z-30" />}
      <div ref={ref} className="fixed inset-x-0 top-0 z-40 flex flex-col items-center pt-9 px-9">
        <div className={cn('relative rounded-2xl bg-white w-full max-w-3xl shadow-lg', className)}>
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
              'relative rounded-2xl bg-white w-full max-w-3xl shadow-lg justify-center py-6 px-9',
              className,
            )}>
            <Link
              className="flex items-center gap-4 w-full px-3 py-3 hover:bg-primary/10"
              href="/product/1">
              <img className="rounded-sm h-8 w-8" src="/img/pizza1.webp" alt="Pizza 1" />
              <span>Pizza 1</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
