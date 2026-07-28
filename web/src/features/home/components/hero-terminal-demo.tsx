/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const API_BASE_URL = 'https://api.nyaovo.com'

const API_ENDPOINTS = [
  '/v1/chat/completions',
  '/v1/responses',
  '/v1/messages',
] as const

const CYCLE_INTERVAL = 2600
const TRANSITION_MS = 180

export function HeroTerminalDemo() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    intervalRef.current = setInterval(() => {
      setTransitioning(true)
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % API_ENDPOINTS.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, CYCLE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const endpoint = API_ENDPOINTS[activeIndex]
  const fullUrl = `${API_BASE_URL}${endpoint}`

  const handleCopy = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(fullUrl)
  }

  return (
    <div className='relative left-1/2 mx-auto mt-14 w-[min(calc(100vw-1.5rem),36rem)] -translate-x-1/2 px-0 sm:left-auto sm:w-full sm:max-w-xl sm:translate-x-0 sm:px-1'>
      <div
        className={cn(
          'flex min-h-10 items-center gap-1 rounded-full border border-white/[0.45] bg-white/[0.72] px-1.5 py-0.5 text-foreground shadow-[0_10px_30px_-18px_rgba(30,41,59,0.55),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-2 dark:border-white/[0.16] dark:bg-white/[0.14] dark:text-white'
        )}
      >
        <div className='flex min-w-0 flex-1 items-baseline gap-1 rounded-full px-2.5 py-1 transition-colors duration-200 hover:bg-black/[0.06] sm:gap-1.5 sm:px-3 dark:hover:bg-white/10'>
          <span className='shrink-0 text-[13px] leading-none font-medium text-muted-foreground sm:text-[15px] dark:text-white/[0.72]'>
            https://
          </span>
          <span className='min-w-0 truncate text-[13px] leading-none font-semibold text-foreground sm:text-[15px] dark:text-white'>
            api.nyaovo.com
          </span>
        </div>
        <span
          className={cn(
            'inline-flex w-fit max-w-[58%] shrink-0 items-center justify-center truncate px-2 py-1 text-[13px] leading-none font-semibold text-[#66ccff] transition-all duration-200 sm:px-3 sm:text-[15px]',
            transitioning
              ? 'translate-y-1 opacity-0 blur-[1px]'
              : 'translate-y-0 opacity-100 blur-0'
          )}
        >
          {endpoint}
        </span>
        <button
          type='button'
          onClick={handleCopy}
          aria-label={t('Copy API URL')}
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-200 sm:size-8',
            'text-muted-foreground hover:bg-black/[0.06] hover:text-foreground',
            'dark:text-white/[0.72] dark:hover:bg-white/10 dark:hover:text-white'
          )}
        >
          <Copy className='size-4' />
        </button>
      </div>
    </div>
  )
}
