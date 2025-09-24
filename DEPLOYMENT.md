# 🚀 部署指南

## 阿里云服务器部署

### 📋 前提条件

1. **Node.js 环境** (推荐 Node.js 18+)
2. **PM2 进程管理器**
3. **Git 工具**

### 🔧 快速部署

#### 方案1：生产模式部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/liuhaojie02/yang-dify-text-generator.git
cd yang-dify-text-generator

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的 Dify API 配置

# 4. 运行部署脚本
./scripts/deploy.sh
```

#### 方案2：开发模式部署

```bash
# 使用开发模式配置
pm2 start ecosystem.dev.config.js

# 启动后预热页面
sleep 15 && npm run warmup
```

### ⚡ 解决首次访问慢的问题

**问题原因**：
- 开发模式首次访问需要编译（4+ 秒）
- pm2可能有超时设置
- 路由跳转在编译期间失败

**解决方案**：

1. **使用生产模式**（最佳）：
   ```bash
   npm run build
   pm2 start ecosystem.config.js --env production
   ```

2. **预热页面**：
   ```bash
   npm run warmup
   ```

3. **增加pm2超时设置**：
   ```bash
   pm2 start npm --name "newapp" -- run dev --listen-timeout 30000
   ```

### 📊 性能对比

| 模式 | 首次访问 | 后续访问 | 内存占用 | 推荐场景 |
|------|----------|----------|----------|----------|
| 开发模式 | 4+ 秒 | 快速 | 高 | 开发调试 |
| 生产模式 | 快速 | 快速 | 低 | 生产环境 |

### 🔍 监控和调试

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs newapp

# 监控资源使用
pm2 monit

# 重启应用
pm2 restart newapp

# 停止应用
pm2 stop newapp
```

### 🌐 Nginx配置（可选）

如果使用Nginx作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 增加超时时间
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 🔧 环境变量配置

在 `.env.local` 文件中配置：

```env
# Dify API 配置
NEXT_PUBLIC_APP_ID=your_dify_app_id
NEXT_PUBLIC_APP_KEY=your_dify_api_key
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1

# 应用配置
NEXT_PUBLIC_APP_TYPE_WORKFLOW=workflow
```

### 🎯 推荐部署流程

1. **本地测试** → 确保功能正常
2. **构建应用** → `npm run build`
3. **生产部署** → `pm2 start ecosystem.config.js`
4. **页面预热** → `npm run warmup`
5. **监控验证** → `pm2 monit`

这样可以避免首次访问的编译延迟问题！
