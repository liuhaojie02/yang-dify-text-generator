#!/usr/bin/env node

/**
 * 页面预热脚本 - 在开发服务器启动后访问主要页面进行预编译
 */

const http = require('http');

const pages = [
    '/',
    '/generator'
];

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'HEAD', // 使用HEAD请求更快
      timeout: 10000 // 增加超时时间
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
};

const warmupPage = (path) => {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            timeout: 10000
        }, (res) => {
            console.log(`✅ 预热页面: ${path} - 状态码: ${res.statusCode}`);
            resolve();
        });

        req.on('error', (err) => {
            console.log(`❌ 预热失败: ${path} - ${err.message}`);
            resolve();
        });

        req.on('timeout', () => {
            console.log(`⏰ 预热超时: ${path}`);
            req.destroy();
            resolve();
        });

        req.end();
    });
};

const warmupServer = async () => {
    console.log('🔥 等待服务器启动...');

    // 等待服务器启动
    let serverReady = false;
    let attempts = 0;

    while (!serverReady && attempts < 30) {
        serverReady = await checkServer();
        if (!serverReady) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
    }

    if (!serverReady) {
        console.log('❌ 服务器启动超时');
        return;
    }

    console.log('🔥 开始预热主要页面...');

    for (const page of pages) {
        await warmupPage(page);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('🎉 页面预热完成！');
};

if (require.main === module) {
    warmupServer().catch(console.error);
}
