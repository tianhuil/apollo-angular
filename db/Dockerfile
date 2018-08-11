FROM onjin/alpine-postgres:9.6.2

ARG DB_WORKDIR

RUN apk update && apk upgrade && apk add bash

WORKDIR $DB_WORKDIR

COPY * $DB_WORKDIR/

# Use command from parent
