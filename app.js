// Mini App JavaScript - Bixfee
// Backend API URL - باید Backend API شما در حال اجرا باشد
// برای تست محلی: 'http://localhost:5000/api'
// برای Production: 'https://your-domain.com/api' یا URL سرور شما

// تعیین URL API بر اساس محیط
function getApiBase() {
    // اگر در محیط تلگرام هستیم و از localhost استفاده می‌کنیم
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    
    // اگر در GitHub Pages هستیم
    if (window.location.origin.includes('github.io')) {
        // Backend API URL - استفاده از HTTPS برای حل مشکل Mixed Content
        // nginx با SSL روی پورت 2083 راه‌اندازی شده است
        return 'https://194.116.236.44:2083/api';
    }
    
    // برای Production - از همان origin استفاده کن
    // اگر Backend API روی همان سرور است از '/api' استفاده کن
    // این کار باعث می‌شود که با دامنه bixfee.com به صورت خودکار کار کند
    const origin = window.location.origin;
    
    // اگر Backend API روی همان سرور است (بیشترین حالت)
    // این کار با دامنه bixfee.com و IP 194.116.236.44 کار می‌کند
    return `${origin}/api`;
}

const API_BASE = getApiBase();

// اگر API_BASE null باشد، از Demo Mode استفاده می‌شود
if (API_BASE === null) {
    console.warn('⚠️ Backend API URL تنظیم نشده است. در حال استفاده از حالت نمایشی (Demo Mode).');
    console.info('📖 برای راه‌اندازی Backend API، فایل راهنمای_Backend.md را مطالعه کنید.');
}
let currentUser = null;
let currentLanguage = 'fa';
let tg = null;
let isInitializing = false; // Flag to prevent multiple initializations

// Translations
const translations = {
    fa: {
        nav: {
            dashboard: 'داشبورد',
            prices: 'قیمت‌ها',
            trading: 'معاملات',
            profile: 'پروفایل'
        },
        dashboard: {
            balance: 'موجودی کیف پول',
            charge: 'شارژ',
            withdraw: 'برداشت',
            quick_actions: 'دسترسی سریع',
            forex: 'بازار فارکس',
            convert: 'تبدیل ارز',
            visa: 'ویزا کارت',
            gift: 'گیفت کارت',
            referral: 'همکاری',
            support: 'پشتیبانی',
            recent_transactions: 'تراکنش‌های اخیر',
            view_all: 'مشاهده همه'
        },
        prices: {
            live_rates: 'قیمت‌های لحظه‌ای'
        },
        trading: {
            buy: 'خرید',
            sell: 'فروش'
        },
        profile: {
            user_info: 'اطلاعات کاربری',
            level: 'سطح',
            xp: 'امتیاز',
            transactions: 'تراکنش‌ها',
            volume: 'حجم معاملات',
            settings: 'تنظیمات',
            language: 'زبان',
            security: 'امنیت'
        },
        forex: {
            title: 'بازار فارکس'
        },
        convert: {
            title: 'تبدیل ارز',
            usdt_to_voucher: 'تتر به ووچر',
            voucher_to_usdt: 'ووچر به تتر'
        },
        referral: {
            title: 'همکاری در فروش',
            link: 'لینک معرفی شما',
            copy: 'کپی',
            referrals: 'معرفی‌ها',
            commission: 'کمیسیون'
        },
        messages: {
            loading: 'در حال بارگذاری...',
            error: 'خطا در بارگذاری',
            success: 'موفق',
            copied: 'کپی شد'
        }
    },
    en: {
        nav: {
            dashboard: 'Dashboard',
            prices: 'Prices',
            trading: 'Trading',
            profile: 'Profile'
        },
        dashboard: {
            balance: 'Wallet Balance',
            charge: 'Charge',
            withdraw: 'Withdraw',
            quick_actions: 'Quick Actions',
            forex: 'Forex Market',
            convert: 'Convert',
            visa: 'Visa Card',
            gift: 'Gift Card',
            referral: 'Referral',
            support: 'Support',
            recent_transactions: 'Recent Transactions',
            view_all: 'View All'
        },
        prices: {
            live_rates: 'Live Rates'
        },
        trading: {
            buy: 'Buy',
            sell: 'Sell'
        },
        profile: {
            user_info: 'User Information',
            level: 'Level',
            xp: 'XP',
            transactions: 'Transactions',
            volume: 'Volume',
            settings: 'Settings',
            language: 'Language',
            security: 'Security'
        },
        forex: {
            title: 'Forex Market'
        },
        convert: {
            title: 'Currency Convert',
            usdt_to_voucher: 'USDT to Voucher',
            voucher_to_usdt: 'Voucher to USDT'
        },
        referral: {
            title: 'Referral Program',
            link: 'Your Referral Link',
            copy: 'Copy',
            referrals: 'Referrals',
            commission: 'Commission'
        },
        messages: {
            loading: 'Loading...',
            error: 'Error loading',
            success: 'Success',
            copied: 'Copied'
        }
    }
};

// Initialize Telegram Web App
function initTelegramWebApp() {
    // Wait for Telegram Web App SDK to load
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        
        // Call ready() first - this is required by Telegram WebApp SDK
        tg.ready();
        
        // Expand the WebApp to full height (recommended for better UX)
        if (!tg.isExpanded) {
            tg.expand();
        }
        
        // Set theme colors (according to latest Telegram WebApp documentation)
        tg.setHeaderColor('#6366f1');
        tg.setBackgroundColor('#f8fafc');
        
        // Enable closing confirmation (optional but recommended)
        tg.enableClosingConfirmation();
        
        // Return initData if available (for server-side validation)
        if (tg.initData && tg.initData.length > 0) {
            console.log('✅ initData دریافت شد');
            return tg.initData;
        }
        
        // If initData not available but we have initDataUnsafe, that's okay for demo mode
        // Note: initDataUnsafe is not validated and should only be used for demo/testing
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            console.log('📱 initDataUnsafe موجود است - استفاده از حالت نمایشی');
            return 'demo'; // Special marker for demo mode
        }
        
        // If we have version, we're definitely in Telegram but initData might load later
        if (tg.version) {
            console.log('📱 در محیط Telegram هستیم اما initData هنوز آماده نیست');
            return 'telegram'; // We're in Telegram but no initData yet
        }
        
        // If SDK is loaded but no data at all
        console.warn('⚠️ SDK لود شده اما initData یا initDataUnsafe موجود نیست');
        return '';
    }
    
    // If SDK not loaded yet, wait a bit and try again
    if (typeof window.Telegram === 'undefined') {
        // SDK might still be loading
        return null;
    }
    
    return null;
}

