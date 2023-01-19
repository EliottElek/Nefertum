FROM node:latest

RUN mkdir -p /usr/app/
WORKDIR /usr/app

COPY ./ ./
RUN npm install -g npm@9.3.0
RUN npm install yarn 
RUN yarn install
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]