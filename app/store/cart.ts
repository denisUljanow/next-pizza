import { getCartDetails } from '@/shared/lib/get-cart-details';
import { Api } from '@/shared/services/api-client';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { create } from 'zustand';


export type CartStateItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  disabled?: boolean;
  pizzaSize?: number | null;
  pizzaType?: number | null;
  ingredients: Array<{ name: string; price: number }>;
};

export interface CartState {
  loading: boolean;
  error: boolean;
  totalAmount: number;
  items: CartStateItem[];

  /* Waren aus Warenkorb fetchen */
  fetchCartItems: () => Promise<void>;

  /* Warenmenge in Warenkorb update */
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;

  /* Ware ins Warenkorb hinzufügen */
  addCartItem: (values: any) => Promise<void>;

  /* Ware aus dem Warenkorb entfernen */
  removeCartItem: (id: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,
    error: false,
    totalAmount: 0,

    fetchCartItems: async () => {
      try {
        set({ loading: true, error: false });
        const data = await Api.cart.getCart();
        console.log('Fetched cart data:', data);
        set(getCartDetails(data));                // Daten aus Api-Response werden transformiert und im Store gesetzt
      } catch (error) {
        console.error(error);
        set({ error: true });
      } finally {
        set({ loading: false });
      }
    },

    updateItemQuantity: async (id: number, quantity: number) => {
      try {
        set({ loading: true, error: false });
        const data = await Api.cart.updateItemQuantity(id, quantity);
        console.log('upgedated cart data:', data);
        set(getCartDetails(data));                // Daten aus Api-Response werden transformiert und im Store gesetzt
      } catch (error) {
        console.error(error);
        set({ error: true });
      } finally {
        set({ loading: false });
      }
    },

  removeCartItem: async (id: number) => {
    try {
        set({ loading: true, error: false });
        const data = await Api.cart.removeCartItem(id);
        console.log('Removed cart data:', data);
        set(getCartDetails(data));                // Daten aus Api-Response werden transformiert und im Store gesetzt
      } catch (error) {
        console.error(error);
        set({ error: true });
      } finally {
        set({ loading: false });
      }
  },

  addCartItem: async (values: CreateCartItemValues) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.addCartItem(values);
      set(getCartDetails(data));
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

}));
