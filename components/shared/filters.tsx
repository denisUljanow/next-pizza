'use client';

import React from 'react';
import { useSet } from 'react-use';

import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { Title } from './title';
import { useFilterIngredients } from '@/hooks/useFilterIngredients';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { items, loading } = useFilterIngredients();
  const [selectedIngredients, { add, remove }] = useSet<string>(new Set<string>());

  const ingredientOptions = React.useMemo(
    () =>
      items.map((ingredient) => ({
        text: ingredient.name,
        value: ingredient.id.toString(),
      })),
    [items],
  );

  const handleIngredientToggle = React.useCallback(
    (value: string, checked: boolean) => {
      if (checked) {
        add(value);
      } else {
        remove(value);
      }
      const nextSelected = new Set(selectedIngredients);
      if (checked) {
        nextSelected.add(value);
      } else {
        nextSelected.delete(value);
      }

      const selectedItems = ingredientOptions.filter((option) => nextSelected.has(option.value));
      console.log('Selected ingredients:', selectedItems);
    },
    [add, remove, ingredientOptions, selectedIngredients],
  );

  return (
    <div className={className}>
      <Title text="Filter" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Zusammenstellen möglich" value="1" />
        <FilterCheckbox text="Neu" value="2" />
      </div>

      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Preis von - bis:</p>
        <div className="flex gap-3 mb-5">
          <Input type="number" placeholder="0" min={0} max={1000} defaultValue={0} />
          <Input type="number" min={100} max={1000} placeholder="1000" />
        </div>
        <RangeSlider min={0} max={5000} step={10} value={[0, 5000]} />
      </div>

      <CheckboxFiltersGroup
        className="mt-5"
        title="Zutaten"
        limit={6}
        defaultItems={ingredientOptions.slice(0, 6)}
        items={ingredientOptions}
        loading={loading}
        selectedValues={selectedIngredients}
        onItemToggle={handleIngredientToggle}    // fügt ein oder entfernt Zutaten aus dem Set selectedIngredients
      />
    </div>
  );
};
