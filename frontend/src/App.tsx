import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { useAuthStore } from './store/auth.store'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/app/Dashboard'
import { CharacterPage } from './pages/app/CharacterPage'
import { Timers } from './pages/app/Timers'

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      {isAuthenticated && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/bg-app.png')", opacity: 0.07 }}
        />
      )}
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/app/personagens/:id" element={
            <ProtectedRoute><CharacterPage /></ProtectedRoute>
          } />
          <Route path="/app/timers" element={
            <ProtectedRoute><Timers /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}
