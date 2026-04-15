'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackPageView, trackClick } from '@/lib/analytics'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n/context'
import { LangToggle } from '@/lib/i18n/LangToggle'
import { TranslationKey } from '@/lib/i18n/translations'

const FEATURE_KEYS: { icon: string; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: '🔍', titleKey: 'feat_crawl_title', descKey: 'feat_crawl_desc' },
  { icon: '🧹', titleKey: 'feat_clean_title', descKey: 'feat_clean_desc' },
  { icon: '🎯', titleKey: 'feat_extract_title', descKey: 'feat_extract_desc' },
  { icon: '📊', titleKey: 'feat_cluster_title', descKey: 'feat_cluster_desc' },
  { icon: '⚡', titleKey: 'feat_priority_title', descKey: 'feat_priority_desc' },
  { icon: '📝', titleKey: 'feat_report_title', descKey: 'feat_report_desc' },
]

const TEAM_KEYS: { nameKey: TranslationKey; roleKey: TranslationKey; bioKey: TranslationKey; initial: string }[] = [
  { nameKey: 'team_1_name', roleKey: 'team_1_role', bioKey: 'team_1_bio', initial: 'Z' },
  { nameKey: 'team_2_name', roleKey: 'team_2_role', bioKey: 'team_2_bio', initial: 'L' },
  { nameKey: 'team_3_name', roleKey: 'team_3_role', bioKey: 'team_3_bio', initial: 'W' },
  { nameKey: 'team_4_name', roleKey: 'team_4_role', bioKey: 'team_4_bio', initial: 'Z' },
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { t } = useI18n()

  useEffect(() => {
    trackPageView('/')
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    trackClick('waitlist_submit', email)
    const supabase = createClient()
    const { error } = await supabase.from('app_insight_waitlist').insert({ email, source: 'landing_page' })
    if (!error) setSubmitted(true)
    else if (error.code === '23505') setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-bold text-indigo-600">AppInsight</Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            {user ? (
              <Link href="/admin" className="text-sm text-slate-600 hover:text-indigo-600">{t('nav_admin')}</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-600 hover:text-indigo-600">{t('nav_login')}</Link>
                <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">{t('nav_register')}</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
            {t('hero_badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight text-balance">
            {t('hero_title_1')}<br />
            <span className="text-indigo-600">{t('hero_title_2')}</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero_desc')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" onClick={() => trackClick('hero_register')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors">
              {t('hero_cta')}
            </Link>
            <button onClick={() => { trackClick('hero_learn_more'); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl text-lg font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              {t('hero_secondary')}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('features_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_KEYS.map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">{t(f.titleKey)}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">{t('how_title')}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[t('how_step_1'), t('how_step_2'), t('how_step_3')].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">{i + 1}</div>
                  <p className="mt-3 text-sm font-medium text-slate-700">{step}</p>
                </div>
                {i < 2 && <div className="hidden md:block text-slate-300 text-2xl pb-6">&rarr;</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('team_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM_KEYS.map((m, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-600 font-bold">{m.initial}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{t(m.nameKey)}</h3>
                <p className="text-xs text-indigo-600 font-medium">{t(m.roleKey)}</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{t(m.bioKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t('waitlist_title')}</h2>
          <p className="mt-4 text-slate-600">{t('waitlist_desc')}</p>
          {submitted ? (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
              {t('waitlist_success')}
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t('waitlist_placeholder')}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {loading ? t('waitlist_submitting') : t('waitlist_submit')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <span>{t('footer_copy')}</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/login">{t('nav_login')}</Link>
            <Link href="/register">{t('nav_register')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
