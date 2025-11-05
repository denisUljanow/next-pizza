import { prisma } from "@/libs/prisma";

export default async function ProductPage ({ params: {id} } : { params: {id: string}}) {
  
  const products = await prisma.product.findMany({});

  console.log(products);
  
  return (
    <div>
      Product Page - {id}

    </div>
  );
};