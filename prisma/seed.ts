import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generatePizza = (productId: number, type: number, size: number) => {
  return {
    productId,
    size,
    type,
    price: randomNumber(5, 10),
    carbs: randomNumber(10, 30),
    fats: randomNumber(5, 15),
    kcal: randomNumber(180, 300),
    proteins: randomNumber(20, 45),
    weight: randomNumber(400, 650),
  };
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'Alice Johnson',
        phone: '+4366771234321',
        role: 'USER',
        phoneVerified: '2025-01-15T10:00:00Z',
      },
      {
        fullName: 'Bob Smith',
        phone: '+4366779876543',
        role: 'ADMIN',
        phoneVerified: new Date(),
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Pepperoni fresh',
        imageUrl: 'assets/img/pizza1.webp',
        active: true,
      },
      {
        name: 'Cheese',
        imageUrl: 'assets/img/pizza2.webp',
        active: true,
      },
      {
        name: 'Chorizo fresh',
        imageUrl: 'assets/img/pizza3.webp',
        active: true,
      },
    ],
  });

  await prisma.pizza.createMany({
    data: [
      generatePizza(1, 1, 20),
      generatePizza(1, 2, 30),
      generatePizza(1, 3, 40),

      generatePizza(2, 1, 20),
      generatePizza(2, 2, 30),
      generatePizza(2, 3, 40),

      generatePizza(3, 1, 20),
      generatePizza(3, 2, 30),
      generatePizza(3, 3, 40),
    ],
  });

  await prisma.ingredient.createMany({
    data: [
      {
        name: 'Käse-Rand',
        price: 1.79,
        imageUrl: 'assets/img/käseRand.png',
      },
      {
        name: 'Mozzarella',
        price: 0.79,
        imageUrl: 'assets/img/mozarella.png',
      },
      {
        name: 'Cheddar und Parmesan',
        price: 0.79,
        imageUrl: 'assets/img/cheddarParmesan.png',
      },
      {
        name: 'Scharfe Paprika Halagno',
        price: 0.59,
        imageUrl: 'assets/img/pepper.png',
      },
      {
        name: 'Weiche Hühnchen',
        price: 0.79,
        imageUrl: 'assets/img/hühnchen.png',
      },
      {
        name: 'Champignons',
        price: 0.59,
        imageUrl: 'assets/img/champignons.png',
      },
      {
        name: 'Becon',
        price: 0.79,
        imageUrl: 'assets/img/becon.png',
      },
      {
        name: 'Schinken',
        price: 0.79,
        imageUrl: 'assets/img/schinken.png',
      },
      {
        name: 'Peperoni',
        price: 0.79,
        imageUrl: 'assets/img/pikantPeperoni.png',
      },
      {
        name: 'Scharfe Chorizo',
        price: 0.79,
        imageUrl: 'assets/img/chorizo.png',
      },
      {
        name: 'Essiggurken',
        price: 0.59,
        imageUrl: 'assets/img/gurken.png',
      },
      {
        name: 'Frische Tomaten',
        price: 0.59,
        imageUrl: 'assets/img/tomaten.png',
      },
      {
        name: 'Rote Zwiebeln',
        price: 0.59,
        imageUrl: 'assets/img/roteZwiebel.png',
      },
      {
        name: 'Ananas',
        price: 0.59,
        imageUrl: 'assets/img/ananas.png',
      },
      {
        name: 'italienische Kräuter',
        price: 0.39,
        imageUrl: 'assets/img/herbals.png',
      },
      {
        name: 'Süsse Paprika',
        price: 0.59,
        imageUrl: 'assets/img/süssePaprika.png',
      },
      {
        name: 'Griechische Käse',
        price: 0.79,
        imageUrl: 'assets/img/brynza.png',
      },
      {
        name: 'Meatballs',
        price: 0.79,
        imageUrl: 'assets/img/meatballs.png',
      },
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
      },
      {
        userId: 2,
        totalAmount: 0,
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      pizzaId: 1,
      cartId: 1,
      userId: 1,
      quantity: 1,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Pizza" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
