'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useBoolean } from 'ahooks'
import { t } from 'i18next'
import produce from 'immer'
import cn from 'classnames'
import NoData from '../no-data'
import TextGenerationRes from './item'
import Toast from '@/app/components/base/toast'
import { sendCompletionMessage, sendWorkflowMessage, updateFeedback } from '@/service'
import type { Feedbacktype, PromptConfig, VisionFile, VisionSettings, WorkflowProcess } from '@/types/app'
import { NodeRunningStatus, TransferMethod, WorkflowRunningStatus } from '@/types/app'
import Loading from '@/app/components/base/loading'
import { sleep } from '@/utils'

export type IResultProps = {
  isWorkflow: boolean
  isCallBatchAPI: boolean
  isPC: boolean
  isMobile: boolean
  isError: boolean
  promptConfig: PromptConfig | null
  inputs: Record<string, any>
  controlSend?: number
  controlRetry?: number
  controlStopResponding?: number
  onShowRes: () => void
  taskId?: number
  onCompleted: (completionRes: string, taskId?: number, success?: boolean) => void
  visionConfig: VisionSettings
  completionFiles: VisionFile[]
  uploadedFiles?: any[] // 添加上传的文档文件
}

const Result: FC<IResultProps> = ({
  isWorkflow,
  isCallBatchAPI,
  isPC,
  isMobile,
  isError,
  promptConfig,
  inputs,
  controlSend,
  controlRetry,
  controlStopResponding,
  onShowRes,
  taskId,
  onCompleted,
  visionConfig,
  completionFiles,
  uploadedFiles,
}) => {
  const [isResponsing, { setTrue: setResponsingTrue, setFalse: setResponsingFalse }] = useBoolean(false)
  useEffect(() => {
    if (controlStopResponding)
      setResponsingFalse()
  }, [controlStopResponding])

  const [completionRes, doSetCompletionRes] = useState('')
  const completionResRef = useRef('')
  const setCompletionRes = (res: string) => {
    completionResRef.current = res
    doSetCompletionRes(res)
  }
  const getCompletionRes = () => completionResRef.current
  const [workflowProcessData, doSetWorkflowProccessData] = useState<WorkflowProcess>()
  const workflowProcessDataRef = useRef<WorkflowProcess>()
  const setWorkflowProccessData = (data: WorkflowProcess) => {
    workflowProcessDataRef.current = data
    doSetWorkflowProccessData(data)
  }
  const getWorkflowProccessData = () => workflowProcessDataRef.current

  const { notify } = Toast
  const isNoData = !completionRes

  const [messageId, setMessageId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedbacktype>({
    rating: null,
  })

  // 添加生成的文件状态
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([])

  const handleFeedback = async (feedback: Feedbacktype) => {
    await updateFeedback({ url: `/messages/${messageId}/feedbacks`, body: { rating: feedback.rating } })
    setFeedback(feedback)
  }

  const logError = (message: string) => {
    notify({ type: 'error', message })
  }

  const checkCanSend = () => {
    // batch will check outer
    if (isCallBatchAPI)
      return true

    const prompt_variables = promptConfig?.prompt_variables
    if (!prompt_variables || prompt_variables?.length === 0)
      return true

    let hasEmptyInput = ''
    const requiredVars = prompt_variables?.filter(({ key, name, required }) => {
      const res = (!key || !key.trim()) || (!name || !name.trim()) || (required || required === undefined || required === null)
      return res
    }) || [] // compatible with old version
    requiredVars.forEach(({ key, name }) => {
      if (hasEmptyInput)
        return

      if (!inputs[key])
        hasEmptyInput = name
    })

    if (hasEmptyInput) {
      logError(t('appDebug.errorMessage.valueOfVarRequired', { key: hasEmptyInput }))
      return false
    }
    if (completionFiles.find(item => item.transfer_method === TransferMethod.local_file && !item.upload_file_id)) {
      notify({ type: 'info', message: t('appDebug.errorMessage.waitForImgUpload') })
      return false
    }
    return !hasEmptyInput
  }

  const handleSend = async () => {
    if (isResponsing) {
      notify({ type: 'info', message: t('appDebug.errorMessage.waitForResponse') })
      return false
    }

    if (!checkCanSend())
      return

    const data: Record<string, any> = {
      inputs,
    }

    // 处理图片文件
    if (visionConfig.enabled && completionFiles && completionFiles?.length > 0) {
      data.files = completionFiles.map((item) => {
        if (item.transfer_method === TransferMethod.local_file) {
          return {
            ...item,
            url: '',
          }
        }
        return item
      })
    }

    // 处理文档文件
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log('处理上传的文档文件:', uploadedFiles)
      const documentFiles = uploadedFiles.filter(file => file.uploaded).map(file => ({
        type: 'document',
        transfer_method: 'local_file',
        upload_file_id: file.upload_file_id,
        filename: file.name
      }))

      console.log('筛选后的文档文件:', documentFiles)
      if (documentFiles.length > 0) {
        data.files = [...(data.files || []), ...documentFiles]
        console.log('最终的files数据:', data.files)
      }
    }

    setMessageId(null)
    setFeedback({
      rating: null,
    })
    setCompletionRes('')

    const res: string[] = []
    let tempMessageId = ''

    if (!isPC)
      onShowRes()

    setResponsingTrue()
    let isEnd = false
    let isTimeout = false;
    (async () => {
      await sleep(1000 * 60) // 1min timeout
      if (!isEnd) {
        setResponsingFalse()
        onCompleted(getCompletionRes(), taskId, false)
        isTimeout = true
      }
    })()

    console.log('准备发送工作流消息，完整data:', JSON.stringify(data, null, 2))

    if (isWorkflow) {
      sendWorkflowMessage(
        data,
        {
          onWorkflowStarted: ({ workflow_run_id }) => {
            tempMessageId = workflow_run_id
            setWorkflowProccessData({
              status: WorkflowRunningStatus.Running,
              tracing: [],
              expand: false,
            })
            setResponsingFalse()
          },
          onNodeStarted: ({ data }) => {
            setWorkflowProccessData(produce(getWorkflowProccessData()!, (draft) => {
              draft.expand = true
              draft.tracing!.push({
                ...data,
                status: NodeRunningStatus.Running,
                expand: true,
              } as any)
            }))
          },
          onNodeFinished: ({ data }) => {
            setWorkflowProccessData(produce(getWorkflowProccessData()!, (draft) => {
              const currentIndex = draft.tracing!.findIndex(trace => trace.node_id === data.node_id)
              if (currentIndex > -1 && draft.tracing) {
                draft.tracing[currentIndex] = {
                  ...(draft.tracing[currentIndex].extras
                    ? { extras: draft.tracing[currentIndex].extras }
                    : {}),
                  ...data,
                  expand: !!data.error,
                } as any
              }
            }))
          },
          onWorkflowFinished: (response) => {
            console.log('工作流完成回调被调用，完整响应:', response)
            console.log('response结构:', Object.keys(response))
            const { data } = response
            console.log('工作流完成数据:', data)
            console.log('data结构:', data ? Object.keys(data) : 'data为空')

            if (isTimeout)
              return
            if (data.error) {
              notify({ type: 'error', message: data.error })
              setResponsingFalse()
              onCompleted(getCompletionRes(), taskId, false)
              isEnd = true
              return
            }

            console.log('更新工作流状态为成功')
            setWorkflowProccessData(produce(getWorkflowProccessData()!, (draft) => {
              draft.status = data.error ? WorkflowRunningStatus.Failed : WorkflowRunningStatus.Succeeded
            }))

            // 处理生成的文件
            if (data.files && data.files.length > 0) {
              console.log('工作流直接返回的文件:', data.files)
              setGeneratedFiles(data.files)
            }

            // 从输出文本中提取文件链接
            let extractedFiles: any[] = []
            if (data.outputs) {
              const outputText = typeof data.outputs === 'string' ? data.outputs : JSON.stringify(data.outputs)
              console.log('工作流输出文本:', outputText)

              // 匹配文件链接格式: [filename.ext](url)
              const fileRegex = /\[(.*?\.(docx|pdf|txt|xlsx|pptx|doc|xls|ppt))\]\((https?:\/\/[^\s)]+)\)/gi
              let match
              while ((match = fileRegex.exec(outputText)) !== null) {
                extractedFiles.push({
                  filename: match[1],
                  url: match[3],
                  type: 'document'
                })
              }

              console.log('从输出中提取的文件数量:', extractedFiles.length)
              if (extractedFiles.length > 0) {
                console.log('提取的文件详情:', extractedFiles)
                setGeneratedFiles(prev => {
                  const newFiles = [...prev, ...extractedFiles]
                  console.log('更新后的文件列表:', newFiles)
                  return newFiles
                })
              }
            }

            if (!data.outputs)
              setCompletionRes('')
            else if (Object.keys(data.outputs).length > 1)
              setCompletionRes(data.outputs)
            else
              setCompletionRes(data.outputs[Object.keys(data.outputs)[0]])
            setResponsingFalse()
            setMessageId(tempMessageId)
            onCompleted(getCompletionRes(), taskId, true)
            isEnd = true
          },
        },
      )
    }
    else {
      sendCompletionMessage(data, {
        onData: (data: string, _isFirstMessage: boolean, { messageId }) => {
          tempMessageId = messageId
          res.push(data)
          setCompletionRes(res.join(''))
        },
        onCompleted: () => {
          if (isTimeout)
            return

          setResponsingFalse()
          setMessageId(tempMessageId)
          onCompleted(getCompletionRes(), taskId, true)
          isEnd = true
        },
        onError() {
          if (isTimeout)
            return

          setResponsingFalse()
          onCompleted(getCompletionRes(), taskId, false)
          isEnd = true
        },
      })
    }
  }

  useEffect(() => {
    if (controlSend)
      handleSend()
  }, [controlSend])

  useEffect(() => {
    if (controlRetry)
      handleSend()
  }, [controlRetry])

  const handleDownloadFile = (file: any) => {
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.filename || 'generated-file'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderFileDownloads = () => {
    console.log('渲染文件下载区域，文件数量:', generatedFiles.length, '文件列表:', generatedFiles)
    if (generatedFiles.length === 0) {
      console.log('没有生成的文件，不显示下载区域')
      return null
    }

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-900 mb-3">生成的文件</h3>
        <div className="space-y-2">
          {generatedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📄</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.filename || `文件 ${index + 1}`}
                  </p>
                  {file.size && (
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDownloadFile(file)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                下载
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTextGenerationRes = () => (
    <div>
      <TextGenerationRes
        isWorkflow={isWorkflow}
        workflowProcessData={workflowProcessData}
        className='mt-3'
        isError={isError}
        onRetry={handleSend}
        content={completionRes}
        messageId={messageId}
        isInWebApp
        onFeedback={handleFeedback}
        feedback={feedback}
        isMobile={isMobile}
        isLoading={isCallBatchAPI ? (!completionRes && isResponsing) : false}
        taskId={isCallBatchAPI ? ((taskId as number) < 10 ? `0${taskId}` : `${taskId}`) : undefined}
      />
      {renderFileDownloads()}
    </div>
  )

  return (
    <div className={cn(isNoData && !isCallBatchAPI && 'h-full')}>
      {!isCallBatchAPI && (
        (isResponsing && !completionRes)
          ? (
            <div className='flex h-full w-full justify-center items-center'>
              <Loading type='area' />
            </div>)
          : (
            <>
              {(isNoData && !workflowProcessData)
                ? <NoData />
                : renderTextGenerationRes()
              }
            </>
          )
      )}
      {isCallBatchAPI && (
        <div className='mt-2'>
          {renderTextGenerationRes()}
        </div>
      )}
    </div>
  )
}
export default React.memo(Result)
