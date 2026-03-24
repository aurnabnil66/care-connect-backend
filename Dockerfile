FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8000

# Generate Prisma client and start server
CMD ["sh", "-c", "npx prisma generate && npm start"]