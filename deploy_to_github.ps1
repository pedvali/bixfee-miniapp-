# اسکریپت خودکار برای آپلود Mini App به GitHub
# PowerShell Script for Auto Deploying Mini App to GitHub

Write-Host "🚀 شروع آپلود Mini App به GitHub..." -ForegroundColor Green
Write-Host ""

# بررسی نصب بودن Git
Write-Host "📦 بررسی نصب بودن Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git نصب است: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git نصب نیست!" -ForegroundColor Red
    Write-Host ""
    Write-Host "لطفاً Git را نصب کنید:" -ForegroundColor Yellow
    Write-Host "1. به https://git-scm.com/download/win بروید" -ForegroundColor Cyan
    Write-Host "2. Git را دانلود و نصب کنید" -ForegroundColor Cyan
    Write-Host "3. این اسکریپت را دوباره اجرا کنید" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "برای ادامه Enter را بزنید"
    exit
}

# دریافت اطلاعات GitHub
Write-Host ""
Write-Host "📝 اطلاعات GitHub را وارد کنید:" -ForegroundColor Yellow
Write-Host ""

$githubUsername = Read-Host "نام کاربری GitHub شما"
$repositoryName = Read-Host "نام Repository (مثلاً: bixfee-miniapp)"

if ([string]::IsNullOrWhiteSpace($githubUsername) -or [string]::IsNullOrWhiteSpace($repositoryName)) {
    Write-Host "❌ نام کاربری و Repository نمی‌توانند خالی باشند!" -ForegroundColor Red
    exit
}

# مسیر فعلی
$currentDir = Get-Location
$miniappDir = Join-Path $currentDir "miniapp"
$tempDir = Join-Path $env:TEMP "bixfee-miniapp-deploy"

# بررسی وجود پوشه miniapp
if (-not (Test-Path $miniappDir)) {
    Write-Host "❌ پوشه miniapp پیدا نشد!" -ForegroundColor Red
    Write-Host "مسیر فعلی: $currentDir" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "📁 آماده‌سازی فایل‌ها..." -ForegroundColor Yellow

# حذف پوشه موقت قبلی (اگر وجود دارد)
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}

# ایجاد پوشه موقت
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# کپی فایل‌های miniapp
Write-Host "📋 کپی فایل‌ها..." -ForegroundColor Yellow
Copy-Item -Path "$miniappDir\*" -Destination $tempDir -Recurse -Force

# رفتن به پوشه موقت
Set-Location $tempDir

# بررسی اینکه آیا Repository از قبل وجود دارد
Write-Host ""
Write-Host "🔍 بررسی Repository..." -ForegroundColor Yellow

$repoExists = $false
try {
    $response = Invoke-WebRequest -Uri "https://api.github.com/repos/$githubUsername/$repositoryName" -Method Get -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $repoExists = $true
        Write-Host "✅ Repository از قبل وجود دارد" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️ Repository جدید خواهد بود" -ForegroundColor Cyan
}

# راه‌اندازی Git
Write-Host ""
Write-Host "🔧 راه‌اندازی Git..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
}

git init
git add .
git commit -m "Initial commit - Bixfee Mini App"

# تنظیم remote
$repoUrl = "https://github.com/$githubUsername/$repositoryName.git"
Write-Host ""
Write-Host "🔗 تنظیم remote: $repoUrl" -ForegroundColor Yellow

if (-not $repoExists) {
    Write-Host ""
    Write-Host "⚠️ Repository باید ابتدا در GitHub ایجاد شود!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "لطفاً این مراحل را انجام دهید:" -ForegroundColor Cyan
    Write-Host "1. به https://github.com/new بروید" -ForegroundColor White
    Write-Host "2. Repository name: $repositoryName" -ForegroundColor White
    Write-Host "3. Public یا Private را انتخاب کنید" -ForegroundColor White
    Write-Host "4. Create repository را بزنید" -ForegroundColor White
    Write-Host "5. دستورات زیر را اجرا کنید:" -ForegroundColor White
    Write-Host ""
    Write-Host "git remote add origin $repoUrl" -ForegroundColor Green
    Write-Host "git branch -M main" -ForegroundColor Green
    Write-Host "git push -u origin main" -ForegroundColor Green
    Write-Host ""
} else {
    git remote add origin $repoUrl
    git branch -M main
    
    Write-Host ""
    Write-Host "🚀 آیا می‌خواهید فایل‌ها را Push کنید؟ (y/n)" -ForegroundColor Yellow
    $push = Read-Host
    
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host ""
        Write-Host "📤 در حال Push کردن..." -ForegroundColor Yellow
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ فایل‌ها با موفقیت آپلود شدند!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📝 مراحل بعدی:" -ForegroundColor Yellow
            Write-Host "1. به https://github.com/$githubUsername/$repositoryName/settings/pages بروید" -ForegroundColor Cyan
            Write-Host "2. Source: Branch را 'main' انتخاب کنید" -ForegroundColor Cyan
            Write-Host "3. Folder: '/ (root)' را انتخاب کنید" -ForegroundColor Cyan
            Write-Host "4. Save کنید" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "🌐 URL شما: https://$githubUsername.github.io/$repositoryName/miniapp/" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️ در config.py این URL را تنظیم کنید:" -ForegroundColor Yellow
            Write-Host "MINI_APP_URL = 'https://$githubUsername.github.io/$repositoryName/miniapp/'" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ خطا در Push کردن!" -ForegroundColor Red
            Write-Host "ممکن است نیاز به Authentication داشته باشید" -ForegroundColor Yellow
        }
    }
}

# بازگشت به پوشه اصلی
Set-Location $currentDir

Write-Host ""
Write-Host "✅ آماده است!" -ForegroundColor Green
Write-Host ""
Read-Host "برای خروج Enter را بزنید"

