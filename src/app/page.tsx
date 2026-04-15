'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackPageView, trackClick } from '@/lib/analytics'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
  { icon: '🔍', title: '智能爬取', desc: '自动抓取 App Store / Google Play 海量用户评论' },
  { icon: '🧹', title: '数据清洗', desc: '去重、去水军、语言检测，确保数据质量' },
  { icon: '🎯', title: '痛点提取', desc: 'AI 深度分析，从用户吐槽中精准提取核心痛点' },
  { icon: '📊', title: '需求聚类', desc: '语义聚类将零散抱怨归类，发现真正的需求模式' },
  { icon: '⚡', title: '优先级排序', desc: '多维评分体系，告诉你先做什么最有价值' },
  { icon: '📝', title: '自动报告', desc: '一键生成 Markdown/PDF 需求洞察报告' },
]

const TEAM = [
  { name: '张三', role: '创始人 & CEO', bio: '前字节跳动产品经理，10年移动互联网经验' },
  { name: '李四', role: 'CTO', bio: '前阿里云高级工程师，AI 基础设施专家' },
  { name: '王五', role: '产品负责人', bio: '连续创业者，专注用户需求研究' },
  { name: '赵六', role: 'AI 工程师', bio: 'NLP 方向博士，LLM 应用专家' },
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

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
    const { error } = await supabase.from('ai_waitlist').insert({ email, source: 'landing_page' })
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
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/admin" className="text-sm text-slate-600 hover:text-indigo-600">后台</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-600 hover:text-indigo-600">登录</Link>
                <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">注册</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
            AI 驱动的需求挖掘平台
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight text-balance">
            从用户评论中，<br />
            <span className="text-indigo-600">发现真正的需求</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AppInsight 用 AI 自动分析海量 APP 用户评论，精准提取痛点、聚类需求、优先级排序。
            帮产品经理和创业者从用户的呼声中发现下一个产品机会。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" onClick={() => trackClick('hero_register')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors">
              免费开始
            </Link>
            <button onClick={() => { trackClick('hero_learn_more'); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl text-lg font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">六步完成需求洞察</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">工作流程</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {['输入 APP 名称', 'AI 自动分析', '获取洞察报告'].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">{i + 1}</div>
                  <p className="mt-3 text-sm font-medium text-slate-700">{step}</p>
                </div>
                {i < 2 && <div className="hidden md:block text-slate-300 text-2xl pb-6">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">团队</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-600 font-bold">{m.name[0]}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{m.name}</h3>
                <p className="text-xs text-indigo-600 font-medium">{m.role}</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">加入等待列表</h2>
          <p className="mt-4 text-slate-600">我们正在内测中，留下邮箱，第一时间获得体验资格。</p>
          {submitted ? (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
              已加入等待列表！我们会尽快联系你。
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {loading ? '提交中...' : '加入'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <span>&copy; 2026 AppInsight</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/login">登录</Link>
            <Link href="/register">注册</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
