# ScaleVolt Store Mini Launch - Deployment Script
# This script helps deploy the mini launch version

Write-Host "🚀 ScaleVolt Store Mini Launch - Deployment Helper" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "1. Ensure you have Node.js 18+ installed" -ForegroundColor White
Write-Host "2. Ensure you have Git configured" -ForegroundColor White
Write-Host "3. Ensure you have Supabase project created" -ForegroundColor White
Write-Host "4. Ensure you have Vercel and Render accounts" -ForegroundColor White

Write-Host "`n🔧 Local Setup:" -ForegroundColor Yellow
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Copy .env.mini.example to .env and configure" -ForegroundColor White
Write-Host "3. Seed products: node db/seed-mini-products.js" -ForegroundColor White
Write-Host "4. Test locally: npm run dev" -ForegroundColor White

Write-Host "`n🚀 Deployment Steps:" -ForegroundColor Yellow
Write-Host "1. Frontend (Vercel):" -ForegroundColor White
Write-Host "   - Go to vercel.com and import this repository" -ForegroundColor White
Write-Host "   - Set build command: npm run build" -ForegroundColor White
Write-Host "   - Set output directory: dist" -ForegroundColor White
Write-Host "   - Add environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY" -ForegroundColor White

Write-Host "`n2. Backend (Render):" -ForegroundColor White
Write-Host "   - Go to render.com and create Web Service" -ForegroundColor White
Write-Host "   - Connect this repository" -ForegroundColor White
Write-Host "   - Set root directory: node-backend/backend-node" -ForegroundColor White
Write-Host "   - Set build command: npm install" -ForegroundColor White
Write-Host "   - Set start command: npm start" -ForegroundColor White
Write-Host "   - Add environment variables: SUPABASE_URL, SUPABASE_ANON_KEY" -ForegroundColor White

Write-Host "`n3. Update Frontend API URL:" -ForegroundColor White
Write-Host "   - After backend deployment, update API_BASE_URL in frontend" -ForegroundColor White
Write-Host "   - Redeploy frontend" -ForegroundColor White

Write-Host "`n✅ Your mini launch store will be ready!" -ForegroundColor Green
Write-Host "`n📚 For detailed instructions, see README-mini.md" -ForegroundColor Cyan
Write-Host "🌐 For help, check the documentation or open an issue" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
