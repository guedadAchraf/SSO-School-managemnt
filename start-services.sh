#!/bin/bash

# Stop any running containers
docker-compose down

# Remove existing volumes
docker volume prune -f

# Start the services
docker-compose up -d

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to start..."
until curl -s http://localhost:8080/auth > /dev/null; do
  sleep 5
  echo "Still waiting for Keycloak..."
done

echo "Keycloak is up! Running setup..."

# Run Keycloak setup
node keycloak-setup.js

# Create silent check SSO files
mkdir -p projects/admin/src/assets
mkdir -p projects/teacher/src/assets
mkdir -p projects/student/src/assets

echo '<html><body><script>parent.postMessage(location.href, location.origin);</script></body></html>' > projects/admin/src/assets/silent-check-sso.html
echo '<html><body><script>parent.postMessage(location.href, location.origin);</script></body></html>' > projects/teacher/src/assets/silent-check-sso.html
echo '<html><body><script>parent.postMessage(location.href, location.origin);</script></body></html>' > projects/student/src/assets/silent-check-sso.html

# Start the Angular applications
echo "Starting Angular applications..."
npm run dev:admin & npm run dev:teacher