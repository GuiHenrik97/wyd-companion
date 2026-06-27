export function TaskCard({ task, label, onMark, onUnmark }: {
  task: any
  label: string
  onMark: (t: string, action?: string) => void
  onUnmark: (t: string) => void
}) {
  const isInfernal = task.type === 'INFERNAL'
  const isCheckin = task.type === 'CHECKIN'
  const isCaca = task.type === 'CACA'

  const done = isInfernal
    ? task.count >= 2
    : isCaca
    ? task.bossDone && task.deliveryDone
    : task.done

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      done ? 'bg-zinc-900 border-zinc-800 opacity-60' : 'bg-zinc-900 border-zinc-700 hover:border-amber-500/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            done ? 'bg-amber-500 border-amber-500' : 'border-zinc-600'
          }`}>
            {done && <span className="text-black text-xs">✓</span>}
          </div>
          <div>
            <p className={`text-sm font-medium ${done ? 'text-zinc-500 line-through' : 'text-white'}`}>
              {label}
            </p>
            {isInfernal && <p className="text-xs text-zinc-500">{task.count ?? 0}/2 entradas</p>}
            {isCheckin && task.cycleDay && <p className="text-xs text-zinc-500">Dia {task.cycleDay} de 14</p>}
          </div>
        </div>
        {!done && !isInfernal && !isCaca && (
          <div className="flex gap-2">
            <button onClick={() => onMark(task.type)} className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors">
              Marcar feito
            </button>
          </div>
        )}
        {done && (
          <button onClick={() => onUnmark(task.type)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Desfazer
          </button>
        )}
        {isInfernal && !done && (
          <div className="flex gap-2 items-center">
            <button onClick={() => onMark(task.type)} className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors">
              +1 entrada
            </button>
            {(task.count ?? 0) > 0 && (
              <button onClick={() => onUnmark(task.type)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                Desfazer
              </button>
            )}
          </div>
        )}
      </div>

      {isCaca && (
        <div className="mt-3 flex gap-3 pl-8">
          <button
            onClick={() => !task.bossDone && onMark(task.type, 'boss')}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              task.bossDone
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-white'
            }`}
          >
            <span>{task.bossDone ? '✓' : '○'}</span> Boss
          </button>
          <button
            onClick={() => !task.deliveryDone && onMark(task.type, 'delivery')}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              task.deliveryDone
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-white'
            }`}
          >
            <span>{task.deliveryDone ? '✓' : '○'}</span> Entrega
          </button>
          {(task.bossDone || task.deliveryDone) && (
            <button onClick={() => onUnmark(task.type)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors ml-auto">
              Desfazer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
