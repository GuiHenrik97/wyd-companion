import { useState, useEffect } from 'react'

interface EventTimer {
  id: string
  label: string
  description: string
  times: { hour: number; minute: number }[]
  days: number[] | 'all'
  enabled: boolean
  alertBefore: number
}

const DEFAULT_EVENTS: EventTimer[] = [
  {
    id: 'infernal',
    label: 'Zona Infernal',
    description: 'Entrada nos minutos :00 e :30',
    times: [
      { hour: 2, minute: 0 }, { hour: 6, minute: 0 },
      { hour: 10, minute: 0 }, { hour: 14, minute: 0 },
      { hour: 18, minute: 0 }, { hour: 22, minute: 0 },
    ],
    days: 'all',
    enabled: true,
    alertBefore: 10,
  },
  {
    id: 'arena',
    label: 'Arena Real',
    description: 'Verifique os horários do seu servidor',
    times: [{ hour: 20, minute: 0 }, { hour: 22, minute: 0 }],
    days: 'all',
    enabled: true,
    alertBefore: 15,
  },
  {
    id: 'torres',
    label: 'Guerra de Torres',
    description: 'Segunda a Sexta',
    times: [{ hour: 21, minute: 0 }],
    days: [1, 2, 3, 4, 5],
    enabled: true,
    alertBefore: 15,
  },
  {
    id: 'kefra',
    label: 'Boss Kefra',
    description: 'Sábado',
    times: [{ hour: 12, minute: 0 }],
    days: [6],
    enabled: true,
    alertBefore: 15,
  },
  {
    id: 'cidade',
    label: 'Guerra de Cidade',
    description: 'Domingo',
    times: [{ hour: 20, minute: 0 }],
    days: [0],
    enabled: true,
    alertBefore: 15,
  },
]

function getNextOccurrence(event: EventTimer): Date | null {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const candidates: Date[] = []

  const daysToCheck = [0, 1, 2, 3, 4, 5, 6]

  for (const offset of daysToCheck) {
    const checkDay = (dayOfWeek + offset) % 7
    if (event.days !== 'all' && !event.days.includes(checkDay)) continue

    for (const t of event.times) {
      const candidate = new Date(now)
      candidate.setDate(now.getDate() + offset)
      candidate.setHours(t.hour, t.minute, 0, 0)
      if (candidate > now) candidates.push(candidate)
    }
  }

  candidates.sort((a, b) => a.getTime() - b.getTime())
  return candidates[0] ?? null
}

function formatCountdown(ms: number): { text: string; urgent: boolean } {
  if (ms <= 0) return { text: 'Agora!', urgent: true }
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const urgent = ms < 15 * 60 * 1000

  if (hours > 0) return { text: `${hours}h ${minutes.toString().padStart(2, '0')}m`, urgent }
  if (minutes > 0) return { text: `${minutes}m ${seconds.toString().padStart(2, '0')}s`, urgent }
  return { text: `${seconds}s`, urgent: true }
}

function formatNextTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function Timers() {
  const [events, setEvents] = useState<EventTimer[]>(() => {
    try {
      const saved = localStorage.getItem('wyd-timers')
      if (saved) {
        const parsed = JSON.parse(saved)
        return DEFAULT_EVENTS.map(def => ({
          ...def,
          enabled: parsed[def.id]?.enabled ?? def.enabled,
          alertBefore: parsed[def.id]?.alertBefore ?? def.alertBefore,
        }))
      }
    } catch {}
    return DEFAULT_EVENTS
  })

  const [now, setNow] = useState(new Date())
  const [notified, setNotified] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const saved: Record<string, any> = {}
    events.forEach(e => { saved[e.id] = { enabled: e.enabled, alertBefore: e.alertBefore } })
    localStorage.setItem('wyd-timers', JSON.stringify(saved))
  }, [events])

  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') Notification.requestPermission()

    events.forEach(event => {
      if (!event.enabled) return
      const next = getNextOccurrence(event)
      if (!next) return
      const msLeft = next.getTime() - now.getTime()
      const alertMs = event.alertBefore * 60 * 1000
      const key = `${event.id}-${next.getTime()}`

      if (msLeft > 0 && msLeft <= alertMs && !notified.has(key)) {
        setNotified(prev => new Set(prev).add(key))
        const minutes = Math.ceil(msLeft / 60000)
        if (Notification.permission === 'granted') {
          new Notification(`WYD Companion — ${event.label}`, {
            body: `Começa em ${minutes} minuto${minutes !== 1 ? 's' : ''}!`,
            icon: '/favicon.svg',
          })
        }
      }
    })
  }, [now, events, notified])

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e))
  }

  const setAlertBefore = (id: string, value: number) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, alertBefore: value } : e))
  }

  const dayOfWeek = now.getDay()

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Lembretes</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Timers em tempo real para os eventos do dia.{' '}
          <span className="text-zinc-600">Funciona apenas com esta aba aberta.</span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {events.map(event => {
          const next = getNextOccurrence(event)
          const msLeft = next ? next.getTime() - now.getTime() : null
          const { text: countdown, urgent } = msLeft !== null ? formatCountdown(msLeft) : { text: '—', urgent: false }
          const isToday = event.days === 'all' || event.days.includes(dayOfWeek)
          const alertOptions = [5, 10, 15, 30]

          return (
            <div
              key={event.id}
              className={`rounded-2xl border p-5 transition-all ${
                !event.enabled
                  ? 'bg-zinc-900/50 border-zinc-800 opacity-50'
                  : urgent && isToday
                  ? 'bg-amber-500/5 border-amber-500/40'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <button
                    onClick={() => toggleEvent(event.id)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                      event.enabled
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-zinc-600'
                    }`}
                  >
                    {event.enabled && <span className="text-black text-xs flex items-center justify-center w-full h-full">✓</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-white font-medium">{event.label}</h3>
                      <span className="text-zinc-500 text-xs">{event.description}</span>
                    </div>

                    {event.enabled && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {!isToday ? (
                          <span className="text-zinc-600 text-sm">Não ocorre hoje</span>
                        ) : next ? (
                          <>
                            <span className="text-zinc-400 text-sm">
                              Próxima às <span className="text-white font-medium">{formatNextTime(next)}</span>
                            </span>
                            <span className={`text-sm font-mono font-medium tabular-nums ${
                              urgent ? 'text-amber-400' : 'text-zinc-300'
                            }`}>
                              {countdown}
                            </span>
                            {urgent && (
                              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                Em breve
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-zinc-600 text-sm">Sem mais ocorrências hoje</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {event.enabled && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-zinc-600 text-xs">Avisar</span>
                    <select
                      value={event.alertBefore}
                      onChange={(e) => setAlertBefore(event.id, Number(e.target.value))}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-300 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {alertOptions.map(o => (
                        <option key={o} value={o}>{o}min antes</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <p className="text-zinc-500 text-xs text-center">
          As notificações do browser precisam estar permitidas para receber alertas.
          Clique em qualquer timer para ativar/desativar.
        </p>
      </div>
    </main>
  )
}
