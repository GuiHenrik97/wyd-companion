import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { characterApi } from '../../api/character.api'
import { calculatorApi } from '../../api/calculator.api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

function CharacterCard({ char, onClick }: { char: any; onClick: () => void }) {
  const seal = char.seal ?? {}
  const gear = char.accountGear ?? {}
  const items = char.itemSet ?? {}

  const class1 = seal.class1Lineage || seal.class1Type || '—'
  const class2 = seal.class2Lineage || seal.class2Type

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-medium text-xl group-hover:text-amber-500 transition-colors">
            {char.nick}
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5">
            {class1}{class2 ? ` · ${class2}` : ''}
          </p>
        </div>
        {char.hasGuild && (
          <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
            {char.guild || 'Guild'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-zinc-800/50 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Selo</p>
          <div className="flex flex-col gap-1">
            <p className="text-zinc-300 text-xs">
              {seal.class1Level || '—'}{seal.class2Level ? `/${seal.class2Level}` : ''}
            </p>
            {seal.mantleType && (
              <p className="text-zinc-300 text-xs">
                Capa: {seal.mantleType} {seal.mantleRefinement != null ? `+${seal.mantleRefinement}` : ''}{seal.mantleAdditional ? ` ${seal.mantleAdditional}` : ''}
              </p>
            )}
            <p className="text-zinc-400 text-xs">
              L1: 11th {seal.class1Has11th ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
              12th {seal.class1Has12th ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
              Esp {seal.class1Spectral ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
              Con {seal.class1Concentration ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
              Res {seal.class1Resurrection ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}
            </p>
            {seal.class2Type && (
              <p className="text-zinc-400 text-xs">
                L2: 11th {seal.class2Has11th ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
                12th {seal.class2Has12th ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
                Esp {seal.class2Spectral ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
                Con {seal.class2Concentration ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}{' '}
                Res {seal.class2Resurrection ? <span className="text-amber-500">✓</span> : <span className="text-zinc-600">✗</span>}
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Conta</p>
          <div className="flex flex-col gap-1">
            {gear.cytheraType && (
              <p className="text-zinc-300 text-xs">
                Cythera: {gear.cytheraType} +{gear.cytheraRefinement ?? 0}
              </p>
            )}
            <p className="text-zinc-400 text-xs">
              Amuletos: T{gear.amulet1AdditionalTier ?? 0}/T{gear.necklaceAdditionalTier ?? 0}/T{gear.beltAdditionalTier ?? 0}
            </p>
            <p className="text-zinc-400 text-xs">
              Amunra: T{gear.amulet2Tier ?? 0}/T{gear.amulet3Tier ?? 0}/T{gear.amulet4Tier ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-3">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Itens</p>
          <div className="flex flex-col gap-1">
            {items.weaponType && (
              <p className="text-zinc-300 text-xs">
                Arma: {items.weaponType} +{items.weaponRefinement ?? 0}
              </p>
            )}
            {(() => {
              const armorSlots = ['chest', 'pants', 'gloves', 'boots']
              const filled = armorSlots.filter(s => items[`${s}Type`])
              if (filled.length === 0) return null
              const avg = Math.round(filled.reduce((acc, s) => acc + (items[`${s}Refinement`] ?? 0), 0) / filled.length)
              return <p className="text-zinc-400 text-xs">Set: +{avg}</p>
            })()}
            {items.mountType && (
              <p className="text-zinc-400 text-xs">
                {items.mountType.replace(/_/g, ' ')} {items.mountLevel ?? 0} Ql {items.mountQuality ?? 0}
              </p>
            )}
            {!items.weaponType && !items.chestType && (
              <p className="text-zinc-600 text-xs">Não configurado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<any[]>([])
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [nick, setNick] = useState('')
  const [guild, setGuild] = useState('')
  const [hasGuild, setHasGuild] = useState(false)

  useEffect(() => {
    Promise.all([
      characterApi.list(),
      calculatorApi.getInventory(),
    ]).then(([charRes, invRes]) => {
      setCharacters(charRes.data)
      setInventory(invRes.data.filter((item: any) => item.quantity > 0))
      setLoading(false)
      setInventoryLoading(false)
    })
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const { data } = await characterApi.create({ nick, guild: guild || undefined, hasGuild })
      setCharacters(prev => [...prev, data])
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
          <p className="text-zinc-400 mt-1 text-sm">Clique em um personagem para gerenciar</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Novo personagem</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-white font-medium">Novo personagem</h2>
          <Input label="Nick" placeholder="Nome do personagem" value={nick} onChange={e => setNick(e.target.value)} required />
          <Input label="Guild (opcional)" placeholder="Nome da guild" value={guild} onChange={e => setGuild(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={hasGuild} onChange={e => setHasGuild(e.target.checked)} className="accent-amber-500" />
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
        <div className="flex flex-col gap-4">
          {characters.map(char => (
            <CharacterCard
              key={char.id}
              char={char}
              onClick={() => navigate(`/app/personagens/${char.id}`)}
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Meu inventário</h2>
            <p className="text-zinc-400 text-sm mt-0.5">Recursos cadastrados na sua conta</p>
          </div>
          <a
            href="/app/inventario"
            className="text-amber-500 hover:text-amber-400 text-sm transition-colors"
          >
            Gerenciar →
          </a>
        </div>

        {inventoryLoading ? (
          <p className="text-zinc-500 text-sm">Carregando...</p>
        ) : inventory.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <p className="text-white font-medium">Nenhum item registrado ainda</p>
              <p className="text-zinc-500 text-sm mt-1">
                Registre seus itens para ver o que tem no inventário e usar os recursos da calculadora.
              </p>
            </div>
            <a
              href="/app/inventario"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium rounded-lg transition-colors"
            >
              Cadastrar inventário
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {inventory
              .sort((a, b) => b.quantity - a.quantity)
              .map((item: any) => (
                <a
                  key={item.id}
                  href="/app/inventario"
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group"
                >
                  <p className="text-zinc-400 text-xs leading-tight group-hover:text-zinc-300 transition-colors">
                    {item.resource.name}
                  </p>
                  <p className="text-white font-medium text-lg tabular-nums">
                    {item.quantity.toLocaleString('pt-BR')}
                  </p>
                  {!item.resource.mobile && (
                    <span className="text-zinc-600 text-xs">🔒 Imóvel</span>
                  )}
                </a>
              ))}
          </div>
        )}
      </div>
    </main>
  )
}
