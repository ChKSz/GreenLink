# 🚀 GreenLink - Modern URL Shortener

A modern URL shortener built with Cloudflare Workers and KV storage, featuring a sleek black-green tech UI and powerful management capabilities.

[中文文档](README_CN.md) | [Git Deploy Guide](GIT_DEPLOY_GUIDE.md)

## ✨ Features

### 🎨 Modern Interface
- **Black-Green Tech Design**: Cool gradients and animations
- **Responsive Layout**: Perfect for desktop and mobile
- **Bilingual Support**: English and Chinese interface
- **Smooth Animations**: Carefully crafted interactions

### 🔗 Core Functionality
- **Quick Generation**: One-click URL shortening
- **Custom Codes**: Support for custom short codes
- **Advanced Options**: Password protection, expiration, click limits
- **One-Click Copy**: Convenient copy functionality
- **QR Code Generation**: Automatic QR code creation

### 📊 Analytics
- **Real-time Stats**: Accurate click tracking
- **Access Analysis**: Referrer, device, and geo statistics
- **Admin Dashboard**: Professional management interface

### 🔒 Security
- **Admin Authentication**: Secure backend login system
- **Password Protection**: Optional link passwords
- **Access Limits**: Click count restrictions
- **Security Headers**: Complete HTTP security headers

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your KV namespace in `wrangler.toml`
3. Update the DOMAIN variable in `wrangler.toml`
4. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

## Development

Run locally:
```bash
npm run dev
```

## Usage

### Creating Short Links
1. **Enter a long URL** in the input field
2. **Optionally specify a custom short code** (letters, numbers, hyphens, underscores)
3. **Click "Shorten URL"** to generate the link
4. **Copy the short link** or **download the QR code**

### Managing Links
1. **Visit `/manage`** to access the management interface
2. **Enter a short code** to view detailed statistics
3. **View analytics** including clicks, referrers, devices, and countries
4. **Track performance** over time with daily click data

### Language Support
- **Admin-controlled language** settings in the management dashboard
- **Global language configuration** affects all users
- **Supported languages**: English and Chinese (中文)

## Tech Stack

- **Cloudflare Workers** - Edge computing platform
- **Cloudflare KV Storage** - Global key-value storage
- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Tech aesthetics with animations
- **QR Code API** - External service for QR generation
- **Progressive Web App** - Offline-capable features

## API Endpoints

### POST `/api/shorten`
Create a new short URL
```json
{
  "url": "https://example.com/very-long-url",
  "customCode": "my-link"  // optional
}
```

### POST `/api/stats`
Get statistics for a short code
```json
{
  "shortCode": "abc123"
}
```

### GET `/{shortCode}`
Redirect to the original URL (with analytics tracking)

## New Features in v2.0

### 📊 **Advanced Analytics**
- **Click tracking** with timestamps
- **Referrer analysis** showing traffic sources
- **Device detection** (mobile/tablet/desktop)
- **Geographic data** from Cloudflare headers
- **Daily click charts** for trend analysis

### 🔒 **Enhanced Security**
- **Rate limiting** (10 requests per minute per IP)
- **URL blacklist** filtering for malicious sites
- **XSS protection** with security headers
- **Input validation** and sanitization

### 🎨 **Improved UX**
- **QR code generation** for mobile sharing
- **Admin-controlled language** settings
- **Secure management dashboard** at `/manage`
- **Custom 404 pages** with helpful navigation
- **Performance optimizations** with caching

### 🛠 **Technical Improvements**
- **Modular code structure** with better organization
- **Error handling** with graceful degradation
- **Caching strategies** for better performance
- **Security headers** for protection
