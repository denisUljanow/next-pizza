import { prisma } from "@/libs/prisma";
import { updateCartTotalAmount } from "@/shared/lib/updateCartTotalAmount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id: paramId } = await context.params;
        const id = Number(paramId);
        const data = await req.json() as { quantity: number };
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Cart token not found' });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                cart: {
                    token,
                },
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.update({
            where: {
                id,
            },
            data: {
                quantity: data.quantity,
            }
        });

        const updatedUserCart = await updateCartTotalAmount(token);     // Warenkorbsumme aktualisieren

        if (!updatedUserCart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUserCart);
    } catch (error) {
        console.log('[CART_PATCH] Server Error', error);
        return NextResponse.json({ message: 'Failed to update cart item' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id: paramId } = await context.params;
        const itemId = Number(paramId);
        const token = req.cookies.get('cartToken')?.value;
        
        if (!Number.isFinite(itemId)) {
            return NextResponse.json({ error: 'Invalid cart item id' }, { status: 400 });
        }

        if (!token) {
            return NextResponse.json({ error: 'Cart token not found' }, { status: 401 });
        }

        const cart = await prisma.cart.findFirst({
            where: {
                token,
            },
        });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            }
        });

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        await prisma.cartItem.delete({
            where: {
                id: itemId,
            }
        });
        
        const updatedUserCart = await updateCartTotalAmount(token);     // Warenkorbsumme aktualisieren

        if (!updatedUserCart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUserCart);
    } catch (error) {
        console.log('[CART_DELETE] Server Error', error);
        return NextResponse.json({ message: 'Failed to remove cart item' }, { status: 500 });
    }
}
