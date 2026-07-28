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
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { type TopNavLink } from '../types'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: TopNavLink[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const normalizedLinks = useMemo(
    () =>
      links.map((link) => ({
        isActive:
          link.href === '/'
            ? pathname === '/'
            : pathname === link.href || pathname.startsWith(`${link.href}/`),
        disabled: false,
        external: false,
        ...link,
      })),
    [links, pathname]
  )

  return (
    <>
      <div className='lg:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={<Button size='icon' variant='outline' className='size-7' />}
          >
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {normalizedLinks.map(
              ({ title, href, isActive, disabled, external }) => (
                <DropdownMenuItem
                  key={`${title}-${href}`}
                  render={
                    external ? (
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : undefined}
                        className={cn(
                          !isActive && 'text-muted-foreground',
                          disabled && 'pointer-events-none opacity-50'
                        )}
                      >
                        {title}
                      </a>
                    ) : (
                      <Link
                        to={href}
                        disabled={disabled}
                        className={cn(
                          !isActive && 'text-muted-foreground',
                          disabled && 'pointer-events-none opacity-50'
                        )}
                      >
                        {title}
                      </Link>
                    )
                  }
                ></DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center gap-1 rounded-full border border-white/[0.45] bg-white/[0.72] px-2 py-1 text-foreground shadow-[0_10px_30px_-18px_rgba(30,41,59,0.55),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl lg:flex dark:border-white/[0.16] dark:bg-white/[0.14] dark:text-white',
          className
        )}
        {...props}
      >
        {normalizedLinks.map(({ title, href, isActive, disabled, external }) =>
          external ? (
            <a
              key={`${title}-${href}`}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : undefined}
              className={cn(
                'text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 hover:bg-black/[0.06] dark:text-white/[0.72] dark:hover:bg-white/10 dark:hover:text-white',
                disabled && 'pointer-events-none opacity-50'
              )}
            >
              {title}
            </a>
          ) : (
            <Link
              key={`${title}-${href}`}
              to={href}
              disabled={disabled}
              className={cn(
                'rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200',
                isActive
                  ? 'bg-black/[0.08] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] dark:bg-white/[0.14] dark:text-white'
                  : 'text-muted-foreground hover:bg-black/[0.06] hover:text-foreground dark:text-white/[0.72] dark:hover:bg-white/10 dark:hover:text-white',
                disabled && 'pointer-events-none opacity-50'
              )}
            >
              {title}
            </Link>
          )
        )}
      </nav>
    </>
  )
}
