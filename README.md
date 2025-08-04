# 🚀 GreenLink - 现代化短链接生成器

一个基于 Cloudflare Workers 和 KV 存储的现代化短链接生成器，具有黑绿科技感 UI 设计和强大的管理功能。

## ✨ 主要特性

### 🎨 现代化界面
- **黑绿科技感设计**：炫酷的渐变效果和动画
- **响应式布局**：完美适配桌面和移动设备
- **中英文双语**：支持界面语言切换
- **流畅动画**：精心设计的交互动效

### 🔗 核心功能
- **快速生成**：一键生成短链接
- **自定义代码**：支持自定义短代码
- **高级选项**：密码保护、过期时间、点击限制
- **一键复制**：便捷的复制功能
- **二维码生成**：自动生成 QR 码

### 📊 数据统计
- **实时统计**：准确记录每次点击
- **访问分析**：来源、设备、地理位置统计
- **管理面板**：专业的后台管理界面

### 🔒 安全特性
- **管理员认证**：安全的后台登录系统
- **密码保护**：链接可设置访问密码
- **访问限制**：支持点击次数限制
- **安全头部**：完整的 HTTP 安全头设置

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- Cloudflare 账户
- Wrangler CLI

### 1. 克隆项目
```bash
git clone https://github.com/ChKSz/greenlink.git
cd greenlink
```

### 2. 安装依赖
```bash
npm install -g wrangler
```

### 3.创建 `wrangler.toml`：
```toml
name = "greenlink"
main = "src/index.js"
compatibility_date = "2025-08-04"

[vars]
ADMIN_PASSWORD = "your-secure-password"

[[kv_namespaces]]
binding = "URL_STORE"
id = "your-kv-namespace-id"
```

### 4. 创建 KV 命名空间
```bash
wrangler kv:namespace create "URL_STORE"
```

### 5. 部署到 Cloudflare
```bash
wrangler deploy
```

## 📖 使用指南

### 创建短链接
1. 访问您的 GreenLink 网站
2. 输入要缩短的长链接
3. （可选）设置自定义代码
4. （可选）展开高级选项设置密码、过期时间等
5. 点击"生成"按钮
6. 复制生成的短链接

### 管理后台
1. 访问 `https://your-domain.com/manage`
2. 使用管理员密码登录
3. 在统计页面查看链接数据
4. 在设置页面配置系统选项

### 高级功能

#### 密码保护
为敏感链接设置访问密码：
```
原链接：https://example.com/sensitive-page
短链接：https://your-domain.com/abc123
访问时需要输入密码
```

#### 过期时间
设置链接的有效期：
- 1小时、24小时、7天、30天
- 过期后自动失效

#### 点击限制
限制链接的访问次数：
- 设置最大点击数（如100次）
- 达到限制后链接失效

## 🛠 技术架构

### 前端技术
- **纯 HTML/CSS/JavaScript**：无框架依赖
- **响应式设计**：CSS Grid 和 Flexbox
- **现代 CSS**：CSS 变量、动画、渐变

### 后端技术
- **Cloudflare Workers**：边缘计算平台
- **KV 存储**：分布式键值存储
- **Web Standards**：基于标准 Web API

### 数据结构
```javascript
// URL 数据
{
  url: "https://example.com",
  password: "optional-password",
  maxClicks: 100,
  currentClicks: 0,
  expiresAt: "2024-12-31T23:59:59Z"
}

// 统计数据
{
  clicks: 42,
  created: "2024-01-01T00:00:00Z",
  lastAccess: "2024-01-02T12:00:00Z",
  url: "https://example.com",
  referrers: {"direct": 20, "google.com": 15},
  countries: {"CN": 25, "US": 10},
  userAgents: {"mobile": 30, "desktop": 12}
}
```

## 🔧 配置选项

### 环境变量
| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ADMIN_PASSWORD` | 管理员密码 | 必须设置 |
| `RATE_LIMIT` | 速率限制（每分钟） | 10 |
| `DEFAULT_LANGUAGE` | 默认语言 | en |

### KV 命名空间
- `URL_STORE`：存储 URL 映射和统计数据
- 自动过期：支持 TTL 设置

## 📊 API 文档

### 创建短链接
```http
POST /api/shorten
Content-Type: application/json

{
  "longUrl": "https://example.com",
  "customCode": "optional",
  "password": "optional",
  "expiryHours": 24,
  "maxClicks": 100
}
```

### 获取统计数据
```http
POST /api/stats
Content-Type: application/json

{
  "shortCode": "abc123",
  "token": "admin-session-token"
}
```

### 管理员登录
```http
POST /api/admin/login
Content-Type: application/json

{
  "password": "admin-password"
}
```

## 🎨 自定义主题

### 修改颜色
编辑 CSS 变量：
```css
:root {
  --primary-color: #00ff88;
  --secondary-color: #00cc6a;
  --background-color: #0a0a0a;
  --text-color: #ffffff;
}
```

### 自定义动画
调整动画参数：
```css
.btn:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}
```

## 🔒 安全最佳实践

### 管理员密码
- 使用强密码（至少12位）
- 包含大小写字母、数字、特殊字符
- 定期更换密码

### 部署安全
- 启用 HTTPS
- 设置安全头部
- 配置 CORS 策略
- 监控访问日志

### 数据保护
- 敏感数据加密存储
- 定期备份重要数据
- 设置合理的过期时间

## 🚀 性能优化

### 缓存策略
- 静态资源：1小时缓存
- 管理页面：30分钟缓存
- API 响应：no-cache

### 边缘计算
- 全球 CDN 分发
- 就近访问加速
- 自动故障转移

## 🤝 贡献指南

### 开发环境
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

### 代码规范
- 使用 2 空格缩进
- 遵循 ESLint 规则
- 添加必要注释
- 编写测试用例

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

### 问题反馈
- [GitHub Issues](https://github.com/ChKSz/greenlink/issues)
- [讨论区](https://github.com/chksz/greenlink/discussions)

### 联系方式
- 邮箱：i@wzg.best

---

⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！
