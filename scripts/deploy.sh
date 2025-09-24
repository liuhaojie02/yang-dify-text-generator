#!/bin/bash

echo "🚀 开始部署AI报告生成应用..."

# 创建日志目录
mkdir -p logs

# 停止现有进程
echo "⏹️ 停止现有进程..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# 构建应用（生产模式）
echo "🔨 构建应用..."
npm install
npm run build

# 启动生产模式
echo "🚀 启动生产模式..."
pm2 start ecosystem.config.js --env production

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 10

# 预热页面
echo "🔥 预热主要页面..."
npm run warmup

echo "✅ 部署完成！"
echo "📱 访问地址: http://your-server-ip:3000"
echo "📊 监控命令: pm2 monit"
echo "📋 查看日志: pm2 logs"
