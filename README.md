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



this is the final file structure:

my-mental-health-app/
├── app/
│   ├── (auth)/              # Route group for Login/Signup
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (onboarding)/        # Route group for the flow in your Figma
│   │   ├── welcome/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   └── profile/page.tsx
│   ├── chat/                # Where the AI SDK will eventually live
│   │   └── page.tsx
│   ├── api/                 # Backend routes (Auth, DB, and later AI)
│   │   └── auth/[...nextauth]/route.ts
│   ├── globals.css          # Tailwind directives
│   └── layout.tsx           # Root layout with the MobileContainer
├── components/
│   ├── ui/                  # Reusable "Atomic" components
│   │   ├── button.tsx       # "Create Account", "I Understand" variants
│   │   ├── input.tsx        # Profile curation inputs
│   │   └── card.tsx         # The white containers in your design
│   ├── shared/
│   │   ├── mobile-container.tsx # The desktop-to-mobile aspect ratio wrapper
│   │   └── icons.tsx        # Exported Figma SVGs as React components
│   └── onboarding/
│       └── progress-bar.tsx # Visual indicator for the user journey
├── lib/
│   ├── db.ts                # Prisma or Drizzle client initialization
│   └── utils.ts             # Tailwind-merge and clsx helpers
├── prisma/                  # Or /db if using Drizzle
│   └── schema.prisma        # Define User, Gender, Religion models here
├── public/
│   └── illustrations/       # Larger Figma assets (onboarding images)
├── tailwind.config.ts       # THEMES: Sync your Figma hex codes here
└── .env                     # Database and Auth secrets