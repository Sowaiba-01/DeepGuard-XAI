@echo off
title DeepGuard AI - Project Setup
color 0A

echo.
echo  ================================================
echo   DeepGuard AI - FYP Setup Script
echo  ================================================
echo.

set "DEST=%USERPROFILE%\Desktop\deepguard-ai"
set "SRC=%~dp0"

echo [1/6] Creating project folder on Desktop...
if exist "%DEST%" (
    echo  Folder already exists, updating...
) else (
    mkdir "%DEST%"
)

echo [2/6] Copying project files...
xcopy /E /I /Y "%SRC%frontend" "%DEST%\frontend" >nul
xcopy /E /I /Y "%SRC%backend" "%DEST%\backend" >nul
xcopy /E /I /Y "%SRC%notebooks" "%DEST%\notebooks" >nul

echo [3/6] Installing Next.js dependencies...
cd /d "%DEST%\frontend"
call npm install
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo [4/6] Setting up Python virtual environment for backend...
cd /d "%DEST%\backend"
python -m venv venv
if %errorlevel% neq 0 (
    echo  ERROR: Could not create Python venv. Make sure Python 3.9+ is installed.
    pause
    exit /b 1
)

echo [5/6] Installing Python dependencies...
call "%DEST%\backend\venv\Scripts\activate.bat"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo  WARNING: Some packages may have failed to install.
)

echo [6/6] Creating .env files from examples...
if not exist "%DEST%\frontend\.env.local" (
    copy "%DEST%\frontend\.env.example" "%DEST%\frontend\.env.local" >nul
    echo  IMPORTANT: Fill in your credentials in frontend\.env.local
)
if not exist "%DEST%\backend\.env" (
    copy "%DEST%\backend\.env.example" "%DEST%\backend\.env" >nul
    echo  IMPORTANT: Fill in your credentials in backend\.env
)

echo.
echo  ================================================
echo   Setup Complete!
echo  ================================================
echo.
echo  Project location: %DEST%
echo.
echo  Next steps:
echo   1. Open frontend\.env.local and add your Google OAuth credentials
echo   2. Open backend\.env and add your credentials
echo   3. Run START_BACKEND.bat to start the API server
echo   4. Run START_FRONTEND.bat to start the web app
echo.
echo  Opening project in VS Code...
code "%DEST%"

pause
