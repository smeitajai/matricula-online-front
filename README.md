# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

## Build

docker build --build-arg API_PROD=http://educacao-api.itajai.local:3000 --build-arg SUPABASE_URL=https://anthdczcbuqwfbyctzwh.supabase.co --build-arg SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudGhkY3pjYnVxd2ZieWN0endoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzMzc1MDEsImV4cCI6MjA0MzkxMzUwMX0.OGvyxAQ4N26A4GTuaeEU3MGqFM72Qk4jtxtgCGDRLSM -t smeitajai/matricula-online-frontend:latest .

## Push

docker push smeitajai/matricula-online-frontend:latest

## Deployment

docker rm matricula-online-frontend --force

docker rmi smeitajai/matricula-online-frontend

docker run -d -p 3001:3000 --name matricula-online-frontend --restart always smeitajai/matricula-online-frontend:latest

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
