import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/app/Dashboard'
import { CharacterPage } from './pages/app/CharacterPage'
import { Timers } from './pages/app/Timers'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
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
  )
}
