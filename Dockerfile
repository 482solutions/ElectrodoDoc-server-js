FROM node:12.14.0

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 1823

CMD npm start
