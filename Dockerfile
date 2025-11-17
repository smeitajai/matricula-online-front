FROM node:22 as builder

WORKDIR /app

ARG API_PROD
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}
ENV API_PROD=${API_PROD}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------

FROM node:22

WORKDIR /app

RUN npm install pm2 -g

# Copia APENAS o output final + package.json
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Instala as dependências necessárias para o output
RUN npm ci --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["pm2-runtime", ".output/server/index.mjs"]
