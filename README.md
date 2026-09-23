# Meus Treinos

App para organizar seus treinos A/B/C, saber qual treino fazer hoje (ciclo
automático), marcar como feito e acompanhar o histórico. Funciona como PWA:
depois de publicado, instala no iPhone e se comporta como um app nativo.
Agora tem tela de login e navegação por abas, no estilo de app nativo.

## Estrutura

```
meus-treinos/
├── index.html      → estrutura/estilo do app
├── app.js          → toda a lógica do app
├── manifest.json   → configuração do PWA
├── sw.js           → service worker (uso offline + atualização)
├── users.json      → lista de usuários e senhas (você edita à mão)
├── gerar-hash.html → ferramenta offline para gerar linhas do users.json
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── README.md
```

Os dados (treinos, exercícios e histórico) ficam salvos no `localStorage` do
navegador do seu iPhone, **separados por usuário logado** — não há servidor.
Use **Ajustes → Dados e backup → Exportar** de vez em quando para não perder
o histórico caso troque de aparelho.

## Login

O acesso ao app agora exige login. Isso **não é segurança de verdade** — é
só uma barreira simples contra alguém pegar seu iPhone destravado e abrir o
app sem querer, ou contra visitas casuais ao link público. Qualquer pessoa
com acesso ao código-fonte (por exemplo, olhando o repositório no GitHub)
consegue ver a lista de usuários e os hashes. Não reutilize uma senha que
você usa em outro lugar importante.

**Para adicionar ou trocar um usuário:**

1. Abra `gerar-hash.html` (pode ser direto do seu computador, sem precisar
   estar publicado — é uma página offline).
2. Preencha usuário, nome, senha (o salt já vem preenchido, pode deixar).
3. Toque em "Gerar linha para users.json" e depois em "Copiar".
4. Abra `users.json` no GitHub (ícone de lápis) e cole o objeto copiado
   dentro do array `"users"`, separando por vírgula dos usuários existentes.
5. Suba a alteração (commit). Da próxima vez que o app checar atualização
   (ou você tocar em Ajustes → Atualizar), o novo usuário passa a funcionar.

O `users.json` de exemplo já vem com o usuário **demo** / senha **demo123**
— troque ou remova antes de usar de verdade.

Marcar **"Lembrar credenciais"** na tela de login guarda a sessão no
aparelho (sobrevive a fechar o app); sem marcar, a sessão dura só enquanto a
aba/app está aberto. Em ambos os casos a sessão vale só até o fim do dia:
todo dia (depois da meia-noite) é preciso fazer login de novo, mesmo com
"Lembrar credenciais" marcado — inclusive se o app ficar aberto durante a
virada do dia, ele detecta e volta para a tela de login sozinho.

## Novidades desta versão

**Rodada 6 (v4.0) — abas, login e dados por usuário**
- **Navegação por abas**: barra fixa embaixo (Início, Treinos, Histórico,
  Progresso, Ajustes), estilo app nativo, com roteamento por hash
  (`#/inicio`, `#/treinos`...) para o gesto de voltar do iOS funcionar. O
  timer de descanso e as folhas (overlays) continuam funcionando por cima
  de qualquer aba.
- **Início redesenhado**: saudação com seu nome e a data, card do treino de
  hoje, sequência/semana/mês, 7 bolinhas mostrando os dias da semana em que
  você treinou, atalho para o último recorde batido, e atalhos rápidos para
  registrar peso ou ver o histórico.
- **Abas refinadas**: Treinos e Histórico ganharam título próprio e
  perderam o botão "Ocultar" (não faz mais sentido, cada uma já tem tela
  própria); Histórico ganhou uma lista das sessões do mês, além do
  calendário; Ajustes foi reorganizado em blocos "Conta", "Treino",
  "Aparência" e "Dados e backup". O botão "Ocultar" continua existindo
  dentro de Progresso (Estatísticas, Recordes, Corpo), onde ainda faz
  sentido esconder um bloco por vez.
- **Login**: tela de usuário/senha antes do app, validada com
  `crypto.subtle` contra um `users.json` que você edita à mão (veja a seção
  "Login" acima), com opção "Manter conectado" e um botão "Sair" em
  Ajustes → Conta. Sem login, nenhuma tela do app é exibida.
