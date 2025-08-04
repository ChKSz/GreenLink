# 🚀 GreenLink 快速发布指南

## 📋 发布前准备

### 1. 确保您有以下账户和工具：
- ✅ GitHub 账户
- ✅ Git 已安装在您的电脑上
- ✅ 项目代码已完成

### 2. 在 GitHub 创建新仓库：
1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 仓库名：`greenlink`
4. 描述：`🚀 现代化短链接生成器 - 基于 Cloudflare Workers`
5. 选择 "Public"
6. **不要勾选** "Initialize this repository with a README"
7. 点击 "Create repository"

## 🎯 一键发布（推荐）

### Windows 用户：
```cmd
# 在项目目录打开命令提示符，运行：
deploy.bat 您的GitHub用户名 greenlink
```

### Mac/Linux 用户：
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行发布脚本
./deploy.sh 您的GitHub用户名 greenlink
```

## 🔧 手动发布步骤

如果自动脚本不工作，可以手动执行以下步骤：

### 1. 初始化 Git 仓库
```bash
cd /path/to/your/greenlink/project
git init
```

### 2. 添加远程仓库
```bash
git remote add origin https://github.com/您的用户名/greenlink.git
```

### 3. 添加文件并提交
```bash
git add .
git commit -m "🎉 Initial commit: GreenLink v2.0"
```

### 4. 推送到 GitHub
```bash
git branch -M main
git push -u origin main
```

## 📁 确保包含这些文件

发布前请确认项目包含以下文件：

### 必需文件：
- ✅ `src/index.js` - 主要代码文件
- ✅ `README.md` - 英文说明文档
- ✅ `README_CN.md` - 中文说明文档
- ✅ `package.json` - 项目配置
- ✅ `LICENSE` - 许可证文件
- ✅ `.gitignore` - Git 忽略文件
- ✅ `wrangler.toml.example` - 配置模板

### 可选文件：
- 📖 `GIT_DEPLOY_GUIDE.md` - 详细发布指南
- 🚀 `QUICK_START.md` - 快速开始指南
- 🛠 `deploy.sh` / `deploy.bat` - 自动发布脚本

## 🔒 安全检查

发布前请确认：

- ❌ **不要**包含 `wrangler.toml` 文件（包含敏感信息）
- ❌ **不要**包含任何密码或密钥
- ❌ **不要**包含 `.env` 文件
- ✅ 确保 `.gitignore` 文件正确配置
- ✅ 检查代码中没有硬编码的敏感数据

## 🎨 GitHub 仓库优化

发布成功后，建议进行以下优化：

### 1. 设置仓库信息
- 添加仓库描述
- 添加网站链接（如果已部署）
- 添加标签：`url-shortener`, `cloudflare-workers`, `javascript`

### 2. 启用功能
- 启用 Issues（问题追踪）
- 启用 Discussions（讨论区）
- 设置 About 部分

### 3. 添加徽章（可选）
在 README.md 中添加状态徽章：
```markdown
![GitHub stars](https://img.shields.io/github/stars/您的用户名/greenlink)
![GitHub forks](https://img.shields.io/github/forks/您的用户名/greenlink)
![GitHub license](https://img.shields.io/github/license/您的用户名/greenlink)
```

## 🚀 部署到 Cloudflare Workers

发布到 GitHub 后，您可以部署到生产环境：

### 1. 配置环境
```bash
# 复制配置文件
cp wrangler.toml.example wrangler.toml

# 编辑配置文件，设置您的密码和 KV 命名空间
```

### 2. 创建 KV 命名空间
```bash
wrangler kv:namespace create "URL_STORE"
```

### 3. 部署
```bash
wrangler deploy
```

## 🆘 常见问题

### Q: 推送时提示权限错误？
A: 确保您已登录 GitHub 并有仓库的推送权限。可能需要设置 SSH 密钥或使用个人访问令牌。

### Q: 提示仓库不存在？
A: 请先在 GitHub 网站上创建仓库，确保仓库名和用户名正确。

### Q: Git 命令不识别？
A: 请先安装 Git：https://git-scm.com/

### Q: 文件太大无法推送？
A: 检查是否包含了不必要的大文件，确保 `.gitignore` 正确配置。

## 📞 获取帮助

如果遇到问题，可以：

1. 查看 [详细发布指南](GIT_DEPLOY_GUIDE.md)
2. 在 GitHub 仓库创建 Issue
3. 查看 Git 官方文档
4. 搜索相关错误信息

---

🎉 **祝您发布成功！** 如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！
