'use client'

import type { ChangeEvent, FC } from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { DocumentArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Toast from '@/app/components/base/toast'
import { fileUpload, formatFileSize, getFileTypeIcon } from './utils'

export type FileItem = {
    id: string
    name: string
    size: number
    type: string
    file: File
    progress: number
    uploaded: boolean
    error?: string
}

type FileUploaderProps = {
    onFilesChange: (files: FileItem[]) => void
    accept?: string
    multiple?: boolean
    maxSize?: number // MB
    maxFiles?: number
    disabled?: boolean
    className?: string
    files?: FileItem[] // 受控的文件列表
}

const FileUploader: FC<FileUploaderProps> = ({
    onFilesChange,
    accept = '.txt,.md,.mdx,.markdown,.pdf,.html,.xlsx,.xls,.doc,.docx,.csv,.eml,.msg,.pptx,.ppt,.xml,.epub,.jpg,.jpeg,.png,.gif,.webp,.svg',
    multiple = false,
    maxSize = 10,
    maxFiles = 1,
    disabled = false,
    className = '',
    files: controlledFiles
}) => {
    const [files, setFiles] = useState<FileItem[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const { notify } = Toast
    const { t } = useTranslation()

    // 如果有受控的files，使用受控模式
    useEffect(() => {
        if (controlledFiles !== undefined) {
            setFiles(controlledFiles)
        }
    }, [controlledFiles])

    const validateFile = (file: File): string | null => {
        // 检查文件大小
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            return `${t('app.generation.fileUpload.fileSizeLimit')} ${maxSize}MB`
        }

        // 检查文件类型
        if (accept && accept !== '*') {
            const acceptedTypes = accept.split(',').map(type => type.trim())
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
            if (!acceptedTypes.some(type => type.toLowerCase() === fileExtension)) {
                return `${t('app.generation.fileUpload.unsupportedType')} ${accept}`
            }
        }

        return null
    }

    const addFiles = (newFiles: File[]) => {
        const validFiles: FileItem[] = []

        for (const file of newFiles) {
            // 检查文件数量限制
            if (!multiple && files.length + validFiles.length >= 1) {
                notify({ type: 'error', message: t('app.generation.fileUpload.onlyOneFile') })
                break
            }

            if (files.length + validFiles.length >= maxFiles) {
                notify({ type: 'error', message: `${t('app.generation.fileUpload.maxFilesLimit')} ${maxFiles} ${t('app.generation.fileUpload.filesLimit')}` })
                break
            }

            // 验证文件
            const error = validateFile(file)
            if (error) {
                notify({ type: 'error', message: error })
                continue
            }

            // 检查是否已存在
            const exists = files.some(f => f.name === file.name && f.size === file.size)
            if (exists) {
                notify({ type: 'error', message: `${t('app.generation.fileUpload.fileExists')} "${file.name}"` })
                continue
            }

            validFiles.push({
                id: `${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                file,
                progress: 0,
                uploaded: false
            })
        }

        if (validFiles.length > 0) {
            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
            setFiles(updatedFiles)
            onFilesChange(updatedFiles)

            // 开始真实的文件上传
            validFiles.forEach(fileItem => {
                uploadFile(fileItem)
            })
        }
    }

    const uploadFile = (fileItem: FileItem) => {
        fileUpload({
            file: fileItem.file,
            onProgressCallback: (progress) => {
                updateFileProgress(fileItem.id, progress, false)
            },
            onSuccessCallback: (res) => {
                updateFileProgress(fileItem.id, 100, true, res.id)
            },
            onErrorCallback: () => {
                notify({ type: 'error', message: `${t('app.generation.fileUpload.uploadFailed')} "${fileItem.name}"` })
                setFiles(prev => {
                    const updated = prev.map(file =>
                        file.id === fileItem.id
                            ? { ...file, error: t('app.generation.fileUpload.uploadFailed') }
                            : file
                    )
                    onFilesChange(updated)
                    return updated
                })
            },
        })
    }

    const updateFileProgress = (id: string, progress: number, uploaded: boolean, uploadFileId?: string) => {
        setFiles(prev => {
            const updated = prev.map(file =>
                file.id === id
                    ? { ...file, progress, uploaded, error: undefined, upload_file_id: uploadFileId }
                    : file
            )
            onFilesChange(updated)
            return updated
        })
    }

    const removeFile = (id: string) => {
        const updated = files.filter(file => file.id !== id)
        setFiles(updated)
        onFilesChange(updated)
    }

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length > 0) {
            addFiles(selectedFiles)
        }
        // 清空input值，允许重复选择同一文件
        e.target.value = ''
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragOver(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        if (disabled) return

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles)
        }
    }


    return (
        <div className={cn('w-full', className)}>
            {/* 上传区域 */}
            <div
                className={cn(
                    'relative border-2 border-dashed rounded-lg p-6 transition-colors',
                    isDragOver && !disabled
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400',
                    disabled && 'bg-gray-50 cursor-not-allowed opacity-50'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            {t('app.generation.fileUpload.dragText')}{' '}
                            <span className="text-blue-600 font-medium">{t('app.generation.fileUpload.clickText')}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {t('app.generation.fileUpload.supportedFormats')}: {accept}
                        </p>
                    </div>
                </div>
            </div>

            {/* 文件列表 */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center p-3 bg-gray-50 rounded-lg border"
                        >
                            <div className="h-8 w-8 flex items-center justify-center text-2xl flex-shrink-0">
                                {getFileTypeIcon(file.name)}
                            </div>

                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                </p>

                                {/* 进度条 */}
                                {!file.uploaded && file.progress > 0 && (
                                    <div className="mt-1">
                                        <div className="bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${file.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 状态指示 */}
                            <div className="ml-3 flex items-center">
                                {file.error ? (
                                    <span className="text-xs text-red-600 font-medium">{file.error}</span>
                                ) : file.uploaded ? (
                                    <span className="text-xs text-green-600 font-medium">{t('app.generation.fileUpload.uploadComplete')}</span>
                                ) : file.progress > 0 ? (
                                    <span className="text-xs text-blue-600 font-medium">
                                        {Math.round(file.progress)}%
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-500">{t('app.generation.fileUpload.waiting')}</span>
                                )}

                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileUploader
