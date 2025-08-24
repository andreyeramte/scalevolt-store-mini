Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SCALEVOLT IMAGE PROCESSING SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Installing sharp package..." -ForegroundColor Yellow
Set-Location "node-backend\backend-node"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Install sharp
Write-Host "Running npm install sharp..." -ForegroundColor Yellow
npm install sharp

Write-Host ""
Write-Host "Step 2: Creating image directories..." -ForegroundColor Yellow

# Create directories
if (!(Test-Path "local-images")) {
    New-Item -ItemType Directory -Name "local-images"
    Write-Host "✅ Created local-images directory" -ForegroundColor Green
} else {
    Write-Host "✅ local-images directory already exists" -ForegroundColor Green
}

if (!(Test-Path "out-images")) {
    New-Item -ItemType Directory -Name "out-images"
    Write-Host "✅ Created out-images directory" -ForegroundColor Green
} else {
    Write-Host "✅ out-images directory already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Verifying installation..." -ForegroundColor Yellow

# Verify sharp installation
if (Test-Path "node_modules\sharp") {
    Write-Host "✅ Sharp is now installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Sharp installation may have failed" -ForegroundColor Red
}

# Verify directories
if (Test-Path "local-images") {
    Write-Host "✅ local-images directory verified" -ForegroundColor Green
} else {
    Write-Host "❌ local-images directory not found" -ForegroundColor Red
}

if (Test-Path "out-images") {
    Write-Host "✅ out-images directory verified" -ForegroundColor Green
} else {
    Write-Host "❌ out-images directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Place your original JPG/PNG images in: node-backend\local-images\" -ForegroundColor White
Write-Host "2. Run the upload script: node upload-images-to-supabase.js" -ForegroundColor White
Write-Host "3. Check node-backend\out-images\ for processed webp files" -ForegroundColor White
Write-Host ""
Write-Host "Make sure your .env file has:" -ForegroundColor Yellow
Write-Host "- SUPABASE_URL (your Supabase project URL)" -ForegroundColor White
Write-Host "- SUPABASE_SERVICE_KEY (your service role key)" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
