import { prisma } from "@/libs/prisma";
import { Container } from "@/components/shared/container";
import { PizzaImage } from "@/components/shared/pizza-image";
import { notFound } from "next/navigation";
import { ChooseProductModal, Title } from "@/components/shared";
import { GroupVariants } from "@/components/shared/group-variants";

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

  return <ChooseProductModal product={product} />;
}
