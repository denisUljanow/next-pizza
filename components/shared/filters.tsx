'use client';
//////////
import React, { useEffect } from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';
import { useSearchParam, useSet } from 'react-use';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  className?: string;
}

interface PriceProps {
  fromPrice?: number;
  toPrice?: number;
}

interface QueryFilters extends PriceProps {
  ingredients?: string[];
  sizes?: string[];
  types?: string[];
}

export const Filters: React.FC<Props> = ({ className }) => {
  type Item = {
    text: string;
    value: string;
  };
  //const [ingredientItems, setIngredientItems] = React.useState<>([]);
  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;
  const {items, loading, filterSet, onAddid} = useFilterIngredients(searchParams.get('ingredients')?.split(','));
  const ingredientOptions: Item[] = items.map((ingredient) => ({
    text: ingredient.name,
    value: ingredient.id.toString(),
  }));
  
  const [prices, setPrices] = React.useState<PriceProps>({
    fromPrice: Number(searchParams.get('fromPrice')) || undefined,
    toPrice: Number(searchParams.get('toPrice')) || undefined,
  });

  //const [sizesSet, {toggle: toggleSizes}] = useSet(new Set<string>([]));
  const [sizesSet, {toggle: toggleSizes}] = useSet(new Set<string>(searchParams.get('sizes')?.split(',') || []));
  const [typeSet, {toggle: toggleTypes}] = useSet(new Set<string>(searchParams.get('types')?.split(',') || []));

  const updatePrice = (key: keyof PriceProps, value: number) => {
    setPrices((prices) => ({
      ...prices,
      [key]: value,
    }));
  };

  const router = useRouter();

  useEffect(() => {
      const query = ({
        ...prices,
        ingredients: Array.from(filterSet),
        sizes: Array.from(sizesSet),
        types: Array.from(typeSet),
      });

      const queryString = qs.stringify(query, { arrayFormat: 'comma', encode: false });
      router.push(`/?${queryString}`, {scroll: false}
      );
      //console.log({filterSet, sizesSet, typeSet, prices});
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
            value={prices.fromPrice || 0}
            onChange={(event) => updatePrice('fromPrice', Number(event.target.value))}
          />
          <Input
            type="number"
            placeholder="20"
            min={1}
            max={20}
            value={prices.toPrice || 20}
            onChange={(event) => updatePrice('toPrice', Number(event.target.value))}
          />
        </div>
        <RangeSlider min={0} max={20} step={1} value={[
          prices.fromPrice || 0 , prices.toPrice || 20
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
