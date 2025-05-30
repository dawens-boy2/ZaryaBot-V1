FROM node:lts-buster

RUN git clone https://github.com/dawens-boy2/ZaryaBot-V1
WORKDIR /root/ZaryaBot-V1

RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1

COPY . .

EXPOSE 9090

CMD ["npm", "start"]
