import { prisma } from '@/libs/prisma';
import { Param } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

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
