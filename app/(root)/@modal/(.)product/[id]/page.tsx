import { prisma } from "@/libs/prisma";
import { notFound } from "next/navigation";
import { ChooseProductModal } from "@/shared/components/shared";
import { ProductWithRelationsPlain } from "@/shared/types/prisma";

type ProductModalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductModalPage({ params }: ProductModalPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const plainProduct: ProductWithRelationsPlain = {
    ...product,
    ingredients: product.ingredients.map((ingredient) => ({
      ...ingredient,
      price: Number(ingredient.price),
    })),
    items: product.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };

  return <ChooseProductModal product={plainProduct} />;
}
