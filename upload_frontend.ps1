# اسکریپت آپلود فایل‌های Frontend به GitHub
# Upload Frontend files to existing GitHub repository

Write-Host "🚀 آپلود فایل‌های Frontend به GitHub..." -ForegroundColor Green
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
    Write-Host "https://git-scm.com/download/win" -ForegroundColor Cyan
    exit
}

# اطلاعات Repository
$githubUsername = "pedvali"
$repositoryName = "bixfee-miniapp-"

Write-Host ""
Write-Host "📝 اطلاعات Repository:" -ForegroundColor Yellow
Write-Host "کاربر: $githubUsername" -ForegroundColor Cyan
Write-Host "Repository: $repositoryName" -ForegroundColor Cyan
Write-Host ""

# مسیرها
$currentDir = Get-Location
$miniappDir = Join-Path $currentDir "miniapp"
$repoDir = Join-Path $env:TEMP "bixfee-miniapp-clone"

# بررسی وجود پوشه miniapp
if (-not (Test-Path $miniappDir)) {
    Write-Host "❌ پوشه miniapp پیدا نشد!" -ForegroundColor Red
    Write-Host "مسیر فعلی: $currentDir" -ForegroundColor Yellow
    exit
}

Write-Host "📁 آماده‌سازی..." -ForegroundColor Yellow

# حذف پوشه موقت قبلی
if (Test-Path $repoDir) {
    Remove-Item -Path $repoDir -Recurse -Force
}

# Clone Repository
Write-Host ""
Write-Host "📥 Clone کردن Repository..." -ForegroundColor Yellow
$repoUrl = "https://github.com/$githubUsername/$repositoryName.git"

try {
    git clone $repoUrl $repoDir
    if ($LASTEXITCODE -ne 0) {
        throw "Clone failed"
    }
    Write-Host "✅ Repository Clone شد" -ForegroundColor Green
} catch {
    Write-Host "❌ خطا در Clone کردن!" -ForegroundColor Red
    Write-Host "ممکن است نیاز به Authentication داشته باشید" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "راه حل:" -ForegroundColor Cyan
    Write-Host "1. به GitHub بروید و Personal Access Token بسازید" -ForegroundColor White
    Write-Host "2. یا از GitHub Desktop استفاده کنید" -ForegroundColor White
    exit
}

# رفتن به Repository
Set-Location $repoDir

# ایجاد پوشه miniapp (اگر وجود ندارد)
$targetMiniappDir = Join-Path $repoDir "miniapp"
if (-not (Test-Path $targetMiniappDir)) {
    New-Item -ItemType Directory -Path $targetMiniappDir -Force | Out-Null
    Write-Host "✅ پوشه miniapp ایجاد شد" -ForegroundColor Green
}

# کپی فایل‌های Frontend
Write-Host ""
Write-Host "📋 کپی فایل‌های Frontend..." -ForegroundColor Yellow

$filesToCopy = @(
    "index.html",
    "styles.css",
    "app.js"
)

foreach ($file in $filesToCopy) {
    $sourceFile = Join-Path $miniappDir $file
    $targetFile = Join-Path $targetMiniappDir $file
    
    if (Test-Path $sourceFile) {
        Copy-Item -Path $sourceFile -Destination $targetFile -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ $file پیدا نشد!" -ForegroundColor Yellow
    }
}

# بررسی تغییرات
Write-Host ""
Write-Host "🔍 بررسی تغییرات..." -ForegroundColor Yellow
git status

# افزودن فایل‌ها
Write-Host ""
Write-Host "➕ افزودن فایل‌ها به Git..." -ForegroundColor Yellow
git add miniapp/

# Commit
Write-Host ""
Write-Host "💾 Commit کردن..." -ForegroundColor Yellow
git commit -m "Add Mini App frontend files (index.html, styles.css, app.js)"

# Push
Write-Host ""
Write-Host "🚀 آیا می‌خواهید فایل‌ها را Push کنید؟ (y/n)" -ForegroundColor Yellow
$push = Read-Host

if ($push -eq "y" -or $push -eq "Y") {
    Write-Host ""
    Write-Host "📤 در حال Push کردن..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ فایل‌ها با موفقیت آپلود شدند!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 مراحل بعدی:" -ForegroundColor Yellow
        Write-Host "1. به https://github.com/$githubUsername/$repositoryName/settings/pages بروید" -ForegroundColor Cyan
        Write-Host "2. Source: Branch را 'main' انتخاب کنید" -ForegroundColor Cyan
        Write-Host "3. Folder: '/miniapp' را انتخاب کنید" -ForegroundColor Cyan
        Write-Host "4. Save کنید" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🌐 URL شما: https://$githubUsername.github.io/$repositoryName/" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️ در config.py این URL را تنظیم کنید:" -ForegroundColor Yellow
        Write-Host "MINI_APP_URL = 'https://$githubUsername.github.io/$repositoryName/'" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ خطا در Push کردن!" -ForegroundColor Red
        Write-Host "ممکن است نیاز به Authentication داشته باشید" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "ℹ️ فایل‌ها آماده هستند اما Push نشدند" -ForegroundColor Yellow
    Write-Host "می‌توانید بعداً با دستورات زیر Push کنید:" -ForegroundColor Cyan
    Write-Host "cd $repoDir" -ForegroundColor White
    Write-Host "git push origin main" -ForegroundColor White
}

# بازگشت
Set-Location $currentDir

Write-Host ""
Write-Host "✅ آماده است!" -ForegroundColor Green
Write-Host ""
Read-Host "برای خروج Enter را بزنید"

