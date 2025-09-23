# Dify API 配置指南

## 问题描述

如果您在上传文件并点击运行时看到 `POST /api/workflows/run 500` 错误，这通常是因为 Dify API 配置不正确导致的。

## 解决方案

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录执行
touch .env.local
```

### 2. 配置 Dify API 信息

在 `.env.local` 文件中添加以下配置：

```env
# Dify API 配置
NEXT_PUBLIC_APP_ID=your_dify_app_id
NEXT_PUBLIC_APP_KEY=your_dify_api_key
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_APP_TYPE_WORKFLOW=workflow
```

### 3. 获取 Dify API 信息

1. **登录 Dify 平台**
   - 访问 [https://dify.ai](https://dify.ai)
   - 登录您的账户

2. **创建或选择应用**
   - 创建一个新的工作流应用
   - 或选择现有的工作流应用

3. **获取 API 信息**
   - 在应用设置中找到 API 密钥
   - 复制应用 ID 和 API 密钥

4. **配置文件上传**
   - 确保您的 Dify 工作流支持文件输入
   - 配置相应的文件处理节点

### 4. 重启开发服务器

配置完成后，重启 Next.js 开发服务器：

```bash
npm run dev
```

## 验证配置

1. 访问报告生成页面
2. 上传一个支持的文件
3. 点击运行按钮
4. 如果配置正确，应该能看到工作流开始执行

## 常见问题

### Q: 仍然出现 500 错误怎么办？

A: 请检查：
- API 密钥是否正确
- 应用 ID 是否正确
- Dify 工作流是否已发布
- 工作流是否配置了文件输入节点

### Q: 如何验证配置是否正确？

A: 查看浏览器开发者工具的控制台，会显示详细的错误信息。

### Q: 支持哪些文件类型？

A: 目前支持：
- 文档类：PDF, Word, Excel, PowerPoint, 文本文件等
- 图片类：JPG, PNG, GIF, WEBP, SVG等

## 技术支持

如果您在配置过程中遇到问题，请：
1. 检查浏览器控制台的错误信息
2. 查看 Next.js 开发服务器的日志
3. 确认 Dify 工作流配置正确
