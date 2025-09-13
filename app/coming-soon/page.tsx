'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function ComingSoonPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 返回按钮 */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>返回</span>
                </button>

                {/* 主要内容 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-200/50">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <SparklesIcon className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        敬请期待
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        我们正在开发更多令人兴奋的AI功能<br />
                        很快就会与您见面！
                    </p>

                    <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>开发中...</span>
                    </div>
                </div>

                {/* 装饰元素 */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            </div>
        </div>
    )
}
