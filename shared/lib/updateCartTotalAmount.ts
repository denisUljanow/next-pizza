import { prisma } from "@/libs/prisma";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";
import { Prisma } from "@prisma/client";

export const updateCartTotalAmount = async (token: string) => {
    const userCart = await prisma.cart.findFirst({
        where: {
            token,
        },
        include: {
            items: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    productItem: {
                        include: {
                            product: true,
                        },
                    },
                    ingredients: true,
                },
            },
        },
    });

    if (!userCart) {
        return;
    }
   
    const totalAmountDecimal = userCart.items.reduce(
        (acc, item) => acc.add(new Prisma.Decimal(calcCartItemTotalPrice(item))),
        new Prisma.Decimal(0),
    );

    const totalAmount = Number(totalAmountDecimal.toDecimalPlaces(2).toString());                                 // Alle Warenkorbelemente durchlaufen samt ihren Zutaten und Gesamtpreis berechnen

  return await prisma.cart.update({     // Upgedatete Warenkorb mit neuer Gesamtsumme (totalAmount) zurückgeben
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount: totalAmount,
    },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
  });
}