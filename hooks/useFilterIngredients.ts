import React from 'react';
import { Api } from '@/services/api-client'
import { Ingredient } from '@prisma/client';

interface ReturnProps {
  items: Ingredient[];
  loading?: boolean;
}

export const useFilterIngredients = (): ReturnProps => {
  const [items, setItems] = React.useState<Ingredient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
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
    
  return { items, loading  };
};