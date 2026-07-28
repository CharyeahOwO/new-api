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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LUOYIN_BRAND_NAME, LuoyinWordmark } from '@/custom/luoyin/brand'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='luoyin-shell luoyin-auth relative grid h-svh max-w-none'>
      <Link
        to='/'
        aria-label={`${t('Go to home')} - ${LUOYIN_BRAND_NAME}`}
        className='absolute top-4 left-4 z-10 rounded-full border border-white/[0.45] bg-white/[0.72] px-3 py-1.5 shadow-[0_10px_30px_-18px_rgba(30,41,59,0.55),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.82] dark:border-white/[0.16] dark:bg-white/[0.14] sm:top-8 sm:left-8'
      >
        <div className='flex h-8 w-32 items-center justify-center md:w-36'>
          <LuoyinWordmark />
        </div>
      </Link>
      <div className='container flex items-center pt-16 sm:pt-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 px-4 py-8 sm:w-[480px] sm:p-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
