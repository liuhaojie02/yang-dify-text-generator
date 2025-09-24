#!/bin/bash

echo "🚀 启动AI报告生成应用（服务器模式）..."

# 检查环境
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，请先安装: npm install -g pm2"
    exit 1
fi

# 停止现有进程
echo "⏹️ 停止现有进程..."
pm2 stop newapp 2>/dev/null || true
pm2 delete newapp 2>/dev/null || true

# 创建必要目录
mkdir -p logs

# 检查是否为生产环境
if [ "$NODE_ENV" = "production" ]; then
    echo "🔨 生产环境：构建应用..."
    npm run build
    
    echo "🚀 启动生产模式..."
    pm2 start npm --name "newapp" -- start
else
    echo "🔧 开发环境：启动开发模式..."
    # 使用更长的启动超时
    pm2 start npm --name "newapp" -- run dev \
        --listen-timeout 30000 \
        --kill-timeout 10000 \
        --max-memory-restart 2G
fi

# 等待服务器完全启动
echo "⏳ 等待服务器启动（30秒）..."
sleep 30

# 检查服务器状态
if curl -f -s http://localhost:3000/ > /dev/null; then
    echo "✅ 服务器启动成功"
    
    # 预热主要页面
    echo "🔥 预热主要页面..."
    node scripts/warmup.js
    
    echo "🎉 应用启动完成！"
    echo "📱 访问地址: http://localhost:3000"
    echo "📊 监控命令: pm2 monit"
    echo "📋 查看日志: pm2 logs newapp"
else
    echo "❌ 服务器启动失败，请检查日志: pm2 logs newapp"
    exit 1
fi
