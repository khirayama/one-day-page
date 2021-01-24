# https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/
FROM node:14.15.4-slim

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
# EXPOSE $PORT
CMD [ "npm", "run", "start" ]
