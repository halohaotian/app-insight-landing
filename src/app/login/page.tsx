'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { trackPageView } from '@/lib/analytics'
import { useI18n } from '@/lib/i18n/context'
import { LangToggle } from '@/lib/i18n/LangToggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => { trackPageView('/login') }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials' ? t('login_error_credentials') : error.message)
    } else {
      router.push('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">AppInsight</Link>
            <LangToggle />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('login_title')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('login_desc')}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('login_email')}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('login_password')}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm">
            {loading ? t('login_logging') : t('login_btn')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {t('login_no_account')} <Link href="/register" className="text-indigo-600 hover:underline">{t('login_link')}</Link>
        </p>
      </div>
    </div>
  )
}
