# 🚀 راهنمای کامل راه‌اندازی Backend API

## ⚠️ وضعیت فعلی

مینی اپ شما الان در **حالت نمایشی (Demo Mode)** است چون Backend API راه‌اندازی نشده است.

## ✅ برای خروج از Demo Mode و استفاده کامل

باید Backend API را راه‌اندازی کنید. این راهنما به شما کمک می‌کند.

---

## 📋 روش 1: اجرای محلی (برای تست)

### گام 1: نصب Flask

```bash
cd F:\Bixfee\my_telegram_bot\my_telegram_bot
pip install Flask flask-cors
```

### گام 2: اجرای سرور Flask

```bash
python miniapp_api.py
```

باید پیام زیر را ببینید:
```
 * Running on http://0.0.0.0:5000
```

### گام 3: تنظیم URL در app.js

فایل `app.js` را باز کنید و خط 32 را تغییر دهید:

```javascript
// به جای:
return null; // null = استفاده از Demo Mode

// این را بنویسید:
return 'http://localhost:5000/api';
```

### گام 4: تست

1. مینی اپ را در تلگرام باز کنید
2. باید به Backend متصل شود ✅

---

## 🌐 روش 2: راه‌اندازی روی VPS/Cloud (Production)

### گزینه A: استفاده از Railway (رایگان برای شروع)

#### مرحله 1: ایجاد حساب
1. به https://railway.app بروید
2. با GitHub حساب خود وارد شوید

#### مرحله 2: Deploy کردن
1. **New Project** → **Deploy from GitHub**
2. Repository خود را انتخاب کنید
3. Railway خودکار `miniapp_api.py` را پیدا می‌کند
4. روی **Deploy** کلیک کنید

#### مرحله 3: دریافت URL
1. بعد از Deploy، یک URL دریافت می‌کنید (مثلاً: `https://bixfee-api.railway.app`)
2. این URL را کپی کنید

#### مرحله 4: تنظیم در app.js
فایل `app.js` را باز کنید و خط 32 را تغییر دهید:

```javascript
// به جای:
return null;

// این را بنویسید (URL خود را جایگزین کنید):
return 'https://bixfee-api.railway.app/api';
```

---

### گزینه B: استفاده از Render (رایگان)

#### مرحله 1: ایجاد حساب
1. به https://render.com بروید
2. با GitHub حساب خود وارد شوید

#### مرحله 2: Deploy کردن
1. **New** → **Web Service**
2. Repository خود را Connect کنید
3. تنظیمات:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python miniapp_api.py`
   - **Environment**: `Python 3`

#### مرحله 3: دریافت URL
1. بعد از Deploy، یک URL دریافت می‌کنید (مثلاً: `https://bixfee-api.onrender.com`)
2. این URL را کپی کنید

#### مرحله 4: تنظیم در app.js
```javascript
return 'https://bixfee-api.onrender.com/api';
```

---

### گزینه C: استفاده از VPS (پیشنهادی برای Production)

#### مرحله 1: نصب Gunicorn
```bash
pip install gunicorn
```

#### مرحله 2: اجرای Backend
```bash
cd F:\Bixfee\my_telegram_bot\my_telegram_bot
gunicorn -w 4 -b 0.0.0.0:5000 miniapp_api:app
```

#### مرحله 3: استفاده از systemd (برای اجرای دائمی)

فایل `/etc/systemd/system/bixfee-miniapp.service` ایجاد کنید:

```ini
[Unit]
Description=Bixfee Mini App API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/my_telegram_bot/my_telegram_bot
ExecStart=/usr/bin/python3 /path/to/my_telegram_bot/my_telegram_bot/miniapp_api.py
Restart=always

[Install]
WantedBy=multi-user.target
```

سپس:
```bash
sudo systemctl enable bixfee-miniapp
sudo systemctl start bixfee-miniapp
```

#### مرحله 4: تنظیم Nginx (اختیاری)

فایل `/etc/nginx/sites-available/bixfee-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📝 تنظیمات app.js

بعد از راه‌اندازی Backend، در `app.js` خط 14-32 را تغییر دهید:

```javascript
// اگر در GitHub Pages هستیم
if (window.location.origin.includes('github.io')) {
    // ⚠️ URL Backend API خود را اینجا قرار دهید
    return 'https://your-backend-api.com/api';  // ← URL خود را بگذارید
}
```

**مثال‌ها:**
- Railway: `return 'https://bixfee-api.railway.app/api';`
- Render: `return 'https://bixfee-api.onrender.com/api';`
- VPS: `return 'https://api.yourdomain.com/api';`

---

## ✅ بررسی اتصال

بعد از تنظیم URL، بررسی کنید:

1. **Console مرورگر** (F12) را باز کنید
2. باید پیام زیر را ببینید:
   ```
   🔗 در حال اتصال به Backend API: https://your-api.com/api/auth
   ```
3. اگر خطا داد، URL را بررسی کنید

---

## 🔧 عیب‌یابی

### مشکل: "Backend API در دسترس نیست"

**راه حل:**
1. بررسی کنید که سرور Flask در حال اجرا است
2. URL را در مرورگر تست کنید: `https://your-api.com/api/auth`
3. باید JSON پاسخ بدهد

### مشکل: "CORS Error"

**راه حل:**
در `miniapp_api.py` باید این خط باشد:
```python
from flask_cors import CORS
CORS(app)
```

### مشکل: "404 Not Found"

**راه حل:**
1. بررسی کنید که URL درست است
2. مطمئن شوید که `/api` در انتهای URL است
3. بررسی کنید که سرور Flask در حال اجرا است

---

## 📌 نکات مهم

1. **هرگز `config.py` را در GitHub آپلود نکنید** - شامل توکن‌های حساس است
2. **Backend API باید همیشه در حال اجرا باشد** - اگر متوقف شود، مینی اپ به Demo Mode برمی‌گردد
3. **برای Production از Gunicorn استفاده کنید** - Flask development server برای Production مناسب نیست

---

## 🎯 خلاصه مراحل

1. ✅ Backend API را راه‌اندازی کنید (Railway/Render/VPS)
2. ✅ URL را دریافت کنید
3. ✅ در `app.js` خط 32 را تغییر دهید
4. ✅ فایل `app.js` را به GitHub آپلود کنید
5. ✅ مینی اپ را تست کنید

---

**موفق باشید! 🚀**

بعد از راه‌اندازی Backend، مینی اپ شما از Demo Mode خارج می‌شود و تمام قابلیت‌ها فعال می‌شوند.

