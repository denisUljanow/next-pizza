import { CartItemDTO } from "../services/dto/cart.dto";

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
    const ingredientsPrice = item.ingredients.reduce((acc, ingredient) => acc + Number(ingredient.price.toString()), 0);
    return (Number(item.productItem.price.toString()) + ingredientsPrice) * item.quantity;
};
