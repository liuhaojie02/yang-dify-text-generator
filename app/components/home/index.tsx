'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import cn from 'classnames'
import { DocumentTextIcon, CogIcon } from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
    const router = useRouter()

    const handleReportGeneration = () => {
        router.push('/generator')
    }

    const handleOtherFunction = () => {
        // 暂时跳转到空白页面
        router.push('/coming-soon')
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* AI风格背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* 背景装饰元素 */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>

                {/* 网格背景 */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>

            {/* 主要内容 */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* 头部 */}
                <header className="pt-8 pb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">智能助手</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
                        强大的AI工具集合，让您的工作更高效、更智能
                    </p>
                </header>

                {/* 功能按钮区域 */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

                        {/* 报告生成按钮 */}
                        <div
                            onClick={handleReportGeneration}
                            className={cn(
                                'group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl',
                                'border border-gray-200/50 cursor-pointer transition-all duration-300',
                                'hover:scale-105 hover:bg-white/90'
                            )}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <DocumentTextIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    报告生成
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    智能生成专业报告<br />
                                    支持多种格式导出
                                </p>
                            </div>

                            {/* 装饰元素 */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                            <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full opacity-40"></div>
                        </div>

                        {/* 其他功能按钮 */}
                        <div
                            onClick={handleOtherFunction}
                            className={cn(
                                'group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl',
                                'border border-gray-200/50 cursor-pointer transition-all duration-300',
                                'hover:scale-105 hover:bg-white/90'
                            )}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <CogIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    更多功能
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    敬请期待<br />
                                    更多AI功能即将上线
                                </p>
                            </div>

                            {/* 装饰元素 */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
                            <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-300 rounded-full opacity-40"></div>
                        </div>

                    </div>
                </div>

                {/* 底部 */}
                <footer className="py-8 text-center text-gray-500">
                    <p>&copy; 北京电信规划设计院有限公司. 让AI为您服务</p>
                </footer>
            </div>
        </div>
    )
}

export default HomePage
