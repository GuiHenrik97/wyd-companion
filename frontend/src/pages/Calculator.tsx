import { useEffect, useState } from 'react'
import { calculatorApi } from '../api/calculator.api'

const CATEGORY_LABELS: Record<string, string> = {
  ARMOR: 'Armaduras e Armas',
  WEAPON: 'Armaduras e Armas',
  CYTHERA: 'Cytheras',
  ACCESSORY: 'Acessórios',
  MANTLE: 'Capa',
  MOUNT: 'Montarias',
}

const CATEGORY_ORDER = ['ARMOR', 'CYTHERA', 'ACCESSORY', 'MANTLE', 'MOUNT']

function ProcessCard({ process }: { process: any }) {
  const [quantity, setQuantity] = useState(1)

  const totalResources = process.resources.map((pr: any) => ({
    ...pr,
    totalQuantity: pr.isConsumedOnFail ? pr.quantity * quantity : pr.quantity,
  }))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-medium">{process.name}</h3>
          {process.notes && (
            <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{process.notes}</p>
          )}
          {process.successRate && (
            <span className="inline-block mt-1 text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
              {(process.successRate * 100).toFixed(0)}% de sucesso
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-zinc-500 text-xs">Tentativas:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
            >−</button>
            <span className="text-white text-sm w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
            >+</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-zinc-500 text-xs uppercase tracking-wide">Materiais para {quantity} tentativa{quantity > 1 ? 's' : ''}</p>
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
                <span className="text-amber-600 text-xs">(não consome em falha)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Calculator() {
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculatorApi.getProcesses().then(({ data }) => {
      setProcesses(data)
      setLoading(false)
    })
  }, [])

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = processes.filter(p => p.category === cat)
    if (items.length > 0) {
      const label = CATEGORY_LABELS[cat]
      if (!acc[label]) acc[label] = []
      acc[label].push(...items)
    }
    return acc
  }, {} as Record<string, any[]>)

  if (loading) return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-zinc-500">Carregando processos...</p>
    </main>
  )

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Calculadora</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Selecione a quantidade de tentativas para calcular os materiais necessários.
          <span className="text-amber-500"> Itens em laranja não são consumidos em falha.</span>
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label}>
            <h2 className="text-lg font-medium text-white mb-4 pb-2 border-b border-zinc-800">
              {label}
            </h2>
            <div className="flex flex-col gap-3">
              {items.map(process => (
                <ProcessCard key={process.id} process={process} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
