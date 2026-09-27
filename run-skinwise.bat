@echo off
title SkinWise Complete Launcher (MySQL)
echo ===================================================
echo   Launching SkinWise (Frontend + Backend + MySQL)
echo ===================================================

:: 1. Launch Backend in a dedicated terminal window
start "SkinWise Backend (MySQL)" cmd /k "%~dp0start-backend.bat"

:: 2. Wait 2 seconds for backend to initialize
timeout /t 2 /nobreak >nul

:: 3. Launch React Frontend
echo Starting React Frontend on port 3000...
cd /d "%~dp0"
set NODE_OPTIONS=--openssl-legacy-provider
npm start
