import { useEffect, useState } from 'react'
import { calculatorApi } from '../api/calculator.api'

const CATEGORIES = [
  { key: 'ARMOR', label: 'Armaduras e Armas' },
  { key: 'CYTHERA', label: 'Cytheras' },
  { key: 'ACCESSORY', label: 'Acessórios' },
  { key: 'MANTLE', label: 'Capa' },
  { key: 'MOUNT', label: 'Montarias' },
]

function ProcessCard({ process }: { process: any }) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const totalResources = process.resources.map((pr: any) => ({
    ...pr,
    totalQuantity: pr.isConsumedOnFail ? pr.quantity * quantity : pr.quantity,
  }))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-zinc-500 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
          <div>
            <p className="text-white text-sm font-medium">{process.name}</p>
            {process.successRate && (
              <span className="text-xs text-amber-400">
                {(process.successRate * 100).toFixed(0)}% de sucesso
              </span>
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t border-zinc-800">
          {process.notes && (
            <p className="text-zinc-500 text-xs leading-relaxed pt-3">{process.notes}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-sm">Tentativas:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >−</button>
              <span className="text-white text-sm w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >+</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Materiais para {quantity} tentativa{quantity > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {totalResources.map((pr: any) => (
                <div
                  key={pr.resource.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border ${
                    pr.isConsumedOnFail
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}
                >
                  <span className="font-medium">{pr.totalQuantity}x</span>
                  <span>{pr.resource.name}</span>
                  {!pr.isConsumedOnFail && (
                    <span className="text-amber-600 ml-1">(não consome em falha)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Calculator() {
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ARMOR')
  const [search, setSearch] = useState('')

  useEffect(() => {
    calculatorApi.getProcesses().then(({ data }) => {
      setProcesses(data)
      setLoading(false)
    })
  }, [])

  const filtered = processes.filter(p =>
    p.category === activeTab &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-zinc-500">Carregando processos...</p>
    </main>
  )

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Calculadora</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Clique em um processo para ver os materiais necessários.{' '}
          <span className="text-amber-500">Itens em laranja não são consumidos em falha.</span>
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setActiveTab(cat.key); setSearch('') }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === cat.key
                ? 'bg-amber-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar processo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-600 text-sm">Nenhum processo encontrado.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(process => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      )}
    </main>
  )
}
