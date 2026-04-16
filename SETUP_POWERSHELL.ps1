# ============================================================
# PALMTRADE - Complete PowerShell Setup Script
# Run this from your project parent folder (e.g. D:\Projects)
# ============================================================

Write-Host "`n[1/4] Creating Next.js project..." -ForegroundColor Yellow
npx create-next-app@latest palmtrade --js --tailwind --app --src-dir --no-eslint --import-alias "@/*" --no-typescript

Set-Location palmtrade

Write-Host "`n[2/4] Installing dependencies..." -ForegroundColor Yellow
npm install @supabase/supabase-js @supabase/ssr next-intl lucide-react

Write-Host "`n[3/4] Creating folder structure..." -ForegroundColor Yellow

function New-Dir($path) {
    $full = "src\$path"
    if (-not (Test-Path $full)) { New-Item -ItemType Directory -Path $full -Force | Out-Null }
    Write-Host "  [DIR] $full" -ForegroundColor Cyan
}
function New-F($path) {
    $full = "src\$path"
    New-Item -ItemType File -Path $full -Force | Out-Null
    Write-Host "  [FILE] $full" -ForegroundColor Green
}

New-Dir "app\[locale]"
New-Dir "app\[locale]\about"
New-Dir "app\[locale]\products"
New-Dir "app\[locale]\gallery"
New-Dir "app\[locale]\news"
New-Dir "app\[locale]\news\[slug]"
New-Dir "app\[locale]\team"
New-Dir "app\[locale]\contact"
New-Dir "app\admin"
New-Dir "app\admin\products"
New-Dir "app\admin\gallery"
New-Dir "app\admin\news"
New-Dir "app\admin\team"
New-Dir "app\admin\contacts"
New-Dir "app\api\contact"
New-Dir "components\layout"
New-Dir "components\sections"
New-Dir "components\ui"
New-Dir "components\admin"
New-Dir "lib"
New-Dir "messages"

Write-Host "`n[4/4] Done! Now copy the source files from the guide." -ForegroundColor Green
Write-Host "Then run: npm run dev" -ForegroundColor Green
