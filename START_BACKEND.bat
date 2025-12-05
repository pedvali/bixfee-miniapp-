@echo off
echo ========================================
echo راه‌اندازی Backend API برای Mini App
echo ========================================
echo.

cd /d "%~dp0.."
cd /d "%~dp0.."

echo در حال بررسی نصب Flask...
python -c "import flask" 2>nul
if errorlevel 1 (
    echo Flask نصب نیست. در حال نصب...
    pip install Flask flask-cors
    if errorlevel 1 (
        echo خطا در نصب Flask!
        pause
        exit /b 1
    )
) else (
    echo Flask نصب است ✓
)

echo.
echo ========================================
echo در حال راه‌اندازی سرور Flask...
echo ========================================
echo.
echo سرور روی http://localhost:5000 اجرا می‌شود
echo.
echo ⚠️ این پنجره را باز نگه دارید!
echo ⚠️ برای توقف، Ctrl+C را بزنید
echo.
echo ========================================
echo.

python miniapp_api.py

pause

