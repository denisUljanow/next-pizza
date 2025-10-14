import { prisma } from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const fullName = data.fullName ?? data.fullname;
    const phone = data.phone;

    if (!fullName || !phone) {
      return NextResponse.json(
        { message: 'fullName (or fullname) and phone are required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: { fullName, phone },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2002'
    ) {
      return NextResponse.json({ message: 'Phone already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
