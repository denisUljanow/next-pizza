'use client';

import React, { useEffect } from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';
import { useSet } from 'react-use';

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
  const [sizesSet, {toggle: toggleSizes}] = useSet(new Set<string>([]));
  const [typeSet, {toggle: toggleTypes}] = useSet(new Set<string>([]));

  const updatePrice = (key: keyof priceProps, value: number) => {
    setPrices((prices) => ({
      ...prices,
      [key]: value,
    }));
  };

  useEffect(() => {
      console.log({filterSet, sizesSet, typeSet, prices});
    },[filterSet, sizesSet, typeSet, prices]
  );

  return (
    <div className={className}>
      <Title text="Filter" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        
        <CheckboxFiltersGroup
          title="Teigtypen"
          className="mb-5"
          onCheckboxChange={toggleTypes}
          filterSet={typeSet}
          items={[
            { text: 'normal', value: 'normal' },
            { text: 'dünn', value: 'dünn' },
          ]}
        />
        
        <CheckboxFiltersGroup
          title="Größen"
          className="mb-5"
          onCheckboxChange={toggleSizes}
          filterSet={sizesSet}
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
            value={prices.fromPrice<prices.toPrice? prices.fromPrice : prices.toPrice-1}
            onChange={(event) => updatePrice('fromPrice', Number(event.target.value))}
          />
          <Input
            type="number"
            placeholder="20"
            min={1}
            max={20}
            value={prices.toPrice>prices.fromPrice? prices.toPrice : prices.fromPrice+1}
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
