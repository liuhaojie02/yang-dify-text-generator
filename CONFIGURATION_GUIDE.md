# Dify 应用配置指南

## 问题说明

当前遇到的 `app_unavailable` 错误表明您的 Dify 应用配置不正确。

## 解决步骤

### 1. 登录 Dify 控制台

访问 [https://dify.ai](https://dify.ai) 并登录您的账户。

### 2. 创建或查找您的应用

- 如果还没有应用，请创建一个新的 **Workflow** 类型应用
- 如果已有应用，请确保应用已发布且状态正常

### 3. 获取配置信息

在您的应用页面中：

1. 点击 **"API"** 选项卡
2. 复制以下信息：
   - **App ID** (应用ID)
   - **API Key** (API密钥)

### 4. 更新环境配置

编辑项目根目录的 `.env.local` 文件：

```bash
# APP ID - 替换为您的实际应用ID
NEXT_PUBLIC_APP_ID=your_actual_app_id

# APP API key - 替换为您的实际API密钥
NEXT_PUBLIC_APP_KEY=your_actual_api_key

# API url prefix
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1

# APP type
NEXT_PUBLIC_APP_TYPE_WORKFLOW=workflow
```

### 5. 重启应用

```bash
# 停止当前服务器
pkill -f "next dev"

# 重新启动
npm run dev
```

## 验证配置

访问 http://localhost:3000 并测试应用功能。如果配置正确，应该不再出现 `app_unavailable` 错误。

## 常见问题

1. **应用未发布**: 确保在 Dify 控制台中发布了您的应用
2. **API密钥错误**: 确保复制了正确的 API Key
3. **应用类型不匹配**: 确保应用类型设置正确（workflow/completion）

## 获取帮助

如果仍有问题，请检查：
- Dify 控制台中的应用状态
- API 调用日志
- 浏览器开发者工具中的网络请求
