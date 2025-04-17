FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]