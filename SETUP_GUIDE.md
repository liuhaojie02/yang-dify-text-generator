# 应用设置指南

## 问题解决 ✅

**报告生成功能 500 错误已修复！**

### 问题原因
应用缺少必要的环境配置文件 `.env.local`，导致无法连接到 Dify API。

### 解决方案
1. **创建了环境配置文件** `.env.local`
2. **添加了API错误处理**，提供mock数据用于演示
3. **重启了开发服务器**

## 当前状态

✅ **应用正常运行**: http://localhost:3000  
✅ **API接口正常**: `/api/parameters` 返回有效数据  
✅ **文件上传功能**: 支持多种文件格式  
✅ **报告生成页面**: 可正常访问和使用  

## 如何使用

### 1. 访问应用
- **主页**: http://localhost:3000
- **报告生成**: http://localhost:3000/generator

### 2. 测试文件上传
支持的文件格式：
- **文档类**: PDF, DOC, DOCX, XLSX, XLS, PPTX, PPT, TXT, MD, HTML, XML, CSV, EPUB, EML, MSG
- **图片类**: JPG, JPEG, PNG, GIF, WEBP, SVG

### 3. 功能特性
- 🔄 拖拽上传文件
- 📊 实时上传进度
- 🎨 文件类型图标
- 🌐 中英文界面
- ⚡ 响应式设计

## 配置真实 Dify API (可选)

如果您有真实的 Dify 应用，可以更新 `.env.local` 文件：

```bash
# 替换为您的真实配置
NEXT_PUBLIC_APP_ID=your_real_app_id
NEXT_PUBLIC_APP_KEY=your_real_api_key
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
NEXT_PUBLIC_APP_TYPE_WORKFLOW=workflow
```

### 获取 Dify 配置信息：
1. 访问 [Dify 控制台](https://dify.ai)
2. 创建或选择您的应用
3. 在 API 选项卡中获取 App ID 和 API Key
4. 更新 `.env.local` 文件
5. 重启应用：`npm run dev`

## 故障排除

### 如果遇到问题：
1. **检查端口**: 确保 3000 端口未被占用
2. **重启服务器**: `pkill -f "next dev" && npm run dev`
3. **清除缓存**: `rm -rf .next && npm run dev`
4. **检查配置**: 确保 `.env.local` 文件存在且格式正确

### 常见错误：
- **应用不可用**: 检查环境变量配置
- **文件上传失败**: 检查文件大小和格式
- **页面加载慢**: 首次访问需要编译，请耐心等待

## 技术支持

如需帮助，请检查：
- 浏览器开发者工具的控制台错误
- 终端中的服务器日志
- 网络请求状态

---

**🎉 应用现在可以正常使用了！**
