# Next.js 15 App with ESLint, Prettier, and Tailwind CSS

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and configured with modern development tools.

## 🚀 Features

- **Next.js 15** - Latest version with App Router and React 19 support
- **TypeScript** - Type safety out of the box
- **ESLint** - Code linting with Next.js recommended rules
- **Prettier** - Code formatting with consistent style
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **Turbopack** - Ultra-fast bundler for development

## 🛠️ Development Tools

### ESLint Configuration

- Next.js Core Web Vitals rules
- TypeScript integration
- Prettier compatibility
- Custom rules for unused variables and explicit any types

### Prettier Configuration

- Single quotes for strings
- Semicolons enabled
- 2-space indentation
- Trailing commas where valid in ES5
- Line width of 80 characters

### Tailwind CSS v4

- Latest PostCSS integration
- Modern theme configuration with CSS variables
- Dark mode support built-in
- Optimized for Next.js App Router

## 🏃‍♂️ Getting Started

### Install dependencies:

```bash
npm install
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
├── src/
│   └── app/
│       ├── globals.css      # Global styles with Tailwind
│       ├── layout.tsx       # Root layout component
│       ├── page.tsx         # Home page component
│       └── favicon.ico      # App favicon
├── public/                  # Static assets
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS configuration for Tailwind
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

## 🎨 Styling

This project uses Tailwind CSS v4 for styling. The global styles are defined in `src/app/globals.css` and include:

- CSS custom properties for theming
- Dark mode support
- Font family configuration (Geist Sans & Geist Mono)

## 🔧 Configuration Files

### ESLint (`eslint.config.mjs`)

Configured for Next.js with TypeScript support and Prettier integration.

### Prettier (`.prettierrc`)

Standardized formatting rules for consistent code style across the project.

### Tailwind CSS (`postcss.config.mjs`)

Uses the latest Tailwind CSS v4 PostCSS plugin for optimal performance.

## 📖 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [ESLint Documentation](https://eslint.org/docs/) - learn about ESLint rules and configuration
- [Prettier Documentation](https://prettier.io/docs/) - learn about code formatting

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
