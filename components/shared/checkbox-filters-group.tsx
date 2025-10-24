'use client';

import React from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { Skeleton } from '../ui';

type Item = FilterChecboxProps;

interface Props {
  className?: string;
  title: string;
  items: Item[];
  defaultItems: Item[];
  limit?: number;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
  searchInputPlaceholder?: string;
  loading?: boolean;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Suche...',
  className,
  onChange,
  defaultValue,
  loading,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  if (loading) {
    return <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]"/>
              </div>
            </div>
  };

  const list = showAll
    ? items.filter((item) => item.text.toLowerCase().includes(searchVal.toLowerCase()))
    : defaultItems.slice(0, limit);
  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>
      {showAll && !loading && (
        <div className="mb-5">
          <Input
            placeholder={searchInputPlaceholder}
            onChange={(e) => handleSearchChange(e)}
            className="bg-gray-50 border-none"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {list.map((item, index) => (
          <FilterCheckbox
            onCheckedChange={(ids) => console.log(ids)}
            checked={false}
            key={index}
            value={item.value}
            text={item.text}
            endAdornment={item.endAdornment}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
          <button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
            {showAll ? 'Schließen' : 'Mehr anzeigen'}
          </button>
        </div>
      )}
    </div>
  );
};
