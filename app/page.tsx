import { Container, Filters, ProductCard, SortPopup, Title } from '@/components/shared';
import { Categories } from '@/components/shared/';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
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
              <ProductCard
                id={1}
                name="Chicken Supreme"
                price={520}
                imageUrl="https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif"
              />
            </div>
          </div>
        </div>
      </Container>
      <div style={{ height: '2000px' }} />
    </>
  );
}
