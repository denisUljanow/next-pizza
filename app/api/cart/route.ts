import { prisma } from '@/libs/prisma';
import { Param } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { updateCartTotalAmount } from '@/shared/lib/updateCartTotalAmount';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('cartToken')?.value;                  // Suche in Cookies nach "cartToken"
    const queryToken = req.nextUrl.searchParams.get('token') ?? undefined;    // Suche in Url nach Query-Parameter "token"
    const token = cookieToken ?? queryToken;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

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

    const response = NextResponse.json(userCart ?? { totalAmount: 0, items: [] });

    if (!cookieToken && userCart) {
      response.cookies.set('cartToken', userCart.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('cartToken')?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;    // Typdefinition für die übergebenen Werte von Client an Server

    const findCartItem = await prisma.cartItem.findFirst({      // Prüfen, ob der hinzuzufügende Artikel samt Zutaten bereits im Warenkorb ist
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        ingredients: {
          every: { id: { in: data.ingredients },
          },
        },
      }
    });

    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
        },
      });
    };
    
    const updatedUserCart = await updateCartTotalAmount(token);     // Warenkorbsumme aktualisieren
    
    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set('cartToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    return resp;

  } catch (error) {
    console.log('[CART_POST] Server Error', error);
    return NextResponse.json({ message: 'Failed to add cart item' }, { status: 500 });
  }
}