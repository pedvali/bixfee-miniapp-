# 📤 راهنمای آپلود فایل‌ها به GitHub

## ✅ فایل‌های مورد نیاز برای GitHub Pages

فقط فایل‌های زیر را باید در GitHub آپلود کنید:

### 📁 فایل‌های اصلی (ضروری)

```
miniapp/
├── index.html          ✅ آپلود کنید
├── app.js              ✅ آپلود کنید
└── styles.css          ✅ آپلود کنید
```

### 📄 فایل‌های راهنما (اختیاری - اما پیشنهاد می‌شود)

```
miniapp/
├── README.md           ✅ پیشنهاد می‌شود
└── راهنمای_Backend.md  ✅ پیشنهاد می‌شود
```

---

## ❌ فایل‌هایی که نباید آپلود کنید

### 🚫 فایل‌های حساس (ممنوع)

```
my_telegram_bot/
├── config.py           ❌ هرگز آپلود نکنید (شامل توکن‌ها است)
├── database.py         ❌ نیازی نیست
├── bot.py              ❌ نیازی نیست
├── miniapp_api.py      ❌ نیازی نیست (فقط Backend)
└── *.log               ❌ نیازی نیست
```

### 🚫 فایل‌های موقت

```
miniapp/
├── *.ps1               ❌ نیازی نیست (اسکریپت‌های PowerShell)
├── *.bat                ❌ نیازی نیست (فایل‌های Batch)
├── requirements.txt    ❌ نیازی نیست (برای Backend است)
└── deploy_to_github.ps1 ❌ نیازی نیست
```

---

## 📋 دستورالعمل آپلود

### روش 1: استفاده از GitHub Desktop یا Git CLI

```bash
# 1. به پوشه miniapp بروید
cd F:\Bixfee\my_telegram_bot\my_telegram_bot\miniapp

# 2. فایل‌های مورد نیاز را Add کنید
git add index.html app.js styles.css README.md

# 3. Commit کنید
git commit -m "Add Mini App files"

# 4. Push کنید
git push origin main
```

### روش 2: استفاده از GitHub Web Interface

1. به Repository خود بروید: `https://github.com/pedvali/telegram-miniapp`
2. روی **Add file** → **Upload files** کلیک کنید
3. فایل‌های زیر را Drag & Drop کنید:
   - `index.html`
   - `app.js`
   - `styles.css`
4. روی **Commit changes** کلیک کنید

---

## 📂 ساختار نهایی Repository

بعد از آپلود، ساختار Repository شما باید به این صورت باشد:

```
telegram-miniapp/
├── index.html          ✅
├── app.js              ✅
├── styles.css          ✅
└── README.md           ✅ (اختیاری)
```

---

## ⚠️ نکات مهم

1. **هرگز `config.py` را آپلود نکنید** - این فایل شامل توکن‌های حساس است
2. **فقط فایل‌های Frontend را آپلود کنید** - Backend API (`miniapp_api.py`) روی سرور جداگانه اجرا می‌شود
3. **بعد از آپلود، GitHub Pages را فعال کنید:**
   - Settings → Pages
   - Source: `main` branch
   - Folder: `/ (root)`
   - Save

---

## ✅ بررسی بعد از آپلود

بعد از آپلود، بررسی کنید که:
- ✅ URL مینی اپ کار می‌کند: `https://pedvali.github.io/telegram-miniapp/`
- ✅ فایل‌های HTML, CSS, JS قابل دسترسی هستند
- ✅ هیچ فایل حساسی آپلود نشده است

---

**موفق باشید! 🚀**

