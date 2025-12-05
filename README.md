# Mini App راهنمای راه‌اندازی

این راهنما برای راه‌اندازی Mini App ربات Bixfee است.

## 📋 نیازمندی‌ها

1. Python 3.8+
2. Flask
3. Flask-CORS
4. دسترسی به دیتابیس ربات

## 🚀 راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
pip install flask flask-cors
```

### 2. تنظیمات

در فایل `config.py` آدرس Mini App را تنظیم کنید:

```python
MINI_APP_URL = "https://your-domain.com/miniapp"
```

### 3. اجرای سرور

```bash
cd my_telegram_bot/my_telegram_bot
python miniapp_api.py
```

سرور روی پورت 5000 اجرا می‌شود.

## 📱 استفاده از GitHub Pages

### 1. ایجاد Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bixfee-miniapp.git
git push -u origin main
```

### 2. فعال‌سازی GitHub Pages

1. به تنظیمات Repository بروید
2. در بخش Pages، branch `main` و folder `/` را انتخاب کنید
3. Save کنید

### 3. آپدیت URL در BotFather

1. به BotFather بروید
2. `/setmenubutton` را بزنید
3. ربات خود را انتخاب کنید
4. Add button
5. نام: "🌐 پنل وب" یا "Web Panel"
6. URL: `https://your-username.github.io/bixfee-miniapp/miniapp/`

یا در `config.py` آدرس را تنظیم کنید:

```python
MINI_APP_URL = "https://your-username.github.io/bixfee-miniapp/miniapp/"
```

## 🔧 تنظیمات Backend

برای استفاده از Backend API، باید سرور Flask را روی یک سرور VPS یا Cloud اجرا کنید و URL را به Mini App Frontend متصل کنید.

### استفاده از VPS

1. فایل‌های Mini App را روی VPS آپلود کنید
2. سرور Flask را اجرا کنید (می‌توانید از systemd یا supervisor استفاده کنید)
3. از Nginx برای reverse proxy استفاده کنید

### استفاده از Cloud (Heroku, Railway, etc.)

1. فایل `Procfile` ایجاد کنید:
```
web: python miniapp_api.py
```

2. آپلود کنید و URL را تنظیم کنید

## 📝 ساختار فایل‌ها

```
miniapp/
├── index.html      # صفحه اصلی Mini App
├── styles.css      # استایل‌ها
├── app.js          # منطق JavaScript
└── README.md       # این فایل

miniapp_api.py      # Backend API (Flask)
```

## 🌐 قابلیت‌ها

- ✅ پنل کاربری کامل
- ✅ نمایش قیمت‌های لحظه‌ای
- ✅ دسترسی به بازار فارکس
- ✅ تبدیل تتر به ووچر و برعکس
- ✅ خرید ویزا کارت مجازی
- ✅ خرید گیفت کارت
- ✅ همکاری در فروش
- ✅ تغییر زبان (فارسی/انگلیسی)
- ✅ UI/UX زیبا و کاربرپسند

## 🔐 امنیت

- تأیید `initData` تلگرام برای احراز هویت
- استفاده از HTTPS برای اتصال امن
- اعتبارسنجی درخواست‌ها در Backend

## 📞 پشتیبانی

در صورت مشکل، با پشتیبانی ربات تماس بگیرید.

