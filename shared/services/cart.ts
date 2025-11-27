import { Cart } from "@prisma/client";
import { axiosInstance } from "./instances";
import { CartDTO } from "./dto/cart.dto";

export const getCart = async (): Promise<CartDTO> => {
    return (await axiosInstance.get<CartDTO>('/api/cart')).data;
}

export const updateItemQuantity = async (itemId: number, quantity: number): Promise<CartDTO> => {
  return (await axiosInstance.patch<CartDTO>(`/api/cart/${itemId}`, { quantity })).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
    return (await axiosInstance.delete<CartDTO>(`/api/cart/${id}`)).data;
}