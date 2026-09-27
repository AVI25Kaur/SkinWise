@echo off
title SkinWise Backend Server (MySQL)
echo ===================================================
echo   Starting SkinWise Backend (Node.js + MySQL)
echo ===================================================

:: Check if MySQL is listening on port 3306
powershell -Command "if ((Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue).TcpTestSucceeded) { exit 0 } else { exit 1 }"
if %errorlevel% neq 0 (
    echo [WARNING] MySQL does not appear to be listening on port 3306.
    echo Please ensure the MySQL service is started (via Services or net start MySQL).
    echo.
) else (
    echo [OK] MySQL is active and listening on port 3306.
)

echo Starting Node.js Express authentication server on port 5000...
cd /d "%~dp0server"
node server.js
pause
