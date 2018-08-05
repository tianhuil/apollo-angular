FROM onjin/alpine-postgres:9.6.2

RUN apk update && apk upgrade && apk add bash

WORKDIR $DB_WORKDIR

COPY * $DB_WORKDIR/

# Use command from parent
