@echo off
cd /d "%~dp0"
start "My Daily Bloom Server" cmd /k "npm.cmd run dev"
timeout /t 5 /nobreak >nul
start "" http://localhost:5173/