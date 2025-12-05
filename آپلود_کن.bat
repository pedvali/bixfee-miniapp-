@echo off
chcp 65001 >nul
echo.
echo ===========================================
echo 🚀 آپلود Mini App به GitHub
echo ===========================================
echo.
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "upload.ps1"
pause

