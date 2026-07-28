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
import { useMemo } from 'react'
import { useStatus } from '@/hooks/use-status'
import {
  LUOYIN_BRAND_NAME,
  LUOYIN_MICRO_TAGLINE,
  LUOYIN_TAGLINE,
  LUOYIN_WORDMARK_SRC,
} from '@/custom/luoyin/brand'

// Built-in fallbacks — used when the corresponding backend option is empty,
// so an unconfigured deployment renders exactly as before.
const DEFAULT_EYEBROW = '✨ 欢迎来到我的奇妙 API 世界 🌸'
const DEFAULT_BG_IMAGE_MOBILE =
  'https://api.nyaovo.com/image/api/random?device=mobile'
const DEFAULT_BG_IMAGE_PC = 'https://api.nyaovo.com/image/api/random?device=pc'
const DEFAULT_BASE_URL = 'https://api.nyaovo.com'
const DEFAULT_DISPLAY_HOST = 'api.nyaovo.com'
const DEFAULT_ENDPOINTS = [
  '/v1/chat/completions',
  '/v1/responses',
  '/v1/messages',
]

export interface HomeBranding {
  brandName: string
  tagline: string
  microTagline: string
  eyebrow: string
  bgImageMobile: string
  bgImagePc: string
  baseUrl: string
  displayHost: string
  endpoints: string[]
  wordmarkSrc: string
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

// Split a newline- or comma-separated endpoint list into normalized paths.
function parseEndpoints(raw: unknown): string[] {
  const text = asString(raw)
  if (!text) return DEFAULT_ENDPOINTS
  const list = text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
  return list.length > 0 ? list : DEFAULT_ENDPOINTS
}

// Derive the display host (e.g. "api.example.com") from a base URL.
function hostFromUrl(url: string, fallback: string): string {
  if (!url) return fallback
  try {
    return new URL(url).host || fallback
  } catch {
    return fallback
  }
}

/**
 * Resolve landing-page branding from backend `/api/status`, falling back to the
 * built-in defaults field by field. The terminal demo base URL reuses the
 * existing `server_address` option; the wordmark reuses `logo`.
 */
export function useHomeBranding(): HomeBranding {
  const { status } = useStatus()

  return useMemo(() => {
    const get = (key: string): string => asString(status?.[key])

    const baseUrl = get('server_address') || DEFAULT_BASE_URL
    const wordmarkSrc = get('logo') || LUOYIN_WORDMARK_SRC

    return {
      brandName: get('landing_page_brand_name') || LUOYIN_BRAND_NAME,
      tagline: get('landing_page_tagline') || LUOYIN_TAGLINE,
      microTagline: get('landing_page_micro_tagline') || LUOYIN_MICRO_TAGLINE,
      eyebrow: get('landing_page_eyebrow') || DEFAULT_EYEBROW,
      bgImageMobile:
        get('landing_page_bg_image_mobile') || DEFAULT_BG_IMAGE_MOBILE,
      bgImagePc: get('landing_page_bg_image_pc') || DEFAULT_BG_IMAGE_PC,
      baseUrl,
      displayHost: hostFromUrl(baseUrl, DEFAULT_DISPLAY_HOST),
      endpoints: parseEndpoints(status?.['landing_page_terminal_endpoints']),
      wordmarkSrc,
    }
  }, [status])
}
