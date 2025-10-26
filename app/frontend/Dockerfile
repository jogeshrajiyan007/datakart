# Use Node 18
FROM node:20.19.5-slim

#Working Directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm","run","dev","--","--host"]