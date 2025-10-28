import React from 'react';
import { Api } from '@/services/api-client'
import { Ingredient } from '@prisma/client';
import { useSet } from 'react-use';

interface ReturnProps {
  items: Ingredient[];
  loading?: boolean;
  filterSet: Set<string>;
  onAddid: (value: string) => void;
}

export const useFilterIngredients = (): ReturnProps => {
  const [items, setItems] = React.useState<Ingredient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filterSet, {toggle}] = useSet(new Set<string>([]));

  React.useEffect(() => {  
    async function fetchIngredients() {
        try {        
            setLoading(true);
            const data = await Api.ingredients.getAll();
            setItems(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        } finally {
            setLoading(false);
        }
    }
    fetchIngredients();  
  }, []);
    
  return { items, loading, filterSet, onAddid: toggle };
};