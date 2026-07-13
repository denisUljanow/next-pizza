import { prisma } from '@/libs/prisma';
import { getStripeClient } from '@/libs/stripe';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
import { sendEmail } from '@/shared/lib';
import type { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';

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
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      redirectUrl.searchParams.set('payment', 'order_not_found');
      return NextResponse.redirect(redirectUrl);
    }

    const wasAlreadyPaid = order.status === OrderStatus.SUCCEEDED;

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.SUCCEEDED,
        paymentId: session.id,
      },
    });

    if (!wasAlreadyPaid) {
      const items = typeof updatedOrder.items === 'string' ? JSON.parse(updatedOrder.items) : (updatedOrder.items as unknown as CartItemDTO[]);

      try {
        const emailData = await sendEmail(
          updatedOrder.email,
          'Next Pizza / Bestellung erfolgreich bezahlt #' + updatedOrder.id,
          createElement(OrderSuccessTemplate, {
            orderId: updatedOrder.id,
            items,
          }),
          `Ihre Bestellung #${updatedOrder.id} wurde erfolgreich bezahlt.`
        );
        console.log('[StripeSuccess] Email sent', emailData);
      } catch (error) {
        console.error('[StripeSuccess] Failed to send success email', error);
      }
    }

    redirectUrl.searchParams.set('payment', 'success');
  } else {
    redirectUrl.searchParams.set('payment', session.payment_status);
  }

  redirectUrl.searchParams.set('orderId', String(orderId));
  console.log('[StripeSuccess] Redirecting to', redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
}
