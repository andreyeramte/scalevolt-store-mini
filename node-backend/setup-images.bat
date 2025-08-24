@echo off
echo Setting up image processing environment...
echo.

cd /d "%~dp0"

echo Installing sharp package...
npm install sharp

echo Creating image directories...
if not exist "local-images" mkdir local-images
if not exist "out-images" mkdir out-images

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Place your original JPG/PNG images in: local-images/
echo 2. Run the upload script: node upload-images-to-supabase.js
echo 3. Check out-images/ for processed webp files
echo.
pause
