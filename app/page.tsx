import { Container, Filters, SortPopup, Title } from '@/components/shared';
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
            <div className="flex flex-col gap-16">Pizza1 Pizza2</div>
          </div>
        </div>
      </Container>
      <div style={{ height: '2000px' }} />
    </>
  );
}
