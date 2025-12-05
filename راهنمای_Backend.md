# 🔧 راهنمای راه‌اندازی Backend API

## ⚠️ مشکل فعلی

Mini App شما الان در **حالت نمایشی (Demo Mode)** کار می‌کند چون Backend API در دسترس نیست.

## ✅ راه‌حل: راه‌اندازی Backend API

### روش 1: اجرای محلی (برای تست)

```bash
cd F:\Bixfee\my_telegram_bot\my_telegram_bot
python miniapp_api.py
```

سپس در `app.js` خط 6 را تغییر دهید:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

### روش 2: آپلود روی VPS/Cloud

#### استفاده از Railway (رایگان برای شروع):

1. به https://railway.app بروید
2. New Project → Deploy from GitHub
3. Repository خود را انتخاب کنید
4. فایل `miniapp_api.py` را Deploy کنید
5. URL دریافت کنید (مثلاً: `https://your-app.railway.app`)
6. در `app.js` خط 6 را تغییر دهید:
```javascript
const API_BASE = 'https://your-app.railway.app/api';
```

#### استفاده از Render (رایگان):

1. به https://render.com بروید
2. New → Web Service
3. Repository خود را Connect کنید
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python miniapp_api.py`
6. URL دریافت کنید

#### استفاده از VPS (پیشنهادی):

```bash
# نصب Gunicorn
pip install gunicorn

# اجرای Backend
gunicorn -w 4 -b 0.0.0.0:5000 miniapp_api:app
```

---

## 📝 تنظیمات app.js

بعد از راه‌اندازی Backend، در `app.js` خط 5-7 را تغییر دهید:

```javascript
const API_BASE = window.location.origin.includes('github.io') 
    ? 'https://your-backend-api.com/api'  // ← URL Backend خود را اینجا بگذارید
    : '/api';
```

**مثال:**
```javascript
const API_BASE = 'https://bixfee-api.railway.app/api';
```

---

## 🔐 نیازمندی‌های Backend

Backend API نیاز به:
- دسترسی به دیتابیس (`bixfee.db`)
- `TELEGRAM_TOKEN` از `config.py`
- پورت 5000 (یا هر پورت دیگری)

---

## ✅ بعد از راه‌اندازی

1. Backend API را راه‌اندازی کنید
2. URL را در `app.js` تنظیم کنید
3. فایل `app.js` را در GitHub آپدیت کنید
4. Mini App را تست کنید

---

**موفق باشید! 🚀**