// Initialize App
async function initApp() {
    // Prevent multiple simultaneous initializations
    if (isInitializing) {
        console.log('⏸️ در حال اجرای initialization قبلی...');
        return;
    }
    
    isInitializing = true;
    
    try {
        // Wait for Telegram SDK to load (max 5 seconds)
        let initData = null;
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds (50 * 100ms)
        
        // Check for debug/dev mode (allow browser access for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const isDebugMode = urlParams.get('debug') === 'true' || urlParams.get('dev') === 'true' || 
                           localStorage.getItem('miniapp_debug') === 'true';
        
        // Check if we're in Telegram environment - use multiple methods for better detection
        // First check if Telegram WebApp SDK is available (most reliable method)
        const hasTelegramSDK = typeof window.Telegram !== 'undefined' && window.Telegram.WebApp;
        
        // Fallback checks for cases where SDK might not be loaded yet
        const hasTelegramUserAgent = window.navigator.userAgent.includes('Telegram') || 
                                     window.navigator.userAgent.includes('TelegramWebApp');
        const hasTelegramParams = window.location.search.includes('tgWebApp') ||
                                  window.location.search.includes('tgWebAppStartParam');
        const hasTelegramReferrer = document.referrer.includes('telegram') ||
                                    document.referrer.includes('t.me');
        
        // Consider it Telegram if SDK is available OR if we have multiple indicators
        const isTelegram = hasTelegramSDK || (hasTelegramUserAgent && (hasTelegramParams || hasTelegramReferrer));
        
        // If we don't have SDK yet but indicators suggest Telegram, wait a bit more
        if (!hasTelegramSDK && (hasTelegramUserAgent || hasTelegramParams || hasTelegramReferrer)) {
            // Wait a bit more for SDK to load (especially on mobile - can be slower)
            let sdkWaitAttempts = 0;
            const maxSdkWaitAttempts = 50; // 5 seconds (increased for mobile)
            
            while (sdkWaitAttempts < maxSdkWaitAttempts) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
                    break; // SDK loaded
                }
                sdkWaitAttempts++;
            }
        }
        
        // Final check - if still no SDK and no clear indicators
        const finalHasSDK = typeof window.Telegram !== 'undefined' && window.Telegram.WebApp;
        const finalIsTelegram = finalHasSDK || (hasTelegramUserAgent && (hasTelegramParams || hasTelegramReferrer));
        
        // Allow debug mode or Telegram access
        if (!finalIsTelegram && !isDebugMode) {
            // Not in Telegram and not in debug mode - show friendly message
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.textContent = '⚠️ این Mini App فقط از طریق Telegram قابل استفاده است';
            }
            showError('⚠️ این Mini App فقط از طریق Telegram قابل استفاده است\n\n📱 لطفاً از ربات تلگرام استفاده کنید:\n1. ربات را باز کنید\n2. دستور /start را بزنید\n3. روی دکمه "🌐 پنل وب" کلیک کنید\n\n💡 برای تست: URL را با ?debug=true باز کنید');
            
            // Hide loading and show app with error message
            setTimeout(() => {
                // Hide splash and loading
                const splashScreen = document.getElementById('splash-screen');
                if (splashScreen) {
                    splashScreen.style.display = 'none';
                }
                document.getElementById('loading').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                document.getElementById('app').innerHTML = `
                    <div style="padding: 20px; text-align: center; direction: rtl;">
                        <h2 style="color: #6366f1; margin-bottom: 20px;">⚠️ دسترسی محدود</h2>
                        <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">
                            این Mini App فقط از طریق Telegram قابل استفاده است.
                        </p>
                        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">
                            لطفاً از ربات تلگرام استفاده کنید.
                        </p>
                        <p style="font-size: 12px; color: #cbd5e1; padding: 15px; background: #f1f5f9; border-radius: 8px; margin-top: 20px;">
                            💡 برای تست در مرورگر: URL را با <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">?debug=true</code> باز کنید
                        </p>
                    </div>
                `;
            }, 2000);
            return;
        }
        
        // If in debug mode, create a mock Telegram object
        if (isDebugMode && !finalHasSDK) {
            console.warn('🔧 Debug Mode فعال - استفاده از داده‌های نمایشی');
            const mockWebApp = {
                ready: () => {},
                expand: () => {},
                setHeaderColor: () => {},
                setBackgroundColor: () => {},
                enableClosingConfirmation: () => {},
                initData: '',
                initDataUnsafe: {
                    user: {
                        id: 123456789,
                        first_name: 'تست',
                        last_name: 'کاربر',
                        username: 'test_user',
                        language_code: 'fa'
                    }
                },
                version: '6.0',
                isExpanded: true
            };
            window.Telegram = { WebApp: mockWebApp };
            tg = mockWebApp; // Set tg directly for immediate use
            // Set debug flag in localStorage for future visits
            localStorage.setItem('miniapp_debug', 'true');
            // In debug mode, use demo initData directly
            initData = 'demo';
        }
        
        // We're in Telegram - wait for SDK to load (skip if already set in debug mode)
        if (!initData) {
            while (!initData && attempts < maxAttempts) {
                initData = initTelegramWebApp();
                if (!initData) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                } else {
                    break;
                }
            }
        }
        
        // If still no initData but we're in Telegram
        if (!initData && finalIsTelegram) {
            // SDK might be loading slowly
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.textContent = 'در حال بارگذاری...';
            }
            
            // Try one more time after 2 seconds
            setTimeout(async () => {
                initData = initTelegramWebApp();
                if (initData) {
                    initApp(); // Retry initialization
                } else {
                    showError('خطا در بارگذاری Telegram Web App SDK\nلطفاً صفحه را رفرش کنید.');
                    const loadingText = document.getElementById('loading-text');
                    if (loadingText) {
                        loadingText.textContent = 'خطا در بارگذاری - لطفاً رفرش کنید';
                    }
                }
            }, 2000);
            return;
        }
        
        // If we have initData, continue with authentication
        // Note: initData can be actual initData string, 'demo', or 'telegram'
        // If initData is empty or null, try to use initDataUnsafe
        if (!initData || initData === '') {
            // Last attempt: check if we have initDataUnsafe
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                console.info('📱 استفاده از initDataUnsafe به عنوان fallback');
                initData = 'demo';
            } else {
                showError('خطا در دریافت اطلاعات Telegram Web App\nلطفاً صفحه را رفرش کنید.');
                // Hide splash and loading
                const splashScreen = document.getElementById('splash-screen');
                if (splashScreen) {
                    splashScreen.style.display = 'none';
                }
                document.getElementById('loading').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                document.getElementById('app').innerHTML = `
                    <div style="padding: 20px; text-align: center; direction: rtl;">
                        <h2 style="color: #ef4444; margin-bottom: 20px;">❌ خطا در دریافت اطلاعات</h2>
                        <p style="font-size: 16px; color: #64748b; margin-bottom: 15px;">
                            نتوانستیم اطلاعات Telegram Web App را دریافت کنیم.
                        </p>
                        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">
                            لطفاً صفحه را رفرش کنید یا از طریق ربات تلگرام دوباره تلاش کنید.
                        </p>
                        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            🔄 رفرش صفحه
                        </button>
                    </div>
                `;
                return;
            }
        }
        
        // If initData is 'telegram' or empty string, we're in Telegram but no initData yet
        // Try to use initDataUnsafe as fallback
        if (initData === 'telegram' || initData === '') {
            // Check if we have initDataUnsafe - use it as fallback
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                console.info('📱 initData در دسترس نیست، استفاده از initDataUnsafe');
                initData = 'demo';
                // Continue to demo mode below
            } else {
                // Wait a bit more for initData to be available
                console.info('⏳ در انتظار دریافت initData...');
                setTimeout(async () => {
                    const retryInitData = initTelegramWebApp();
                    if (retryInitData && retryInitData !== 'telegram' && retryInitData !== '') {
                        // We got real initData now, restart initialization
                        initApp();
                    } else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                        // Use unsafe data as fallback
                        initData = 'demo';
                        initApp();
                    } else {
                        // Still no data - show error but allow demo mode
                        console.warn('⚠️ initData دریافت نشد، استفاده از حالت نمایشی');
                        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                            initData = 'demo';
                            initApp();
                        } else {
                            showError('خطا در دریافت اطلاعات Telegram Web App\nدر حال استفاده از حالت نمایشی...');
                            setTimeout(() => {
                                if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                                    initData = 'demo';
                                    initApp();
                                }
                            }, 2000);
                        }
                    }
                }, 2000);
                return;
            }
        }
        
        // If initData is 'demo', use demo mode directly
        if (initData === 'demo' && tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            console.log('Using demo mode - Backend API not configured');
            currentUser = {
                id: tg.initDataUnsafe.user.id || 0,
                first_name: tg.initDataUnsafe.user.first_name || 'کاربر',
                last_name: tg.initDataUnsafe.user.last_name || '',
                username: tg.initDataUnsafe.user.username || '',
                language: 'fa'
            };
            currentLanguage = 'fa';
            
            updateUI();
            loadDashboardDemo();
            loadHomeData();
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            
            // Show info message (only once, not annoying)
            // setTimeout(() => {
            //     showToast('⚠️ حالت نمایشی فعال است - Backend API را تنظیم کنید');
            // }, 1000);
            return;
        }
        
        // Authenticate with backend
        // اگر API_BASE null باشد، مستقیماً به Demo Mode برو
        if (!API_BASE) {
            console.info('📱 Backend API تنظیم نشده - استفاده از حالت نمایشی');
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                currentUser = {
                    id: tg.initDataUnsafe.user.id || 0,
                    first_name: tg.initDataUnsafe.user.first_name || 'کاربر',
                    last_name: tg.initDataUnsafe.user.last_name || '',
                    username: tg.initDataUnsafe.user.username || '',
                    language: 'fa'
                };
                currentLanguage = 'fa';
                
                updateUI();
                loadDashboardDemo();
                loadHomeData();
                
                // Hide splash and loading
                const splashScreen = document.getElementById('splash-screen');
                if (splashScreen) {
                    splashScreen.style.display = 'none';
                }
                document.getElementById('loading').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                
                setTimeout(() => {
                    showToast('⚠️ حالت نمایشی - برای استفاده کامل Backend API را راه‌اندازی کنید');
                }, 1000);
            }
            return;
        }
        
        try {
            console.log('🔗 در حال اتصال به Backend API:', `${API_BASE}/auth`);
            
            // Create timeout controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
            
            const authResponse = await fetch(`${API_BASE}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ initData }),
                signal: controller.signal,
                mode: 'cors',  // Explicitly set CORS mode
                credentials: 'omit'  // Don't send credentials for CORS
            });
            
            clearTimeout(timeoutId);
            
            if (!authResponse.ok) {
                // If 404 or network error, try demo mode
                if (authResponse.status === 404 || authResponse.status === 0) {
                    throw new Error('Backend not available');
                }
                const errorText = await authResponse.text();
                console.error('API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${authResponse.status}, message: ${errorText}`);
            }
            
            const authData = await authResponse.json();
            
            if (!authData.success) {
                showError(authData.error || 'Authentication failed');
                return;
            }
            
            // Authentication successful
            currentUser = authData.user;
            currentLanguage = currentUser.language || 'fa';
            
            // Update UI
            updateUI();
            loadDashboard();
            loadHomeData();
            
            // Hide loading
            document.getElementById('loading').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            
        } catch (error) {
            console.error('Auth error:', error);
            console.error('API Base URL:', API_BASE);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            
            // If backend not available, use demo mode
            if (error.name === 'AbortError' || 
                error.name === 'TimeoutError' ||
                error.message.includes('Failed to fetch') || 
                error.message.includes('Backend not available') || 
                error.message.includes('404') ||
                error.message.includes('NetworkError') ||
                error.message.includes('Network request failed') ||
                error.message.includes('ERR_INTERNET_DISCONNECTED') ||
                error.message.includes('ERR_CONNECTION_REFUSED') ||
                error.message.includes('Mixed Content') ||
                error.message.includes('blocked:mixed-content') ||
                error.message.includes('CORS') ||
                error.message.includes('CORS policy')) {
                console.warn('Backend API not available, using demo mode');
                
                // Use demo user data from Telegram
                if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    currentUser = {
                        id: tg.initDataUnsafe.user.id || 0,
                        first_name: tg.initDataUnsafe.user.first_name || 'کاربر',
                        last_name: tg.initDataUnsafe.user.last_name || '',
                        username: tg.initDataUnsafe.user.username || '',
                        language: 'fa'
                    };
                    currentLanguage = 'fa';
                    
                    // Update UI
                    updateUI();
                    loadDashboardDemo();
                    loadHomeData();
                    
                    // Hide loading
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('app').style.display = 'block';
                    
                    // Show info message (only once, not annoying)
                    // setTimeout(() => {
                    //     showToast('⚠️ حالت نمایشی - Backend API را راه‌اندازی کنید');
                    // }, 1000);
                    return;
                } else {
                    showError('⚠️ Backend API در دسترس نیست\n\nلطفاً Backend API را راه‌اندازی کنید.\n\nURL: ' + API_BASE);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('app').style.display = 'block';
                    document.getElementById('app').innerHTML = `
                        <div style="padding: 20px; text-align: center; direction: rtl;">
                            <h2 style="color: #ef4444; margin-bottom: 20px;">⚠️ خطا در اتصال به سرور</h2>
                            <p style="font-size: 16px; color: #64748b; margin-bottom: 15px;">
                                Backend API در دسترس نیست.
                            </p>
                            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">
                                URL مورد انتظار: <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${API_BASE}/auth</code>
                            </p>
                            <p style="font-size: 12px; color: #cbd5e1; margin-top: 20px;">
                                لطفاً Backend API را راه‌اندازی کنید یا URL را در app.js تنظیم کنید.
                            </p>
                        </div>
                    `;
                    return;
                }
            }
            
            // Show detailed error message
            const errorMsg = error.message || 'خطای ناشناخته';
            showError('خطا در اتصال به سرور: ' + errorMsg);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            document.getElementById('app').innerHTML = `
                <div style="padding: 20px; text-align: center; direction: rtl;">
                    <h2 style="color: #ef4444; margin-bottom: 20px;">❌ خطا در اتصال</h2>
                    <p style="font-size: 16px; color: #64748b; margin-bottom: 15px;">
                        ${errorMsg}
                    </p>
                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">
                        API URL: <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${API_BASE}</code>
                    </p>
                    <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        🔄 تلاش مجدد
                    </button>
                </div>
            `;
            return;
        }
        
    } catch (error) {
        console.error('Init error:', error);
        showError('Failed to initialize app: ' + error.message);
    } finally {
        // Reset flag after a delay to allow retries
        setTimeout(() => {
            isInitializing = false;
        }, 2000);
    }
}

