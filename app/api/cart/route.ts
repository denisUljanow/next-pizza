import { prisma } from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import { it } from "node:test";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ totalAmount: 0, items: [] });
        }

        const userCart = await prisma.cart.findFirst({
            where: {
                OR: [
                    {
                        token,
                    }
                ],    
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

        return NextResponse.json(userCart);

    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
}