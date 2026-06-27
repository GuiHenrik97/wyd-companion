import { useState } from 'react'
import { characterApi } from '../../api/character.api'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const CYTHERA_OPTIONS = ['M', 'A', 'AMUNRA', 'BAHAMUT', 'ANUBIS']
const REFINE_OPTIONS = Array.from({ length: 16 }, (_, i) => i)

function RefineSelect({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-zinc-400">{label}</label>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
        {REFINE_OPTIONS.map(r => <option key={r} value={r}>+{r}</option>)}
      </select>
    </div>
  )
}

export function AccountTab({ character }: { character: any }) {
  const gear = character.accountGear ?? {}
  const [form, setForm] = useState({
    cytheraType: gear.cytheraType ?? '',
    cytheraRefinement: gear.cytheraRefinement ?? 0,
    cytheraAdditional: gear.cytheraAdditional ?? '',
    amulet1Type: gear.amulet1Type ?? 'AMUNRA',
    amulet1ItemTier: gear.amulet1ItemTier ?? 1,
    amulet1Refinement: gear.amulet1Refinement ?? 0,
    amulet1AdditionalTier: gear.amulet1AdditionalTier ?? 0,
    amulet2Refinement: gear.amulet2Refinement ?? 0,
    amulet2Tier: gear.amulet2Tier ?? 0,
    amulet3Refinement: gear.amulet3Refinement ?? 0,
    amulet3Tier: gear.amulet3Tier ?? 0,
    amulet4Refinement: gear.amulet4Refinement ?? 0,
    amulet4Tier: gear.amulet4Tier ?? 0,
    necklaceItemTier: gear.necklaceItemTier ?? 1,
    necklaceRefinement: gear.necklaceRefinement ?? 0,
    necklaceAdditionalTier: gear.necklaceAdditionalTier ?? 0,
    beltItemTier: gear.beltItemTier ?? 1,
    beltRefinement: gear.beltRefinement ?? 0,
    beltAdditionalTier: gear.beltAdditionalTier ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await characterApi.updateAccountGear(character.id, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-white font-medium">Cythera</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Tipo</label>
          <select value={form.cytheraType} onChange={e => set('cytheraType', e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500">
            <option value="">— Nenhuma —</option>
            {CYTHERA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {form.cytheraType && (
          <div className="grid grid-cols-2 gap-4">
            <RefineSelect label="Refinação" value={form.cytheraRefinement} onChange={v => set('cytheraRefinement', v)} />
            <Input label="Adicional" placeholder="ex: 12 Imunidade" value={form.cytheraAdditional} onChange={e => set('cytheraAdditional', e.target.value)} />
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-white font-medium">Amuleto 1 <span className="text-zinc-500 text-sm font-normal">(Brinco ou Amunra)</span></h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Tipo</label>
          <select value={form.amulet1Type} onChange={e => set('amulet1Type', e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500">
            <option value="BRINCO">Brinco</option>
            <option value="AMUNRA">Amunra</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <RefineSelect label="Refinação" value={form.amulet1Refinement} onChange={v => set('amulet1Refinement', v)} />
          {form.amulet1Type === 'BRINCO' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Tier item</label>
              <select value={form.amulet1ItemTier} onChange={e => set('amulet1ItemTier', Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                {[1,2,3].map(t => <option key={t} value={t}>T{t}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">{form.amulet1Type === 'BRINCO' ? 'Tier adicional' : 'Tier'}</label>
            <select value={form.amulet1AdditionalTier} onChange={e => set('amulet1AdditionalTier', Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
              {Array.from({ length: form.amulet1Type === 'BRINCO' ? 8 : 9 }, (_, i) => <option key={i} value={i}>T{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      {[2, 3, 4].map(n => (
        <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-medium">Amunra {n}</h2>
          <div className="grid grid-cols-2 gap-4">
            <RefineSelect label="Refinação" value={(form as any)[`amulet${n}Refinement`]} onChange={v => set(`amulet${n}Refinement`, v)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Tier</label>
              <select value={(form as any)[`amulet${n}Tier`]} onChange={e => set(`amulet${n}Tier`, Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                {Array.from({ length: 9 }, (_, i) => <option key={i} value={i}>T{i}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      {[
        { key: 'necklace', label: 'Colar' },
        { key: 'belt', label: 'Cinto' },
      ].map(({ key, label }) => (
        <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-medium">{label}</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Tier item</label>
              <select value={(form as any)[`${key}ItemTier`]} onChange={e => set(`${key}ItemTier`, Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                {[1,2,3].map(t => <option key={t} value={t}>T{t}</option>)}
              </select>
            </div>
            <RefineSelect label="Refinação" value={(form as any)[`${key}Refinement`]} onChange={v => set(`${key}Refinement`, v)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Tier adicional</label>
              <select value={(form as any)[`${key}AdditionalTier`]} onChange={e => set(`${key}AdditionalTier`, Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                {Array.from({ length: 8 }, (_, i) => <option key={i} value={i}>T{i}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleSave} loading={saving} className="w-full py-3">
        {saved ? '✓ Salvo!' : 'Salvar Conta'}
      </Button>
    </div>
  )
}
