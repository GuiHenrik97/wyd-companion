import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function Register() {
  const navigate = useNavigate()
  const { setTokens, setUserId } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.register(email, password)
      const { data } = await authApi.login(email, password)
      setTokens(data.accessToken, data.refreshToken)
      setUserId(data.userId)
      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-[90vh] px-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Criar conta</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Crie sua conta gratuita no WYD Companion
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            ⚠️ Não use as mesmas credenciais do jogo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full py-3 mt-2">
            Criar conta
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="text-amber-500 hover:text-amber-400">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
