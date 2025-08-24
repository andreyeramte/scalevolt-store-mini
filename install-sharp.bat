@echo off
echo Installing sharp package...
echo.

cd node-backend\backend-node
echo Current directory: %CD%
echo.

echo Running npm install sharp...
npm install sharp

echo.
echo Installation complete! Checking if sharp was installed...
echo.

if exist "node_modules\sharp" (
    echo ✅ Sharp is now installed successfully!
) else (
    echo ❌ Sharp installation may have failed
)

echo.
pause
