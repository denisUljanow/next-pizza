import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
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
        defaultItems={[
          {
            text: 'Käse sauce',
            value: '1',
          },
          {
            text: 'Mozarella',
            value: '2',
          },
          {
            text: 'Knoblauch',
            value: '3',
          },
          {
            text: 'Salzgurke',
            value: '4',
          },
          {
            text: 'Rote Zwiebel',
            value: '5',
          },
          {
            text: 'Tomaten',
            value: '6',
          },
        ]}
        items={[
          {
            text: 'Käse sauce',
            value: '1',
          },
          {
            text: 'Mozarella',
            value: '2',
          },
          {
            text: 'Knoblauch',
            value: '3',
          },
          {
            text: 'Salzgurke',
            value: '4',
          },
          {
            text: 'Rote Zwiebel',
            value: '5',
          },
          {
            text: 'Tomaten',
            value: '6',
          },
          {
            text: 'Käse sauce',
            value: '1',
          },
          {
            text: 'Mozarella',
            value: '2',
          },
          {
            text: 'Knoblauch',
            value: '3',
          },
          {
            text: 'Salzgurke',
            value: '4',
          },
          {
            text: 'Rote Zwiebel',
            value: '5',
          },
          {
            text: 'Tomaten',
            value: '6',
          },
        ]}
      />
    </div>
  );
};
