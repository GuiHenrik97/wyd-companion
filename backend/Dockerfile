FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build && echo "BUILD OK" && ls -la dist/

EXPOSE 3001
CMD ["node", "dist/main.js"]
