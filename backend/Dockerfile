FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]