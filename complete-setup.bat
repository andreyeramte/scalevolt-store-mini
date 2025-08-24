@echo off
echo ========================================
echo    SCALEVOLT IMAGE PROCESSING SETUP
echo ========================================
echo.

echo Step 1: Installing sharp package...
cd node-backend\backend-node
echo Current directory: %CD%
echo.

npm install sharp

echo.
echo Step 2: Creating image directories...
if not exist "local-images" mkdir local-images
if not exist "out-images" mkdir out-images

echo.
echo Step 3: Verifying installation...
if exist "node_modules\sharp" (
    echo ✅ Sharp is now installed successfully!
) else (
    echo ❌ Sharp installation may have failed
)

if exist "local-images" (
    echo ✅ local-images directory created
) else (
    echo ❌ Failed to create local-images directory
)

if exist "out-images" (
    echo ✅ out-images directory created
) else (
    echo ❌ Failed to create out-images directory
)

echo.
echo ========================================
echo           SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Place your original JPG/PNG images in: node-backend\local-images\
echo 2. Run the upload script: node upload-images-to-supabase.js
echo 3. Check node-backend\out-images\ for processed webp files
echo.
echo Make sure your .env file has:
echo - SUPABASE_URL (your Supabase project URL)
echo - SUPABASE_SERVICE_KEY (your service role key)
echo.
pause
