
FROM node:21.6.2-alpine
# Set working directory for all build stages.
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app/

COPY package*.json ./

RUN npm install
USER node

COPY --chown=node:node . .
RUN npm run 

EXPOSE 8080

#
CMD ["npm", "start"]



# the solution that worked for me is to delete the .docker/config.json by running
# https://stackoverflow.com/questions/66912085/why-is-docker-compose-failing-with-error-internal-load-metadata-suddenly
# rm  ~/.docker/config.json
# then docker-compose up your-services should work