- **Dados separados por usuário**: cada login tem seu próprio histórico,
  treinos e backups automáticos. Na primeira vez que qualquer usuário loga
  nesta versão, os dados antigos (de antes de existir login) são copiados
  automaticamente para ele, sem apagar a cópia antiga.
- **Transições suaves** entre abas (respeitando "reduzir movimento" do
  iOS) e estados vazios amigáveis (ex.: "nenhuma sessão nesse mês").

**Rodada 5 (v3.1)**
- **Timer de descanso sem piscar**: a barra é montada uma vez e só o número e o anel são atualizados no lugar (antes o HTML era recriado a cada segundo, o que reiniciava a animação). O anel agora avança de forma contínua.
- **Botão Atualizar mais robusto**: além de checar uma versão nova do `sw.js`, agora baixa `index.html`, `app.js`, `manifest.json` e ícones direto do servidor (ignorando cache), compara com o que está salvo e recarrega se algo mudou. Também funciona quando só o `app.js`/`index.html` foi alterado. O app verifica sozinho ao voltar para ele e mostra o aviso "Nova versão disponível". Em Preferências há também **"Recarregar do zero"** (limpa só o cache do app; treinos e histórico não são apagados).
- **Service worker "rede primeiro"**: a cada abertura os arquivos são revalidados no servidor; o cache só serve de reserva offline.
- **Ocultar em todas as seções**: Meus treinos, Histórico, Estatísticas, Recordes, Corpo, Lembretes, Preferências e Dados e backup têm o botão Ocultar/Mostrar. Ao ocultar, sobra só o título da seção. A escolha fica salva.
- **Recordes enxutos**: um exercício por treino (o que bateu recorde de carga mais recentemente), com a letra do treino ao lado.

**Rodada 4**
- **Timer de descanso** entre séries (60/90/120s configurável por exercício), com vibração no fim. Não dispara em exercícios marcados como superset.
- **Tela sempre ligada** durante o treino (Wake Lock), com opção para desativar em Preferências.
- **Sugestão de progressão**: ao abrir um exercício, mostra "Sugestão: 65 kg × 10" com base na última vez, e um botão para aplicar direto nas séries.
- **Recordes pessoais (PR)**: selo de troféu quando você bate a maior carga ou o maior 1RM estimado, com uma seção "Recordes" listando os principais.
- **Notas e RPE**: campo de observação por exercício e por treino, e RPE (1–10) opcional por exercício.
- **Tipos de série**: aquecimento, drop set e até a falha (toque no número da série para alternar). Aquecimento fica fora das estatísticas de volume e recordes.
- **Estatísticas**: volume total, séries por grupo muscular e volume por semana (7/30/90 dias).
- **Peso corporal e medidas** (cintura, peito, braço, coxa) com gráfico de evolução.
- **Backups automáticos** dentro do aparelho (últimas 5 cópias diárias), com tela para restaurar qualquer uma.
- **Exportar/importar mais seguros**: exportar agora tenta abrir a folha de compartilhamento do iPhone (salvar direto no iCloud); importar valida o arquivo antes de aplicar e recusa backups corrompidos ou de versão futura.
- **Desfazer** em exclusões de exercício, treino e sessão (toast com botão "Desfazer").
- **Duplicar treino**, **reordenar exercícios**, **superset** (agrupar dois exercícios) e **link** de vídeo/técnica por exercício.
- **Unidade kg/lb** configurável.
- Correção: marcar uma série com ✓ agora grava de fato o peso/reps que já apareciam pré-preenchidos na tela (antes podiam ficar em branco).
- Telas de abertura (splash screens) do iOS.

**Rodada 3.1**
- **Biblioteca de exercícios embutida**: a lista de exercícios do seletor
  agora já vem pré-carregada com mais de 300 exercícios organizados em 21
  grupos musculares (Quadríceps, Glúteos, Peitoral, Costas, Bíceps,
  Tríceps, etc.), então dá pra montar um treino sem digitar nada. Os
  grupos aparecem retráteis (toque para abrir/fechar); ao digitar na
  busca, o filtro passa a mostrar todos os exercícios que combinam, de
  qualquer grupo, numa lista só. Exercícios digitados manualmente que não
  estão na biblioteca continuam aparecendo no topo, em "Meus exercícios".

