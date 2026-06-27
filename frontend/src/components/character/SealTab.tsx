export function SealTab({ character, characterId }: { character: any; characterId: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-medium mb-4">Aba Selo</h2>
      <p className="text-zinc-500 text-sm">Em construção — edição do Selo em breve.</p>
      <pre className="text-xs text-zinc-600 mt-4 overflow-auto">
        {JSON.stringify(character.seal, null, 2)}
      </pre>
    </div>
  )
}
