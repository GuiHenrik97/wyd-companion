export function ItemsTab({ character }: { character: any }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-medium mb-4">Aba Itens</h2>
      <p className="text-zinc-500 text-sm">Em construção — edição de Itens em breve.</p>
      <pre className="text-xs text-zinc-600 mt-4 overflow-auto">
        {JSON.stringify(character.itemSet, null, 2)}
      </pre>
    </div>
  )
}