// Update UI based on language
function updateUI() {
    const dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLanguage);
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let text = translations[currentLanguage];
        
        for (const k of keys) {
            text = text?.[k];
        }
        
        if (text) {
            el.textContent = text;
        }
    });
}

// API Helper
async function apiCall(endpoint, data = {}) {
    try {
        const initData = tg?.initData || '';
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                initData,
                ...data
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('API error:', error);
        return { success: false, error: error.message };
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        // Load profile
        const profileData = await apiCall('/user/profile');
        if (profileData.success) {
            updateProfile(profileData.profile);
        }
        
        // Load balance
        const balance = profileData.profile?.balance || 0;
        updateBalance(balance);
        
        // Load transactions
        const transactionsData = await apiCall('/user/transactions', { limit: 5 });
        if (transactionsData.success) {
            updateTransactions(transactionsData.transactions);
        }
        
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

// Load Dashboard in Demo Mode (without backend)
function loadDashboardDemo() {
    try {
        // Update user name from Telegram
        if (currentUser && currentUser.first_name) {
            const userNameEl = document.getElementById('user-name');
            if (userNameEl) {
                userNameEl.textContent = currentUser.first_name;
            }
        }
        
        // Set demo balance
        updateBalance(0);
        
        // Show demo message with better styling
        const transactionsContainer = document.getElementById('recent-transactions');
        if (transactionsContainer) {
            transactionsContainer.innerHTML = `
                <div style="padding: 30px 20px; text-align: center; direction: rtl;">
                    <div style="margin-bottom: 15px;">
                        <span style="font-size: 48px;">📱</span>
                    </div>
                    <p style="font-size: 16px; color: #6366f1; font-weight: 600; margin-bottom: 10px;">
                        حالت نمایشی فعال است
                    </p>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 15px; line-height: 1.6;">
                        برای استفاده از تمام قابلیت‌ها، باید Backend API را راه‌اندازی کنید.
                    </p>
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <p style="font-size: 12px; color: #475569; margin: 0;">
                            💡 راهنما: فایل <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">راهنمای_Backend.md</code> را مطالعه کنید
                        </p>
                    </div>
                </div>
            `;
        }
        
        // Update profile with demo data
        if (document.getElementById('user-level')) {
            document.getElementById('user-level').textContent = 'نمایشی';
        }
        if (document.getElementById('user-xp')) {
            document.getElementById('user-xp').textContent = '0';
        }
        if (document.getElementById('user-transactions')) {
            document.getElementById('user-transactions').textContent = '0';
        }
        if (document.getElementById('user-volume')) {
            document.getElementById('user-volume').textContent = '0 تومان';
        }
        
    } catch (error) {
        console.error('Demo dashboard error:', error);
    }
}

// Update Profile
function updateProfile(profile) {
    if (profile.level) {
        document.getElementById('user-level').textContent = profile.level;
    }
    if (profile.xp !== undefined) {
        document.getElementById('user-xp').textContent = profile.xp.toLocaleString();
    }
    if (profile.total_transactions !== undefined) {
        document.getElementById('user-transactions').textContent = profile.total_transactions;
    }
    if (profile.total_volume !== undefined) {
        document.getElementById('user-volume').textContent = profile.total_volume.toLocaleString() + ' تومان';
    }
    
    if (currentUser && currentUser.first_name) {
        document.getElementById('user-name').textContent = currentUser.first_name;
    }
}

// Update Balance (legacy - for old dashboard)
function updateBalanceOld(balance) {
    const balanceEl = document.getElementById('balance-value');
    if (balanceEl) {
        balanceEl.textContent = balance.toLocaleString();
    }
}

// Update Transactions
function updateTransactions(transactions) {
    const container = document.getElementById('recent-transactions');
    if (!container) return;
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">' + 
            (currentLanguage === 'fa' ? 'تراکنشی وجود ندارد' : 'No transactions') + '</p>';
        return;
    }
    
    container.innerHTML = transactions.slice(0, 5).map(tx => {
        const type = tx.transaction_type || 'unknown';
        const amount = tx.amount_irr || tx.amount || 0;
        const date = new Date(tx.created_at).toLocaleDateString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US');
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-type">${type}</div>
                    <div class="transaction-date">${date}</div>
                </div>
                <div class="transaction-amount">${amount.toLocaleString()} تومان</div>
            </div>
        `;
    }).join('');
}

// Load Prices
async function loadPrices() {
    try {
        const ratesData = await apiCall('/rates/live');
        if (ratesData.success && ratesData.rates) {
            updateRates(ratesData.rates);
        }
    } catch (error) {
        console.error('Prices load error:', error);
    }
}

// Update Rates
function updateRates(rates) {
    const container = document.getElementById('rates-container');
    if (!container) return;
    
    const ratesArray = [];
    for (const [crypto, rateData] of Object.entries(rates)) {
        if (rateData.buy) {
            ratesArray.push({
                crypto,
                buy: rateData.buy.rate_with_fee || rateData.buy.base_rate,
                sell: rateData.sell?.rate_with_fee || rateData.sell?.base_rate
            });
        }
    }
    
    container.innerHTML = ratesArray.map(rate => `
        <div class="rate-card">
            <div class="rate-header">
                <span class="rate-crypto">${rate.crypto}</span>
                <span class="rate-type">${currentLanguage === 'fa' ? 'خرید' : 'Buy'}</span>
            </div>
            <div class="rate-value">${rate.buy.toLocaleString()}</div>
            <div class="rate-label">${currentLanguage === 'fa' ? 'تومان' : 'Toman'}</div>
        </div>
        <div class="rate-card">
            <div class="rate-header">
                <span class="rate-crypto">${rate.crypto}</span>
                <span class="rate-type">${currentLanguage === 'fa' ? 'فروش' : 'Sell'}</span>
            </div>
            <div class="rate-value">${rate.sell.toLocaleString()}</div>
            <div class="rate-label">${currentLanguage === 'fa' ? 'تومان' : 'Toman'}</div>
        </div>
    `).join('');
}

// Load Forex Rates
async function loadForexRates() {
    try {
        const forexData = await apiCall('/forex/rates');
        if (forexData.success && forexData.forex_rates) {
            updateForexRates(forexData.forex_rates);
        }
    } catch (error) {
        console.error('Forex load error:', error);
    }
}

// Update Forex Rates
function updateForexRates(rates) {
    const container = document.getElementById('forex-rates');
    if (!container) return;
    
    container.innerHTML = Object.entries(rates).map(([pair, rateData]) => {
        const buyRate = rateData.buy?.rate_with_fee || rateData.buy?.base_rate || 0;
        return `
            <div class="forex-item">
                <div class="forex-pair">${pair}/IRR</div>
                <div class="forex-rate">${buyRate.toLocaleString()}</div>
            </div>
        `;
    }).join('');
}

// Load Referral Data
async function loadReferralData() {
    try {
        const referralData = await apiCall('/user/referral');
        if (referralData.success && referralData.referral) {
            updateReferral(referralData.referral);
        }
    } catch (error) {
        console.error('Referral load error:', error);
    }
}

// Update Referral
function updateReferral(referral) {
    const linkInput = document.getElementById('referral-link');
    if (linkInput && referral.link) {
        linkInput.value = referral.link;
    }
    
    const referralsCount = document.getElementById('referrals-count');
    if (referralsCount && referral.referrals) {
        referralsCount.textContent = referral.referrals.length || 0;
    }
    
    const commissionAmount = document.getElementById('commission-amount');
    if (commissionAmount && referral.commission) {
        const total = referral.commission.total_commission || 0;
        commissionAmount.textContent = total.toLocaleString() + ' تومان';
    }
}

// Page Navigation (Updated for Trust Wallet style)
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(`${pageId}-page`);
    if (page) {
        page.classList.add('active');
        
        // Load page-specific data
        if (pageId === 'wallet') {
            loadWalletAssets();
        } else if (pageId === 'swap') {
            loadSwapRates();
        } else if (pageId === 'orders') {
            loadOrders();
        } else if (pageId === 'referral') {
            loadReferralData();
        } else if (pageId === 'home') {
            loadHomeData();
        }
    }
    
    // Update bottom navigation
    updateBottomNav(pageId);
}

// Update Bottom Navigation
function updateBottomNav(activePageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const page = item.getAttribute('data-page');
        if (page === activePageId) {
            item.classList.add('active');
        }
    });
}

// Show Action Modal (Buy/Sell/Convert)
function showActionModal(action) {
    const modal = document.getElementById('action-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    const titles = {
        buy: 'خرید',
        sell: 'فروش',
        convert: 'تبدیل سریع'
    };
    
    modalTitle.textContent = titles[action] || action;
    
    // Generate modal content based on action
    let content = '';
    if (action === 'buy') {
        content = `
            <div class="action-options">
                <button class="action-option-btn" onclick="selectBuyOption('crypto')">
                    <div class="option-icon">💱</div>
                    <div class="option-text">
                        <h4>خرید ارز دیجیتال</h4>
                        <p>خرید USDT, TRX, BTC و سایر ارزها</p>
                    </div>
                </button>
                <button class="action-option-btn" onclick="selectBuyOption('voucher')">
                    <div class="option-icon">🎫</div>
                    <div class="option-text">
                        <h4>خرید ووچر یوتوپیا</h4>
                        <p>خرید ووچر UUSD</p>
                    </div>
                </button>
                <button class="action-option-btn" onclick="selectBuyOption('usdt')">
                    <div class="option-icon">🟢</div>
                    <div class="option-text">
                        <h4>خرید تتر (USDT)</h4>
                        <p>خرید مستقیم USDT</p>
                    </div>
                </button>
            </div>
        `;
    } else if (action === 'sell') {
        content = `
            <div class="action-options">
                <button class="action-option-btn" onclick="selectSellOption('crypto')">
                    <div class="option-icon">💱</div>
                    <div class="option-text">
                        <h4>فروش ارز دیجیتال</h4>
                        <p>فروش USDT, TRX, BTC و سایر ارزها</p>
                    </div>
                </button>
                <button class="action-option-btn" onclick="selectSellOption('voucher')">
                    <div class="option-icon">🎫</div>
                    <div class="option-text">
                        <h4>فروش ووچر یوتوپیا</h4>
                        <p>فروش ووچر UUSD</p>
                    </div>
                </button>
                <button class="action-option-btn" onclick="selectSellOption('usdt')">
                    <div class="option-icon">🔴</div>
                    <div class="option-text">
                        <h4>فروش تتر (USDT)</h4>
                        <p>فروش مستقیم USDT</p>
                    </div>
                </button>
            </div>
        `;
    } else if (action === 'convert') {
        content = `
            <div class="convert-modal-content">
                <p style="margin-bottom: 16px; color: var(--text-secondary);">تبدیل سریع بین ووچر و ارزهای دیجیتال</p>
                <button class="swap-btn" onclick="closeActionModal(); showPage('swap');">
                    شروع تبدیل
                </button>
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

// Close Action Modal
function closeActionModal() {
    const modal = document.getElementById('action-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('action-modal');
    if (modal && e.target === modal) {
        closeActionModal();
    }
});

// Send callback query to bot
async function sendCallbackToBot(callbackData) {
    try {
        // Method 1: Use Backend API if available
        if (API_BASE) {
            const response = await fetch(`${API_BASE}/bot/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    initData: tg?.initData || '',
                    callback_data: callbackData
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return true;
                }
            }
        }
        
        // Method 2: Use Telegram Web App sendData (if available)
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({ callback_data: callbackData }));
            return true;
        }
        
        // Method 3: Open bot with deep link (fallback)
        if (tg && tg.openTelegramLink) {
            // Open bot chat - user will need to click button manually
            tg.openTelegramLink(`https://t.me/bixfee_bot?start=miniapp_${callbackData}`);
            showToast('در حال باز کردن ربات...');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error sending callback to bot:', error);
        return false;
    }
}

// Select Buy Option
function selectBuyOption(type) {
    closeActionModal();
    
    if (type === 'crypto') {
        // Open buy crypto menu in bot - این دقیقاً مثل ربات است
        sendCallbackToBot('buy_crypto_menu').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی خرید ارز دیجیتال...');
            } else {
                // Fallback: open bot with start parameter
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=buy_crypto_menu');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else if (type === 'voucher') {
        // Open buy voucher in bot
        sendCallbackToBot('buy_voucher_start').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی خرید ووچر...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=buy_voucher_start');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else if (type === 'usdt') {
        // Open buy USDT directly
        sendCallbackToBot('buy_usdt').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی خرید USDT...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=buy_usdt');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else {
        // Open main buy menu
        sendCallbackToBot('buy_menu').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی خرید...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=buy_menu');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    }
}

// Select Sell Option
function selectSellOption(type) {
    closeActionModal();
    
    if (type === 'crypto') {
        // Open sell crypto menu in bot - این دقیقاً مثل ربات است
        sendCallbackToBot('sell_crypto_menu').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی فروش ارز دیجیتال...');
            } else {
                // Fallback: open bot with start parameter
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=sell_crypto_menu');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else if (type === 'voucher') {
        // Open sell voucher in bot
        sendCallbackToBot('sell_voucher_start').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی فروش ووچر...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=sell_voucher_start');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else if (type === 'usdt') {
        // Open sell USDT directly
        sendCallbackToBot('sell_usdt').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی فروش USDT...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=sell_usdt');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    } else {
        // Open main sell menu
        sendCallbackToBot('sell_menu').then(success => {
            if (success) {
                showToast('در حال باز کردن منوی فروش...');
            } else {
                if (tg && tg.openTelegramLink) {
                    tg.openTelegramLink('https://t.me/bixfee_bot?start=sell_menu');
                } else {
                    showToast('لطفاً از طریق ربات استفاده کنید');
                }
            }
        });
    }
}

// Load Wallet Assets
async function loadWalletAssets() {
    const container = document.getElementById('wallet-assets');
    const totalBalanceEl = document.getElementById('wallet-total-balance');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">در حال بارگذاری...</div>';
    
    // Demo data
    const demoAssets = [
        { name: 'ووچر', icon: '🎫', balance: '0', value: '0 تومان', change: '+0%' },
        { name: 'USDT', icon: '🟩', balance: '0', value: '0 تومان', change: '+0%' },
        { name: 'TRX', icon: '🔺', balance: '0', value: '0 تومان', change: '+0%' }
    ];
    
    // Load real data from API
    if (API_BASE) {
        try {
            const profileData = await apiCall('/user/profile');
            if (profileData.success && profileData.profile) {
                const balance = profileData.profile.balance || 0;
                if (totalBalanceEl) {
                    totalBalanceEl.textContent = balance.toLocaleString() + ' تومان';
                }
                
                // Update assets with real data if available
                // For now, use demo data
            }
        } catch (error) {
            console.error('Error loading wallet assets:', error);
        }
    }
    
    // Render assets
    container.innerHTML = demoAssets.map(asset => `
        <div class="asset-item" onclick="viewAssetDetails('${asset.name}')">
            <div class="asset-icon">${asset.icon}</div>
            <div class="asset-info">
                <div class="asset-name">${asset.name}</div>
                <div class="asset-balance">${asset.balance}</div>
            </div>
            <div class="asset-value">
                <div class="asset-value-amount">${asset.value}</div>
                <div class="asset-value-change">${asset.change}</div>
            </div>
        </div>
    `).join('');
}

// View Asset Details
function viewAssetDetails(assetName) {
    sendCallbackToBot(`view_asset_${assetName.toLowerCase()}`).then(success => {
        if (!success && tg && tg.openTelegramLink) {
            tg.openTelegramLink(`https://t.me/bixfee_bot?start=asset_${assetName.toLowerCase()}`);
        }
    });
}

// Open Charge Wallet
function openChargeWallet() {
    sendCallbackToBot('charge_wallet').then(success => {
        if (success) {
            showToast('در حال باز کردن منوی شارژ...');
        } else {
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink('https://t.me/bixfee_bot?start=charge');
            } else {
                showToast('لطفاً از طریق ربات استفاده کنید');
            }
        }
    });
}

// Open Withdraw Wallet
function openWithdrawWallet() {
    sendCallbackToBot('withdraw_wallet').then(success => {
        if (success) {
            showToast('در حال باز کردن منوی برداشت...');
        } else {
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink('https://t.me/bixfee_bot?start=withdraw');
            } else {
                showToast('لطفاً از طریق ربات استفاده کنید');
            }
        }
    });
}

// Open Wallet History
function openWalletHistory() {
    sendCallbackToBot('wallet_history').then(success => {
        if (success) {
            showToast('در حال باز کردن تاریخچه...');
        } else {
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink('https://t.me/bixfee_bot?start=wallet_history');
            } else {
                showToast('لطفاً از طریق ربات استفاده کنید');
            }
        }
    });
}

// Load Swap Rates
async function loadSwapRates() {
    // TODO: Load real rates from API
    const rateEl = document.getElementById('swap-rate');
    if (rateEl) {
        rateEl.textContent = 'در حال بارگذاری...';
    }
    
    if (API_BASE) {
        try {
            const data = await apiCall('/rates/live');
            if (data.success && data.rates) {
                // Update rates
            }
        } catch (error) {
            console.error('Error loading rates:', error);
        }
    }
}

// Execute Swap
function executeSwap() {
    const fromAmount = document.getElementById('swap-from-amount').value;
    const fromCurrency = document.getElementById('swap-from-currency').value;
    const toCurrency = document.getElementById('swap-to-currency').value;
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
        showToast('لطفاً مقدار را وارد کنید');
        return;
    }
    
    showToast('در حال انجام تبدیل...');
    // TODO: Implement swap logic
}

// Load Orders
async function loadOrders(orderType = 'all') {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">در حال بارگذاری...</div>';
    
    // Load real orders from API
    if (API_BASE) {
        try {
            const data = await apiCall('/user/orders', { type: orderType });
            if (data.success && data.orders && data.orders.length > 0) {
                renderOrders(data.orders);
            } else {
                renderOrders([]);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            renderOrders([]);
        }
    } else {
        renderOrders([]);
    }
}

// Render Orders
function renderOrders(orders) {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                <p>هیچ سفارشی وجود ندارد</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const statusClass = order.status === 'completed' ? 'completed' : 'pending';
        const statusText = order.status === 'completed' ? 'تکمیل شده' : 'در انتظار';
        const date = new Date(order.created_at).toLocaleDateString('fa-IR');
        const typeText = order.type === 'buy' ? 'خرید' : 'فروش';
        
        return `
            <div class="order-item" onclick="viewOrderDetails(${order.id})">
                <div class="order-header">
                    <div class="order-type">${typeText} ${order.currency || ''}</div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                <div class="order-details">
                    <span>مبلغ: ${(order.amount || 0).toLocaleString()} تومان</span>
                    <span>${date}</span>
                </div>
            </div>
        `;
    }).join('');
}

// View Order Details
function viewOrderDetails(orderId) {
    sendCallbackToBot(`view_order_${orderId}`).then(success => {
        if (!success && tg && tg.openTelegramLink) {
            tg.openTelegramLink(`https://t.me/bixfee_bot?start=order_${orderId}`);
        }
    });
}

// Load Home Data
async function loadHomeData() {
    // Update balance
    updateBalance(0);
    
    // Update user info display
    if (currentUser) {
        const userInfoEl = document.getElementById('user-info-display');
        if (userInfoEl) {
            userInfoEl.textContent = currentUser.first_name || 'کاربر';
        }
    }
    
    // Load user profile data
    if (API_BASE) {
        try {
            const profileData = await apiCall('/user/profile');
            if (profileData.success && profileData.profile) {
                updateProfileData(profileData.profile);
                if (profileData.profile.balance !== undefined) {
                    updateBalance(profileData.profile.balance);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
}

// Toggle Language
function toggleLanguage() {
    const newLang = currentLanguage === 'fa' ? 'en' : 'fa';
    currentLanguage = newLang;
    updateUI();
    document.getElementById('current-language').textContent = newLang === 'fa' ? 'فارسی' : 'English';
    showToast(newLang === 'fa' ? 'زبان تغییر کرد' : 'Language changed');
}

// Toggle Theme
function toggleTheme() {
    // TODO: Implement theme toggle
    showToast('تغییر تم به زودی اضافه می‌شود');
}

// Show User Info
function showUserInfo() {
    if (currentUser) {
        const info = `نام: ${currentUser.first_name || 'کاربر'}\nنام کاربری: ${currentUser.username || '-'}`;
        showToast(info, 5000);
    }
}

// Open Support Chat
function openSupportChat() {
    sendCallbackToBot('support_chat').then(success => {
        if (!success && tg && tg.openTelegramLink) {
            tg.openTelegramLink('https://t.me/bixfee_bot');
        }
    });
}

// Create New Ticket
function createNewTicket() {
    sendCallbackToBot('create_ticket').then(success => {
        if (success) {
            showToast('در حال باز کردن فرم ایجاد تیکت...');
        } else {
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink('https://t.me/bixfee_bot?start=create_ticket');
            } else {
                showToast('لطفاً از طریق ربات استفاده کنید');
            }
        }
    });
}

// Show My Tickets
async function showMyTickets() {
    const ticketsList = document.getElementById('tickets-list');
    const ticketsSection = document.getElementById('tickets-list-section');
    const activeTicketSection = document.getElementById('active-ticket-section');
    
    if (!ticketsList) return;
    
    // Hide active ticket if showing
    if (activeTicketSection) {
        activeTicketSection.style.display = 'none';
    }
    
    // Show tickets list
    if (ticketsSection) {
        ticketsSection.style.display = 'block';
    }
    
    // Load tickets
    if (API_BASE) {
        try {
            const data = await apiCall('/user/tickets');
            if (data.success && data.tickets) {
                renderTicketsList(data.tickets);
            } else {
                renderTicketsList([]);
            }
        } catch (error) {
            console.error('Error loading tickets:', error);
            renderTicketsList([]);
        }
    } else {
        renderTicketsList([]);
    }
}

// Render Tickets List
function renderTicketsList(tickets) {
    const container = document.getElementById('tickets-list');
    if (!container) return;
    
    if (!tickets || tickets.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                <div style="font-size: 48px; margin-bottom: 16px;">🎫</div>
                <p>هیچ تیکتی وجود ندارد</p>
                <button class="support-action-btn" onclick="createNewTicket()" style="margin-top: 20px;">
                    <span>ایجاد تیکت جدید</span>
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tickets.map(ticket => {
        const statusClass = ticket.status === 'open' ? 'open' : 'closed';
        const statusText = ticket.status === 'open' ? 'باز' : 'بسته';
        const date = new Date(ticket.created_at).toLocaleDateString('fa-IR');
        
        return `
            <div class="ticket-item" onclick="openTicket(${ticket.id})">
                <div class="ticket-item-header">
                    <div class="ticket-item-number">${ticket.ticket_number || `تیکت #${ticket.id}`}</div>
                    <span class="ticket-status ${statusClass}">${statusText}</span>
                </div>
                <div class="ticket-item-subject">${ticket.subject || 'بدون موضوع'}</div>
                <div class="ticket-item-footer">
                    <span>${date}</span>
                    <span>${ticket.topic || 'پشتیبانی'}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Open Ticket
async function openTicket(ticketId) {
    const activeTicketSection = document.getElementById('active-ticket-section');
    const ticketsSection = document.getElementById('tickets-list-section');
    
    if (!activeTicketSection) return;
    
    // Hide tickets list
    if (ticketsSection) {
        ticketsSection.style.display = 'none';
    }
    
    // Show active ticket
    activeTicketSection.style.display = 'block';
    
    // Load ticket messages
    if (API_BASE) {
        try {
            const data = await apiCall('/user/ticket', { ticket_id: ticketId });
            if (data.success && data.ticket) {
                renderTicketMessages(data.ticket, data.messages || []);
            }
        } catch (error) {
            console.error('Error loading ticket:', error);
            showToast('خطا در بارگذاری تیکت');
        }
    }
}

// Render Ticket Messages
function renderTicketMessages(ticket, messages) {
    const ticketNumber = document.getElementById('active-ticket-number');
    const ticketStatus = document.getElementById('active-ticket-status');
    const messagesContainer = document.getElementById('ticket-messages');
    
    if (ticketNumber) {
        ticketNumber.textContent = ticket.ticket_number || `تیکت #${ticket.id}`;
    }
    
    if (ticketStatus) {
        ticketStatus.textContent = ticket.status === 'open' ? 'باز' : 'بسته';
        ticketStatus.className = `ticket-status ${ticket.status}`;
    }
    
    if (messagesContainer) {
        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">هیچ پیامی وجود ندارد</div>';
        } else {
            messagesContainer.innerHTML = messages.map(msg => {
                const isUser = !msg.is_admin;
                const date = new Date(msg.created_at).toLocaleString('fa-IR');
                return `
                    <div class="ticket-message ${isUser ? 'user' : 'admin'}">
                        <div>${msg.message}</div>
                        <div class="ticket-message-time">${date}</div>
                    </div>
                `;
            }).join('');
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// Send Ticket Message
async function sendTicketMessage() {
    const input = document.getElementById('ticket-message-input');
    if (!input || !input.value.trim()) {
        showToast('لطفاً پیام خود را وارد کنید');
        return;
    }
    
    const message = input.value.trim();
    input.value = '';
    
    // TODO: Send message via API
    showToast('در حال ارسال پیام...');
    
    if (API_BASE) {
        try {
            const data = await apiCall('/user/ticket/send', { message });
            if (data.success) {
                showToast('پیام ارسال شد');
                // Reload ticket messages
                // TODO: Get current ticket ID
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('خطا در ارسال پیام');
        }
    } else {
        // Fallback: open bot
        if (tg && tg.openTelegramLink) {
            tg.openTelegramLink(`https://t.me/bixfee_bot?start=ticket_message_${message.substring(0, 20)}`);
        }
    }
}

// Close Active Ticket
function closeActiveTicket() {
    const activeTicketSection = document.getElementById('active-ticket-section');
    const ticketsSection = document.getElementById('tickets-list-section');
    
    if (activeTicketSection) {
        activeTicketSection.style.display = 'none';
    }
    
    if (ticketsSection) {
        ticketsSection.style.display = 'block';
    }
}

// Create Ticket (legacy)
function createTicket() {
    createNewTicket();
}

// Update Balance (for home page)
function updateBalance(balance) {
    const balanceEl = document.getElementById('total-balance');
    if (balanceEl) {
        balanceEl.textContent = balance.toLocaleString() + ' تومان';
    }
}

// Order Tab Navigation
document.querySelectorAll('.order-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const orderType = tab.getAttribute('data-order-type');
        loadOrders(orderType);
    });
});

// Language Toggle
document.getElementById('lang-toggle')?.addEventListener('click', async () => {
    const newLang = currentLanguage === 'fa' ? 'en' : 'fa';
    
    const result = await apiCall('/language/set', { language: newLang });
    if (result.success) {
        currentLanguage = newLang;
        updateUI();
        showToast(currentLanguage === 'fa' ? 'زبان تغییر کرد' : 'Language changed');
        
        // Reload data
        loadDashboard();
    }
});

// Refresh Button
document.getElementById('refresh-btn')?.addEventListener('click', () => {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id.replace('-page', '');
        if (pageId === 'dashboard') {
            loadDashboard();
        } else if (pageId === 'prices') {
            loadPrices();
        } else if (pageId === 'forex') {
            loadForexRates();
        }
    }
    showToast(currentLanguage === 'fa' ? 'به‌روزرسانی شد' : 'Refreshed');
});

// Copy Referral Link
function copyReferralLink() {
    const linkInput = document.getElementById('referral-link');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        showToast(currentLanguage === 'fa' ? 'کپی شد' : 'Copied');
    }
}

// Show Convert Form
function showConvertForm(type) {
    // This would show a conversion form
    showToast(currentLanguage === 'fa' ? 'این قابلیت به زودی اضافه می‌شود' : 'Feature coming soon');
}

// Show Toast
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// Show Error
function showError(message) {
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

// Play spinning coin sound
function playSpinningSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 3; // 3 seconds
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a realistic spinning coin sound effect
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const progress = t / duration;
            
            // Base frequency that decreases as coin slows down (like a real coin)
            const baseFreq = 400 - (progress * 200); // Starts high, decreases
            
            // Modulation for metallic "tinkling" effect
            const modFreq = 8 + (progress * 4); // Faster modulation as it slows
            const modDepth = 0.3 + (progress * 0.2);
            
            // Amplitude envelope - starts strong, fades out
            const amplitude = Math.max(0, 1 - (progress * 1.2)) * 0.4;
            
            // Add some randomness for realism
            const noise = (Math.random() - 0.5) * 0.1;
            
            // Main spinning sound with harmonics
            const fundamental = Math.sin(2 * Math.PI * baseFreq * t);
            const harmonic2 = Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.3;
            const harmonic3 = Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.15;
            const modulation = Math.sin(2 * Math.PI * modFreq * t) * modDepth;
            
            // Combine all components
            data[i] = (fundamental + harmonic2 + harmonic3) * 
                     (1 + modulation) * 
                     amplitude + noise;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
        
        return audioContext;
    } catch (error) {
        console.warn('Could not play spinning sound:', error);
        return null;
    }
}

// Handle splash screen
function handleSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const loadingScreen = document.getElementById('loading');
    const appContainer = document.getElementById('app');
    
    if (!splashScreen) return;
    
    // Try to play spinning sound (may require user interaction)
    let audioContext = null;
    try {
        audioContext = playSpinningSound();
        // If audio context is suspended, try to resume on user interaction
        if (audioContext && audioContext.state === 'suspended') {
            document.addEventListener('click', function resumeAudio() {
                try {
                    if (audioContext && audioContext.state === 'suspended') {
                        audioContext.resume().then(() => {
                            console.log('Audio resumed');
                        });
                    }
                } catch (e) {
                    // Ignore
                }
                document.removeEventListener('click', resumeAudio);
            }, { once: true });
        }
    } catch (error) {
        console.log('Could not initialize audio:', error);
    }
    
    // After 3 seconds, hide splash and show loading/app
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            // Show loading screen if app is not ready
            if (appContainer && appContainer.style.display === 'none') {
                loadingScreen.style.display = 'flex';
            }
            
            // Clean up audio context
            if (audioContext) {
                setTimeout(() => {
                    audioContext.close().catch(() => {});
                }, 100);
            }
        }, 500);
    }, 3000);
}

// Initialize on load
// Wait for both DOM and Telegram SDK to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Start splash screen
    handleSplashScreen();
    
    // Wait a bit for Telegram SDK to load
    if (typeof window.Telegram === 'undefined') {
        // SDK not loaded yet, wait a bit
        setTimeout(() => {
            initApp();
        }, 500);
    } else {
        initApp();
    }
});

// Also try to initialize when Telegram SDK loads
if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    // SDK already loaded
    initApp();
} else {
    // Wait for SDK to load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
                initApp();
            }
        }, 1000);
    });
}


