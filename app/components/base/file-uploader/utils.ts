'use client'

import { upload } from '@/service/base'

type FileUploadParams = {
    file: File
    onProgressCallback: (progress: number) => void
    onSuccessCallback: (res: { id: string }) => void
    onErrorCallback: () => void
}

type FileUpload = (v: FileUploadParams) => void

export const fileUpload: FileUpload = ({
    file,
    onProgressCallback,
    onSuccessCallback,
    onErrorCallback,
}) => {
    const formData = new FormData()
    formData.append('file', file)

    const onProgress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
            const percent = Math.floor(e.loaded / e.total * 100)
            onProgressCallback(percent)
        }
    }

    upload({
        xhr: new XMLHttpRequest(),
        data: formData,
        onprogress: onProgress,
    })
        .then((res: { id: string }) => {
            onSuccessCallback(res)
        })
        .catch(() => {
            onErrorCallback()
        })
}

// 文件类型验证
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    return allowedTypes.some(type => type.toLowerCase() === fileExtension)
}

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件类型图标
export const getFileTypeIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
        // 文档类
        case 'pdf':
            return '📄'
        case 'doc':
        case 'docx':
            return '📝'
        case 'xls':
        case 'xlsx':
            return '📊'
        case 'ppt':
        case 'pptx':
            return '📊'
        case 'txt':
            return '📃'
        case 'md':
        case 'mdx':
        case 'markdown':
            return '📝'
        case 'csv':
            return '📋'
        case 'html':
            return '🌐'
        case 'xml':
            return '📋'
        case 'eml':
        case 'msg':
            return '📧'
        case 'epub':
            return '📚'
        // 图片类
        case 'jpg':
        case 'jpeg':
            return '🖼️'
        case 'png':
            return '🖼️'
        case 'gif':
            return '🎞️'
        case 'webp':
            return '🖼️'
        case 'svg':
            return '🎨'
        default:
            return '📁'
    }
}
