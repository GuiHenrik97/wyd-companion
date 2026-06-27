import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PLAYLIST = ['/music-town.mp3', '/music-login.mp3']
const LOGIN_PLAYLIST = ['/music-login.mp3', '/music-town.mp3']

export function AudioPlayer() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('wyd-muted') === 'true'
  })
  const [started, setStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const trackIndexRef = useRef(0)
  const location = useLocation()

  const isLoggedArea = location.pathname.startsWith('/app')
  const playlist = isLoggedArea ? PLAYLIST : LOGIN_PLAYLIST

  const playNext = () => {
    trackIndexRef.current = (trackIndexRef.current + 1) % playlist.length
    if (audioRef.current) {
      audioRef.current.src = playlist[trackIndexRef.current]
      audioRef.current.play().catch(() => {})
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(playlist[0])
      audioRef.current.volume = 0.15
      audioRef.current.addEventListener('ended', playNext)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
      localStorage.setItem('wyd-muted', String(muted))
    }
  }, [muted])

  const handleFirstInteraction = () => {
    if (!started && audioRef.current) {
      audioRef.current.play().catch(() => {})
      setStarted(true)
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleFirstInteraction, { once: true })
    return () => window.removeEventListener('click', handleFirstInteraction)
  }, [started])

  return (
    <button
      onClick={() => setMuted(m => !m)}
      title={muted ? 'Ativar música' : 'Desativar música'}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 hover:border-amber-500 flex items-center justify-center text-zinc-400 hover:text-amber-500 transition-all"
    >
      {muted ? (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )}
    </button>
  )
}
