FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN mkdir -p src/public/uploads/expenses src/public/uploads/incomes \
    && chmod +x docker-entrypoint.sh \
    && chown -R node:node /app

USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--", "./docker-entrypoint.sh"]
CMD ["node", "server.js"]
