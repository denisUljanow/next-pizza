'use client';

import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';

interface Props {
  className?: string;
}

interface priceProps {
  fromPrice: number;
  toPrice: number;
}

export const Filters: React.FC<Props> = ({ className }) => {
  type Item = {
    text: string;
    value: string;
  };
  //const [ingredientItems, setIngredientItems] = React.useState<>([]);
  
  const {items, loading, filterSet, onAddid} = useFilterIngredients();
  const ingredientOptions: Item[] = items.map((ingredient) => ({
    text: ingredient.name,
    value: ingredient.id.toString(),
  }));
  const [prices, setPrices] = React.useState<priceProps>({
    fromPrice: 0,
    toPrice: 20,
  });

  const updatePrice = (key: keyof priceProps, value: number) => {
    setPrices((prices) => ({
      ...prices,
      [key]: value,
    }));
  };

  return (
    <div className={className}>
      <Title text="Filter" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        <FilterCheckbox name="Filter" text="Zusammenstellen möglich" value="1" />
        <FilterCheckbox name="Filter" text="Neu" value="2" />
      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Preis von - bis:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={20}
            value={prices.fromPrice}
            onChange={(event) => updatePrice('fromPrice', Number(event.target.value))}
          />
          <Input
            type="number"
            placeholder="20"
            min={1}
            max={20}
            value={prices.toPrice}
            onChange={(event) => updatePrice('toPrice', Number(event.target.value))}
          />
        </div>
        <RangeSlider min={0} max={20} step={1} value={[
          prices.fromPrice, prices.toPrice
        ]} onValueChange={([fromPrice, toPrice]) => setPrices({fromPrice, toPrice})} />
      </div>

      <CheckboxFiltersGroup
        className="mt-5"
        title="Zutaten"
        limit={6}
        defaultItems={ingredientOptions.slice(0, 6)}
        items={ingredientOptions}
        loading={loading}
        filterSet ={filterSet}
        onCheckboxChange={onAddid}
      />
    </div>
  );
};
