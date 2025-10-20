import { prisma } from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';
  const products = await prisma.product.findMany({
    where: {
      active: true,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  });
  return NextResponse.json(products);
}
