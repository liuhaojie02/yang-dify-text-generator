module.exports = {
    apps: [
        {
            name: 'ai-report-dev',
            script: 'npm',
            args: 'run dev',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            // 增加启动延迟，等待编译完成
            min_uptime: '10s',
            max_restarts: 5,
            // 日志配置
            log_file: './logs/dev-combined.log',
            out_file: './logs/dev-out.log',
            error_file: './logs/dev-error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            // 启动后预热
            exec_mode: 'fork',
            // 增加超时时间
            listen_timeout: 10000,
            kill_timeout: 5000
        }
    ],
    // 部署后执行的脚本
    deploy: {
        production: {
            user: 'root',
            host: 'your-server-ip',
            ref: 'origin/main',
            repo: 'https://github.com/liuhaojie02/yang-dify-text-generator.git',
            path: '/var/www/ai-report-generator',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production && sleep 10 && npm run warmup'
        }
    }
};
