This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up the Database

Create the database and run migrations:

```bash
npx prisma migrate dev
```

### 3. Seed the Database (Important!)

Populate the database with demo car data so everyone sees the same cars:

**Try this first:**

```bash
npx prisma db seed
```

**If you get an error, try one of these alternatives:**

Option A - Use tsx (recommended):

```bash
npm install -D tsx
npx tsx prisma/seed.ts
```

Option B - Use Node directly (if seed.ts is converted to .js):

```bash
node prisma/seed.ts
```

Option C - Use ts-node with loader:

```bash
npx ts-node --esm prisma/seed.ts
```

**Verify the seed worked:**

```bash
npx prisma studio
```

This opens a browser UI to see your database. You should see Toyota cars from 2020-2025.

### 4. Run the Development Server

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
