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
import { cn } from '@/lib/utils'

export const LUOYIN_BRAND_NAME = '洛音云枢'
export const LUOYIN_TAGLINE = '洛水之畔，万模同声。'
export const LUOYIN_MICRO_TAGLINE = '星が落ちる前に、声を見つけよう。'
export const LUOYIN_WORDMARK_SRC = '/wordmark-luoyin.svg'

type LuoyinWordmarkProps = {
  className?: string
  src?: string
}

export function LuoyinWordmark({ className, src }: LuoyinWordmarkProps) {
  return (
    <img
      src={src || LUOYIN_WORDMARK_SRC}
      alt=''
      draggable={false}
      className={cn(
        'h-full w-full object-contain drop-shadow-[0_1px_1px_rgba(38,54,92,0.55)]',
        className
      )}
    />
  )
}
