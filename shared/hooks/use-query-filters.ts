import { useRouter } from "next/navigation";
import { useEffect } from "react";
import qs from 'qs';
import type { FiltersState } from "./use-filters";

export const useQueryFilters = (filters: FiltersState) => {
  const router = useRouter();

  const ingredientsKey = Array.from(filters.ingredientSet).sort().join(',');
  const sizesKey = Array.from(filters.sizesSet).sort().join(',');
  const typesKey = Array.from(filters.typeSet).sort().join(',');

  useEffect(() => {
    const ingredients = ingredientsKey ? ingredientsKey.split(',') : [];
    const sizes = sizesKey ? sizesKey.split(',') : [];
    const types = typesKey ? typesKey.split(',') : [];

    const query = ({
      ...filters.prices,
      ingredients,
      sizes,
      types,
    });

    const queryString = qs.stringify(query, { arrayFormat: 'comma', encode: false });
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });
  }, [
    filters.prices.fromPrice,
    filters.prices.toPrice,
    ingredientsKey,
    sizesKey,
    typesKey,
    router,
  ]);
};
