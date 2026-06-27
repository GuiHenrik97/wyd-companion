export function AccountTab({ character }: { character: any }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-medium mb-4">Aba Conta</h2>
      <p className="text-zinc-500 text-sm">Em construção — edição da Conta em breve.</p>
      <pre className="text-xs text-zinc-600 mt-4 overflow-auto">
        {JSON.stringify(character.accountGear, null, 2)}
      </pre>
    </div>
  )
}
