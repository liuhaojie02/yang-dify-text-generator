'use client'
import React from 'react'
import { DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

export type FileDownloadProps = {
    files: Array<{
        filename: string
        url: string
        size?: number
        extension?: string
        mime_type?: string
    }>
    className?: string
}

const FileDownload: React.FC<FileDownloadProps> = ({ files, className }) => {
    const handleDownload = (file: FileDownloadProps['files'][0]) => {
        // 创建一个临时的 a 标签来触发下载
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.filename
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return ''
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
    }

    const getFileIcon = (extension?: string) => {
        // 根据文件扩展名返回不同的图标样式
        const iconClass = 'w-8 h-8'

        switch (extension?.toLowerCase()) {
            case '.docx':
            case '.doc':
                return <DocumentIcon className={cn(iconClass, 'text-blue-600')} />
            case '.pdf':
                return <DocumentIcon className={cn(iconClass, 'text-red-600')} />
            case '.xlsx':
            case '.xls':
                return <DocumentIcon className={cn(iconClass, 'text-green-600')} />
            case '.pptx':
            case '.ppt':
                return <DocumentIcon className={cn(iconClass, 'text-orange-600')} />
            default:
                return <DocumentIcon className={cn(iconClass, 'text-gray-600')} />
        }
    }

    if (!files || files.length === 0) {
        return null
    }

    return (
        <div className={cn('space-y-2', className)}>
            {files.map((file, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.extension)}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {file.filename}
                            </div>
                            {file.size && (
                                <div className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        title="下载文件"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>下载</span>
                    </button>
                </div>
            ))}
        </div>
    )
}

export default FileDownload
