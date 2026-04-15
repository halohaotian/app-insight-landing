'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, t as translate, TranslationKey } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('app_insight_locale') as Locale | null
    if (saved === 'zh' || saved === 'en') setLocale(saved)
  }, [])

  const handleSetLocale = (l: Locale) => {
    setLocale(l)
    localStorage.setItem('app_insight_locale', l)
  }

  const t = (key: TranslationKey) => translate(locale, key)

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
