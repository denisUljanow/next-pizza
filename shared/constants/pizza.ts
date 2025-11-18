export const pizzaSizesMap = {
    20: 'Klein',
    30: 'Mittel',
    40: 'Groß',
    } as const;

export const pizzaTypesMap = {
    1: 'Normaler Teig',
    2: 'Dünner Teig',
    } as const;

export const pizzaSizesArray = Object.entries(pizzaSizesMap).map(([value, text]) => ({
    value,
    text,
    }));

export const pizzaTypesArray = Object.entries(pizzaTypesMap).map(([value, text]) => ({
    value,
    text,
    }));

export type PizzaSizeKey = keyof typeof pizzaSizesMap;
export type PizzaTypeKey = keyof typeof pizzaTypesMap;