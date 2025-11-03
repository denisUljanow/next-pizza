'use client';
//////////
import React, { useEffect } from 'react';
import { Title } from './title';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilters, useQueryFilters, useIngredients } from '@/hooks';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  

  //const [sizesSet, {toggle: toggleSizes}] = useSet(new Set<string>([]));
  const filters = useFilters();
  const { ingredientOptions, loading } = useIngredients();

  useQueryFilters(filters);

  return (
    <div className={className}>
      <Title text="Filter" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        
        <CheckboxFiltersGroup
          title="Teigtypen"
          className="mb-5"
          onCheckboxChange={filters.setTypes}
          filterSet={filters.typeSet}
          items={[
            { text: 'normal', value: 'normal' },
            { text: 'dünn', value: 'dünn' },
          ]}
        />
        
        <CheckboxFiltersGroup
          title="Größen"
          className="mb-5"
          onCheckboxChange={filters.setSizes}
          filterSet={filters.sizesSet}
          items={[
            { text: '20 cm', value: '20' },
            { text: '30 cm', value: '30' },
            { text: '40 cm', value: '40' },
          ]}
        />

      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Preis von - bis:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={20}
            value={filters.prices.fromPrice || 0}
            onChange={(event) => filters.setPrices('fromPrice', Number(event.target.value))}
          />
          <Input
            type="number"
            placeholder="20"
            min={1}
            max={20}
            value={filters.prices.toPrice || 20}
            onChange={(event) => filters.setPrices('toPrice', Number(event.target.value))}
          />
        </div>
        <RangeSlider min={0} max={20} step={1} value={[
          filters.prices.fromPrice || 0 , filters.prices.toPrice || 20
        ]} onValueChange={([fromPrice, toPrice]) => {
          filters.setPrices('fromPrice', fromPrice);
          filters.setPrices('toPrice', toPrice);
        }} />
      </div>

      <CheckboxFiltersGroup
        className="mt-5"
        title="Zutaten"
        limit={6}
        defaultItems={ingredientOptions.slice(0, 6)}
        items={ingredientOptions}
        loading={loading}
        filterSet ={filters.ingredientSet}
        onCheckboxChange={filters.setIngredients}
      />
    </div>
  );
};
