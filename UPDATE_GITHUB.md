# راهنمای آپدیت فایل app.js در GitHub

## مشکل فعلی
فایل `app.js` در VPS آپدیت شده اما در GitHub repository آپدیت نشده است.

## راه حل

### روش 1: استفاده از Git (پیشنهادی)

```bash
cd /root/Pedram/Bixfee/my_telegram_bot/miniapp

# بررسی وضعیت
git status

# اضافه کردن فایل
git add app.js

# Commit
git commit -m "Update Backend API URL to production server"

# Push به GitHub
git push origin main
```

### روش 2: آپدیت دستی در GitHub

1. به https://github.com/pedvali/bixfee-miniapp- بروید
2. فایل `app.js` را باز کنید
3. خط 18 را پیدا کنید
4. مطمئن شوید که شامل این کد است:
   ```javascript
   return 'http://194.116.236.44:5000/api';
   ```
5. اگر `return null;` است، آن را به کد بالا تغییر دهید
6. روی "Commit changes" کلیک کنید

## بررسی نهایی

بعد از آپدیت:
1. چند دقیقه صبر کنید تا GitHub Pages آپدیت شود
2. به https://pedvali.github.io/bixfee-miniapp-/ بروید
3. Console مرورگر را باز کنید (F12)
4. بررسی کنید که آیا API_BASE تنظیم شده است

## نکته مهم

اگر از HTTP استفاده می‌کنید، ممکن است مرورگر خطا دهد. برای حل این مشکل:
- از HTTPS با دامنه استفاده کنید
- یا از nginx reverse proxy استفاده کنید
