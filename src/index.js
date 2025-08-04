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

        // Serve PWA manifest
        if (path === '/manifest.json' && method === 'GET') {
            const manifest = {
                name: "GreenLink URL Shortener",
                short_name: "GreenLink",
                description: "Fast & Secure URL Shortener",
                start_url: "/",
                display: "standalone",
                background_color: "#000000",
                theme_color: "#00ff88",
                orientation: "portrait-primary",
                icons: [
                    {
                        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iNDAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTQ4IDk2SDk2TTk2IDk2SDE0NE05NiA5NlY0OE05NiA5NlYxNDQiIHN0cm9rZT0iIzAwRkY4OCIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSI5NiIgcj0iMTAiIGZpbGw9IiMwMEZGODgiLz4KPGNpcmNsZSBjeD0iMTQ0IiBjeT0iOTYiIHI9IjEwIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9Ijk2IiBjeT0iNDgiIHI9IjEwIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9Ijk2IiBjeT0iMTQ0IiByPSIxMCIgZmlsbD0iIzAwRkY4OCIvPgo8L3N2Zz4K",
                        sizes: "192x192",
                        type: "image/svg+xml"
                    },
                    {
                        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTAwIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0xMjggMjU2SDI1Nk0yNTYgMjU2SDM4NE0yNTYgMjU2VjEyOE0yNTYgMjU2VjM4NCIgc3Ryb2tlPSIjMDBGRjg4IiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTI4IiBjeT0iMjU2IiByPSIyNSIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIzODQiIGN5PSIyNTYiIHI9IjI1IiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjI1NiIgY3k9IjEyOCIgcj0iMjUiIGZpbGw9IiMwMEZGODgiLz4KPGNpcmNsZSBjeD0iMjU2IiBjeT0iMzg0IiByPSIyNSIgZmlsbD0iIzAwRkY4OCIvPgo8L3N2Zz4K",
                        sizes: "512x512",
                        type: "image/svg+xml"
                    }
                ],
                categories: ["productivity", "utilities"],
                lang: "en",
                dir: "ltr"
            };

            return new Response(JSON.stringify(manifest), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=86400'
                },
            });
        }

        // Serve service worker
        if (path === '/sw.js' && method === 'GET') {
            const serviceWorker = `
                const CACHE_NAME = 'greenlink-v1';
                const urlsToCache = [
                    '/',
                    '/manifest.json'
                ];

                self.addEventListener('install', (event) => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.addAll(urlsToCache))
                    );
                });

                self.addEventListener('fetch', (event) => {
                    event.respondWith(
                        caches.match(event.request)
                            .then((response) => {
                                if (response) {
                                    return response;
                                }
                                return fetch(event.request);
                            })
                    );
                });
            `;

            return new Response(serviceWorker, {
                headers: {
                    'Content-Type': 'application/javascript',
                    'Cache-Control': 'public, max-age=3600'
                },
            });
        }

        // Serve main page
        if (path === '/' && method === 'GET') {
            const html = getMainPage();

            return new Response(html, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;",
                    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                    'Vary': 'Accept-Encoding'
                },
            });
        }

        // Serve PWA manifest
        if (path === '/manifest.json' && method === 'GET') {
            const manifest = {
                name: "GreenLink URL Shortener",
                short_name: "GreenLink",
                description: "Fast & Secure URL Shortener",
                start_url: "/",
                display: "standalone",
                background_color: "#000000",
                theme_color: "#00ff88",
                icons: [
                    {
                        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik04IDE2SDE2TTE2IDE2SDI0TTE2IDE2VjhNMTYgMTZWMjQiIHN0cm9rZT0iIzAwRkY4OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iOCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMTYiIHI9IjIiIGZpbGw9IiMwMEZGODgiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSI4IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMjQiIHI9IjIiIGZpbGw9IiMwMEZGODgiLz4KPC9zdmc+Cg==",
                        sizes: "192x192",
                        type: "image/svg+xml"
                    },
                    {
                        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik04IDE2SDE2TTE2IDE2SDI0TTE2IDE2VjhNMTYgMTZWMjQiIHN0cm9rZT0iIzAwRkY4OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iOCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMTYiIHI9IjIiIGZpbGw9IiMwMEZGODgiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSI4IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMjQiIHI9IjIiIGZpbGw9IiMwMEZGODgiLz4KPC9zdmc+Cg==",
                        sizes: "512x512",
                        type: "image/svg+xml"
                    }
                ]
            };

            return new Response(JSON.stringify(manifest), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=86400'
                },
            });
        }

        // API endpoint to create short URL
        if (path === '/api/shorten' && method === 'POST') {
            const startTime = Date.now();

            try {
                // Rate limiting
                const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
                const rateLimitPassed = await checkRateLimit(clientIP, env);
                if (!rateLimitPassed) {
                    return new Response(JSON.stringify({
                        error: 'Rate limit exceeded. Please try again later.',
                        responseTime: Date.now() - startTime
                    }), {
                        status: 429,
                        headers: {
                            'Content-Type': 'application/json',
                            'Retry-After': '60',
                            ...corsHeaders
                        },
                    });
                }

                const body = await request.json();
                const { url: longUrl, customCode, expiryHours, password, maxClicks } = body;

                if (!longUrl || !isValidUrl(longUrl) || !isSafeUrl(longUrl)) {
                    return new Response(JSON.stringify({ error: 'Invalid or unsafe URL' }), {
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

                // Prepare URL data with advanced options
                const urlData = {
                    url: longUrl,
                    created: new Date().toISOString(),
                    password: password || null,
                    maxClicks: maxClicks ? parseInt(maxClicks) : null,
                    currentClicks: 0
                };

                // Store the URL mapping with optional expiry
                if (expiryHours && parseInt(expiryHours) > 0) {
                    const expirySeconds = parseInt(expiryHours) * 3600;
                    await env.URL_STORE.put(shortCode, JSON.stringify(urlData), { expirationTtl: expirySeconds });
                } else {
                    await env.URL_STORE.put(shortCode, JSON.stringify(urlData));
                }

                // Initialize statistics
                await initializeStats(shortCode, env, expiryHours, longUrl);

                const shortUrl = `${url.origin}/${shortCode}`;
                const responseTime = Date.now() - startTime;

                return new Response(JSON.stringify({
                    shortUrl,
                    longUrl,
                    shortCode,
                    responseTime,
                    hasPassword: !!password,
                    hasExpiry: !!expiryHours,
                    hasClickLimit: !!maxClicks
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'X-Response-Time': `${responseTime}ms`,
                        ...corsHeaders
                    },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // Admin login endpoint
        if (path === '/api/admin/login' && method === 'POST') {
            try {
                const body = await request.json();
                const { password } = body;

                if (password === env.ADMIN_PASSWORD) {
                    // Generate session token
                    const sessionToken = generateSessionToken();
                    const sessionKey = `session:${sessionToken}`;
                    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

                    // Store session (expires in 24 hours)
                    await env.URL_STORE.put(sessionKey, JSON.stringify({
                        created: new Date().toISOString(),
                        ip: clientIP,
                        userAgent: request.headers.get('User-Agent') || 'unknown'
                    }), { expirationTtl: 86400 });

                    // Log successful login
                    await logAdminAction('LOGIN_SUCCESS', clientIP, env);

                    return new Response(JSON.stringify({
                        success: true,
                        token: sessionToken
                    }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                } else {
                    // Log failed login attempt
                    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
                    await logAdminAction('LOGIN_FAILED', clientIP, env);

                    return new Response(JSON.stringify({ error: 'Invalid password' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // Admin logout endpoint
        if (path === '/api/admin/logout' && method === 'POST') {
            try {
                const body = await request.json();
                const { token } = body;

                if (token) {
                    const sessionKey = `session:${token}`;
                    await env.URL_STORE.delete(sessionKey);
                }

                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // API endpoint to get statistics (requires authentication)
        if (path === '/api/stats' && method === 'POST') {
            try {
                const body = await request.json();
                const { shortCode, token } = body;

                // Verify admin session
                if (!await verifyAdminSession(token, env)) {
                    return new Response(JSON.stringify({ error: 'Authentication required' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                if (!shortCode) {
                    return new Response(JSON.stringify({ error: 'Short code required' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                const statsKey = `stats:${shortCode}`;
                const statsData = await env.URL_STORE.get(statsKey);
                const stats = statsData ? JSON.parse(statsData) : null;

                if (!stats) {
                    return new Response(JSON.stringify({ error: 'Statistics not found' }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                return new Response(JSON.stringify(stats), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }



        // API endpoint to delete link (admin only)
        if (path === '/api/admin/delete' && method === 'POST') {
            try {
                const body = await request.json();
                const { shortCode, token } = body;

                // Verify admin session
                if (!await verifyAdminSession(token, env)) {
                    return new Response(JSON.stringify({ error: 'Authentication required' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                if (!shortCode) {
                    return new Response(JSON.stringify({ error: 'Short code required' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                // Delete URL and stats
                await env.URL_STORE.delete(shortCode);
                await env.URL_STORE.delete(`stats:${shortCode}`);

                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // API endpoint to get language settings
        if (path === '/api/language' && method === 'GET') {
            try {
                const languageData = await env.URL_STORE.get('system:language');
                const language = languageData ? JSON.parse(languageData).language : 'en';

                return new Response(JSON.stringify({ language }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ language: 'en' }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // API endpoint to set language (admin only)
        if (path === '/api/admin/language' && method === 'POST') {
            try {
                const body = await request.json();
                const { language, token } = body;

                // Verify admin session
                if (!await verifyAdminSession(token, env)) {
                    return new Response(JSON.stringify({ error: 'Authentication required' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                if (!language || !['en', 'zh'].includes(language)) {
                    return new Response(JSON.stringify({ error: 'Invalid language' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders },
                    });
                }

                // Save language setting
                await env.URL_STORE.put('system:language', JSON.stringify({
                    language,
                    updatedAt: new Date().toISOString()
                }));

                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Invalid request' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                });
            }
        }

        // Handle short URL redirects with statistics
        if (path.length > 1 && method === 'GET') {
            const shortCode = path.substring(1);

            // Check for special routes
            if (shortCode === 'manage') {
                return new Response(getManagePage(), {
                    headers: {
                        'Content-Type': 'text/html',
                        'Cache-Control': 'public, max-age=1800',
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'X-XSS-Protection': '1; mode=block'
                    },
                });
            }

            const urlDataStr = await env.URL_STORE.get(shortCode);

            if (urlDataStr) {
                let urlData;
                try {
                    // Try to parse as JSON (new format)
                    urlData = JSON.parse(urlDataStr);
                } catch {
                    // Fallback to old format (plain URL string)
                    urlData = { url: urlDataStr, password: null, maxClicks: null, currentClicks: 0 };
                }

                // Check click limit
                if (urlData.maxClicks && urlData.currentClicks >= urlData.maxClicks) {
                    return new Response(getLimitExceededPage(), {
                        status: 410,
                        headers: {
                            'Content-Type': 'text/html',
                            'Cache-Control': 'no-cache'
                        }
                    });
                }

                // Check password protection
                if (urlData.password) {
                    const providedPassword = new URL(request.url).searchParams.get('p');
                    if (!providedPassword || providedPassword !== urlData.password) {
                        return new Response(getPasswordPage(shortCode), {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Cache-Control': 'no-cache'
                            }
                        });
                    }
                }

                // Update click count
                if (urlData.maxClicks) {
                    urlData.currentClicks = (urlData.currentClicks || 0) + 1;
                    await env.URL_STORE.put(shortCode, JSON.stringify(urlData));
                }

                // Record statistics
                try {
                    await recordAccess(shortCode, request, env);
                } catch (error) {
                    // Log error but don't fail the redirect
                    console.error('Failed to record access:', error);
                }

                return Response.redirect(urlData.url, 301);
            } else {
                return new Response(getNotFoundPage(), {
                    status: 404,
                    headers: {
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache'
                    }
                });
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

// Check if URL is safe (not in blacklist)
function isSafeUrl(url) {
    const blacklistedDomains = [
        'malware.com',
        'phishing.com',
        'spam.com'
    ];

    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();

        // Check against blacklist
        for (const blacklisted of blacklistedDomains) {
            if (domain.includes(blacklisted)) {
                return false;
            }
        }

        // Additional safety checks
        if (url.includes('javascript:') || url.includes('data:')) {
            return false;
        }

        return true;
    } catch (_) {
        return false;
    }
}

// Rate limiting function
async function checkRateLimit(clientIP, env) {
    const rateLimitKey = `rate:${clientIP}:${Math.floor(Date.now() / 60000)}`;
    const currentCount = await env.URL_STORE.get(rateLimitKey);
    const count = currentCount ? parseInt(currentCount) : 0;

    if (count >= 10) { // 10 requests per minute
        return false;
    }

    await env.URL_STORE.put(rateLimitKey, (count + 1).toString(), {
        expirationTtl: 60
    });

    return true;
}

// Initialize statistics for new short URL
async function initializeStats(shortCode, env, expiryHours, longUrl) {
    const statsKey = `stats:${shortCode}`;
    const now = new Date();
    const stats = {
        clicks: 0,
        created: now.toISOString(),
        lastAccess: null,
        url: longUrl, // 添加原始URL
        expiresAt: expiryHours ? new Date(now.getTime() + parseInt(expiryHours) * 3600000).toISOString() : null,
        referrers: {},
        countries: {},
        userAgents: {},
        dailyClicks: {}
    };

    // Set same expiry for stats as the URL
    if (expiryHours && parseInt(expiryHours) > 0) {
        const expirySeconds = parseInt(expiryHours) * 3600;
        await env.URL_STORE.put(statsKey, JSON.stringify(stats), { expirationTtl: expirySeconds });
    } else {
        await env.URL_STORE.put(statsKey, JSON.stringify(stats));
    }
}

// Record access statistics
async function recordAccess(shortCode, request, env) {
    const statsKey = `stats:${shortCode}`;
    const currentStats = await env.URL_STORE.get(statsKey);

    if (!currentStats) return; // No stats to update

    const stats = JSON.parse(currentStats);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Update basic stats
    stats.clicks++;
    stats.lastAccess = now.toISOString();

    // Record referrer
    const referer = request.headers.get('Referer');
    if (referer) {
        try {
            const refererUrl = new URL(referer);
            let refererDomain = refererUrl.hostname;

            // 简化域名显示
            if (refererDomain.startsWith('www.')) {
                refererDomain = refererDomain.substring(4);
            }

            // 过滤掉自己的域名
            const currentDomain = new URL(request.url).hostname;
            if (refererDomain !== currentDomain && !refererDomain.includes(currentDomain)) {
                stats.referrers[refererDomain] = (stats.referrers[refererDomain] || 0) + 1;
            } else {
                stats.referrers['direct'] = (stats.referrers['direct'] || 0) + 1;
            }
        } catch (_) {
            stats.referrers['direct'] = (stats.referrers['direct'] || 0) + 1;
        }
    } else {
        stats.referrers['direct'] = (stats.referrers['direct'] || 0) + 1;
    }

    // Record user agent
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    const deviceType = getDeviceType(userAgent);
    stats.userAgents[deviceType] = (stats.userAgents[deviceType] || 0) + 1;

    // Record daily clicks
    stats.dailyClicks[today] = (stats.dailyClicks[today] || 0) + 1;

    // Record country (from Cloudflare headers)
    const country = request.headers.get('CF-IPCountry');
    if (country && country !== 'XX' && country !== 'T1') {
        // 只记录有效的国家代码
        stats.countries[country] = (stats.countries[country] || 0) + 1;
    } else {
        stats.countries['unknown'] = (stats.countries['unknown'] || 0) + 1;
    }

    await env.URL_STORE.put(statsKey, JSON.stringify(stats));
}

// Get device type from user agent
function getDeviceType(userAgent) {
    if (!userAgent || userAgent === 'unknown') {
        return 'unknown';
    }

    const ua = userAgent.toLowerCase();

    // 更精确的设备检测
    if (ua.includes('ipad') || (ua.includes('tablet') && !ua.includes('mobile'))) {
        return 'tablet';
    } else if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipod')) {
        return 'mobile';
    } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux') || ua.includes('x11')) {
        return 'desktop';
    } else {
        return 'unknown';
    }
}

// Generate session token
function generateSessionToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Verify admin session
async function verifyAdminSession(token, env) {
    if (!token) return false;

    const sessionKey = `session:${token}`;
    const sessionData = await env.URL_STORE.get(sessionKey);

    return sessionData !== null;
}



// Log admin actions
async function logAdminAction(action, ip, env) {
    try {
        const logKey = `log:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        const logEntry = {
            action,
            ip,
            timestamp: new Date().toISOString(),
            userAgent: 'admin'
        };

        // Store log entry (expires in 30 days)
        await env.URL_STORE.put(logKey, JSON.stringify(logEntry), {
            expirationTtl: 2592000 // 30 days
        });
    } catch (error) {
        console.error('Failed to log admin action:', error);
    }
}

// Get admin logs
async function getAdminLogs(env, limit = 50) {
    const logs = [];

    // This is a simplified implementation
    // In a real scenario, you would scan for log keys and sort by timestamp
    // For now, return empty array

    return logs;
}

// Main HTML page with black-green tech aesthetic
function getMainPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - URL Shortener</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNkgxNk0xNiAxNkgyNE0xNiAxNlY4TTE2IDE2VjI0IiBzdHJva2U9IiMwMEZGODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+Cjwvc3ZnPgo=">
    <meta name="description" content="GreenLink - Fast & Secure URL Shortener powered by Cloudflare Workers">
    <meta name="keywords" content="url shortener, short link, greenlink, cloudflare workers">
    <meta name="author" content="GreenLink">
    <meta property="og:title" content="GreenLink - URL Shortener">
    <meta property="og:description" content="Fast & Secure URL Shortener with modern tech aesthetic">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#00ff88">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="GreenLink">
    <link rel="manifest" href="/manifest.json">

    <!-- Touch Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiByeD0iNDAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTQ1IDkwSDkwTTkwIDkwSDEzNU05MCA5MFY0NU05MCA5MFYxMzUiIHN0cm9rZT0iIzAwRkY4OCIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iNDUiIGN5PSI5MCIgcj0iMTAiIGZpbGw9IiMwMEZGODgiLz4KPGNpcmNsZSBjeD0iMTM1IiBjeT0iOTAiIHI9IjEwIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjkwIiBjeT0iNDUiIHI9IjEwIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjkwIiBjeT0iMTM1IiByPSIxMCIgZmlsbD0iIzAwRkY4OCIvPgo8L3N2Zz4K">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            padding: 20px;
        }

        .container {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3);
            position: relative;
            backdrop-filter: blur(20px);
            animation: containerFadeIn 0.8s ease-out;
            transform-style: preserve-3d;
        }

        @keyframes containerFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 50%, rgba(0, 255, 136, 0.05) 100%);
            border-radius: 20px;
            pointer-events: none;
        }





        .logo {
            text-align: center;
            margin-bottom: 40px;
            animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }

        .logo h1 {
            font-size: 2.8em;
            font-weight: 700;
            color: #00ff88;
            margin-bottom: 12px;
            animation: gradientShift 4s ease-in-out infinite;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.4);
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .logo-title {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #00ff88;
            display: inline-block;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }

        .logo-text {
            position: relative;
            display: inline-block;
            width: 9ch; /* 固定宽度为GreenLink的长度 */
            height: 1.2em; /* 设置高度避免塌陷 */
            text-align: center;
        }

        .logo-short {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            opacity: 1;
            transition: opacity 0.4s ease;
            white-space: nowrap;
            text-align: center;
        }

        .logo-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            opacity: 0;
            transition: opacity 0.4s ease;
            white-space: nowrap;
            text-align: center;
        }

        .logo-title:hover .logo-short {
            opacity: 0;
        }

        .logo-title:hover .logo-full {
            opacity: 1;
        }

        .logo-title:hover {
            transform: scale(1.05);
            text-shadow: 0 0 30px rgba(0, 255, 136, 1);
        }

        .logo p {
            color: #888;
            font-size: 1.1em;
        }

        .form-group {
            margin-bottom: 20px;
        }

        /* 基础表单样式 */
        .basic-form {
            position: relative;
        }

        /* 展开按钮样式 */
        .expand-toggle {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
        }

        .expand-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 16px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 24px;
            color: #888;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .expand-btn:hover {
            background: rgba(0, 255, 136, 0.1);
            border-color: #00ff88;
            color: #00ff88;
            transform: translateY(-1px);
        }

        .expand-icon {
            transition: transform 0.3s ease;
        }

        .expand-btn.expanded .expand-icon {
            transform: rotate(180deg);
        }

        /* 高级选项样式 */
        .advanced-form {
            overflow: hidden;
            transition: all 0.3s ease;
            border-top: 1px solid #333;
            padding-top: 20px;
            margin-top: 10px;
        }

        .advanced-form.show {
            animation: expandIn 0.3s ease;
        }

        @keyframes expandIn {
            from {
                opacity: 0;
                max-height: 0;
            }
            to {
                opacity: 1;
                max-height: 500px;
            }
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #00ff88;
        }

        input[type="url"], input[type="text"], input[type="password"], input[type="number"], .expiry-select {
            width: 100%;
            padding: 18px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            color: #00ff88;
            font-size: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            backdrop-filter: blur(10px);
        }

        input[type="url"]:focus, input[type="text"]:focus, input[type="password"]:focus, input[type="number"]:focus, .expiry-select:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            background: rgba(0, 0, 0, 0.85);
        }

        /* 隐藏number输入框的上下箭头 */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }



        .expiry-select option {
            background: #1a1a1a;
            color: #00ff88;
        }

        input::placeholder {
            color: #666;
        }

        .btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #00ff88, #00cc6a, #00ff88);
            background-size: 200% 200%;
            border: none;
            border-radius: 16px;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease, background-position 0.4s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 255, 136, 0.2);
            transform: scale(1);
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .btn:hover {
            background-position: 100% 0;
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }

        .btn:active {
            transform: scale(0.98);
        }

        .btn:hover::before {
            left: 100%;
        }



        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .result {
            margin-top: 32px;
            padding: 32px;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 20px;
            display: none;
            position: relative;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 32px rgba(0, 255, 136, 0.1);
        }

        .result::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 136, 0.05), transparent);
            border-radius: 20px;
            pointer-events: none;
        }

        .result.show {
            display: block;
            animation: resultSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes resultSlideIn {
            from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
                filter: blur(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }

        /* 页面元素淡入动画 */
        .fade-in {
            animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 标签页内容切换动画 */
        .tab-content {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease-out;
            display: none;
        }

        .tab-content.active {
            opacity: 1;
            transform: translateY(0);
            display: block;
            animation: tabFadeIn 0.6s ease-out;
        }

        @keyframes tabFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
            padding: 12px 18px;
            background: #00ff88;
            color: #000;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .copy-btn:hover {
            background: #00cc6a;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
        }

        .qr-section {
            margin-top: 20px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 255, 136, 0.2);
        }

        .qr-section h4 {
            margin-bottom: 15px;
            color: #00ff88;
        }

        .qr-container {
            display: inline-block;
            padding: 15px;
            background: white;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .qr-btn {
            padding: 10px 20px;
            background: rgba(0, 255, 136, 0.2);
            border: 1px solid #00ff88;
            border-radius: 5px;
            color: #00ff88;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .qr-btn:hover {
            background: #00ff88;
            color: #000;
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
            animation: fadeIn 0.3s ease;
        }

        .spinner {
            border: 3px solid rgba(0, 255, 136, 0.1);
            border-top: 3px solid #00ff88;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* 骨架屏样式 */
        .skeleton {
            background: linear-gradient(90deg, rgba(0, 255, 136, 0.1) 25%, rgba(0, 255, 136, 0.2) 50%, rgba(0, 255, 136, 0.1) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .skeleton-text {
            height: 16px;
            margin-bottom: 8px;
        }

        .skeleton-title {
            height: 24px;
            width: 60%;
            margin-bottom: 16px;
        }

        .skeleton-button {
            height: 40px;
            width: 120px;
            border-radius: 8px;
        }

        /* PWA 安装横幅 */
        .install-banner {
            position: fixed;
            top: -100px;
            left: 20px;
            right: 20px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            color: #000;
            padding: 16px;
            z-index: 1000;
            transition: top 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            margin-top: 20px;
        }

        .install-banner.show {
            top: 0;
        }

        .install-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            gap: 15px;
        }

        .install-btn {
            background: rgba(0, 0, 0, 0.15);
            color: #000;
            border: none;
            padding: 10px 16px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .install-btn:hover {
            background: rgba(0, 0, 0, 0.25);
            transform: translateY(-1px);
        }

        .dismiss-btn {
            background: none;
            border: none;
            color: #000;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .dismiss-btn:hover {
            background: rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
        }

        @media (max-width: 600px) {
            .install-content {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }

            .install-content span {
                font-size: 14px;
            }
        }

        /* 无障碍访问支持 */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* 高对比度模式支持 */
        @media (prefers-contrast: high) {
            .container {
                border: 2px solid #00ff88;
                background: #000;
            }

            .btn, .copy-btn, .qr-btn {
                border: 2px solid #00ff88;
            }
        }

        /* 减少动画模式支持 */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* 焦点可见性增强 */
        .btn:focus-visible,
        .copy-btn:focus-visible,
        .qr-btn:focus-visible,
        input:focus-visible,
        select:focus-visible {
            outline: 3px solid #00ff88;
            outline-offset: 2px;
        }

        /* 错误状态样式 */
        input[aria-invalid="true"] {
            border-color: #ff4444;
            box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
        }

        /* 成功状态样式 */
        input[aria-invalid="false"]:valid {
            border-color: #00ff88;
        }

        /* 骨架屏样式 */
        .skeleton {
            background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        .skeleton-text {
            height: 16px;
            margin-bottom: 8px;
        }

        .skeleton-title {
            height: 24px;
            width: 60%;
            margin-bottom: 16px;
        }

        .skeleton-button {
            height: 48px;
            width: 120px;
            border-radius: 8px;
        }

        .skeleton-card {
            padding: 20px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            margin-bottom: 20px;
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

        /* 触摸优化 */
        .btn, .copy-btn, .qr-btn {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        .btn:active, .copy-btn:active, .qr-btn:active {
            transform: translateY(-1px) scale(0.98);
        }

        /* 移动端优化 */
        @media (max-width: 600px) {
            .container {
                padding: 30px 20px;
                margin: 20px;
                min-height: calc(100vh - 40px);
            }

            .logo h1 {
                font-size: 2em;
            }

            .btn, .copy-btn, .qr-btn {
                min-height: 48px;
                font-size: 16px;
            }

            input[type="url"], input[type="text"], input[type="password"], input[type="number"], .expiry-select {
                min-height: 48px;
                font-size: 16px;
            }

            .short-url {
                flex-direction: column;
                gap: 15px;
            }

            .copy-btn {
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: 20px 15px;
                margin: 10px;
            }

            .qr-section {
                margin-top: 15px;
                padding-top: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1 class="logo-title">
                <span class="logo-text">
                    <span class="logo-short">GLink</span>
                    <span class="logo-full">GreenLink</span>
                </span>
            </h1>
            <p data-i18n="subtitle">Fast & Secure</p>
        </div>
        
        <form id="shortenForm">
            <!-- 基础表单 -->
            <div class="basic-form">
                <div class="form-group">
                    <label for="longUrl" data-i18n="urlLabel">Enter URL:</label>
                    <input type="url" id="longUrl" data-i18n-placeholder="urlPlaceholder" placeholder="https://example.com/long-url" required>
                </div>

                <div class="form-group">
                    <label for="customCode" data-i18n="customLabel">Custom code (optional):</label>
                    <input type="text" id="customCode" data-i18n-placeholder="customPlaceholder" placeholder="my-link" pattern="[a-zA-Z0-9-_]+" maxlength="20">
                </div>

                <!-- 展开按钮 -->
                <div class="expand-toggle">
                    <button type="button" id="expandBtn" class="expand-btn" aria-label="Show advanced options">
                        <svg class="expand-icon" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                        </svg>
                        <span data-i18n="advancedOptions">Advanced</span>
                    </button>
                </div>
            </div>

            <!-- 高级选项 -->
            <div class="advanced-form" id="advancedForm" style="display: none;">
                <div class="form-group">
                    <label for="expiryTime" id="expiryLabel">Link expiry (optional):</label>
                    <select id="expiryTime" class="expiry-select" aria-describedby="expiryHelp">
                        <option value="">Never expires</option>
                        <option value="1">1 hour</option>
                        <option value="24">1 day</option>
                        <option value="168">1 week</option>
                        <option value="720">1 month</option>
                        <option value="8760">1 year</option>
                    </select>
                    <div id="expiryHelp" class="sr-only">Set when this link should expire and become inactive</div>
                </div>

                <div class="form-group">
                    <label for="password" id="passwordLabel">Password protection (optional):</label>
                    <input type="password" id="password" placeholder="Enter password" maxlength="50"
                           aria-describedby="passwordHelp">
                    <div id="passwordHelp" class="sr-only">Optional: Require a password to access this link</div>
                </div>

                <div class="form-group">
                    <label for="maxClicks" id="maxClicksLabel">Maximum clicks (optional):</label>
                    <input type="number" id="maxClicks" placeholder="e.g., 100" min="1" max="10000"
                           aria-describedby="maxClicksHelp">
                    <div id="maxClicksHelp" class="sr-only">Optional: Limit the number of times this link can be accessed</div>
                </div>
            </div>

            <button type="submit" class="btn" id="submitBtn" data-i18n="shortenBtn">Shorten</button>
            <div id="submitHelp" class="sr-only">Press Enter or click to generate short link with your settings</div>
        </form>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p data-i18n="generating">Generating...</p>
        </div>

        <div class="error" id="error"></div>

        <div class="result" id="result">
            <h3 data-i18n="resultTitle">Ready!</h3>
            <div class="short-url">
                <input type="text" id="shortUrlInput" readonly>
                <button class="copy-btn" onclick="copyToClipboard()" id="copyBtn">Copy</button>
            </div>
            <div class="qr-section">
                <h4 id="qrTitle">QR Code</h4>
                <div id="qrcode" class="qr-container"></div>
                <button class="qr-btn" onclick="downloadQR()" id="downloadQR">Download QR</button>
            </div>
        </div>

        <div class="footer">
            <a href="https://github.com/chksz/greenlink" target="_blank" class="github-link">
                <svg class="github-icon" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span data-i18n="github">GitHub</span>
            </a>
        </div>
    </div>

    <script>
        // 全局语言配置
        let currentLang = 'en'; // 默认英文

        // 从全局设置获取语言配置
        async function loadLanguageSettings() {
            try {
                const response = await fetch('/api/language');
                if (response.ok) {
                    const data = await response.json();
                    currentLang = data.language || 'en';
                    updatePageText();
                } else {
                    // 如果获取失败，使用默认语言
                    updatePageText();
                }
            } catch (error) {
                console.log('Using default language settings');
                updatePageText();
            }
        }

        // 更新页面文本
        function updatePageText() {
            const texts = {
                en: {
                    subtitle: "Fast & Secure",
                    urlLabel: "Enter URL:",
                    urlPlaceholder: "https://example.com/long-url",
                    customLabel: "Custom code (optional):",
                    customPlaceholder: "my-link",
                    expiryLabel: "Link expiry (optional):",
                    advancedOptions: "Advanced",
                    shortenBtn: "Shorten",
                    generating: "Generating...",
                    resultTitle: "Ready!",
                    copyBtn: "Copy",
                    qrTitle: "QR Code",
                    downloadQR: "Download",
                    github: "GitHub",
                    copied: "Copied!",
                    invalidUrl: "Invalid URL",
                    customExists: "Custom code already exists",
                    networkError: "Network error. Please try again.",
                    notFound: "Short URL not found"
                },
                zh: {
                    subtitle: "快速安全",
                    urlLabel: "输入网址:",
                    urlPlaceholder: "https://example.com/长网址",
                    customLabel: "自定义代码 (可选):",
                    customPlaceholder: "我的链接",
                    expiryLabel: "链接过期时间 (可选):",
                    advancedOptions: "高级选项",
                    shortenBtn: "生成",
                    generating: "生成中...",
                    resultTitle: "完成!",
                    copyBtn: "复制",
                    qrTitle: "二维码",
                    downloadQR: "下载",
                    github: "GitHub",
                    copied: "已复制!",
                    invalidUrl: "无效的网址",
                    customExists: "自定义代码已存在",
                    networkError: "网络错误，请重试",
                    notFound: "短链接未找到"
                }
            };

            const langTexts = texts[currentLang] || texts.en;

            // 更新带有 data-i18n 属性的元素
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langTexts[key]) {
                    if (element.tagName === 'INPUT' && element.type !== 'text' && element.type !== 'url') {
                        element.value = langTexts[key];
                    } else {
                        element.textContent = langTexts[key];
                    }
                }
            });

            // 更新带有 data-i18n-placeholder 属性的元素
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (langTexts[key]) {
                    element.placeholder = langTexts[key];
                }
            });

            // 更新过期选择框选项
            const expirySelect = document.getElementById('expiryTime');
            if (expirySelect) {
                if (currentLang === 'zh') {
                    expirySelect.innerHTML = '<option value="">永不过期</option>' +
                        '<option value="1">1小时</option>' +
                        '<option value="24">1天</option>' +
                        '<option value="168">1周</option>' +
                        '<option value="720">1个月</option>' +
                        '<option value="8760">1年</option>';
                } else {
                    expirySelect.innerHTML = '<option value="">Never expires</option>' +
                        '<option value="1">1 hour</option>' +
                        '<option value="24">1 day</option>' +
                        '<option value="168">1 week</option>' +
                        '<option value="720">1 month</option>' +
                        '<option value="8760">1 year</option>';
                }
            }

            // 更新展开按钮文本
            if (typeof updateExpandButtonText === 'function') {
                updateExpandButtonText();
            }
        }

        // 键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: 提交表单
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const form = document.getElementById('shortenForm');
                if (form && !document.getElementById('submitBtn').disabled) {
                    form.dispatchEvent(new Event('submit'));
                }
            }

            // Ctrl/Cmd + K: 聚焦到URL输入框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('longUrl').focus();
            }

            // Escape: 清除错误信息
            if (e.key === 'Escape') {
                const error = document.getElementById('error');
                if (error.classList.contains('show')) {
                    error.classList.remove('show');
                }
            }
        });

        // PWA 安装提示
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // 检查用户是否已经关闭过安装提示
            const installDismissed = localStorage.getItem('pwa-install-dismissed');
            if (!installDismissed) {
                showInstallPrompt();
            }
        });

        function showInstallPrompt() {
            const installBanner = document.createElement('div');
            installBanner.className = 'install-banner';
            installBanner.innerHTML = '<div class="install-content">' +
                '<span>📱 Install GreenLink as an app for better experience</span>' +
                '<button onclick="installPWA()" class="install-btn">Install</button>' +
                '<button onclick="dismissInstall()" class="dismiss-btn">×</button>' +
                '</div>';
            document.body.appendChild(installBanner);

            setTimeout(() => {
                installBanner.classList.add('show');
            }, 100);
        }

        function installPWA() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installed');
                        // 安装成功后记录，避免再次提示
                        localStorage.setItem('pwa-install-dismissed', 'true');
                    }
                    deferredPrompt = null;
                    dismissInstall();
                });
            }
        }

        function dismissInstall() {
            const banner = document.querySelector('.install-banner');
            if (banner) {
                banner.remove();
                // 记录用户已关闭安装提示
                localStorage.setItem('pwa-install-dismissed', 'true');
            }
        }

        // Service Worker 注册
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // 页面加载时初始化
        document.addEventListener('DOMContentLoaded', () => {
            loadLanguageSettings();

            // 添加页面加载动画
            setTimeout(() => {
                const elements = document.querySelectorAll('.container, .logo, .form-group:not(.advanced-form .form-group)');
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('fade-in');
                    }, index * 100);
                });
            }, 100);

            // 添加焦点管理
            setupFocusManagement();
        });

        // 焦点管理
        function setupFocusManagement() {
            const inputs = document.querySelectorAll('input, button');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.transform = 'scale(1.02)';
                });

                input.addEventListener('blur', () => {
                    input.style.transform = 'scale(1)';
                });
            });
        }

        // 展开/收起高级选项功能
        const expandBtn = document.getElementById('expandBtn');
        const advancedForm = document.getElementById('advancedForm');
        let isAdvancedExpanded = false;

        expandBtn.addEventListener('click', () => {
            isAdvancedExpanded = !isAdvancedExpanded;

            if (isAdvancedExpanded) {
                // 展开
                advancedForm.style.display = 'block';
                advancedForm.classList.add('show');
                expandBtn.classList.add('expanded');
                updateExpandButtonText();
            } else {
                // 收起
                advancedForm.style.display = 'none';
                expandBtn.classList.remove('expanded');
                updateExpandButtonText();
            }
        });

        // 更新展开按钮文本
        function updateExpandButtonText() {
            const span = expandBtn.querySelector('span');
            if (isAdvancedExpanded) {
                span.textContent = currentLang === 'zh' ? '简单模式' : 'Simple';
            } else {
                span.textContent = currentLang === 'zh' ? '高级选项' : 'Advanced';
            }
        }

        document.getElementById('shortenForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const longUrl = document.getElementById('longUrl').value;
            const customCode = document.getElementById('customCode').value;
            const expiryHours = document.getElementById('expiryTime').value;
            const password = document.getElementById('password').value;
            const maxClicks = document.getElementById('maxClicks').value;
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
                    body: JSON.stringify({ url: longUrl, customCode, expiryHours, password, maxClicks }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('shortUrlInput').value = data.shortUrl;
                    generateQRCode(data.shortUrl);
                    result.classList.add('show');
                } else {
                    error.textContent = data.error || 'An error occurred';
                    error.classList.add('show');
                }
            } catch (err) {
                error.textContent = 'Network error. Please try again.';
                error.classList.add('show');
            } finally {
                loading.classList.remove('show');
                submitBtn.disabled = false;
            }
        });

        function copyToClipboard() {
            const shortUrlInput = document.getElementById('shortUrlInput');
            shortUrlInput.select();
            document.execCommand('copy');

            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            const copiedText = currentLang === 'zh' ? '已复制!' : 'Copied!';
            copyBtn.textContent = copiedText;
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }

        // Generate QR Code using a simple QR code API
        function generateQRCode(url) {
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';

            const qrImg = document.createElement('img');
            qrImg.src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent(url)}\`;
            qrImg.alt = 'QR Code';
            qrImg.style.maxWidth = '100%';
            qrImg.style.height = 'auto';

            qrContainer.appendChild(qrImg);
        }

        // Download QR Code
        function downloadQR() {
            const qrImg = document.querySelector('#qrcode img');
            if (!qrImg) return;

            const link = document.createElement('a');
            link.href = qrImg.src;
            link.download = 'greenlink-qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

// 404 Not Found page
function getNotFoundPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - Link Not Found</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNkgxNk0xNiAxNkgyNE0xNiAxNlY4TTE2IDE2VjI0IiBzdHJva2U9IiMwMEZGODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+Cjwvc3ZnPgo=">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }

        .container {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }

        h1 {
            font-size: 4em;
            margin-bottom: 20px;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }

        h2 {
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #888;
        }

        p {
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            color: #000;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            margin: 0 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <h2>Link Not Found</h2>
        <p>The short link you're looking for doesn't exist or has been removed.</p>
        <a href="/" class="btn">← Back to Home</a>
        <a href="/manage" class="btn">View Statistics</a>
    </div>
</body>
</html>`;
}

// Password protection page
function getPasswordPage(shortCode) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - Password Required</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNkgxNk0xNiAxNkgyNE0xNiAxNlY4TTE2IDE2VjI0IiBzdHJva2U9IiMwMEZGODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ci8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+Cjwvc3ZnPgo=">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 255, 136, 0.8); }
        p { margin-bottom: 30px; line-height: 1.6; color: #888; }
        input { width: 100%; padding: 16px; background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 12px; color: #00ff88; font-size: 16px; margin-bottom: 20px; transition: all 0.3s ease; }
        input:focus { outline: none; border-color: #00ff88; box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1); background: rgba(0, 0, 0, 0.8); }
        .btn { width: 100%; padding: 16px; background: linear-gradient(45deg, #00ff88, #00cc6a); color: #000; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3); }
        .back-link { display: inline-block; margin-top: 20px; color: #888; text-decoration: none; }
        .back-link:hover { color: #00ff88; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Password Required</h1>
        <p>This link is password protected. Please enter the password to continue.</p>
        <form onsubmit="submitPassword(event)">
            <input type="password" id="password" placeholder="Enter password" required>
            <button type="submit" class="btn">Access Link</button>
        </form>
        <a href="/" class="back-link">← Back to Home</a>
    </div>
    <script>
        function submitPassword(event) {
            event.preventDefault();
            const password = document.getElementById('password').value;
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('p', password);
            window.location.href = currentUrl.toString();
        }
    </script>
</body>
</html>`;
}

// Link limit exceeded page
function getLimitExceededPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - Access Limit Exceeded</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNkgxNk0xNiAxNkgyNE0xNiAxNlY4TTE2IDE2VjI0IiBzdHJva2U9IiMwMEZGODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ci8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+Cjwvc3ZnPgo=">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 68, 68, 0.3);
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin-bottom: 20px; color: #ff4444; }
        h2 { font-size: 1.5em; margin-bottom: 20px; color: #ff4444; }
        p { margin-bottom: 30px; line-height: 1.6; color: #888; }
        .btn { display: inline-block; padding: 16px 32px; background: linear-gradient(45deg, #00ff88, #00cc6a); color: #000; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s ease; margin: 0 10px; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚠️</h1>
        <h2>Access Limit Exceeded</h2>
        <p>This link has reached its maximum number of allowed accesses and is no longer available.</p>
        <a href="/" class="btn">← Back to Home</a>
        <a href="/manage" class="btn">View Statistics</a>
    </div>
</body>
</html>`;
}

// Management page for viewing and managing links
function getManagePage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GreenLink - Admin Dashboard</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNkgxNk0xNiAxNkgyNE0xNiAxNlY4TTE2IDE2VjI0IiBzdHJva2U9IiMwMEZGODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIyIiBmaWxsPSIjMDBGRjg4Ci8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iIzAwRkY4OCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjI0IiByPSIyIiBmaWxsPSIjMDBGRjg4Ii8+Cjwvc3ZnPgo=">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #00ff88;
            min-height: 100vh;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .admin-container {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.9));
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 24px;
            padding: 40px;
            max-width: 900px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
        }

        .admin-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 50%, rgba(0, 255, 136, 0.05) 100%);
            border-radius: 24px;
            pointer-events: none;
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            position: relative;
        }

        .header h1 {
            font-size: 2.5em;
            color: #00ff88;
            margin-bottom: 15px;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }



        .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }

        .login-box {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.9));
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 24px;
            padding: 50px;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            text-align: center;
            position: relative;
            overflow: hidden;
            animation: loginBoxFadeIn 0.8s ease-out;
        }

        @keyframes loginBoxFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .login-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 50%, rgba(0, 255, 136, 0.05) 100%);
            border-radius: 24px;
            pointer-events: none;
        }

        .login-box h1 {
            font-size: 2em;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
            margin-bottom: 20px;
        }

        .login-box p {
            color: #888;
            margin-bottom: 30px;
        }

        .login-box input {
            width: 100%;
            padding: 16px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 12px;
            color: #00ff88;
            font-size: 16px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .login-box input:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
            background: rgba(0, 0, 0, 0.8);
        }

        .login-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            border: none;
            border-radius: 12px;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .login-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
        }

        .logout-btn {
            padding: 15px 25px;
            background: linear-gradient(45deg, #ff4444, #cc3333);
            border: none;
            border-radius: 16px;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        .logout-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .logout-btn:hover {
            background: linear-gradient(45deg, #cc3333, #ff4444);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(255, 68, 68, 0.3);
        }

        .logout-btn:hover::before {
            left: 100%;
        }

        .nav-links {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .nav-links a {
            color: #00ff88;
            text-decoration: none;
            padding: 15px 25px;
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        .nav-links a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
            transition: left 0.5s;
        }

        .nav-links a:hover {
            background: rgba(0, 255, 136, 0.2);
            border-color: #00ff88;
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
        }

        .nav-links a:hover::before {
            left: 100%;
        }

        .nav-links a:hover {
            background: #00ff88;
            color: #000;
        }

        .search-section {
            margin: 0 auto 30px;
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 16px;
            padding: 25px;
            position: relative;
        }

        .search-section h3 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.2em;
            color: #00ff88;
        }

        .search-input {
            width: 100%;
            padding: 15px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 12px;
            color: #00ff88;
            font-size: 16px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .search-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            border: none;
            border-radius: 12px;
            color: #000;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .search-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }

        .stats-container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff88;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }

        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #00ff88;
        }

        .stat-label {
            color: #888;
            margin-top: 5px;
        }

        .chart-section {
            margin-top: 30px;
        }

        .chart-title {
            font-size: 1.2em;
            margin-bottom: 15px;
            color: #00ff88;
        }

        .chart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 10px;
            background: rgba(0, 255, 136, 0.05);
            border-radius: 5px;
        }

        .chart-bar {
            height: 20px;
            background: linear-gradient(90deg, #00ff88, #00cc6a);
            border-radius: 10px;
            margin-left: 15px;
            min-width: 20px;
        }

        .error {
            color: #ff4444;
            text-align: center;
            padding: 20px;
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid #ff4444;
            border-radius: 10px;
            margin: 20px 0;
        }

        .loading {
            text-align: center;
            padding: 40px;
        }

        .spinner {
            border: 2px solid #333;
            border-top: 2px solid #00ff88;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dashboard-tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 40px;
            gap: 15px;
            background: rgba(0, 0, 0, 0.3);
            padding: 8px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 136, 0.2);
        }

        .tab-btn {
            padding: 16px 28px;
            background: transparent;
            border: none;
            border-radius: 16px;
            color: #00ff88;
            cursor: pointer;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .tab-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            opacity: 0;
            transition: opacity 0.4s ease;
            border-radius: 16px;
        }

        .tab-btn span {
            position: relative;
            z-index: 1;
        }

        .tab-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
        }

        .tab-btn:hover::before {
            opacity: 0.2;
        }

        .tab-btn.active {
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.4);
        }

        .tab-btn.active::before {
            opacity: 0;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }



        .system-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .info-card {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
        }

        .info-card h4 {
            color: #00ff88;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        .info-card p {
            color: #888;
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .setting-group {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
        }

        .setting-group h4 {
            color: #00ff88;
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .setting-group p {
            color: #888;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .language-selector {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .language-selector label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 10px 15px;
            border: 1px solid #333;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .language-selector label:hover {
            border-color: #00ff88;
            background: rgba(0, 255, 136, 0.1);
        }

        .language-selector input[type="radio"] {
            accent-color: #00ff88;
        }

        .language-selector input[type="radio"]:checked + span {
            color: #00ff88;
            font-weight: bold;
        }

        .save-btn {
            padding: 12px 24px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            border: none;
            border-radius: 8px;
            color: #000;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
        }

        .status-label {
            color: #888;
        }

        .status-value {
            font-weight: bold;
        }

        .status-active {
            color: #00ff88;
        }

        .status-inactive {
            color: #ff4444;
        }

        .session-info {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 20px;
        }

        .session-info p {
            margin-bottom: 10px;
            color: #ccc;
        }

        .session-info strong {
            color: #00ff88;
        }

        @media (max-width: 600px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .nav-links a, .nav-links button {
                display: block;
                margin: 10px 0;
            }

            .dashboard-tabs {
                flex-direction: column;
                align-items: center;
            }

            .tab-btn {
                width: 200px;
            }

            .link-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }

            .link-actions {
                width: 100%;
                justify-content: flex-end;
            }
        }
    </style>
</head>
<body>
    <!-- Login Form -->
    <div id="loginForm" class="login-container">
        <div class="login-box">
            <h1 data-admin-i18n="loginTitle">🔐 Admin Login</h1>
            <p data-admin-i18n="loginSubtitle">Enter admin password to access dashboard</p>
            <form id="adminLoginForm">
                <input type="password" id="adminPassword" data-admin-i18n-placeholder="passwordPlaceholder" placeholder="Admin Password" required>
                <button type="submit" class="login-btn" data-admin-i18n="loginBtn">Login</button>
            </form>
            <div id="loginError" class="error" style="display: none;"></div>
            <div class="nav-links">
                <a href="/" data-admin-i18n="backToHome">← Back to Home</a>
            </div>
        </div>
    </div>

    <!-- Admin Dashboard -->
    <div id="adminDashboard" style="display: none;">
        <div class="admin-container">
            <div class="header">
                <h1 data-admin-i18n="dashboardTitle">🚀 GreenLink Admin Dashboard</h1>
                <p data-admin-i18n="dashboardSubtitle">Manage your short links and view analytics</p>
                <div class="nav-links">
                    <a href="/" data-admin-i18n="backToHome">← Back to Home</a>
                    <button onclick="logout()" class="logout-btn" data-admin-i18n="logoutBtn">Logout</button>
                    <a href="https://github.com/chksz/greenlink" target="_blank">GitHub</a>
                </div>
            </div>

        <!-- Dashboard Tabs -->
        <div class="dashboard-tabs">
            <button class="tab-btn active" onclick="showTab('stats')"><span data-admin-i18n="tabStats">📊 Statistics</span></button>
            <button class="tab-btn" onclick="showTab('settings')"><span data-admin-i18n="tabSettings">⚙️ Settings</span></button>
        </div>

        <!-- Statistics Tab -->
        <div id="statsTab" class="tab-content active">
            <div class="search-section">
                <h3 data-admin-i18n="statsTitle">Enter Short Code to View Statistics</h3>
                <input type="text" id="shortCodeInput" class="search-input" data-admin-i18n-placeholder="statsPlaceholder" placeholder="Enter short code (e.g., abc123)" maxlength="20">
                <button onclick="loadStats()" class="search-btn" data-admin-i18n="viewStatsBtn">View Statistics</button>
            </div>
        </div>



        <!-- Settings Tab -->
        <div id="settingsTab" class="tab-content">
            <div class="search-section">
                <h3 data-admin-i18n="settingsTitle">System Settings</h3>

                <!-- Language Settings -->
                <div class="setting-group">
                    <h4 data-admin-i18n="languageSettingsTitle">🌐 Global Language Settings</h4>
                    <p data-admin-i18n="languageSettingsDesc">Set the global language for all users (affects both frontend and backend)</p>
                    <div class="language-selector">
                        <label>
                            <input type="radio" name="language" value="en" id="langEn" checked>
                            <span>English</span>
                        </label>
                        <label>
                            <input type="radio" name="language" value="zh" id="langZh">
                            <span>中文 (Chinese)</span>
                        </label>
                    </div>
                    <button onclick="saveLanguageSettings()" class="save-btn" data-admin-i18n="saveLanguageBtn">Save Language Settings</button>
                </div>


            </div>
        </div>
    </div>

    <div id="loading" class="loading" style="display: none;">
        <div class="spinner"></div>
        <p data-admin-i18n="loadingStats">Loading statistics...</p>
    </div>

    <div id="error" class="error" style="display: none;"></div>

    <div id="statsContainer" class="stats-container" style="display: none; margin-top: 30px;">
        <h2><span data-admin-i18n="statisticsFor">Statistics for:</span> <span id="currentShortCode"></span></h2>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="totalClicks">0</div>
                <div class="stat-label" data-admin-i18n="totalClicks">Total Clicks</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="targetUrl">-</div>
                <div class="stat-label" data-admin-i18n="targetUrl">Target URL</div>
            </div>
        </div>
    </div>

    <script>
        let adminToken = localStorage.getItem('adminToken');
        let adminCurrentLang = 'en'; // 默认英文

        // 全局错误处理函数
        function handleApiError(response, data) {
            if (response.status === 401) {
                // 认证失败，清除token并跳转到登录页面
                adminToken = null;
                localStorage.removeItem('adminToken');
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('adminDashboard').style.display = 'none';
                document.getElementById('loginError').textContent = 'Session expired. Please login again.';
                document.getElementById('loginError').style.display = 'block';
                return true; // 表示已处理错误
            }
            return false; // 表示未处理错误
        }

        // 后台多语言配置
        const adminTranslations = {
            en: {
                loginTitle: "🔐 Admin Login",
                loginSubtitle: "Enter admin password to access dashboard",
                passwordPlaceholder: "Admin Password",
                loginBtn: "Login",
                backToHome: "← Back to Home",
                dashboardTitle: "🚀 GreenLink Admin Dashboard",
                dashboardSubtitle: "Manage your short links and view analytics",
                logoutBtn: "Logout",
                tabStats: "📊 Statistics",
                tabLinks: "🔗 All Links",
                tabSettings: "⚙️ Settings",
                statsTitle: "Enter Short Code to View Statistics",
                statsPlaceholder: "Enter short code (e.g., abc123)",
                viewStatsBtn: "View Statistics",
                linksTitle: "All Short Links",
                loadLinksBtn: "Load All Links",
                settingsTitle: "System Settings",
                languageSettingsTitle: "🌐 Global Language Settings",
                languageSettingsDesc: "Set the global language for all users (affects both frontend and backend)",
                saveLanguageBtn: "Save Language Settings",

                loadingStats: "Loading statistics...",
                statisticsFor: "Statistics for:",
                totalClicks: "Total Clicks",
                targetUrl: "Target URL"
            },
            zh: {
                loginTitle: "🔐 管理员登录",
                loginSubtitle: "输入管理员密码以访问控制台",
                passwordPlaceholder: "管理员密码",
                loginBtn: "登录",
                backToHome: "← 返回首页",
                dashboardTitle: "🚀 GreenLink 管理控制台",
                dashboardSubtitle: "管理您的短链接并查看分析数据",
                logoutBtn: "退出登录",
                tabStats: "📊 统计分析",
                tabLinks: "🔗 所有链接",
                tabSettings: "⚙️ 系统设置",
                statsTitle: "输入短代码查看统计信息",
                statsPlaceholder: "输入短代码 (例如: abc123)",
                viewStatsBtn: "查看统计",
                linksTitle: "所有短链接",
                loadLinksBtn: "加载所有链接",
                settingsTitle: "系统设置",
                languageSettingsTitle: "🌐 全局语言设置",
                languageSettingsDesc: "设置所有用户的全局语言（影响前台和后台界面）",
                saveLanguageBtn: "保存语言设置",

                loadingStats: "正在加载统计数据...",
                statisticsFor: "统计信息:",
                totalClicks: "总点击数",
                targetUrl: "目标链接"
            }
        };

        // 加载后台语言设置
        async function loadAdminLanguage() {
            try {
                const response = await fetch('/api/language');
                if (response.ok) {
                    const data = await response.json();
                    adminCurrentLang = data.language || 'en';
                    updateAdminPageText();
                }
            } catch (error) {
                console.log('Using default admin language');
                updateAdminPageText();
            }
        }

        // 更新后台页面文本
        function updateAdminPageText() {
            const texts = adminTranslations[adminCurrentLang] || adminTranslations.en;

            // 更新所有带有 data-admin-i18n 属性的元素
            document.querySelectorAll('[data-admin-i18n]').forEach(element => {
                const key = element.getAttribute('data-admin-i18n');
                if (texts[key]) {
                    element.textContent = texts[key];
                }
            });

            // 更新 placeholder
            document.querySelectorAll('[data-admin-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-admin-i18n-placeholder');
                if (texts[key]) {
                    element.placeholder = texts[key];
                }
            });
        }

        // 验证session是否有效
        async function validateSession() {
            if (!adminToken) return false;

            try {
                const response = await fetch('/api/stats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shortCode: 'test', token: adminToken }),
                });

                if (response.status === 401) {
                    // Session已过期
                    adminToken = null;
                    localStorage.removeItem('adminToken');
                    return false;
                }

                return true;
            } catch (error) {
                return false;
            }
        }

        // Check if already logged in
        document.addEventListener('DOMContentLoaded', async () => {
            loadAdminLanguage();
            if (adminToken) {
                // 验证session是否仍然有效
                const isValid = await validateSession();
                if (isValid) {
                    showDashboard();
                } else {
                    // Session无效，显示登录表单
                    document.getElementById('loginForm').style.display = 'block';
                    document.getElementById('adminDashboard').style.display = 'none';
                }
            }
        });

        // Admin login
        document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('adminPassword').value;
            const loginError = document.getElementById('loginError');

            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password }),
                });

                const data = await response.json();

                if (response.ok) {
                    adminToken = data.token;
                    localStorage.setItem('adminToken', adminToken);
                    showDashboard();
                } else {
                    loginError.textContent = data.error || 'Login failed';
                    loginError.style.display = 'block';
                }
            } catch (err) {
                loginError.textContent = 'Network error. Please try again.';
                loginError.style.display = 'block';
            }
        });

        // Show dashboard
        function showDashboard() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';

            // Load current settings and language
            loadCurrentSettings();
            loadAdminLanguage();

            // Set session time
            document.getElementById('sessionTime').textContent = new Date().toLocaleString();
        }

        // Logout
        async function logout() {
            try {
                await fetch('/api/admin/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: adminToken }),
                });
            } catch (err) {
                console.error('Logout error:', err);
            }

            adminToken = null;
            localStorage.removeItem('adminToken');
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'none';
        }

        // Tab switching
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Hide stats container when switching away from stats tab
            if (tabName !== 'stats') {
                const statsContainer = document.getElementById('statsContainer');
                const errorDiv = document.getElementById('error');
                if (statsContainer) statsContainer.style.display = 'none';
                if (errorDiv) errorDiv.style.display = 'none';
            }

            // Show selected tab
            document.getElementById(tabName + 'Tab').classList.add('active');

            // Activate the correct button based on tab name
            if (tabName === 'stats') {
                document.querySelector('.tab-btn:first-child').classList.add('active');
            } else if (tabName === 'settings') {
                document.querySelector('.tab-btn:last-child').classList.add('active');
            }
        }

        async function loadStats() {
            const shortCode = document.getElementById('shortCodeInput').value.trim();
            if (!shortCode) {
                showError('Please enter a short code');
                return;
            }

            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const statsContainer = document.getElementById('statsContainer');

            // Reset states
            loading.style.display = 'block';
            error.style.display = 'none';
            statsContainer.style.display = 'none';

            try {
                const response = await fetch('/api/stats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shortCode, token: adminToken }),
                });

                const data = await response.json();

                if (response.ok) {
                    displayStats(shortCode, data);
                } else {
                    // 检查是否是认证错误
                    if (!handleApiError(response, data)) {
                        showError(data.error || 'Failed to load statistics');
                    }
                }
            } catch (err) {
                showError('Network error. Please try again.');
            } finally {
                loading.style.display = 'none';
            }
        }

        function displayStats(shortCode, stats) {
            document.getElementById('currentShortCode').textContent = shortCode;
            document.getElementById('totalClicks').textContent = stats.clicks;

            // Display target URL
            const targetUrlElement = document.getElementById('targetUrl');
            if (targetUrlElement) {
                targetUrlElement.textContent = stats.url || 'N/A';
            }

            document.getElementById('statsContainer').style.display = 'block';
        }



        function showError(message) {
            const error = document.getElementById('error');
            error.textContent = message;
            error.style.display = 'block';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }



        // View link statistics
        function viewLinkStats(shortCode) {
            showTab('stats');
            document.getElementById('shortCodeInput').value = shortCode;
            loadStats();
        }

        // Delete link
        async function deleteLink(shortCode) {
            if (!confirm(\`Are you sure you want to delete the link "\${shortCode}"? This action cannot be undone.\`)) {
                return;
            }

            try {
                const response = await fetch('/api/admin/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shortCode, token: adminToken }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Link deleted successfully!');
                } else {
                    // 检查是否是认证错误
                    if (!handleApiError(response, data)) {
                        alert(data.error || 'Failed to delete link');
                    }
                }
            } catch (err) {
                alert('Network error. Please try again.');
            }
        }

        // Load current settings
        async function loadCurrentSettings() {
            try {
                const response = await fetch('/api/language');
                if (response.ok) {
                    const data = await response.json();
                    const language = data.language || 'en';

                    // Update radio buttons
                    document.getElementById('langEn').checked = language === 'en';
                    document.getElementById('langZh').checked = language === 'zh';
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        }

        // Save language settings
        async function saveLanguageSettings() {
            const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

            try {
                const response = await fetch('/api/admin/language', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        language: selectedLanguage,
                        token: adminToken
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    const successMsg = adminCurrentLang === 'zh' ?
                        '全局语言设置保存成功！页面将刷新以应用新语言。' :
                        'Global language settings saved successfully! Page will refresh to apply new language.';
                    alert(successMsg);

                    // Update current language and refresh both frontend and backend
                    adminCurrentLang = selectedLanguage;
                    updateAdminPageText();

                    // Reload the page to apply new language globally
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // 检查是否是认证错误
                    if (!handleApiError(response, data)) {
                        const errorMsg = adminCurrentLang === 'zh' ? '保存全局语言设置失败' : 'Failed to save global language settings';
                        alert(data.error || errorMsg);
                    }
                }
            } catch (error) {
                const networkErrorMsg = adminCurrentLang === 'zh' ? '网络错误，请重试' : 'Network error. Please try again.';
                alert(networkErrorMsg);
            }
        }

        // Allow Enter key to trigger search
        document.getElementById('shortCodeInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadStats();
            }
        });
    </script>
</body>
</html>`;
}
