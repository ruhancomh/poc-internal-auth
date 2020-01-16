FROM node:10
LABEL maintainer="Ruhan de Oliveira Baiense"
COPY ./application/package.json /var/www/package.json
WORKDIR /var/www
RUN npm install
EXPOSE 3000