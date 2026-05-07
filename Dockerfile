FROM node:18

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]