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
import { Fragment, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: string
  name?: string
  columns?: FooterColumnProps[]
  copyright?: string
  compact?: boolean
  className?: string
}

const NEW_API_FOOTER_ATTRIBUTION_KEY = [
  'footer',
  'new' + 'api',
  'projectAttributionSuffix',
].join('.')

function FooterLinkItem(props: { link: FooterLink }) {
  const { t } = useTranslation()
  const isExternal = props.link.href.startsWith('http')
  const label = t(props.link.text)

  if (isExternal) {
    return (
      <a
        href={props.link.href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-slate-700 hover:text-slate-950 text-sm transition-colors duration-200 dark:text-white/72 dark:hover:text-white'
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={props.link.href}
      className='text-slate-700 hover:text-slate-950 text-sm transition-colors duration-200 dark:text-white/72 dark:hover:text-white'
    >
      {label}
    </Link>
  )
}

// Renders User Agreement / Privacy Policy links inline with the parent's
// copyright row when either is configured in System Settings → Site. Emits
// fragmented siblings so the parent flex container's gap controls spacing.
function LegalLinks(props: { leadingSeparator?: boolean }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const items: { key: string; label: string; href: string }[] = []
  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) {
    return null
  }
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {(props.leadingSeparator || index > 0) && (
            <span aria-hidden='true' className='text-muted-foreground/30'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='hover:text-foreground transition-colors duration-200'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

// inline=true returns just the inner span for composition in a parent flex
// row. inline=false wraps in a centered/right-aligned div (default).
function ProjectAttribution(props: { currentYear: number; inline?: boolean }) {
  const { t } = useTranslation()
  const content = (
    <span className='text-slate-700/78 dark:text-white/60'>
      &copy; {props.currentYear}{' '}
      <a
        href='https://github.com/QuantumNous/new-api'
        target='_blank'
        rel='noopener noreferrer'
        className='font-medium text-slate-950 transition-colors hover:text-black dark:text-white/82 dark:hover:text-white'
      >
        {t('New API')}
      </a>
      . {t(NEW_API_FOOTER_ATTRIBUTION_KEY)}
    </span>
  )
  if (props.inline) {
    return content
  }
  return (
    <div className='text-center text-xs text-slate-700/78 sm:text-right dark:text-white/60'>
      {content}
    </div>
    </div>
  )
}

export function Footer(props: FooterProps) {
  const { t } = useTranslation()
  const {
    systemName,
    logo: systemLogo,
    footerHtml,
    demoSiteEnabled,
  } = useSystemConfig()

  const displayLogo = props.logo || systemLogo || '/logo.png'
  const displayName = props.name || systemName || 'New API'
  const isDemoSiteMode = Boolean(demoSiteEnabled)
  const currentYear = new Date().getFullYear()

  const fallbackColumns = useMemo<FooterColumnProps[]>(
    () => [
      {
        title: t('footer.columns.about.title'),
        links: [
          {
            text: t('footer.columns.about.links.aboutProject'),
            href: 'https://docs.newapi.pro/wiki/project-introduction/',
          },
          {
            text: t('footer.columns.about.links.contact'),
            href: 'https://docs.newapi.pro/support/community-interaction/',
          },
          {
            text: t('footer.columns.about.links.features'),
            href: 'https://docs.newapi.pro/wiki/features-introduction/',
          },
        ],
      },
      {
        title: t('footer.columns.docs.title'),
        links: [
          {
            text: t('footer.columns.docs.links.quickStart'),
            href: 'https://docs.newapi.pro/getting-started/',
          },
          {
            text: t('footer.columns.docs.links.installation'),
            href: 'https://docs.newapi.pro/installation/',
          },
          {
            text: t('footer.columns.docs.links.apiDocs'),
            href: 'https://docs.newapi.pro/api/',
          },
        ],
      },
      {
        title: t('footer.columns.related.title'),
        links: [
          {
            text: t('footer.columns.related.links.oneApi'),
            href: 'https://github.com/songquanpeng/one-api',
          },
          {
            text: t('footer.columns.related.links.midjourney'),
            href: 'https://github.com/novicezk/midjourney-proxy',
          },
          {
            text: t('footer.columns.related.links.newApiKeyTool'),
            href: 'https://github.com/Calcium-Ion/new-api-key-tool',
          },
        ],
      },
    ],
    [t]
  )

  const displayColumns = props.columns ?? fallbackColumns

  if (props.compact) {
    return (
      <footer
        className={cn('relative z-10 px-4 pb-4 md:pb-5', props.className)}
      >
        <div className='mx-auto flex min-h-14 w-full max-w-3xl flex-col items-center justify-between gap-2 rounded-full border border-white/[0.45] bg-white/[0.72] px-5 py-2.5 text-foreground shadow-[0_10px_30px_-18px_rgba(30,41,59,0.55),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:min-h-12 sm:flex-row sm:gap-4 sm:px-6 dark:border-white/[0.16] dark:bg-white/[0.14] dark:text-white'>
          <div className='flex min-w-0 items-center gap-2 text-center sm:text-left'>
            <span className='truncate text-[13px] font-semibold tracking-tight'>
              {displayName}
            </span>
            <span className='text-muted-foreground text-[13px] dark:text-white/[0.72]'>
              &copy; {currentYear}.{' '}
              {props.copyright ?? t('footer.defaultCopyright')}
            </span>
          </div>

          <div className='flex min-w-0 flex-col items-center leading-tight sm:items-end'>
            <p className='text-[13px] text-slate-700/82 dark:text-white/72'>
              <Trans
                i18nKey='home.footer.developedDesigned'
                components={{
                  newapi: (
                    <a
                      href='https://www.newapi.ai/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mx-0.5 font-semibold text-slate-950 transition-colors hover:text-black dark:text-white/88 dark:hover:text-white'
                    />
                  ),
                }}
              />
            </p>
            <p className='text-muted-foreground mt-0.5 text-[11px] dark:text-white/[0.58]'>
              <Trans
                i18nKey='home.footer.customizedBy'
                components={{
                  repo: (
                    <a
                      href='https://github.com/CharyeahOwO/new-api'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='transition-colors hover:text-foreground dark:hover:text-white'
                    />
                  ),
                }}
              />
            </p>
          </div>
        </div>
      </footer>
    )
  }

  if (footerHtml) {
    return (
      <footer
        className={cn(
          'relative z-10 px-4 pb-4 md:pb-5',
          props.className
        )}
      >
        <div className='mx-auto w-full max-w-6xl'>
          <div className='flex flex-col items-center justify-between gap-3 rounded-lg border border-white/[0.42] bg-white/[0.42] px-5 py-3 shadow-[0_16px_42px_-28px_rgba(15,23,42,0.42),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl sm:flex-row sm:px-6 dark:border-white/[0.12] dark:bg-white/10'>
            <div
              className='custom-footer min-w-0 text-center text-sm text-slate-800 sm:text-left dark:text-white/72'
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
            <div className='flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/[0.28] pt-3 text-xs text-slate-700/78 sm:w-auto sm:justify-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 dark:border-white/[0.12] dark:text-white/60'>
              <LegalLinks />
              <ProjectAttribution currentYear={currentYear} inline />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn('relative z-10 px-4 pb-4 md:pb-5', props.className)}
    >
      <div className='mx-auto max-w-6xl rounded-lg border border-white/[0.42] bg-white/[0.42] px-5 py-4 shadow-[0_16px_42px_-28px_rgba(15,23,42,0.42),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl md:px-6 md:py-5 dark:border-white/[0.12] dark:bg-white/10'>
        <div className='flex flex-col justify-between gap-5 md:flex-row md:gap-8'>
          {/* Brand column */}
          <div className='shrink-0'>
            <Link to='/' className='group flex items-center gap-2.5'>
              <img
                src={displayLogo}
                alt={displayName}
                className='size-7 rounded-lg object-contain'
              />
              <span className='text-sm font-semibold tracking-tight text-slate-950 dark:text-white/88'>
                {displayName}
              </span>
            </Link>
            <p className='mt-2 max-w-[200px] text-xs leading-relaxed text-slate-700/82 dark:text-white/58'>
              {t('Powerful API Management Platform')}
            </p>
          </div>

          {/* Links columns */}
          {isDemoSiteMode && (
            <div className='grid grid-cols-3 gap-8 md:gap-16'>
              {displayColumns.map((column, index) => (
                <div key={index}>
                  <p className='mb-2 text-xs font-medium text-slate-700/76 uppercase dark:text-white/56'>
                    {t(column.title)}
                  </p>
                  <ul className='space-y-2'>
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <FooterLinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div className='mt-4 flex flex-col items-center justify-between gap-2 border-t border-white/[0.28] pt-3 sm:flex-row dark:border-white/[0.12]'>
          <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-700/76 sm:justify-start dark:text-white/56'>
            <span>
              &copy; {currentYear} {displayName}.{' '}
              {props.copyright ?? t('footer.defaultCopyright')}
            </span>
            <LegalLinks leadingSeparator />
          </div>
          <ProjectAttribution currentYear={currentYear} />
        </div>
      </div>
    </footer>
  )
}
