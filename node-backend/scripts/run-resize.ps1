Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    IMAGE RESIZING SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location (Split-Path $PSScriptRoot -Parent)
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

Write-Host "Starting image resizing process..." -ForegroundColor Yellow
Write-Host ""

# Run the resize script
node scripts/resize-images.js

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
