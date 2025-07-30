# GreenLink 部署指南

## 前置要求

1. **Cloudflare 账户**: 注册 [Cloudflare](https://cloudflare.com) 账户
2. **Node.js**: 安装 Node.js (推荐 v18+)
3. **Wrangler CLI**: Cloudflare Workers 的命令行工具

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装并配置 Wrangler

```bash
# 全局安装 wrangler
npm install -g wrangler

# 登录 Cloudflare 账户
wrangler login
```

### 3. 创建 KV 命名空间

```bash
# 创建生产环境 KV 命名空间
wrangler kv:namespace create "URL_STORE"

# 创建预览环境 KV 命名空间
wrangler kv:namespace create "URL_STORE" --preview
```

命令执行后会返回类似这样的输出：
```
🌀 Creating namespace with title "greenlink-shortener-URL_STORE"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "URL_STORE", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

### 4. 更新配置文件

将上一步获得的 KV 命名空间 ID 更新到 `wrangler.toml` 文件中：

```toml
name = "greenlink-shortener"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "URL_STORE"
id = "your-production-kv-namespace-id"  # 替换为实际的 ID
preview_id = "your-preview-kv-namespace-id"  # 替换为实际的预览 ID

[vars]
DOMAIN = "your-domain.com"  # 替换为你的域名
```

### 5. 本地测试

```bash
# 启动本地开发服务器
npm run dev
```

访问 `http://localhost:8787` 测试功能。

### 6. 部署到 Cloudflare

```bash
# 部署到生产环境
npm run deploy
```

部署成功后，你会看到类似这样的输出：
```
✨ Success! Deployed to https://greenlink-shortener.your-subdomain.workers.dev
```

## 自定义域名配置

### 1. 添加域名到 Cloudflare

1. 在 Cloudflare 控制台添加你的域名
2. 更新域名的 DNS 设置指向 Cloudflare

### 2. 配置 Workers 路由

1. 进入 Cloudflare 控制台 > Workers & Pages
2. 选择你的 Worker
3. 点击 "Triggers" 标签
4. 添加自定义域名或路由

### 3. 更新配置

更新 `wrangler.toml` 中的 `DOMAIN` 变量为你的自定义域名。

## 环境变量说明

- `DOMAIN`: 你的短链接域名，用于生成完整的短链接 URL

## 功能特性

✅ **URL 缩短**: 将长 URL 转换为短链接  
✅ **自定义代码**: 支持自定义短链接代码  
✅ **重定向**: 快速重定向到原始 URL  
✅ **响应式设计**: 适配所有设备  
✅ **科技感 UI**: 黑绿配色的现代界面  
✅ **一键复制**: 快速复制生成的短链接  

## API 接口

### POST /api/shorten

创建短链接

**请求体:**
```json
{
  "url": "https://example.com/very-long-url",
  "customCode": "my-link"  // 可选
}
```

**响应:**
```json
{
  "shortUrl": "https://your-domain.com/abc123",
  "longUrl": "https://example.com/very-long-url",
  "shortCode": "abc123"
}
```

### GET /{shortCode}

重定向到原始 URL

## 故障排除

### 常见问题

1. **KV 命名空间错误**: 确保 `wrangler.toml` 中的 KV 命名空间 ID 正确
2. **部署失败**: 检查 Wrangler 是否已登录 (`wrangler whoami`)
3. **本地测试问题**: 确保使用 `npm run dev` 而不是 `wrangler dev --local`

### 调试技巧

```bash
# 查看 Worker 日志
wrangler tail

# 查看 KV 存储内容
wrangler kv:key list --binding=URL_STORE

# 手动添加测试数据
wrangler kv:key put --binding=URL_STORE "test" "https://example.com"
```

## 性能优化

- Cloudflare Workers 在全球边缘节点运行，延迟极低
- KV 存储提供最终一致性，适合读多写少的场景
- 支持每天 100,000 次免费请求

## 安全考虑

- 输入验证：自动验证 URL 格式
- 防止重复：检查自定义代码是否已存在
- CORS 支持：安全的跨域请求处理

## 扩展功能

可以考虑添加的功能：
- 访问统计
- 过期时间设置
- 批量创建
- 管理界面
- API 密钥认证
