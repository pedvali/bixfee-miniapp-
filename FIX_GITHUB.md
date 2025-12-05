# 🔧 راهنمای رفع مشکل GitHub Pages

## مشکل
صفحه GitHub Pages به جای مینی‌اپ، یک صفحه ساده نمایش می‌دهد.

## علت
فایل‌های اشتباه در GitHub repository آپدیت شده‌اند.

## راه حل

### فایل‌های مورد نیاز برای آپدیت در GitHub:

1. **index.html** - از `/root/Pedram/Bixfee/my_telegram_bot/miniapp/index.html`
2. **app.js** - از `/root/Pedram/Bixfee/my_telegram_bot/miniapp/app.js`
3. **styles.css** - از `/root/Pedram/Bixfee/my_telegram_bot/miniapp/styles.css`

### روش آپدیت:

#### روش 1: استفاده از Git (اگر repository در VPS است)

```bash
cd /root/Pedram/Bixfee/my_telegram_bot/miniapp

# بررسی وضعیت
git status

# اضافه کردن همه فایل‌ها
git add index.html app.js styles.css

# Commit
git commit -m "Update miniapp files - fix index.html and add Backend API"

# Push
git push origin main
```

#### روش 2: آپدیت دستی در GitHub

1. به https://github.com/pedvali/bixfee-miniapp- بروید

2. **فایل index.html را آپدیت کنید:**
   - فایل `index.html` را باز کنید
   - محتوای کامل فایل `/root/Pedram/Bixfee/my_telegram_bot/miniapp/index.html` را کپی کنید
   - در GitHub paste کنید و commit کنید

3. **فایل app.js را آپدیت کنید:**
   - فایل `app.js` را باز کنید
   - مطمئن شوید که خط 18 شامل `return 'http://194.116.236.44:5000/api';` است
   - اگر نیست، آن را آپدیت کنید

4. **فایل styles.css را بررسی کنید:**
   - مطمئن شوید که فایل `styles.css` موجود است
   - اگر نیست، فایل را از `/root/Pedram/Bixfee/my_telegram_bot/miniapp/styles.css` آپدیت کنید

### بررسی نهایی

بعد از آپدیت:
1. 2-3 دقیقه صبر کنید
2. به https://pedvali.github.io/bixfee-miniapp-/ بروید
3. باید صفحه مینی‌اپ با لوگوی چرخان نمایش داده شود
4. Console مرورگر را بررسی کنید (F12) برای خطاها

## نکته مهم

اگر هنوز مشکل دارید:
- مطمئن شوید که فایل `index.html` در root repository است (نه در پوشه)
- مطمئن شوید که فایل `app.js` و `styles.css` در همان سطح `index.html` هستند
