import { prisma } from "@/libs/prisma";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  types?: string;
  ingredients?: string;
  fromPrice?: string;
  toPrice?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {
    const sizes = params.sizes?.split(',').map(Number);
    const pizzaTypes = params.types?.split(',').map(Number);
    const ingredientsIdArr = params.ingredients?.split(',').map(Number);
    console.log("ingredientsIdArr in findPizzas:", ingredientsIdArr);
    //const ingredientsIdArr = [1,2,4,5,6,7];

    const minPrice = Number(params.fromPrice) || DEFAULT_MIN_PRICE;
    const maxPrice = Number(params.toPrice) || DEFAULT_MAX_PRICE;

    const categories = await prisma.category.findMany({
        include: {
            products: {
                orderBy: {
                id: 'desc',
                },
                where: {
                ingredients: ingredientsIdArr
                    ? {
                        some: {
                        id: {
                            in: ingredientsIdArr,
                        },
                        },
                    }
                    : undefined,
                },
                include: {
                ingredients: true,
                items: true,
                },
            },
        },
    });

    return categories;
};