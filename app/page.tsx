import {
  Categories,
  Container,
  Filters,
  ProductsGroupList,
  SortPopup,
  Title,
} from '@/shared/components/shared';
import { prisma } from '@/libs/prisma';

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

  // Normalize Prisma Decimal fields so client components receive plain numbers
  const categoriesWithPrice = categories.map((category) => ({
    ...category,
    products: category.products.map((product) => {
      const items = product.items.map((item) => ({
        ...item,
        price: Number(item.price.toDecimalPlaces(2).toString()),
      }));

      const ingredients = product.ingredients.map((ingredient) => ({
        ...ingredient,
        price: Number(ingredient.price.toDecimalPlaces(2).toString()),
      }));

      const productPrice =
        items.length > 0 ? Math.min(...items.map((item) => item.price)) : 0;

      return {
        ...product,
        price: productPrice,
        items,
        ingredients,
      };
    }),
  }));
  
  console.log("categoriesWithPrice", categoriesWithPrice);
  return (
    <>
      <Container className="mt-10">
        <Title className="font-extrabold" size="lg" text="Alle Pizzen"></Title>
      </Container>

      <div className="sticky top-0 bg-white py-5 shadow-lg shadow-black/5">
        <Container className="flex items-center justify-between">
          <Categories
            categories={categoriesWithPrice.filter((category) => category.products.length > 0)}
          />
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
              {categoriesWithPrice.map((category) => (
                <ProductsGroupList
                  key={category.id}
                  title={category.name}
                  items={category.products}
                  categoryId={category.id}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div style={{ height: '2000px' }} />
    </>
  );
}
