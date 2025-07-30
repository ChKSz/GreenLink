// GreenLink URL Shortener - Cloudflare Worker
// A modern URL shortener with black-green tech aesthetic

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers for API requests
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Serve main page
        if (path === '/' && method === 'GET') {
            return new Response(getMainPage(), {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        // API endpoint to create short URL
        if (path === '/api/shorten' && method === 'POST') {
            try {
                const body = await request.json();
                const { url: longUrl, customCode } = body;

                if (!longUrl || !isValidUrl(longUrl)) {
                    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                const shortCode = customCode || generateShortCode();

                // Check if custom code already exists
                if (customCode) {
                    const existing = await env.URL_STORE.get(shortCode);
                    if (existing) {
                        return new Response(JSON.stringify({ error: 'Custom code already exists' }), {
                            status: 409,
                            headers: { 'Content-Type': 'application/json', ...corsHeaders },
                        });
                    }
                }

                // Store the URL mapping
                await env.URL_STORE.put(shortCode, longUrl);

                const shortUrl = `${url.origin}/${shortCode}`;

                return new Response(JSON.stringify({
                    shortUrl,
                    longUrl,
                    shortCode
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // Handle short URL redirects
        if (path.length > 1 && method === 'GET') {
            const shortCode = path.substring(1);
            const longUrl = await env.URL_STORE.get(shortCode);

            if (longUrl) {
                return Response.redirect(longUrl, 301);
            } else {
                return new Response('Short URL not found', { status: 404 });
            }
        }

        return new Response('Not Found', { status: 404 });
    },
};

// Generate random short code
function generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Main HTML page with black-green tech aesthetic
function getMainPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - URL Shortener</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
        }

        .container {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff88;
            border-radius: 15px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .language-toggle {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 5px;
        }

        .lang-btn {
            padding: 8px 12px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 5px;
            color: #00ff88;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .lang-btn:hover, .lang-btn.active {
            background: #00ff88;
            color: #000;
        }

        .container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 136, 0.1), transparent);
            animation: rotate 4s linear infinite;
            z-index: -1;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo h1 {
            font-size: 2.5em;
            font-weight: bold;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
            margin-bottom: 10px;
        }

        .logo p {
            color: #888;
            font-size: 1.1em;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00ff88;
        }

        input[type="url"], input[type="text"] {
            width: 100%;
            padding: 15px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #333;
            border-radius: 8px;
            color: #00ff88;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input[type="url"]:focus, input[type="text"]:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        input::placeholder {
            color: #666;
        }

        .btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            border: none;
            border-radius: 8px;
            color: #000;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn:hover {
            background: linear-gradient(45deg, #00cc6a, #00ff88);
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .result {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 8px;
            display: none;
        }

        .result.show {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .short-url {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }

        .short-url input {
            flex: 1;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff88;
            padding: 10px;
            border-radius: 5px;
            color: #00ff88;
        }

        .copy-btn {
            padding: 10px 15px;
            background: #00ff88;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .copy-btn:hover {
            background: #00cc6a;
        }

        .error {
            color: #ff4444;
            margin-top: 10px;
            padding: 10px;
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #ff4444;
            border-radius: 5px;
            display: none;
        }

        .error.show {
            display: block;
        }

        .loading {
            display: none;
            text-align: center;
            margin-top: 20px;
        }

        .loading.show {
            display: block;
        }

        .spinner {
            border: 2px solid #333;
            border-top: 2px solid #00ff88;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 255, 136, 0.2);
        }

        .github-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #888;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .github-link:hover {
            color: #00ff88;
            transform: translateY(-2px);
        }

        .github-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        @media (max-width: 600px) {
            .container {
                padding: 30px 20px;
                margin: 20px;
            }

            .logo h1 {
                font-size: 2em;
            }

            .language-toggle {
                top: 15px;
                right: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="language-toggle">
            <button class="lang-btn active" onclick="switchLanguage('en')" data-lang="en">EN</button>
            <button class="lang-btn" onclick="switchLanguage('zh')" data-lang="zh">中文</button>
        </div>

        <div class="logo">
            <h1>GreenLink</h1>
            <p data-i18n="subtitle">Fast & Secure URL Shortener</p>
        </div>
        
        <form id="shortenForm">
            <div class="form-group">
                <label for="longUrl" data-i18n="urlLabel">Enter URL to shorten:</label>
                <input type="url" id="longUrl" data-i18n-placeholder="urlPlaceholder" placeholder="https://example.com/very-long-url" required>
            </div>

            <div class="form-group">
                <label for="customCode" data-i18n="customLabel">Custom short code (optional):</label>
                <input type="text" id="customCode" data-i18n-placeholder="customPlaceholder" placeholder="my-link" pattern="[a-zA-Z0-9-_]+" maxlength="20">
            </div>

            <button type="submit" class="btn" id="submitBtn" data-i18n="shortenBtn">Shorten URL</button>
        </form>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p data-i18n="generating">Generating short link...</p>
        </div>

        <div class="error" id="error"></div>

        <div class="result" id="result">
            <h3 data-i18n="resultTitle">Your short link is ready!</h3>
            <div class="short-url">
                <input type="text" id="shortUrlInput" readonly>
                <button class="copy-btn" onclick="copyToClipboard()" data-i18n="copyBtn">Copy</button>
            </div>
        </div>

        <div class="footer">
            <a href="https://github.com/chksz/greenlink" target="_blank" class="github-link">
                <svg class="github-icon" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span data-i18n="github">View on GitHub</span>
            </a>
        </div>
    </div>

    <script>
        // 多语言配置
        const translations = {
            en: {
                subtitle: "Fast & Secure URL Shortener",
                urlLabel: "Enter URL to shorten:",
                urlPlaceholder: "https://example.com/very-long-url",
                customLabel: "Custom short code (optional):",
                customPlaceholder: "my-link",
                shortenBtn: "Shorten URL",
                generating: "Generating short link...",
                resultTitle: "Your short link is ready!",
                copyBtn: "Copy",
                github: "View on GitHub",
                copied: "Copied!",
                invalidUrl: "Invalid URL",
                customExists: "Custom code already exists",
                networkError: "Network error. Please try again.",
                notFound: "Short URL not found"
            },
            zh: {
                subtitle: "快速安全的短链接生成器",
                urlLabel: "输入要缩短的网址:",
                urlPlaceholder: "https://example.com/很长的网址",
                customLabel: "自定义短代码 (可选):",
                customPlaceholder: "我的链接",
                shortenBtn: "生成短链接",
                generating: "正在生成短链接...",
                resultTitle: "您的短链接已生成!",
                copyBtn: "复制",
                github: "在GitHub上查看",
                copied: "已复制!",
                invalidUrl: "无效的网址",
                customExists: "自定义代码已存在",
                networkError: "网络错误，请重试",
                notFound: "短链接未找到"
            }
        };

        let currentLang = localStorage.getItem('language') || 'en';

        // 切换语言
        function switchLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('language', lang);

            // 更新按钮状态
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // 更新页面文本
            updatePageText();
        }

        // 更新页面文本
        function updatePageText() {
            const texts = translations[currentLang];

            // 更新所有带有 data-i18n 属性的元素
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (texts[key]) {
                    element.textContent = texts[key];
                }
            });

            // 更新 placeholder
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (texts[key]) {
                    element.placeholder = texts[key];
                }
            });
        }

        // 页面加载时初始化语言
        document.addEventListener('DOMContentLoaded', () => {
            switchLanguage(currentLang);
        });

        document.getElementById('shortenForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const longUrl = document.getElementById('longUrl').value;
            const customCode = document.getElementById('customCode').value;
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            const error = document.getElementById('error');
            
            // Reset states
            result.classList.remove('show');
            error.classList.remove('show');
            loading.classList.add('show');
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: longUrl, customCode }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('shortUrlInput').value = data.shortUrl;
                    result.classList.add('show');
                } else {
                    const errorMsg = getErrorMessage(data.error);
                    error.textContent = errorMsg;
                    error.classList.add('show');
                }
            } catch (err) {
                error.textContent = translations[currentLang].networkError;
                error.classList.add('show');
            } finally {
                loading.classList.remove('show');
                submitBtn.disabled = false;
            }
        });

        // 获取错误信息
        function getErrorMessage(error) {
            const texts = translations[currentLang];
            switch(error) {
                case 'Invalid URL':
                    return texts.invalidUrl;
                case 'Custom code already exists':
                    return texts.customExists;
                default:
                    return error || texts.networkError;
            }
        }

        function copyToClipboard() {
            const shortUrlInput = document.getElementById('shortUrlInput');
            shortUrlInput.select();
            document.execCommand('copy');

            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = translations[currentLang].copied;
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
        
        // Add some interactive effects
        document.addEventListener('mousemove', (e) => {
            const container = document.querySelector('.container');
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            container.style.setProperty('--mouse-x', x + 'px');
            container.style.setProperty('--mouse-y', y + 'px');
        });
    </script>
</body>
</html>`;
}
