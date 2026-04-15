'use client'

import { useI18n } from './context'

export function LangToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
      className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-500"
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  )
}
