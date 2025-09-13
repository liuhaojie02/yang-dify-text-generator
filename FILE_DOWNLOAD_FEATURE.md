# 文件下载功能说明

## 功能概述

当 Dify 工作流运行完成并输出文件时，应用会自动检测并显示文件下载组件，用户可以点击下载按钮获取生成的文件。

## 工作原理

### 1. 文件输出检测

应用会检查工作流的输出结果中是否包含 `files` 数组：

```javascript
// 工作流输出示例
{
  "files": [
    {
      "dify_model_identity": "__dify__file__",
      "filename": "可行性研究报告.docx",
      "extension": ".docx",
      "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "size": 37910,
      "url": "https://upload.dify.ai/files/tools/68350e1d-1662-412b-b504-ba119a7024a5.docx?timestamp=1757745967&nonce=b86fce1d3d176a9300bea9eb2f9b1650&sign=7IysbcRsatLaomQIwRmfswkAMSjfj_0mAEzC2C44yok="
    }
  ]
}
```

### 2. 文件下载组件

- **位置**: 显示在工作流结果的 JSON 输出下方
- **样式**: 文件图标 + 文件名 + 文件大小 + 下载按钮
- **交互**: 点击下载按钮触发文件下载

### 3. 支持的文件类型

- **Word 文档**: .docx, .doc (蓝色图标)
- **PDF 文档**: .pdf (红色图标)
- **Excel 表格**: .xlsx, .xls (绿色图标)
- **PowerPoint 演示**: .pptx, .ppt (橙色图标)
- **其他文件**: 默认灰色图标

## 技术实现

### 组件结构

```
app/components/base/file-download/
├── index.tsx          # 主组件
└── style.module.css   # 样式文件
```

### 主要功能

1. **文件大小格式化**: 自动将字节转换为 KB/MB/GB
2. **文件类型识别**: 根据扩展名显示不同颜色的图标
3. **下载触发**: 使用临时 `<a>` 标签触发浏览器下载
4. **响应式设计**: 支持移动端和桌面端

### 集成方式

文件下载组件已集成到 `app/components/result/item/index.tsx` 中，当检测到工作流输出包含文件时自动显示。

## 使用示例

### 工作流配置

确保您的 Dify 工作流在结束节点输出文件，输出格式应包含：

```json
{
  "files": [
    {
      "filename": "报告.docx",
      "url": "https://...",
      "size": 37910,
      "extension": ".docx",
      "mime_type": "application/..."
    }
  ]
}
```

### 用户体验

1. 用户提交工作流请求
2. 工作流执行完成
3. 结果页面显示生成的文件列表
4. 用户点击下载按钮获取文件

## 故障排除

### 常见问题

1. **文件不显示**: 检查工作流输出是否包含 `files` 数组
2. **下载失败**: 确认文件 URL 有效且可访问
3. **样式问题**: 确保 Tailwind CSS 类正确加载

### 调试方法

1. 检查浏览器开发者工具的 Network 标签
2. 查看工作流输出的完整 JSON 结构
3. 确认文件 URL 在新标签页中可以直接访问

## 扩展功能

### 可能的改进

1. **批量下载**: 支持一键下载所有文件
2. **预览功能**: 支持在线预览文档内容
3. **文件管理**: 添加文件重命名、删除等功能
4. **下载进度**: 显示大文件的下载进度条

### 自定义样式

可以通过修改 `style.module.css` 文件来自定义文件下载组件的外观：

```css
.fileItem {
  /* 自定义文件项样式 */
}

.downloadButton {
  /* 自定义下载按钮样式 */
}
```
