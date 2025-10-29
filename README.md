Technologies used in this project:

https://www.npmjs.com/package/qs  -> A querystring parsing and stringifying library with some added security. (um url's zu erstellen und zu parsen)



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

to install:

npm install lucide-react
npm install tailwindcss-animate

setup for prisma-postgres:

1.  -- prisma --

npm install prisma --save-dev
npm install @prisma/client
npx prisma init

2.  -- docker --

psql -U root -c "CREATE DATABASE \"next-pizza\";"
docker exec -it <container-name> psql -U root -c "CREATE DATABASE \"next-pizza\";"

3.  -- Automatische Erzeugung von Tabellen in postgres --

npx prisma db push

(to update prisma models):

(1) delete all table entries in prisma studio
(2) npx prisma generate
(3) npx prisma db pull
(4) npx prisma db push
