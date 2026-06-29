export function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>

      <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-medium text-lg mb-2">1. Dados coletados</h2>
          <p>O WYD Hub coleta os seguintes dados ao criar uma conta: endereço de e-mail e senha (armazenada de forma criptografada e irreversível). Adicionalmente, você pode cadastrar voluntariamente dados do seu personagem no jogo WYD Global (equipamentos, níveis, inventário de recursos), que ficam vinculados à sua conta.</p>
        </section>

        <section>
          <h2 className="text-white font-medium text-lg mb-2">2. Uso dos dados</h2>
          <p>Seus dados são utilizados exclusivamente para o funcionamento da plataforma: autenticação, exibição das informações do seu personagem e cálculo de recursos na calculadora. Não compartilhamos seus dados com terceiros e não exibimos anúncios.</p>
        </section>

        <section>
          <h2 className="text-white font-medium text-lg mb-2">3. Segurança</h2>
          <p>Senhas são armazenadas com criptografia bcrypt e nunca em texto puro. Utilizamos tokens JWT com expiração curta para autenticação. Não temos acesso à sua senha do jogo WYD Global — recomendamos fortemente que não utilize as mesmas credenciais do jogo nesta plataforma.</p>
        </section>

        <section>
          <h2 className="text-white font-medium text-lg mb-2">4. Seus direitos (LGPD)</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
            <li>Acessar seus dados cadastrados</li>
            <li>Solicitar a correção de dados incorretos</li>
            <li>Excluir sua conta e todos os dados associados</li>
            <li>Revogar o consentimento a qualquer momento</li>
          </ul>
          <p className="mt-2">Para exercer seus direitos, acesse a página de <a href="/app/perfil" className="text-amber-500 hover:text-amber-400">Perfil</a> ou entre em contato pelo e-mail: <a href="mailto:guilhermehssouza97@gmail.com" className="text-amber-500 hover:text-amber-400">guilhermehssouza97@gmail.com</a></p>
        </section>

        <section>
          <h2 className="text-white font-medium text-lg mb-2">5. Retenção de dados</h2>
          <p>Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta, todos os dados são removidos permanentemente de nossos servidores, incluindo personagens, equipamentos e inventário.</p>
        </section>

        <section>
          <h2 className="text-white font-medium text-lg mb-2">6. Contato</h2>
          <p>Dúvidas sobre esta política: <a href="mailto:guilhermehssouza97@gmail.com" className="text-amber-500 hover:text-amber-400">guilhermehssouza97@gmail.com</a></p>
          <p className="mt-1 text-zinc-600 text-xs">Última atualização: Junho de 2026</p>
        </section>
      </div>
    </main>
  )
}
