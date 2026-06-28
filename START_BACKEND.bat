@echo off
title DeepGuard AI - Backend Server
color 0B
echo Starting DeepGuard AI Backend (FastAPI)...
cd /d "%USERPROFILE%\Desktop\deepguard-ai\backend"
call venv\Scripts\activate.bat
echo Backend running at http://localhost:8000
echo API Docs at http://localhost:8000/docs
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
