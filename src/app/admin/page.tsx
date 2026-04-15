'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface DailyStat {
  stat_date: string
  page_views: number
  unique_visitors: number
  click_events: number
  registrations: number
  waitlist_signups: number
}

interface WaitlistEntry {
  id: string
  email: string
  source: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DailyStat[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'waitlist'>('overview')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      // Check admin role
      const { data: profile } = await supabase
        .from('app_insight_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      if (profile?.role === 'admin') {
        setIsAdmin(true)
        loadAdminData(supabase)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
  }, [router])

  async function loadAdminData(supabase: ReturnType<typeof createClient>) {
    const [statsRes, waitlistRes] = await Promise.all([
      supabase.from('app_insight_daily_stats').select('*').order('stat_date', { ascending: false }).limit(30),
      supabase.from('app_insight_waitlist').select('*').order('created_at', { ascending: false }).limit(50),
    ])
    if (statsRes.data) setStats(statsRes.data)
    if (waitlistRes.data) setWaitlist(waitlistRes.data)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  // Compute totals
  const totals = stats.reduce(
    (acc, s) => ({
      views: acc.views + s.page_views,
      visitors: acc.visitors + s.unique_visitors,
      clicks: acc.clicks + s.click_events,
      regs: acc.regs + s.registrations,
      wl: acc.wl + s.waitlist_signups,
    }),
    { views: 0, visitors: 0, clicks: 0, regs: 0, wl: 0 }
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">加载中...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">你不是管理员，无法访问后台</p>
          <Link href="/" className="text-indigo-600 hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold text-indigo-600">AppInsight</Link>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm font-medium text-slate-700">管理后台</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-600">退出</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'waitlist' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            Waitlist ({waitlist.length})
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: '总浏览量', value: totals.views, color: 'text-blue-600' },
                { label: '独立访客', value: totals.visitors, color: 'text-green-600' },
                { label: '点击事件', value: totals.clicks, color: 'text-purple-600' },
                { label: '注册数', value: totals.regs, color: 'text-orange-600' },
                { label: 'Waitlist', value: totals.wl, color: 'text-red-600' },
              ].map((card) => (
                <div key={card.label} className="bg-white p-5 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500">{card.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            {stats.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">每日浏览量</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[...stats].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="stat_date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="page_views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">每日注册 & Waitlist</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[...stats].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="stat_date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="registrations" stroke="#f97316" strokeWidth={2} name="注册" />
                      <Line type="monotone" dataKey="waitlist_signups" stroke="#ef4444" strokeWidth={2} name="Waitlist" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {stats.length === 0 && (
              <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
                暂无统计数据。请先运行 <code className="text-xs bg-slate-100 px-1 rounded">app_insight_aggregate_daily_stats()</code> 或等待自动聚合。
              </div>
            )}

            {/* Stats table */}
            {stats.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700">每日明细</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-slate-500 font-medium">日期</th>
                        <th className="text-right px-6 py-3 text-slate-500 font-medium">浏览量</th>
                        <th className="text-right px-6 py-3 text-slate-500 font-medium">访客</th>
                        <th className="text-right px-6 py-3 text-slate-500 font-medium">点击</th>
                        <th className="text-right px-6 py-3 text-slate-500 font-medium">注册</th>
                        <th className="text-right px-6 py-3 text-slate-500 font-medium">Waitlist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s) => (
                        <tr key={s.stat_date} className="border-t border-slate-100">
                          <td className="px-6 py-3 text-slate-700">{s.stat_date}</td>
                          <td className="px-6 py-3 text-right text-blue-600 font-medium">{s.page_views}</td>
                          <td className="px-6 py-3 text-right text-green-600 font-medium">{s.unique_visitors}</td>
                          <td className="px-6 py-3 text-right text-purple-600 font-medium">{s.click_events}</td>
                          <td className="px-6 py-3 text-right text-orange-600 font-medium">{s.registrations}</td>
                          <td className="px-6 py-3 text-right text-red-600 font-medium">{s.waitlist_signups}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'waitlist' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-slate-500 font-medium">邮箱</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-medium">来源</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-medium">状态</th>
                  <th className="text-left px-6 py-3 text-slate-500 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w) => (
                  <tr key={w.id} className="border-t border-slate-100">
                    <td className="px-6 py-3 text-slate-700">{w.email}</td>
                    <td className="px-6 py-3 text-slate-500">{w.source}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        w.status === 'invited' ? 'bg-blue-100 text-blue-700' :
                        w.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{new Date(w.created_at).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">暂无 Waitlist 数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
