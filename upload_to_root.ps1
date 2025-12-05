# اسکریپت آپلود فایل‌های Mini App به Root Repository
# این اسکریپت فایل‌ها را مستقیماً در root آپلود می‌کند

Write-Host ""
Write-Host "🚀 آپلود Mini App به Root Repository" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# دریافت اطلاعات
Write-Host "📝 اطلاعات GitHub:" -ForegroundColor Yellow
$username = Read-Host "نام کاربری GitHub شما (مثلاً: pedvali)"
$repoName = "bixfee-miniapp-"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ نام کاربری نمی‌تواند خالی باشد!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔐 روش احراز هویت:" -ForegroundColor Yellow
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
Write-Host "📁 بررسی فایل‌ها..." -ForegroundColor Yellow

# مسیر فعلی
$currentDir = Get-Location
$miniappDir = Join-Path $currentDir "."

# بررسی فایل‌های مورد نیاز
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
    Write-Host ""
    Write-Host "⚠️ لطفاً مطمئن شوید که در پوشه miniapp هستید!" -ForegroundColor Yellow
    exit
}

Write-Host "✅ همه فایل‌ها پیدا شدند" -ForegroundColor Green

# ایجاد پوشه موقت
$tempDir = Join-Path $env:TEMP "bixfee-upload-root-$(Get-Random)"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host ""
Write-Host "📥 Clone کردن Repository..." -ForegroundColor Yellow

# Clone Repository
Set-Location $tempDir
$repoUrl = "$authUrl/$username/$repoName.git"

try {
    git clone $repoUrl $repoName 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Clone failed"
    }
    Write-Host "✅ Repository Clone شد" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ خطا در Clone کردن Repository!" -ForegroundColor Red
    Write-Host "ممکن است:" -ForegroundColor Yellow
    Write-Host "- Token یا پسورد اشتباه باشد" -ForegroundColor White
    Write-Host "- Repository وجود نداشته باشد" -ForegroundColor White
    Write-Host "- دسترسی کافی نداشته باشید" -ForegroundColor White
    Set-Location $currentDir
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    exit
}

# رفتن به پوشه Repository
Set-Location $repoName

Write-Host ""
Write-Host "🗑️ حذف فایل‌های قدیمی (اگر وجود دارند)..." -ForegroundColor Yellow

# حذف فایل‌های قدیمی
$oldFiles = @("index.html", "style.css", "app.js")
foreach ($file in $oldFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "  ✓ $file حذف شد" -ForegroundColor Gray
    }
}

# حذف پوشه miniapp اگر وجود دارد (اختیاری)
if (Test-Path "miniapp") {
    Write-Host "  ⚠️ پوشه miniapp پیدا شد (می‌توانید بعداً حذف کنید)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📤 کپی فایل‌های جدید به Root..." -ForegroundColor Yellow

# کپی فایل‌های جدید به root
Copy-Item -Path "$miniappDir\index.html" -Destination "index.html" -Force
Copy-Item -Path "$miniappDir\styles.css" -Destination "styles.css" -Force
Copy-Item -Path "$miniappDir\app.js" -Destination "app.js" -Force

Write-Host "  ✓ index.html" -ForegroundColor Green
Write-Host "  ✓ styles.css" -ForegroundColor Green
Write-Host "  ✓ app.js" -ForegroundColor Green

# Git add
Write-Host ""
Write-Host "📝 اضافه کردن به Git..." -ForegroundColor Yellow
git add index.html styles.css app.js 2>&1 | Out-Null

# Git config
git config user.name $username
git config user.email "$username@users.noreply.github.com"

# Commit
Write-Host "💾 Commit کردن تغییرات..." -ForegroundColor Yellow
git commit -m "Update Mini App with Trust Wallet design - Upload to root" 2>&1 | Out-Null

# Push
Write-Host ""
Write-Host "🚀 در حال ارسال به GitHub..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅✅✅ موفقیت! ✅✅✅" -ForegroundColor Green
    Write-Host ""
    Write-Host "فایل‌ها با موفقیت به Root Repository آپلود شدند!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 مرحله بعدی - تنظیمات GitHub Pages:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. به این آدرس بروید:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/$repoName/settings/pages" -ForegroundColor White
    Write-Host ""
    Write-Host "2. این تنظیمات را انجام دهید:" -ForegroundColor Cyan
    Write-Host "   - Source: Branch = main" -ForegroundColor White
    Write-Host "   - Folder: / (root) ⚠️ مهم: باید root باشد!" -ForegroundColor White
    Write-Host "   - Save" -ForegroundColor White
    Write-Host ""
    Write-Host "3. بعد از 2-5 دقیقه، URL شما:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Green
    Write-Host ""
    Write-Host "4. Cache مرورگر را پاک کنید (Ctrl+Shift+R)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. تست کنید:" -ForegroundColor Yellow
    Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ خطا در Push!" -ForegroundColor Red
    Write-Host "ممکن است فایل‌ها از قبل وجود داشته باشند یا مشکلی در دسترسی باشد" -ForegroundColor Yellow
}

# پاکسازی
Set-Location $currentDir
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Read-Host "برای خروج Enter را بزنید"

