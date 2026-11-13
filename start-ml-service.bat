@echo off
title SkinWise ML Service
cd /d "%~dp0ml-service"

set "PYTHON=%~dp0ml-service\.venv\Scripts\python.exe"
if not exist "%PYTHON%" set "PYTHON=%~dp0ml-service\venv\Scripts\python.exe"

if exist "%PYTHON%" (
    "%PYTHON%" -m uvicorn app:app --reload --port 8000
) else (
    python -m uvicorn app:app --reload --port 8000
)

if errorlevel 1 pause
