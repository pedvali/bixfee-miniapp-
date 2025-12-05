# Simple Upload Script for Mini App
# Upload Frontend files to GitHub

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Mini App Upload to GitHub ===" -ForegroundColor Green
Write-Host ""

# Get GitHub username
Write-Host "GitHub Username:" -ForegroundColor Yellow
$username = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Username cannot be empty!" -ForegroundColor Red
    exit
}

$repoName = "bixfee-miniapp-"

Write-Host ""
Write-Host "Authentication Method:" -ForegroundColor Yellow
Write-Host "1. Personal Access Token (Recommended)" -ForegroundColor Cyan
Write-Host "2. Password (If 2FA is disabled)" -ForegroundColor Cyan
Write-Host ""
$authMethod = Read-Host "Choose method (1 or 2)"

if ($authMethod -eq "1") {
    Write-Host ""
    Write-Host "To create a Token:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Name: Mini App Upload" -ForegroundColor White
    Write-Host "4. Select scope: repo" -ForegroundColor White
    Write-Host "5. Click 'Generate token'" -ForegroundColor White
    Write-Host "6. Copy the token (shown only once!)" -ForegroundColor White
    Write-Host ""
    $token = Read-Host "Enter your Personal Access Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
    $tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $authUrl = "https://${tokenPlain}@github.com"
} else {
    Write-Host ""
    $password = Read-Host "Enter GitHub password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $authUrl = "https://${username}:${passwordPlain}@github.com"
}

Write-Host ""
Write-Host "Preparing files..." -ForegroundColor Yellow

# Paths
$currentDir = Get-Location
# If script is in miniapp folder, files are in current directory
# If script is run from parent, files are in miniapp subfolder
if (Test-Path (Join-Path $currentDir "index.html")) {
    $miniappDir = $currentDir
} else {
    $miniappDir = Join-Path $currentDir "miniapp"
    if (-not (Test-Path $miniappDir)) {
        # Try parent directory
        $parentDir = Split-Path $currentDir -Parent
        $miniappDir = Join-Path $parentDir "miniapp"
    }
}
$tempDir = Join-Path $env:TEMP "bixfee-upload-$(Get-Random)"

# Check files
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
    Write-Host "ERROR: These files are missing:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    exit
}

# Create temp directory
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy files
Write-Host "Copying files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$tempDir\miniapp" -Force | Out-Null

Copy-Item -Path "$miniappDir\index.html" -Destination "$tempDir\miniapp\index.html" -Force
Copy-Item -Path "$miniappDir\styles.css" -Destination "$tempDir\miniapp\styles.css" -Force
Copy-Item -Path "$miniappDir\app.js" -Destination "$tempDir\miniapp\app.js" -Force

Write-Host "Files copied successfully" -ForegroundColor Green

# Clone Repository
Set-Location $tempDir
Write-Host ""
Write-Host "Connecting to GitHub..." -ForegroundColor Yellow

$repoUrl = "$authUrl/$username/$repoName.git"

try {
    git clone $repoUrl $repoName 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Clone failed"
    }
    Write-Host "Connected successfully" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: Connection failed!" -ForegroundColor Red
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "- Wrong token or password" -ForegroundColor White
    Write-Host "- Repository does not exist" -ForegroundColor White
    Write-Host "- Insufficient permissions" -ForegroundColor White
    Set-Location $currentDir
    exit
}

# Copy files to Repository
Set-Location $repoName
Write-Host ""
Write-Host "Uploading files..." -ForegroundColor Yellow

# Create miniapp folder if it doesn't exist
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
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Files uploaded!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Configure:" -ForegroundColor Cyan
    Write-Host "   - Source: Branch = main" -ForegroundColor White
    Write-Host "   - Folder: /miniapp (NOT /)" -ForegroundColor White
    Write-Host "   - Click Save" -ForegroundColor White
    Write-Host ""
    Write-Host "3. After 2-5 minutes, your URL:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Green
    Write-Host ""
    Write-Host "4. Update config.py:" -ForegroundColor Yellow
    Write-Host "   MINI_APP_URL = 'https://$username.github.io/$repoName/'" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Files might already exist" -ForegroundColor Yellow
}

# Cleanup
Set-Location $currentDir
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Read-Host "Press Enter to exit"

