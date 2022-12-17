#RUN rc-update add docker boot
FROM ubuntu:latest
CMD ['bash']
FROM node:16.17.1
#app directory
WORKDIR /usr/src/app
#install app dependencies
COPY  package*.json ./

#for production
RUN npm ci --only=production

#bundle app source
COPY . .

EXPOSE 5000

CMD ['bash']
#SHELL ["/bin/bash", "-c"]
ENTRYPOINT  ["node", "index.js"]