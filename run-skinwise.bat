@echo off
title SkinWise Complete Launcher (PostgreSQL)
echo ===================================================
echo   Launching SkinWise (Frontend + Backend + PostgreSQL)
echo ===================================================

:: 1. Launch ML inference service in a dedicated terminal window
start "SkinWise ML Service" cmd /k "%~dp0start-ml-service.bat"

:: 2. Launch Backend in a dedicated terminal window
start "SkinWise Backend (PostgreSQL)" cmd /k "%~dp0start-backend.bat"

:: 3. Wait 2 seconds for backend to initialize
timeout /t 2 /nobreak >nul

:: 4. Launch React Frontend
echo Starting React Frontend on port 3000...
cd /d "%~dp0"
set NODE_OPTIONS=--openssl-legacy-provider
npm start
