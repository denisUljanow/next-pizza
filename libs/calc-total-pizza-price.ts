import { Ingredient, Product, ProductItem } from "@prisma/client";

/**
 * 
 * @param items - Pizza-Varianten
 * @param size - ausgewählte Pizza-Größe
 * @param type - ausgewählter Pizza-Typ
 * @param ingredients - verfügbare Zutaten
 * @param selectedIngredients - ausgewählte Zutaten
 * @returns number - Gesamtpreis der Pizza
 */
export const totalPizzaPrice = (
    items: ProductItem[],
    size: number,
    type: number,
    ingredients?: Ingredient[],
    selectedIngredients?: Set<number>,

) => {
    const itemPrice = items?.find((item) => item.size === size && item.pizzaType === type)?.price || 0;
    const ingredientsPrice = ingredients?.reduce((acc, ingredient) => {
        if (selectedIngredients?.has(ingredient.id)) {
            return acc + ingredient.price;
        }
        return acc;
    }, 0) || 0;
  
    return itemPrice + ingredientsPrice;
}