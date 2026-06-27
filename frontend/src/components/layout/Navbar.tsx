import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../ui/Button'

export function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-amber-500 font-bold text-xl tracking-tight">
        WYD Companion
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/calculadora" className="text-zinc-400 hover:text-white text-sm transition-colors">
          Calculadora
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/app/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Dashboard
            </Link>
            <Link to="/app/timers" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Lembretes
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-sm">
              Sair
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Entrar
            </Link>
            <Button variant="primary" onClick={() => navigate('/register')} className="text-sm">
              Cadastrar
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
