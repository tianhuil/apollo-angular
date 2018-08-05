FROM mhart/alpine-node:10.8.0

WORKDIR $API_WORKDIR
COPY package*.json $API_WORKDIR/
COPY package-lock.json $API_WORKDIR/
RUN npm install

# Cache installation before
COPY server.js $API_WORKDIR/

CMD [ "node", "server.js" ]
