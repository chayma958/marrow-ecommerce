FROM node:26-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build


FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
