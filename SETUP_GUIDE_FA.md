# 🚀 راهنمای کامل راه‌اندازی Mini App - فارسی

این راهنما به شما کمک می‌کند تا Mini App را به GitHub آپلود کنید.

## 📋 پیش‌نیازها

### 1. نصب Git

اگر Git نصب نیست:
1. به https://git-scm.com/download/win بروید
2. Git را دانلود و نصب کنید
3. در طول نصب، گزینه "Add Git to PATH" را انتخاب کنید

### 2. حساب GitHub

اگر حساب GitHub ندارید:
1. به https://github.com/signup بروید
2. یک حساب رایگان بسازید

---

## 🎯 روش 1: استفاده از اسکریپت خودکار (پیشنهادی)

### مرحله 1: اجرای اسکریپت

```powershell
cd F:\Bixfee\my_telegram_bot\my_telegram_bot\miniapp
.\deploy_to_github.ps1
```

### مرحله 2: وارد کردن اطلاعات

اسکریپت از شما می‌پرسد:
- نام کاربری GitHub
- نام Repository (مثلاً: `bixfee-miniapp`)

### مرحله 3: ایجاد Repository در GitHub

اگر Repository وجود ندارد:
1. به https://github.com/new بروید
2. Repository name: `bixfee-miniapp` (یا نامی که انتخاب کردید)
3. Public یا Private را انتخاب کنید
4. **Create repository** را بزنید
5. **توجه:** دستورات README را اجرا نکنید! فقط Repository را بسازید

### مرحله 4: Push کردن

بعد از ایجاد Repository، اسکریپت فایل‌ها را Push می‌کند.

---

## 🎯 روش 2: آپلود دستی (بدون Git)

اگر Git نمی‌خواهید نصب کنید:

### مرحله 1: ایجاد Repository

1. به https://github.com/new بروید
2. Repository name: `bixfee-miniapp`
3. Public را انتخاب کنید
4. **Create repository** را بزنید

### مرحله 2: آپلود فایل‌ها

1. به Repository خود بروید
2. روی **"uploading an existing file"** کلیک کنید
3. فایل‌های زیر را از پوشه `miniapp` آپلود کنید:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `requirements.txt`
4. Commit changes را بزنید

### مرحله 3: فعال‌سازی GitHub Pages

1. Settings → Pages
2. Source: Branch را `main` انتخاب کنید
3. Folder: `/ (root)` را انتخاب کنید
4. Save کنید

---

## 🎯 روش 3: استفاده از GitHub Desktop

### مرحله 1: نصب GitHub Desktop

1. به https://desktop.github.com بروید
2. GitHub Desktop را دانلود و نصب کنید

### مرحله 2: Clone Repository

1. Repository را در GitHub بسازید
2. در GitHub Desktop: File → Clone Repository
3. Repository خود را انتخاب کنید
4. Local path: `F:\Bixfee\bixfee-miniapp`

### مرحله 3: کپی فایل‌ها

1. فایل‌های `miniapp` را به پوشه `bixfee-miniapp` کپی کنید
2. در GitHub Desktop: Commit & Push

### مرحله 4: فعال‌سازی Pages

همانند روش 2، GitHub Pages را فعال کنید.

---

## ⚙️ تنظیمات بعد از آپلود

### 1. دریافت URL

بعد از فعال‌سازی GitHub Pages، URL شما:
```
https://your-username.github.io/bixfee-miniapp/miniapp/
```

### 2. تنظیم URL در config.py

فایل `config.py` را باز کنید و این خط را پیدا کنید:

```python
MINI_APP_URL = "https://your-domain.com/miniapp"
```

آن را به این تغییر دهید:

```python
MINI_APP_URL = "https://your-username.github.io/bixfee-miniapp/miniapp/"
```

**مثال:**
```python
MINI_APP_URL = "https://john-doe.github.io/bixfee-miniapp/miniapp/"
```

### 3. تست

1. ربات را راه‌اندازی کنید
2. دستور `/start` را بزنید
3. دکمه "🌐 پنل وب" را ببینید
4. روی آن کلیک کنید
5. Mini App باید باز شود

---

## 🔍 عیب‌یابی

### مشکل: Mini App باز نمی‌شود

**راه‌حل:**
- بررسی کنید که URL در `config.py` صحیح باشد
- بررسی کنید که URL با `/` ختم شود
- چند دقیقه صبر کنید (GitHub Pages ممکن است چند دقیقه طول بکشد)

### مشکل: خطای 404

**راه‌حل:**
- بررسی کنید که فایل‌ها در پوشه `miniapp` در Repository هستند
- بررسی کنید که GitHub Pages فعال است
- URL را بررسی کنید

### مشکل: خطای احراز هویت

**راه‌حل:**
- بررسی کنید که Backend API در حال اجرا است
- بررسی کنید که `TELEGRAM_TOKEN` در `config.py` صحیح است

---

## 📝 نکات مهم

1. **HTTPS ضروری است:** GitHub Pages خودکار HTTPS دارد
2. **URL صحیح:** URL باید با `/` ختم شود
3. **صبر کنید:** بعد از فعال‌سازی Pages، 2-5 دقیقه صبر کنید
4. **Backend:** برای استفاده کامل، Backend API باید در دسترس باشد

---

## ✅ چک‌لیست

- [ ] Git نصب است
- [ ] حساب GitHub دارم
- [ ] Repository ایجاد شد
- [ ] فایل‌ها آپلود شدند
- [ ] GitHub Pages فعال است
- [ ] URL در `config.py` تنظیم شد
- [ ] ربات را تست کردم

---

## 🎉 آماده است!

اگر همه مراحل را انجام دادید، Mini App شما آماده استفاده است!

---

**موفق باشید! 🚀**

