import React from 'react';
import { Api } from '@/services/api-client'
import { Ingredient } from '@prisma/client';

interface ReturnProps {
  items: Ingredient[];
}

export const useFilterIngredients = (): ReturnProps => {
  const [items, setItems] = React.useState<Ingredient[]>([]);
  React.useEffect(() => {  
    async function fetchIngredients() {
        try {        
            const data = await Api.ingredients.getAll();
            setItems(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }
    fetchIngredients();  
  }, []);
    
  return { items }
};