import React from 'react';
import { Api } from '@/shared/services/api-client'
import { Ingredient } from '@prisma/client';
import { useSet } from 'react-use';

interface ReturnProps {
  ingredientOptions: IngredientItem[];
  loading?: boolean;
}

type IngredientItem = {
    text: string;
    value: string;
  };
  //const [ingredientItems, setIngredientItems] = React.useState<>([]);

export const useIngredients = (values: string[] = []): ReturnProps => {
  const [items, setItems] = React.useState<Ingredient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const ingredientOptions: IngredientItem[] = items.map((ingredient) => ({
    text: ingredient.name,
    value: ingredient.id.toString(),
  }));

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
    
  return { ingredientOptions, loading};
};