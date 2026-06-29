import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export function Verify() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); return }

    api.post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/app/dashboard'), 3000)
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="text-center flex flex-col items-center gap-4 max-w-sm">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400">Verificando seu email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">✓</div>
            <div>
              <p className="text-white font-medium">Email verificado!</p>
              <p className="text-zinc-400 text-sm mt-1">Redirecionando para o dashboard...</p>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl">✗</div>
            <div>
              <p className="text-white font-medium">Link inválido ou expirado</p>
              <p className="text-zinc-400 text-sm mt-1">Tente criar uma nova conta ou entre em contato.</p>
            </div>
            <a href="/" className="text-amber-500 hover:text-amber-400 text-sm">Voltar ao início</a>
          </>
        )}
      </div>
    </main>
  )
}
