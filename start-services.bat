@echo off
echo Starting services...

REM Stop any running containers and clean up
docker-compose down
docker volume prune -f

REM Start Keycloak
docker-compose up -d

REM Wait for Keycloak to be ready
echo Waiting for Keycloak to start...
:WAIT_LOOP
timeout /t 5 /nobreak > nul
curl -s http://localhost:8080/auth > nul 2>&1
if errorlevel 1 (
    echo Still waiting for Keycloak...
    goto WAIT_LOOP
)

echo Keycloak is up! Running setup...

REM Run Keycloak setup
node keycloak-setup.js

REM Create silent check SSO files
mkdir "projects\admin\src\assets" 2>nul
mkdir "projects\teacher\src\assets" 2>nul
mkdir "projects\student\src\assets" 2>nul

(
echo ^<html^>
echo   ^<body^>
echo     ^<script^>
echo       parent.postMessage(location.href, location.origin^);
echo     ^</script^>
echo   ^</body^>
echo ^</html^>
) > "projects\admin\src\assets\silent-check-sso.html"
copy "projects\admin\src\assets\silent-check-sso.html" "projects\teacher\src\assets\silent-check-sso.html"
copy "projects\admin\src\assets\silent-check-sso.html" "projects\student\src\assets\silent-check-sso.html"

REM Start the applications in separate windows
start cmd /k "npm run dev:admin"
start cmd /k "npm run dev:teacher"