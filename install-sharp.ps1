Write-Host "Installing sharp package..." -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Set-Location "node-backend\backend-node"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Install sharp
Write-Host "Running npm install sharp..." -ForegroundColor Yellow
npm install sharp

Write-Host ""
Write-Host "Installation complete! Checking if sharp was installed..." -ForegroundColor Green
Write-Host ""

# Check if sharp was installed
if (Test-Path "node_modules\sharp") {
    Write-Host "✅ Sharp is now installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Sharp installation may have failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