**Rodada 3**
- **Tela de iniciar treino**: não é mais possível adicionar ou remover séries
  durante o treino (a quantidade de séries é a configurada no exercício,
  em "Meus treinos"). As únicas coisas editáveis ali são peso e
  repetições — e agora as repetições também podem ser digitadas
  diretamente (igual ao peso), além dos botões de +/-.
- **Estatística "no mês"**: o card que antes mostrava a soma de todas as
  sessões já feitas (desde sempre) agora mostra apenas as sessões do mês
  atual, reiniciando a cada mês novo. "Dias seguidos" e "essa semana"
  continuam como antes.
- **Lista de exercícios em vez de digitar**: ao tocar em "Adicionar
  exercício" dentro de um treino, abre uma lista com todos os nomes de
  exercícios já usados em qualquer treino, com busca (filtra por qualquer
  trecho do nome) e checkboxes — dá pra marcar vários de uma vez e todos
  entram automaticamente como exercícios do treino. Se o nome ainda não
  existir, dá pra digitar um novo e marcá-lo também. Para renomear um
  exercício já existente, toque no nome dele para abrir a mesma lista
  (aqui é só tocar em um item para escolher).

**Rodada 1**
- Registro de carga e reps ao marcar um treino (ou editar um dia do
  histórico), com o último valor usado como referência.
- Histórico em heatmap estilo GitHub.
- Reordenar treinos no ciclo com as setinhas.
- Ícones SVG no lugar dos caracteres de texto (✎ ✕ ✓).
- Indicador de salvamento renomeado ("salvo neste aparelho").
- Aviso de atualização do app quando uma nova versão for publicada.
- Importar backup mostra quantos treinos/sessões o arquivo tem.
- Corrigido bug do contador de ID de exercício reiniciando a cada carregamento.

**Rodada 2**
- **Gráfico de progresso por exercício**: toque no ícone de gráfico ao lado
  de um exercício para ver a evolução de carga ao longo do tempo.
- **Dias de descanso**: dá pra adicionar "Descanso" como parte do ciclo,
  junto com os treinos A/B/C.
- **Lembrete diário**: ative um horário para o app te avisar (por
  notificação, se permitida, e por um aviso dentro do app) que ainda não
  treinou hoje. **Importante:** isso só funciona enquanto o app está aberto
  ou quando você o reabre — o iPhone não permite alarmes em segundo plano
  para apps instalados via Safari sem um servidor de notificações próprio
  (Web Push exigiria backend). Se quiser lembrete garantido mesmo com o app
  fechado, o caminho realista é usar o app de Lembretes/Calendário nativo
  do iPhone em paralelo.
- **Aviso de backup**: se passar 14 dias sem exportar, aparece um banner
  sugerindo exportar (com atalho direto).
- **Importar com escolha**: agora pergunta se você quer **mesclar** o
  backup com os dados atuais (só adiciona sessões novas) ou **substituir**
  tudo.
- **Inputs de exercício redesenhados**: nome em linha própria, séries/reps
  em campos maiores e mais fáceis de tocar.
- **Animação de conclusão**: um pulso sutil no card ao salvar o treino do dia.
- Mais `aria-label`s nos chips e campos da folha de registro.
- Código dividido em `index.html` (estrutura) e `app.js` (lógica), para
  ficar mais fácil de editar cada parte separadamente.

## Teste do fluxo completo (Rodada 6)

Percorri o código do fluxo login → início → iniciar treino → descanso →
concluir → progresso → sair com atenção (não tenho como abrir um Safari de
iPhone de verdade a partir daqui, então isto é uma revisão cuidadosa do
código, não um teste automatizado rodando no aparelho). O que encontrei:

- **Login**: o formulário valida usuário/senha contra `users.json` via
  `crypto.subtle.digest`; sem conexão e sem o arquivo em cache, mostra uma
  mensagem clara em vez de travar. Depois do primeiro login online, o
  arquivo fica no cache do service worker (rede primeiro, com reserva
  offline), então logins seguintes funcionam sem internet.
- **Início → iniciar treino → descanso → concluir**: reaproveita as mesmas
  funções que já existiam (`startActiveSession`, `startRestTimer`,
  `endActiveSession`), só mudou onde a tela de resumo é montada — não
  toquei nessa lógica.
