import { useState } from 'react'
import { TaskCard } from './TaskCard'
import { dailyApi } from '../../api/daily.api'

const TASK_LABELS: Record<string, string> = {
  CHECKIN: 'Check-in diário',
  INFERNAL: 'Zona Infernal',
  MORTAL: 'Quest Mortal',
  DESERTO: 'Deserto',
  ESPOLIOS: 'Espólios',
  CACA: 'Caça',
  TORRES: 'Guerra de Torres',
  KEFRA: 'Boss Kefra',
  CIDADE: 'Guerra de Cidade',
}

export function DailyChecklist({ tasks, onMark, onUnmark, characterId, cycleDay, onDaySaved }: {
  tasks: any[]
  onMark: (task: string, action?: string) => void
  onUnmark: (task: string) => void
  characterId: string
  cycleDay?: number
  onDaySaved?: () => void
}) {
  const [editingDay, setEditingDay] = useState(false)
  const [dayInput, setDayInput] = useState(cycleDay ?? 1)
  const [saving, setSaving] = useState(false)

  const handleSaveDay = async () => {
    setSaving(true)
    await dailyApi.setCheckinDay(characterId, dayInput)
    setSaving(false)
    setEditingDay(false)
    onDaySaved?.()
  }

  if (!tasks || tasks.length === 0) return <p className="text-zinc-500">Nenhuma tarefa disponível hoje.</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-zinc-400 text-sm">Tarefas de hoje</p>
        {!editingDay ? (
          <button onClick={() => setEditingDay(true)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Ajustar dia do check-in
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Dia</span>
            <input
              type="number"
              min={1}
              max={14}
              value={dayInput}
              onFocus={e => e.target.select()}
              onChange={(e) => setDayInput(Number(e.target.value))}
              className="w-14 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-amber-500"
            />
            <span className="text-xs text-zinc-400">de 14</span>
            <button onClick={handleSaveDay} disabled={saving} className="text-xs text-amber-500 hover:text-amber-400 font-medium">
              {saving ? '...' : 'Salvar'}
            </button>
            <button onClick={() => setEditingDay(false)} className="text-xs text-zinc-600 hover:text-zinc-400">
              Cancelar
            </button>
          </div>
        )}
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.type} task={task} label={TASK_LABELS[task.type] ?? task.type} onMark={onMark} onUnmark={onUnmark} />
      ))}
    </div>
  )
}
