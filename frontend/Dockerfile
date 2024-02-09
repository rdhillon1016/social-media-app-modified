FROM node:20.11.0

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

#start the command to start the app
CMD [ "npm", "run" ,"start" ]
