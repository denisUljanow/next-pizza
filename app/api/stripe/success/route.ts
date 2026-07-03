import { prisma } from '@/libs/prisma';
import { getStripeClient } from '@/libs/stripe';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  const redirectUrl = new URL('/', req.url);

  if (!sessionId) {
    redirectUrl.searchParams.set('payment', 'missing_session');
    return NextResponse.redirect(redirectUrl);
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = Number(session.metadata?.orderId || session.client_reference_id);

  if (!orderId) {
    redirectUrl.searchParams.set('payment', 'missing_order');
    return NextResponse.redirect(redirectUrl);
  }

  if (session.payment_status === 'paid') {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.SUCCEEDED,
        paymentId: session.id,
      },
    });

    redirectUrl.searchParams.set('payment', 'success');
  } else {
    redirectUrl.searchParams.set('payment', session.payment_status);
  }

  redirectUrl.searchParams.set('orderId', String(orderId));
  return NextResponse.redirect(redirectUrl);
}
