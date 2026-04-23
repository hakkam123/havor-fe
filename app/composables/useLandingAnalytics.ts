type LandingAnalytics = {
  totalVisits: number
  todayVisits: number
  lastVisitedAt: string | null
  dayKey: string
}

const STORAGE_KEY = 'havor:landing-analytics'

const getDayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultAnalytics = (): LandingAnalytics => ({
  totalVisits: 0,
  todayVisits: 0,
  lastVisitedAt: null,
  dayKey: getDayKey()
})

export const useLandingAnalytics = () => {
  const analytics = useState<LandingAnalytics>('landing-analytics', defaultAnalytics)

  const readAnalytics = () => {
    if (!import.meta.client) return analytics.value

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        analytics.value = defaultAnalytics()
        return analytics.value
      }

      const parsed = JSON.parse(raw)
      const dayKey = getDayKey()
      analytics.value = {
        totalVisits: Number(parsed.totalVisits || 0),
        todayVisits: parsed.dayKey === dayKey ? Number(parsed.todayVisits || 0) : 0,
        lastVisitedAt: parsed.lastVisitedAt || null,
        dayKey
      }
    } catch {
      analytics.value = defaultAnalytics()
    }

    return analytics.value
  }

  const persistAnalytics = (value: LandingAnalytics) => {
    analytics.value = value
    if (!import.meta.client) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }

  const trackLandingVisit = () => {
    const current = readAnalytics()
    const dayKey = getDayKey()
    const nextValue: LandingAnalytics = {
      totalVisits: current.totalVisits + 1,
      todayVisits: current.dayKey === dayKey ? current.todayVisits + 1 : 1,
      lastVisitedAt: new Date().toISOString(),
      dayKey
    }

    persistAnalytics(nextValue)
    return nextValue
  }

  return {
    analytics,
    readAnalytics,
    trackLandingVisit
  }
}
