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
import Image from 'next/image';
import { setDefaultHighWaterMark } from 'stream';

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
              <ProductsGroupList
                title="Pizzas"
                items={[
                  {
                    id: 1,
                    name: 'Chicken Supreme',
                    price: 5.6,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 2,
                    name: 'Pizza 2',
                    price: 6.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 3,
                    name: 'Pizza 3',
                    price: 7.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 4,
                    name: 'Pizza 4',
                    price: 8.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 5,
                    name: 'Pizza 5',
                    price: 9.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                ]}
                categoryId={1}
              />
              <ProductsGroupList
                title="Combo"
                items={[
                  {
                    id: 1,
                    name: 'Chicken Supreme',
                    price: 5.6,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 2,
                    name: 'Pizza 2',
                    price: 6.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 3,
                    name: 'Pizza 3',
                    price: 7.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 4,
                    name: 'Pizza 4',
                    price: 8.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 5,
                    name: 'Pizza 5',
                    price: 9.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                ]}
                categoryId={2}
              />
              <ProductsGroupList
                title="Vorspeise"
                items={[
                  {
                    id: 1,
                    name: 'Chicken Supreme',
                    price: 5.6,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 2,
                    name: 'Pizza 2',
                    price: 6.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 3,
                    name: 'Pizza 3',
                    price: 7.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 4,
                    name: 'Pizza 4',
                    price: 8.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 5,
                    name: 'Pizza 5',
                    price: 9.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                ]}
                categoryId={3}
              />
              <ProductsGroupList
                title="Cocktails"
                items={[
                  {
                    id: 1,
                    name: 'Chicken Supreme',
                    price: 5.6,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 2,
                    name: 'Pizza 2',
                    price: 6.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 3,
                    name: 'Pizza 3',
                    price: 7.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 4,
                    name: 'Pizza 4',
                    price: 8.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                  {
                    id: 5,
                    name: 'Pizza 5',
                    price: 9.9,
                    imageUrl:
                      'https://media.dodostatic.com/image/r:233x233/11ee86927844f9a1abaa10c6cf62f3ef.avif',
                  },
                ]}
                categoryId={4}
              />
            </div>
          </div>
        </div>
      </Container>
      <div style={{ height: '2000px' }} />
    </>
  );
}
