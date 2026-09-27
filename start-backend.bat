@echo off
title SkinWise Backend Server (PostgreSQL)
echo ===================================================
echo   Starting SkinWise Backend (Node.js + PostgreSQL)
echo ===================================================

echo Starting Node.js Express authentication server on port 5000...
cd /d "%~dp0server"
node server.js
pause
