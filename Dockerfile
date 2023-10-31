FROM node:18 as builder

ARG NODE_ENV=development
ARG API_PROD
ARG SUPABASE_URL
ARG SUPABASE_KEY

ENV NODE_ENV=${NODE_ENV}
ENV API_PROD=${API_PROD}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

FROM node:18

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY --from=builder /usr/src/app/.nuxt ./.nuxt
COPY --from=builder /usr/src/app/.output ./.output
COPY --from=builder /usr/src/app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
