FROM node:14-alpine3.12

WORKDIR  /app
COPY package.json ./
EXPOSE 4000
RUN npm install --legacy-peer-deps
COPY ./ ./

CMD ["npm", "run", "start"]