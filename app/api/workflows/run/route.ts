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
      const { client, getInfo } = await import('@/app/api/utils/common')
      const { user } = getInfo(request)
      const { inputs, files } = body

      console.log('调用Dify API:', { inputs, files, user })
      const res = await client.runWorkflow(inputs, user, true, files)
      return new Response(res.data as any)
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
