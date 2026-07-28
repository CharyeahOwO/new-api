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
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { RichContent } from '@/components/rich-content'
import { LuoyinWordmark } from '@/custom/luoyin/brand'
import { isLikelyHtml } from '@/lib/content-format'
import { useAuthStore } from '@/stores/auth-store'

import { Hero } from './components'
import { useHomePageContent } from './hooks'
import { useHomeBranding } from './hooks/use-home-branding'

export function Home() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user
  const { content, isLoaded, isUrl } = useHomePageContent()
  const { brandName, wordmarkSrc } = useHomeBranding()

  if (!isLoaded) {
    return (
      <PublicLayout
        showMainContainer={false}
        siteName={brandName}
        logo={<LuoyinWordmark src={wordmarkSrc} />}
      >
        <main className='flex min-h-screen items-center justify-center'>
          <div className='text-muted-foreground'>{t('Loading...')}</div>
        </main>
      </PublicLayout>
    )
  }

  if (content) {
    if (isUrl) {
      return (
        <PublicLayout
          showMainContainer={false}
          siteName={brandName}
          logo={<LuoyinWordmark src={wordmarkSrc} />}
        >
          <iframe
            src={content}
            className='h-screen w-full border-none'
            title={t('Custom Home Page')}
            sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
          />
        </PublicLayout>
      )
    }

    const contentIsHtml = isLikelyHtml(content)

    if (contentIsHtml) {
      return (
        <PublicLayout showMainContainer={false}>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={content}
            className='custom-home-content'
          />
        </PublicLayout>
      )
    }

    return (
      <PublicLayout
        showMainContainer={false}
        siteName={brandName}
        logo={<LuoyinWordmark src={wordmarkSrc} />}
      >
        <main className='overflow-x-hidden'>
          <div className='mx-auto max-w-6xl px-4 py-8'>
            <RichContent
              mode='markdown'
              content={content}
              className='custom-home-content'
            />
          </div>
        </main>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout
      showMainContainer={false}
      siteName={brandName}
      logo={<LuoyinWordmark src={wordmarkSrc} />}
    >
      <div className='relative h-svh overflow-hidden md:h-auto md:min-h-screen md:overflow-visible'>
        <Hero isAuthenticated={isAuthenticated} />
        <div className='absolute bottom-0 left-0 z-20 w-full pb-1 md:pb-2'>
          <Footer
            name={brandName}
            compact
            className='bg-transparent mt-0 px-2 pt-0 pb-1 md:px-4 md:pb-5 max-md:[&>div]:min-h-0 max-md:[&>div]:gap-1 max-md:[&>div]:px-3 max-md:[&>div]:py-1.5'
          />
        </div>
      </div>
    </PublicLayout>
  )
}
