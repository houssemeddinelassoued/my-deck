@echo off
rem Launches the open-slide dev server for my-deck and opens it in the browser.
rem If the server is already running, just opens the page.
title my-deck - open-slide dev
cd /d "%~dp0.."

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if %errorlevel%==0 (
  start "" "http://localhost:5173/"
  exit /b 0
)

echo Starting my-deck on http://localhost:5173/ ...
echo Close this window (or press Ctrl+C) to stop the server.
echo.
call npm run dev -- --open
if errorlevel 1 pause
