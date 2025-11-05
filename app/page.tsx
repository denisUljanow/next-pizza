import {
  Container,
  Filters,
  ProductCard,
  ProductsGroupList,
  SortPopup,
  Title,
} from '@/components/shared';
import { Categories } from '@/components/shared/';
import { Button } from '@/components/ui/button';
import { prisma } from '@/libs/prisma';
import Image from 'next/image';
import { setDefaultHighWaterMark } from 'stream';

export default async function Home() {
  
  const categories = await prisma.category.findMany({
    include: { 
      products: {
        include: { 
          ingredients: true,
          items: true,
        },
      },
    },
  });
  
  return (
    <>
      <Container className="mt-10">
        <Title className="font-extrabold" size="lg" text="Alle Pizzen"></Title>
      </Container>

      <div className="sticky top-0 bg-white py-5 shadow-lg shadow-black/5">
        <Container className="flex items-center justify-between">
          <Categories />
          <SortPopup />
        </Container>
      </div>

      <Container className="mt-10 pb-14">
        <div className="flex gap-[60px]">
          <div className="w-[250px]">
            <Filters />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {
                categories.map((category) => (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    items={category.products}
                    categoryId={category.id}
                  />
                ))
              }
            </div>
          </div>
        </div>
      </Container>
      <div style={{ height: '2000px' }} />
    </>
  );
}
