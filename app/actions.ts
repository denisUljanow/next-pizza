'use server';

import { createElement } from 'react';
import { prisma } from "@/libs/prisma";
import { OrderStatus } from '@prisma/client';
import { CheckoutFormValues } from "@/shared/components/shared/checkout/checkout-form-schema";
import { cookies } from "next/headers";
import { sendEmail } from '@/shared/lib/sendEmail';
import { PayOrderTemplate } from '@/shared/components/shared/email-templates/pay-order';
import { createPayment } from '@/libs/create-payments';

export async function createOrder(data: CheckoutFormValues) {
    
    try {
        const cookieStore = cookies();
        const cartToken = (await cookieStore).get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }

        /* Warenkorb mithilfe des Tokens finden **/
        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items: {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            where: {
                token: cartToken,
            },
        });

        /* Wenn Warenkorb nicht gefunden -> Fehler werfen **/
        if (!userCart) {
            throw new Error('Cart not found');
        }

        /* Wenn Warenkorb leer ist -> Fehler werfen **/
        if (userCart.totalAmount.toNumber() === 0) {
            throw new Error('Cart is empty');
        }

        /* Bestellung erstellen **/
        const order = await prisma.order.create({
            data: {
                token: cartToken,
                fullName: data.firstName + ' ' + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                totalAmount: Number(userCart.totalAmount),
                status: OrderStatus.PENDING,
                items: JSON.stringify(userCart.items),
            },
        });

        /* Warenkorb zurücksetzen **/
        await prisma.cart.update({
            where: {
                id: userCart.id,
            },
            data: {
                totalAmount: 0,
            }         
        });

        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id,
            },
        });

        //TODO: Implement payment gateway integration here and return the payment URL

        const paymentData = await createPayment({
            amount: Number(order.totalAmount),
            orderId: order.id,
            description: 'Zahlung der Bestellung #' + order.id,
            customerEmail: data.email,
        });

        if (!paymentData) {
        throw new Error('Payment data not found');
        }

        await prisma.order.update({
            where: {
                id: order.id,
            },
            data: {
                paymentId: paymentData.id,
            },
            });

        const paymentUrl = paymentData.url;


        const emailData = await sendEmail(data.email, 
            'Next Pizza / Zahlungslink für Bestellung #' + order.id,
            createElement(PayOrderTemplate, {
                orderId: order.id,
                totalAmount: Number(order.totalAmount),
                paymentUrl,
            }),
            `Bitte zahlen Sie ${Number(order.totalAmount).toFixed(2)} EUR. Zahlungslink: ${paymentUrl}`
        );
        console.log('[CreateOrder] Email sent', emailData);
        return paymentUrl;

    } catch (error) {
        console.log('[CreateOrder] Server error', error);
        
    }
}
