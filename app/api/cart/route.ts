import { prisma } from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('cartToken')?.value;
    const queryToken = req.nextUrl.searchParams.get('token') ?? undefined;
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
