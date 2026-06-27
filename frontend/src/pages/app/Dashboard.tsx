import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { characterApi } from '../../api/character.api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function Dashboard() {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [nick, setNick] = useState('')
  const [guild, setGuild] = useState('')
  const [hasGuild, setHasGuild] = useState(false)

  useEffect(() => {
    characterApi.list().then(({ data }) => {
      setCharacters(data)
      setLoading(false)
    })
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const { data } = await characterApi.create({ nick, guild: guild || undefined, hasGuild })
      setCharacters((prev) => [...prev, data])
      setShowForm(false)
      setNick('')
      setGuild('')
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Meus personagens</h1>
          <p className="text-zinc-400 mt-1 text-sm">Selecione um personagem para gerenciar</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Novo personagem</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-white font-medium">Novo personagem</h2>
          <Input label="Nick" placeholder="Nome do personagem" value={nick} onChange={(e) => setNick(e.target.value)} required />
          <Input label="Guild (opcional)" placeholder="Nome da guild" value={guild} onChange={(e) => setGuild(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={hasGuild} onChange={(e) => setHasGuild(e.target.checked)} className="accent-amber-500" />
            Tem guild ativa
          </label>
          <div className="flex gap-3">
            <Button type="submit" loading={creating}>Criar</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500">Carregando...</p>
      ) : characters.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-lg">Nenhum personagem ainda</p>
          <p className="text-sm mt-1">Crie seu primeiro personagem acima</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => navigate(`/app/personagens/${char.id}`)}
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-6 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-lg group-hover:text-amber-500 transition-colors">
                  {char.nick}
                </h3>
                {char.hasGuild && (
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                    {char.guild || 'Guild'}
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm mt-1">
                {char.seal?.class1Lineage || 'Sem classe definida'}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
