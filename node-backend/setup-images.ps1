# Setup script for image processing
Write-Host "Setting up image processing environment..." -ForegroundColor Green

# Navigate to backend directory
Set-Location $PSScriptRoot

# Install sharp package
Write-Host "Installing sharp package..." -ForegroundColor Yellow
npm install sharp

# Create directories if they don't exist
Write-Host "Creating image directories..." -ForegroundColor Yellow
if (!(Test-Path "local-images")) {
    New-Item -ItemType Directory -Name "local-images"
    Write-Host "Created local-images directory" -ForegroundColor Green
}

if (!(Test-Path "out-images")) {
    New-Item -ItemType Directory -Name "out-images"
    Write-Host "Created out-images directory" -ForegroundColor Green
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Place your original JPG/PNG images in: local-images/" -ForegroundColor White
Write-Host "2. Run the upload script: node upload-images-to-supabase.js" -ForegroundColor White
Write-Host "3. Check out-images/ for processed webp files" -ForegroundColor White
