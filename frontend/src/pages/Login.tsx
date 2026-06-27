import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function Login() {
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
      const { data } = await authApi.login(email, password)
      setTokens(data.accessToken, data.refreshToken)
      setUserId(data.userId)
      navigate('/app/dashboard')
    } catch {
      setError('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-login.png')", opacity: 0.15 }}
      />
      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Entrar</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Acesse sua conta do WYD Companion
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Não use as credenciais do jogo aqui
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
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full py-3 mt-2">
            Entrar
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Não tem conta?{' '}
          <Link to="/register" className="text-amber-500 hover:text-amber-400">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  )
}
