FROM node:14 as development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]