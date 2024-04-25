#!/bin/bash

# docker compose -f docker-compose.local.yml build $@ \
#   mongo-carbon \
#   farmbook \


docker compose -f docker-compose.local.yml up -d $@ \
  mongo-carbon