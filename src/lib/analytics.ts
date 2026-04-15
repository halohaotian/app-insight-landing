import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function trackPageView(path: string) {
  const sessionId = getSessionId()
  await supabase.from('ai_page_views').insert({
    path,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    session_id: sessionId,
  })
}

export async function trackClick(elementId: string, elementText?: string) {
  const sessionId = getSessionId()
  await supabase.from('ai_click_events').insert({
    element_id: elementId,
    element_text: elementText || null,
    page_path: window.location.pathname,
    session_id: sessionId,
  })
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'ai_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    sessionStorage.setItem(key, id)
  }
  return id
}
