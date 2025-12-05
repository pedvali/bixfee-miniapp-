# 🚀 راهنمای سریع آپلود فایل‌های Frontend

Repository شما در GitHub ایجاد شده است: https://github.com/pedvali/bixfee-miniapp-

اما فایل‌های Frontend (index.html, styles.css, app.js) هنوز آپلود نشده‌اند!

## ⚡ روش سریع: استفاده از اسکریپت

### مرحله 1: اجرای اسکریپت

```powershell
cd F:\Bixfee\my_telegram_bot\my_telegram_bot\miniapp
.\upload_frontend.ps1
```

اسکریپت به صورت خودکار:
- Repository را Clone می‌کند
- فایل‌های Frontend را کپی می‌کند
- به Git اضافه می‌کند
- Commit می‌کند
- Push می‌کند (اگر شما تأیید کنید)

---

## 📤 روش دستی: آپلود از طریق GitHub Web

اگر Git نصب نیست یا نمی‌خواهید استفاده کنید:

### مرحله 1: رفتن به Repository

1. به https://github.com/pedvali/bixfee-miniapp- بروید
2. روی **"Add file"** → **"Upload files"** کلیک کنید

### مرحله 2: ایجاد پوشه miniapp

1. در بالای صفحه، در قسمت فایل‌ها، نام `miniapp/` را تایپ کنید
2. این یک پوشه جدید ایجاد می‌کند

### مرحله 3: آپلود فایل‌ها

فایل‌های زیر را از پوشه `F:\Bixfee\my_telegram_bot\my_telegram_bot\miniapp` آپلود کنید:

- `index.html`
- `styles.css`
- `app.js`

**نکته:** هر سه فایل را همزمان انتخاب کنید (Ctrl+Click)

### مرحله 4: Commit

1. در پایین صفحه، پیام Commit را بنویسید: `Add Mini App frontend files`
2. **Commit changes** را بزنید

---

## ⚙️ فعال‌سازی GitHub Pages

بعد از آپلود فایل‌ها:

### مرحله 1: رفتن به Settings

1. به Repository بروید
2. روی **Settings** کلیک کنید
3. در سمت چپ، **Pages** را انتخاب کنید

### مرحله 2: تنظیمات Pages

1. **Source**: Branch را `main` انتخاب کنید
2. **Folder**: `/miniapp` را انتخاب کنید (نه `/`)
3. **Save** کنید

### مرحله 3: دریافت URL

بعد از 2-5 دقیقه، URL شما:
```
https://pedvali.github.io/bixfee-miniapp-/
```

---

## 🔧 تنظیم URL در config.py

بعد از فعال‌سازی Pages، در `config.py`:

```python
MINI_APP_URL = "https://pedvali.github.io/bixfee-miniapp-/"
```

**⚠️ توجه:** URL باید با `/` ختم شود!

---

## ✅ چک‌لیست

- [ ] فایل‌های Frontend آپلود شدند
- [ ] GitHub Pages فعال است
- [ ] URL در `config.py` تنظیم شد
- [ ] ربات را تست کردم

---

## 🧪 تست

1. ربات را راه‌اندازی کنید
2. دستور `/start` را بزنید
3. دکمه "🌐 پنل وب" را ببینید
4. روی آن کلیک کنید
5. Mini App باید باز شود

---

**موفق باشید! 🚀**

