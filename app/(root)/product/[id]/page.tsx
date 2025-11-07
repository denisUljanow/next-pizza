import { prisma } from "@/libs/prisma";
import { Container } from "@/components/shared/container";
import { PizzaImage } from "@/components/shared/pizza-image";
import { notFound } from "next/navigation";
import { Title } from "@/components/shared";
import { GroupVariants } from "@/components/shared/group-variants";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const products = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: true,
    },
  });

  console.log("Product: ", products);

  if (!products) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <PizzaImage imageUrl={products?.imageUrl} size={40} />
        <div className="w-[490px] bg-[#FCFCFC] p-7">
          <Title text={products.name} size="md" className="font-extrabold mb-1" />

          <p className="text-gray-400">Lorem ipsum dolor diij soili</p>

          <GroupVariants
            items={[
              { name: "Klein", value: "1" },
              { name: "Mittel", value: "2" },
              { name: "Groß", value: "3", disabled: true },
            ]}
            selectedValue="2"
          />
        </div>
      </div>
    </Container>
  );
}
