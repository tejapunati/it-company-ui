@echo off
echo Starting IT Company UI Application...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Check if Angular CLI is installed
where ng >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Angular CLI is not installed. Installing...
    npm install -g @angular/cli
)

echo Starting Angular frontend...
start cmd /k "cd /d %~dp0 && ng serve --open"

echo.
echo To start your backend server, open another terminal and run your backend start command.
echo Example: java -jar your-backend.jar
echo.
echo Once both servers are running, you can access the application at http://localhost:4200