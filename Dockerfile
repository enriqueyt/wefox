# Install node v10.13.0
FROM node:10.13.0

WORKDIR /var/www/wefox

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
