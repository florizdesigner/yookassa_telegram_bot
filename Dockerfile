FROM node:alpine
#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/app/node_modules && chmod -R 777 /home/app/node_modules
WORKDIR /home/app
COPY package*.json ./
RUN npm install -g -D nodemon --unsafe-perm=true --allow-root
#USER node
RUN npm -g install --unsafe-perm=true --allow-root
#COPY --chown=node:node . .
EXPOSE 3001