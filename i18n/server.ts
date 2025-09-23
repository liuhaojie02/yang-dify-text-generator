import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = (): Locale => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] | undefined

  try {
    // get locale from cookie
    const localeCookie = cookies().get('locale')
    languages = localeCookie?.value ? [localeCookie.value] : []

    if (!languages.length) {
      // Negotiator expects plain object so we need to transform headers
      const negotiatorHeaders: Record<string, string> = {}
      headers().forEach((value, key) => (negotiatorHeaders[key] = value))
      // Use negotiator and intl-localematcher to get best locale
      languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    }

    // 过滤无效的语言标签
    languages = languages.filter(lang => {
      try {
        Intl.getCanonicalLocales(lang)
        return true
      } catch {
        return false
      }
    })

    // 如果没有有效的语言标签，使用默认语言
    if (!languages.length) {
      languages = [i18n.defaultLocale]
    }

    // match locale
    const matchedLocale = match(languages, locales, i18n.defaultLocale) as Locale
    return matchedLocale
  } catch (error) {
    console.error('Error getting locale:', error)
    return i18n.defaultLocale as Locale
  }
}
