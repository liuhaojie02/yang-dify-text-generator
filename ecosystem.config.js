module.exports = {
    apps: [
        {
            name: 'ai-report-generator',
            script: 'npm',
            args: 'start',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            // 日志配置
            log_file: './logs/combined.log',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            // 预热配置
            post_start: [
                'sleep 5',
                'node scripts/warmup.js'
            ]
        }
    ]
};
