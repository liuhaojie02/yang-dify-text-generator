import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL, APP_ID } from '@/config'

export async function POST(request: NextRequest) {
  try {
    console.log('工作流API调用开始')

    // 检查必要的配置
    if (!API_KEY || API_KEY === 'undefined' || API_KEY === 'your_api_key_here') {
      console.log('API_KEY未配置')
      return NextResponse.json(
        {
          error: '演示模式',
          message: '当前为演示模式，请配置 Dify API 密钥以使用完整功能',
          details: 'Please set NEXT_PUBLIC_APP_KEY in environment variables',
          demo: true
        },
        { status: 400 }
      )
    }

    if (!APP_ID || APP_ID === 'undefined' || APP_ID === 'your_app_id_here') {
      console.log('APP_ID未配置')
      return NextResponse.json(
        {
          error: '演示模式',
          message: '当前为演示模式，请配置 Dify 应用ID 以使用完整功能',
          details: 'Please set NEXT_PUBLIC_APP_ID in environment variables',
          demo: true
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('请求体:', body)

    // 如果配置了API，尝试调用真实的Dify API
    try {
      const { getInfo } = await import('@/app/api/utils/common')
      const { user } = getInfo(request)
      const { inputs, files } = body

      console.log('调用Dify API:', { inputs, files, user })

      // 构建正确的输入参数格式
      const processedInputs = { ...inputs }

      // 处理文件参数，将files数组转换为inputs中的文件对象
      if (files && files.length > 0) {
        // Dify工作流期望的是 'file' 参数，而不是 'file_0'
        const firstFile = files[0]
        processedInputs['file'] = {
          transfer_method: 'local_file',
          upload_file_id: firstFile.upload_file_id,
          type: 'document'
        }
      }

      console.log('处理后的inputs:', processedInputs)

      // 直接调用 Dify API，绕过有bug的dify-client
      const difyResponse = await fetch(`${API_URL}/workflows/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          inputs: processedInputs,
          user,
          response_mode: 'streaming'
        })
      })

      console.log('Dify API响应状态:', difyResponse.status)

      if (!difyResponse.ok) {
        const errorText = await difyResponse.text()
        console.error('Dify API错误响应:', errorText)
        throw new Error(`Dify API返回错误: ${difyResponse.status} ${errorText}`)
      }

      // 返回流式响应
      return new Response(difyResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      })

    } catch (difyError: any) {
      console.error('Dify API错误:', difyError)
      return NextResponse.json({
        error: 'Dify API调用失败',
        message: difyError.message || 'API调用出错',
        details: difyError.toString()
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('工作流运行错误:', error)

    return NextResponse.json({
      error: '工作流执行失败',
      message: error.message || 'Unknown error',
      details: error.toString()
    }, { status: 500 })
  }
}
