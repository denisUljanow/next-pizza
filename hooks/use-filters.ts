import { useSearchParams } from "next/navigation";
import { useSet } from 'react-use';
import React from "react";

interface PriceProps {
  fromPrice?: number;
  toPrice?: number;
}

interface QueryFilters extends PriceProps {
  ingredients?: string[];
  sizes?: string[];
  types?: string[];
}

export const useFilters = () => {
    
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;    
    
    
    //const {items, loading, filterSet, onAddid} = useFilterIngredients(searchParams.get('ingredients')?.split(','));
      
    const [ingredientSet, {toggle: toggleIngredients}] = useSet(new Set<string>(searchParams.get('ingredients')?.split(',') || []));
    const [sizesSet, {toggle: toggleSizes}] = useSet(new Set<string>(searchParams.get('sizes')?.split(',') || []));
    const [typeSet, {toggle: toggleTypes}] = useSet(new Set<string>(searchParams.get('types')?.split(',') || []));
    const [prices, setPrices] = React.useState<PriceProps>({
        fromPrice: Number(searchParams.get('fromPrice')) || undefined,
        toPrice: Number(searchParams.get('toPrice')) || undefined,
    });

    const updatePrice = (key: keyof PriceProps, value: number) => {
        setPrices((prices) => ({
          ...prices,
          [key]: value,
        }));
      };

    return { ingredientSet, setIngredients: toggleIngredients, sizesSet, setSizes: toggleSizes, typeSet, 
        setTypes: toggleTypes, prices, setPrices: updatePrice };
}