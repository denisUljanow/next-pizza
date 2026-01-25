import { prisma } from "@/libs/prisma";

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string | string[];
  types?: string | string[];
  ingredients?: string | string[];
  fromPrice?: string | string[];
  toPrice?: string | string[];
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const findPizzas = async (params: GetSearchParams) => {
    const normalizeParam = (value?: string | string[]) => {
        if (!value) return undefined;
        return Array.isArray(value) ? value.join(',') : value;
    };

    const sizes = normalizeParam(params.sizes)?.split(',').map(Number).filter((id) => !Number.isNaN(id));
    const pizzaTypes = normalizeParam(params.types)?.split(',').map(Number).filter((id) => !Number.isNaN(id));
    const ingredientsIdArr = normalizeParam(params.ingredients)
        ?.split(',')
        .map(Number)
        .filter((id) => !Number.isNaN(id));

    const minPrice = Number(normalizeParam(params.fromPrice)) || DEFAULT_MIN_PRICE;
    const maxPrice = Number(normalizeParam(params.toPrice)) || DEFAULT_MAX_PRICE;

    const itemFilters: Record<string, unknown> = {};
    if (sizes?.length) {
        itemFilters.size = { in: sizes };
    }
    if (pizzaTypes?.length) {
        itemFilters.pizzaType = { in: pizzaTypes };
    }
    if (minPrice || maxPrice) {
        itemFilters.price = {
        gte: minPrice,
        lte: maxPrice,
        };
    }

    const categories = await prisma.category.findMany({
        include: {
            products: {
                orderBy: {
                id: 'desc',
                },
                where: {
                ingredients: ingredientsIdArr?.length
                    ? {
                        some: {
                        id: {
                            in: ingredientsIdArr,
                            },
                        },
                    }
                    : undefined,
                    items: Object.keys(itemFilters).length
                        ? {
                            some: itemFilters,
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
