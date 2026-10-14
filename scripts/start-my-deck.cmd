@echo off
rem Launches the open-slide dev server for my-deck and opens it in the browser.
rem If a my-deck server is already running (any port), just opens its page.
chcp 65001 >nul
cd /d "%~dp0.."

set "RUNNING_URL="
for /f "usebackq delims=" %%U in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0my-deck-servers.ps1" -Url`) do set "RUNNING_URL=%%U"
if defined RUNNING_URL (
  start "" "%RUNNING_URL%"
  exit /b 0
)

title my-deck - SERVEUR EN COURS (fermer cette fenêtre = arrêter le serveur)
echo.
echo   my-deck - serveur open-slide
echo   ----------------------------
echo   Le navigateur va s'ouvrir tout seul.
echo   Pour ARRÊTER le serveur : ferme cette fenêtre (ou Ctrl+C).
echo   Pour voir / arrêter tous les serveurs : raccourci « My Deck - Serveurs ».
echo.
call npm run dev -- --open
if errorlevel 1 pause
