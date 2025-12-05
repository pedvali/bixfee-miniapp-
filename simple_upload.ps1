# اسکریپت ساده برای آپلود فایل‌های Frontend
# فقط یوزر و پسورد نیاز دارید!

Write-Host ""
Write-Host "🚀 آپلود فایل‌های Mini App به GitHub" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# دریافت اطلاعات
Write-Host "📝 اطلاعات GitHub:" -ForegroundColor Yellow
$username = Read-Host "نام کاربری GitHub شما"
$repoName = "bixfee-miniapp-"

Write-Host ""
Write-Host "🔐 برای آپلود، یکی از روش‌ها را انتخاب کنید:" -ForegroundColor Yellow
Write-Host "1. Personal Access Token (پیشنهادی - امن‌تر)" -ForegroundColor Cyan
Write-Host "2. پسورد (اگر 2FA فعال نیست)" -ForegroundColor Cyan
Write-Host ""
$authMethod = Read-Host "روش (1 یا 2)"

if ($authMethod -eq "1") {
    Write-Host ""
    Write-Host "📖 برای ساخت Token:" -ForegroundColor Yellow
    Write-Host "1. به https://github.com/settings/tokens بروید" -ForegroundColor White
    Write-Host "2. Generate new token (classic)" -ForegroundColor White
    Write-Host "3. نام: Mini App Upload" -ForegroundColor White
    Write-Host "4. Scope: repo را انتخاب کنید" -ForegroundColor White
    Write-Host "5. Generate token را بزنید" -ForegroundColor White
    Write-Host "6. Token را کپی کنید (فقط یک بار نمایش داده می‌شود!)" -ForegroundColor White
    Write-Host ""
    $token = Read-Host "Personal Access Token را وارد کنید" -AsSecureString
    $tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))
    $authUrl = "https://${tokenPlain}@github.com"
} else {
    Write-Host ""
    $password = Read-Host "پسورد GitHub" -AsSecureString
    $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    $authUrl = "https://${username}:${passwordPlain}@github.com"
}

Write-Host ""
Write-Host "📁 آماده‌سازی فایل‌ها..." -ForegroundColor Yellow

# مسیرها
$currentDir = Get-Location
$miniappDir = Join-Path $currentDir "miniapp"
$tempDir = Join-Path $env:TEMP "bixfee-upload-$(Get-Random)"

# بررسی فایل‌ها
$filesNeeded = @("index.html", "styles.css", "app.js")
$missingFiles = @()

foreach ($file in $filesNeeded) {
    $filePath = Join-Path $miniappDir $file
    if (-not (Test-Path $filePath)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ این فایل‌ها پیدا نشدند:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    exit
}

# ایجاد پوشه موقت
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# کپی فایل‌ها
Write-Host "📋 کپی فایل‌ها..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$tempDir\miniapp" -Force | Out-Null

Copy-Item -Path "$miniappDir\index.html" -Destination "$tempDir\miniapp\index.html" -Force
Copy-Item -Path "$miniappDir\styles.css" -Destination "$tempDir\miniapp\styles.css" -Force
Copy-Item -Path "$miniappDir\app.js" -Destination "$tempDir\miniapp\app.js" -Force

Write-Host "✅ فایل‌ها کپی شدند" -ForegroundColor Green

# Clone Repository
Set-Location $tempDir
Write-Host ""
Write-Host "📥 اتصال به GitHub..." -ForegroundColor Yellow

$repoUrl = "$authUrl/$username/$repoName.git"

try {
    git clone $repoUrl $repoName 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Clone failed"
    }
    Write-Host "✅ اتصال برقرار شد" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ خطا در اتصال!" -ForegroundColor Red
    Write-Host "ممکن است:" -ForegroundColor Yellow
    Write-Host "- Token یا پسورد اشتباه باشد" -ForegroundColor White
    Write-Host "- Repository وجود نداشته باشد" -ForegroundColor White
    Write-Host "- دسترسی کافی نداشته باشید" -ForegroundColor White
    exit
}

# کپی فایل‌ها به Repository
Set-Location $repoName
Write-Host ""
Write-Host "📤 آپلود فایل‌ها..." -ForegroundColor Yellow

# ایجاد پوشه miniapp در Repository (اگر وجود ندارد)
if (-not (Test-Path "miniapp")) {
    New-Item -ItemType Directory -Path "miniapp" -Force | Out-Null
}

Copy-Item -Path "$tempDir\miniapp\*" -Destination "miniapp\" -Recurse -Force

# Git add
git add miniapp/ 2>&1 | Out-Null

# Commit
git config user.name $username
git config user.email "$username@users.noreply.github.com"
git commit -m "Add Mini App frontend files" 2>&1 | Out-Null

# Push
Write-Host "🚀 در حال ارسال به GitHub..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅✅✅ موفقیت! ✅✅✅" -ForegroundColor Green
    Write-Host ""
    Write-Host "فایل‌ها با موفقیت آپلود شدند!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 مرحله بعدی:" -ForegroundColor Yellow
    Write-Host "1. به این آدرس بروید:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/$repoName/settings/pages" -ForegroundColor White
    Write-Host ""
    Write-Host "2. این تنظیمات را انجام دهید:" -ForegroundColor Cyan
    Write-Host "   - Source: Branch = main" -ForegroundColor White
    Write-Host "   - Folder: /miniapp (نه /)" -ForegroundColor White
    Write-Host "   - Save" -ForegroundColor White
    Write-Host ""
    Write-Host "3. بعد از 2-5 دقیقه، URL شما:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Green
    Write-Host ""
    Write-Host "4. در config.py این URL را تنظیم کنید:" -ForegroundColor Yellow
    Write-Host "   MINI_APP_URL = 'https://$username.github.io/$repoName/'" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ خطا در Push!" -ForegroundColor Red
    Write-Host "ممکن است فایل‌ها از قبل وجود داشته باشند" -ForegroundColor Yellow
}

# پاکسازی
Set-Location $currentDir
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Read-Host "برای خروج Enter را بزنید"

