FROM node:16.14.0


RUN mkdir -p /home/next/app

WORKDIR /home/next/app

COPY --chown=node package*.json ./
RUN npm install

WORKDIR /home/next/app
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]



