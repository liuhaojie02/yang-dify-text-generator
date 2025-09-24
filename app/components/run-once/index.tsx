import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PlayIcon,
} from '@heroicons/react/24/solid'
import Select from '@/app/components/base/select'
import type { PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import Button from '@/app/components/base/button'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import TextGenerationImageUploader from '@/app/components/base/image-uploader/text-generation-image-uploader'
import FileUploader, { type FileItem } from '@/app/components/base/file-uploader'

export type IRunOnceProps = {
  promptConfig: PromptConfig
  inputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
  onSend: () => void
  visionConfig: VisionSettings
  onVisionFilesChange: (files: VisionFile[]) => void
  onFilesChange?: (files: FileItem[]) => void
}
const RunOnce: FC<IRunOnceProps> = ({
  promptConfig,
  inputs,
  onInputsChange,
  onSend,
  visionConfig,
  onVisionFilesChange,
  onFilesChange,
}) => {
  const { t } = useTranslation()
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])

  const handleFilesChange = (files: FileItem[]) => {
    setUploadedFiles(files)
    onFilesChange?.(files)

    // 将文件信息更新到inputs中，但不包含实际文件对象
    const fileInputs = files.reduce((acc, file, index) => {
      acc[`file_${index}`] = file.name
      // 不在inputs中直接存储文件对象，因为它无法序列化
      return acc
    }, {} as Record<string, any>)

    onInputsChange({ ...inputs, ...fileInputs, hasFiles: files.length > 0 })
  }

  const onClear = () => {
    const newInputs: Record<string, any> = {}
    promptConfig.prompt_variables.forEach((item) => {
      newInputs[item.key] = ''
    })
    setUploadedFiles([])
    onFilesChange?.([]) // 通知父组件清空文件
    onInputsChange(newInputs)
  }

  const canSend = uploadedFiles.length > 0 && uploadedFiles.every(file => file.uploaded)

  return (
    <div className="">
      <section>
        {/* 文件上传区域 */}
        <form>
          <div className='w-full mt-4'>
            <label className='text-gray-900 text-sm font-medium mb-2 block'>
              {t('app.generation.fileUpload.title')}
            </label>
            <FileUploader
              files={uploadedFiles}
              onFilesChange={handleFilesChange}
              accept=".txt,.md,.mdx,.markdown,.pdf,.html,.xlsx,.xls,.doc,.docx,.csv,.eml,.msg,.pptx,.ppt,.xml,.epub,.jpg,.jpeg,.png,.gif,.webp,.svg"
              multiple={false}
              maxSize={50}
              maxFiles={1}
              className="mt-2"
            />
            {t('app.generation.fileUpload.description') && (
              <p className="text-xs text-gray-500 mt-1">
                {t('app.generation.fileUpload.description')}
              </p>
            )}
          </div>

          {/* 可选的额外参数输入 */}
          {promptConfig.prompt_variables.length > 0 && (
            <div className='mt-6'>
              {promptConfig.prompt_variables.map(item => (
                <div className='w-full mt-4' key={item.key}>
                  <label className='text-gray-900 text-sm font-medium'>{item.name}</label>
                  <div className='mt-2'>
                    {item.type === 'select' && (
                      <Select
                        className='w-full'
                        defaultValue={inputs[item.key]}
                        onSelect={(i) => { onInputsChange({ ...inputs, [item.key]: i.value }) }}
                        items={(item.options || []).map(i => ({ name: i, value: i }))}
                        allowSearch={false}
                        bgClassName='bg-gray-50'
                      />
                    )}
                    {item.type === 'string' && (
                      <input
                        type="text"
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                        placeholder={item.name}
                        value={inputs[item.key]}
                        onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                        maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                      />
                    )}
                    {item.type === 'paragraph' && (
                      <textarea
                        className="block w-full h-[104px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                        placeholder={item.name}
                        value={inputs[item.key]}
                        onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                      />
                    )}
                    {item.type === 'number' && (
                      <input
                        type="number"
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                        placeholder={item.name}
                        value={inputs[item.key]}
                        onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {
            visionConfig?.enabled && (
              <div className="w-full mt-4">
                <div className="text-gray-900 text-sm font-medium">{t('common.imageUploader.imageUpload')}</div>
                <div className='mt-2'>
                  <TextGenerationImageUploader
                    settings={visionConfig}
                    onFilesChange={files => onVisionFilesChange(files.filter(file => file.progress !== -1).map(fileItem => ({
                      type: 'image',
                      transfer_method: fileItem.type,
                      url: fileItem.url,
                      upload_file_id: fileItem.fileId,
                    })))}
                  />
                </div>
              </div>
            )
          }
          <div className='mt-6 h-[1px] bg-gray-100'></div>
          <div className='w-full mt-4'>
            <div className="flex items-center justify-between">
              <Button
                className='!h-8 !p-3'
                onClick={onClear}
                disabled={uploadedFiles.length === 0}
              >
                <span className='text-[13px]'>{t('common.operation.clear')}</span>
              </Button>
              <Button
                type="primary"
                className='!h-8 !pl-3 !pr-4'
                onClick={onSend}
                disabled={!canSend}
              >
                <PlayIcon className="shrink-0 w-4 h-4 mr-1" aria-hidden="true" />
                <span className='text-[13px]'>
                  {uploadedFiles.length === 0
                    ? t('app.generation.fileUpload.pleaseUpload')
                    : uploadedFiles.some(f => !f.uploaded)
                      ? t('app.generation.fileUpload.uploading')
                      : t('app.generation.run')
                  }
                </span>
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
export default React.memo(RunOnce)
