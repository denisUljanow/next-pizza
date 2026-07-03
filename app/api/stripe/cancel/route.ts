import { prisma } from '@/libs/prisma';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const orderId = Number(req.nextUrl.searchParams.get('orderId'));
  const redirectUrl = new URL('/checkout', req.url);

  if (orderId) {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    redirectUrl.searchParams.set('orderId', String(orderId));
  }

  redirectUrl.searchParams.set('payment', 'cancelled');
  return NextResponse.redirect(redirectUrl);
}
