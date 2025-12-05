# 📤 آپلود فایل‌های مینی‌اپ به GitHub

## فایل‌های اصلی که باید آپلود شوند

این فایل‌ها را باید در **root** (ریشه) repository GitHub Pages خود آپلود کنید:

### ✅ فایل‌های ضروری:

1. **`index.html`** - فایل اصلی HTML
2. **`app.js`** - فایل JavaScript اصلی (به‌روزرسانی شده با پورت 2083)
3. **`styles.css`** - فایل CSS استایل‌ها

### 📁 دایرکتوری assets (اختیاری):

اگر لوگو دارید، یک دایرکتوری `assets` ایجاد کنید و لوگو را در آن قرار دهید:
- `assets/bixfee-logo.png`

اگر لوگو ندارید، مشکلی نیست - مینی‌اپ از fallback استفاده می‌کند.

---

## 📋 دستورات آپلود به GitHub

### روش 1: از طریق GitHub Web Interface

1. به repository خود بروید: `https://github.com/pedvali/bixfee-miniapp-`
2. روی **"Add file"** → **"Upload files"** کلیک کنید
3. فایل‌های زیر را بکشید و رها کنید:
   - `index.html`
   - `app.js`
   - `styles.css`
   - (اختیاری) `assets/bixfee-logo.png`
4. روی **"Commit changes"** کلیک کنید

### روش 2: از طریق Git Command Line

```bash
cd /root/Pedram/Bixfee/my_telegram_bot/miniapp

# کپی فایل‌های اصلی به یک دایرکتوری موقت
mkdir -p /tmp/bixfee_upload
cp index.html app.js styles.css /tmp/bixfee_upload/

# اگر لوگو دارید
mkdir -p /tmp/bixfee_upload/assets
cp assets/bixfee-logo.png /tmp/bixfee_upload/assets/ 2>/dev/null || echo "لوگو موجود نیست"

# سپس این فایل‌ها را به repository خود push کنید
cd /tmp/bixfee_upload
git init
git add .
git commit -m "Upload miniapp files"
git remote add origin https://github.com/pedvali/bixfee-miniapp-.git
git branch -M main
git push -u origin main
```

---

## ✅ بعد از آپلود

1. چند دقیقه صبر کنید تا GitHub Pages به‌روزرسانی شود
2. مینی‌اپ را تست کنید: `https://pedvali.github.io/bixfee-miniapp-/`
3. بررسی کنید که API به درستی کار می‌کند

---

## 🔗 URL های مهم

- **Frontend (GitHub Pages)**: `https://pedvali.github.io/bixfee-miniapp-/`
- **Backend API**: `https://194.116.236.44:2083/api`

---

## ⚠️ نکات مهم

1. ✅ فایل `app.js` به‌روزرسانی شده و از پورت 2083 استفاده می‌کند
2. ✅ فایل‌های راهنما (`.md`, `.txt`) را آپلود نکنید - فقط فایل‌های اصلی
3. ✅ اگر لوگو ندارید، مشکلی نیست - fallback نمایش داده می‌شود
