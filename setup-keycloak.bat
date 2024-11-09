@echo off
echo Stopping all containers...
docker-compose down

echo Removing volumes...
docker volume prune -f

echo Creating Keycloak directories...
if not exist "keycloak\conf" mkdir "keycloak\conf"
if not exist "keycloak\themes" mkdir "keycloak\themes"

echo Copying Keycloak configuration...
copy /Y "keycloak.conf" "keycloak\conf\"

echo Starting services...
docker-compose up -d

echo Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak

echo Running Keycloak setup...
node keycloak-setup.js

echo Setup complete! 