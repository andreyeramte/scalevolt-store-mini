@echo off
echo ========================================
echo    IMAGE RESIZING SCRIPT
echo ========================================
echo.

cd /d "%~dp0\.."
echo Current directory: %CD%
echo.

echo Starting image resizing process...
echo.

node scripts/resize-images.js

echo.
echo Press any key to continue...
pause > nul
