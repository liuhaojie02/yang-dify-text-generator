import type { FC } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Bars3Icon,
  PencilSquareIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  showBackButton?: boolean
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
  showBackButton = false,
}) => {
  const router = useRouter()

  const handleBackClick = () => {
    router.push('/')
  }

  return (
    <div className="shrink-0 flex items-center justify-between h-12 px-3 bg-gray-100">
      {showBackButton
        ? (
          <div
            className='flex items-center justify-center h-8 w-8 cursor-pointer hover:bg-gray-200 rounded transition-colors'
            onClick={handleBackClick}
            title="返回主页"
          >
            <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          </div>
        )
        : isMobile
          ? (
            <div
              className='flex items-center justify-center h-8 w-8 cursor-pointer'
              onClick={() => onShowSideBar?.()}
            >
              <Bars3Icon className="h-4 w-4 text-gray-500" />
            </div>
          )
          : <div></div>}
      <div className='flex items-center space-x-2'>
        <AppIcon size="small" />
        <div className=" text-sm text-gray-800 font-bold">{title}</div>
      </div>
      {isMobile
        ? (
          <div className='flex items-center justify-center h-8 w-8 cursor-pointer'
            onClick={() => onCreateNewChat?.()}
          >
            <PencilSquareIcon className="h-4 w-4 text-gray-500" />
          </div>)
        : <div></div>}
    </div>
  )
}

export default React.memo(Header)
