# Use the official Node.js 18 image as a base image
FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