- **Progresso**: Estatísticas/Recordes/Corpo continuam com o próprio botão
  Ocultar, exatamente como antes.
- **Sair**: pede confirmação, limpa a sessão salva e volta para o login sem
  deixar nenhuma tela do app visível por trás.

**Pontos de atenção que valem seu teste real no iPhone:**
- Troquei `CACHE_NAME` no `sw.js` e `APP_VERSION` no `app.js` para `v4.0` —
  depois de publicar, é essa versão que deve aparecer em Ajustes → Dados e
  backup e que dispara o aviso de atualização em quem já tinha o app
  instalado.
- Se você é o único usuário do aparelho, a separação de dados por usuário é
  transparente (seus dados de antes continuam lá, só que agora "dentro" do
  seu login). Se mais de uma pessoa usa o mesmo iPhone/Safari, cada uma
  deve logar com seu próprio usuário para não misturar treinos.
- O botão "voltar" do iOS entre abas depende do histórico de hashes do
  navegador; funciona bem para ir e voltar entre abas que você já visitou,
  mas se você voltar até *antes* da primeira aba visitada nesta sessão, o
  app reafirma a aba atual no lugar de sair do app — comportamento seguro,
  mas vale confirmar que não incomoda no uso real.
- Não implementei um limite de tentativas de senha nem expiração de sessão
  — de novo, é só uma barreira simples, não segurança de verdade.

### O que ficou de fora (e por quê)

- **Sincronizar entre aparelhos de verdade** (ex: editar no iPhone e ver no
  iPad na hora) não é possível só com HTML/JS estático — precisa de um
  servidor/backend guardando os dados de cada usuário. O app continua
  local por aparelho; a forma de levar dados de um pra outro é exportar e
  importar o arquivo de backup (dá pra guardar esse arquivo no iCloud Drive
  para facilitar).
- **Reescrever o motor de renderização** (hoje ele redesenha a tela inteira
  a cada ação, em vez de atualizar só o que mudou) não foi feito nesta
  rodada: com a quantidade de dados de um app pessoal de treino isso não
  chega a ser perceptível na prática, e mexer nisso tem risco real de
  introduzir bugs sutis para um ganho que você provavelmente nem notaria.
  Se um dia o app crescer muito (dezenas de exercícios por treino, anos de
  histórico), vale revisitar.

## 1. Subir para o GitHub

1. Entre em [github.com](https://github.com) (crie conta se ainda não tiver).
2. Clique em **New repository**. Nome sugerido: `meus-treinos`. Marque como
   **Public**. Não crie README automático (já tem um aqui).
3. Clique em **Create repository**.
4. Na tela vazia do repositório, clique em **"uploading an existing file"**.
5. Arraste todos os arquivos desta pasta `meus-treinos` (incluindo a pasta
   `icons/` inteira) para a área de upload.
6. Clique em **Commit changes**.

## 2. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
4. Aguarde 1–2 minutos e recarregue a página — vai aparecer o link:
   `https://SEU-USUARIO.github.io/meus-treinos/`

## 3. Instalar no iPhone

1. Abra o link no **Safari** do iPhone.
2. Toque no ícone de compartilhar (quadrado com seta para cima).
3. Toque em **"Adicionar à Tela de Início"** e confirme.

O ícone aparece na tela inicial e abre em tela cheia, como um app nativo.

## Atualizando depois

Edite os arquivos direto pelo GitHub (ícone de lápis em cada arquivo) ou
suba versões novas pela mesma tela de upload. O GitHub Pages republica em
cerca de 1 minuto. Depois, abra o app no iPhone e toque em **Preferências →
Atualizar** (ou espere o aviso "Nova versão disponível").

A cada versão nova, troque o número em dois lugares (o mesmo nos dois):
`CACHE_NAME` no `sw.js` e `APP_VERSION` no `app.js`. Não é obrigatório para o
botão Atualizar funcionar, mas deixa a versão mostrada no app correta.

**Ícone da tela de início:** o iOS guarda o ícone no momento em que o atalho é
criado e não permite que o app o troque depois. Se você mudar os arquivos em
`icons/`, o novo ícone só aparece ao **remover o atalho e adicioná-lo de novo**
pelo Safari (seus dados ficam no aparelho; faça um backup antes por garantia).
