import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { characterApi } from '../../api/character.api'
import { dailyApi } from '../../api/daily.api'
import { SealTab } from '../../components/character/SealTab'
import { AccountTab } from '../../components/character/AccountTab'
import { ItemsTab } from '../../components/character/ItemsTab'
import { DailyChecklist } from '../../components/daily/DailyChecklist'

const TABS = ['Daily', 'Selo', 'Conta', 'Itens'] as const
type Tab = typeof TABS[number]

const playClick = () => {
  const muted = localStorage.getItem('wyd-muted') === 'true'
  if (muted) return
  const clickSound = new Audio('/sfx-click.wav')
  clickSound.volume = 0.3
  clickSound.play().catch(() => {})
}

export function CharacterPage() {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('Daily')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      characterApi.list().then(({ data }) => data.find((c: any) => c.id === id)),
      dailyApi.getTasks(id).then(({ data }) => data),
    ]).then(([char, t]) => {
      setCharacter(char)
      setTasks(t)
      setLoading(false)
    })
  }, [id])

  const handleMarkTask = async (task: string, action?: string) => {
    if (!id) return
    await dailyApi.markDone(id, task, action)
    const { data } = await dailyApi.getTasks(id)
    setTasks(data)
  }

  const handleUnmarkTask = async (task: string) => {
    if (!id) return
    await dailyApi.unmark(id, task)
    const { data } = await dailyApi.getTasks(id)
    setTasks(data)
  }

  const refreshTasks = async () => {
    if (!id) return
    const { data } = await dailyApi.getTasks(id)
    setTasks(data)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">Carregando...</div>
  if (!character) return <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">Personagem não encontrado</div>

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{character.nick}</h1>
        {character.guild && <p className="text-zinc-400 text-sm mt-1">{character.guild}</p>}
      </div>

      <div className="flex gap-1 mb-8 bg-zinc-900 p-1 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playClick()
              setActiveTab(tab)
            }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-amber-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Daily' && (
        <DailyChecklist
          tasks={tasks}
          onMark={handleMarkTask}
          onUnmark={handleUnmarkTask}
          characterId={id!}
          cycleDay={tasks.find((t) => t.type === 'CHECKIN')?.cycleDay}
          onDaySaved={refreshTasks}
        />
      )}
      {activeTab === 'Selo' && <SealTab character={character} />}
      {activeTab === 'Conta' && <AccountTab character={character} />}
      {activeTab === 'Itens' && <ItemsTab character={character} />}
    </main>
  )
}
