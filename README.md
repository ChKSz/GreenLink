# GreenLink - URL Shortener

A modern, minimalist URL shortener built with Cloudflare Workers and KV storage, featuring a sleek black-green tech aesthetic.

## Features

- 🚀 Fast URL shortening powered by Cloudflare Workers
- 💾 Reliable storage with Cloudflare KV
- 🎨 Modern black-green tech UI design
- 📱 Responsive design for all devices
- 🔗 Custom short codes support
- 📊 Simple and clean interface

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

1. Enter a long URL
2. Optionally specify a custom short code
3. Click "Shorten URL"
4. Copy and share your short link!

## Tech Stack

- Cloudflare Workers
- Cloudflare KV Storage
- Vanilla JavaScript
- Modern CSS with tech aesthetics
