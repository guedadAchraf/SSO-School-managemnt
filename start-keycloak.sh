#!/bin/bash

echo "Stopping any running containers..."
docker-compose down

echo "Cleaning up volumes..."
docker volume prune -f

echo "Starting Postgres..."
docker-compose up -d postgres

echo "Waiting for Postgres to be ready..."
sleep 15

echo "Starting Keycloak..."
docker-compose up -d keycloak

echo "Waiting for Keycloak to be ready..."
until curl -s http://localhost:8080/auth > /dev/null; do
    echo "Waiting for Keycloak..."
    sleep 5
done

echo "Running Keycloak setup..."
node keycloak-setup.js 